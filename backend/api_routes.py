"""
Collects all Frontend patient input data over FastAPI and passes it to the corresponding
backend functions.
"""
import uuid
import json
import httpx
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException
from schemas import PatientInput, PatientResponse, DynamicFactors, DynamicQuestionnaire, DerivedRisk, RiskFactors, BaselineFactors, UpdatePatient, PatientState

from clinical_dynamic_factors import dynamic_factors
from clinical_baseline_factors import baseline_factors, calculate_bmi
from environmental_factors.environmental_calculations import final_factors
from risk_engine import risk_engine

import models
from database import Base, engine, get_db

from sqlalchemy import select,update
from sqlalchemy.orm import Session

from fastapi.responses import Response
from fhir_mapper import export_bundle, export_patient_state_to_fhir, export_patient_diagnosis_to_fhir, export_patient_assessment_to_fhir



Base.metadata.create_all(bind = engine)



api = FastAPI()


@api.post('/my_profile', response_model=PatientResponse)
def create_patient_profile(patient_input: PatientInput, db: Annotated[Session, Depends(get_db)]):
    result = db.execute(
        select(models.Patient).where(models.Patient.username == patient_input.username)
    )
    # GET FIRST PATIENT OBJECT OR NONE IF THERE'S NO MATCH
    existing_patient = result.scalars().first()
    if existing_patient:
        raise HTTPException(status_code=400, detail="Username already exists.")

    new_patient = models.Patient(
        username = patient_input.username,
        age = patient_input.age,
        height_cm = patient_input.height_cm,
        weight_kg = patient_input.weight_kg,
        latitude = patient_input.latitude,
        longitude = patient_input.longitude,
        best_pef = patient_input.best_pef
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    db.flush()

    baselineFactors = baseline_factors(patient_input)
    new_baseline = models.BaselineFactor(**baselineFactors.model_dump(), patient_id = new_patient.id)

    db.add(new_baseline)
    db.commit()
    db.refresh(new_baseline)

    return new_patient

@api.post('/patients/{patient_username}/dynamic_records', response_model=DynamicFactors)
def create_dynamic_record(patient_username: str, dynamic_questionnaire: DynamicQuestionnaire, db: Annotated[Session, Depends(get_db)]):
    patient = db.query(models.Patient).filter(models.Patient.username == patient_username).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    dynamic_record = dynamic_factors(dynamic_questionnaire, patient.best_pef)
    new_dynamic_record = models.DynamicFactor(**dynamic_record.model_dump(), patient_id = patient.id)

    db.add(new_dynamic_record)
    db.commit()
    db.refresh(new_dynamic_record)

    return new_dynamic_record

@api.post('/patients/{patient_username}/assessments', response_model=DerivedRisk)
def save_assessment(patient_username: str, db: Annotated[Session, Depends(get_db)]):
    patient = db.query(models.Patient).filter(models.Patient.username == patient_username).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    # Get the latest environmental factors
    env = final_factors(patient.latitude, patient.longitude)

    # GET PATIENT'S BASELINE FACTORS
    baseline_db = patient.baseline_factors
    if not baseline_db:
        raise HTTPException(status_code=404, detail="Please, update your baseline first.")

    baseline = BaselineFactors.model_validate(baseline_db)

    # GET PATIENT'S LATEST DYNAMIC FACTORS AND VALIDATE THEM
    dynamic_query = db.query(models.DynamicFactor).filter(models.DynamicFactor.patient_id == patient.id)
    last_dynamic_query = dynamic_query.order_by(models.DynamicFactor.recorded_at.desc()).first()
    if not last_dynamic_query:
        raise HTTPException(status_code=404, detail="Please, perform a dynamic test first.")

    dynamic = DynamicFactors.model_validate(last_dynamic_query)

    # COLLECT THE FACTORS IN ONE OBJECT
    risk_factors = RiskFactors(environmental = env, baseline = baseline, dynamic = dynamic)

    # CALCULATE THE DERIVED RISK
    derived_risk = risk_engine(risk_factors)
    # CREATE THE PATIENT STATE SNAPSHOT
    patient_state = PatientState(
        patient_input = PatientResponse.model_validate(patient),
        risk_factors = risk_factors,
        exacerbation_risk = derived_risk
    )

    assessment = models.Assessment(
        patient_id = patient.id,
        dynamic_factors_id = last_dynamic_query.id,
        baseline_factors_id = baseline_db.id,

        PM25_mean = env.current_PM25_mean,
        NO2_mean = env.current_NO2_mean,
        O3_mean = env.current_O3_mean,
        birch_pollen_72H_mean = env.birch_pollen_72H_mean,
        grass_pollen_72H_mean = env.grass_pollen_72H_mean,
        ragweed_pollen_72H_mean = env.ragweed_pollen_72H_mean,
        mean_RH_difference = env.mean_RH_difference,
        diurnal_temp_diff = env.current_temp_diff,

        risk_score = derived_risk.risk_score,
        risk_category = derived_risk.risk_category,
        patient_state_snapshot = patient_state.model_dump_json()
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return derived_risk

@api.put('/patients/{patient_username}/my_profile', response_model=UpdatePatient)
def update_patient_profile(patient_username: str, patient_input: PatientInput, db: Annotated[Session, Depends(get_db)]):
    patient = db.query(models.Patient).filter(models.Patient.username == patient_username).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    updated_patient_profile = db.execute(
        update(models.Patient).where(models.Patient.username == patient_username).values(
            username = patient_input.username,
            age = patient_input.age,
            height_cm = patient_input.height_cm,
            weight_kg = patient_input.weight_kg,
            latitude = patient_input.latitude,
            longitude = patient_input.longitude,
            best_pef = patient_input.best_pef
        )
    )

    updated_bmi = calculate_bmi(weight=patient_input.weight_kg, height=patient_input.height_cm)
    updated_patient_profile = db.execute(
        update(models.BaselineFactor).where(models.BaselineFactor.patient_id == patient.id).values(
            bmi = updated_bmi,
            gerd = patient_input.gerd,
            osa = patient_input.osa,
            active_smoking = patient_input.active_smoking,
            past_exacerbations = patient_input.past_exacerbations,
            crs = patient_input.crs
        )
    )

    db.commit()
    db.refresh(patient)

    return patient_input

@api.get('/patients/{patient_username}/my_profile', response_model=PatientInput)
def get_patient_profile(patient_username: str, db: Annotated[Session, Depends(get_db)]):
    patient = db.query(models.Patient).filter(models.Patient.username == patient_username).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")
    baseline = db.query(models.BaselineFactor).filter(models.BaselineFactor.patient_id == patient.id).first()
    if not baseline:
        raise HTTPException(status_code=404, detail="Please update your baseline first.")

    PatientProfile = PatientInput(
        username = patient.username,
        age = patient.age,
        height_cm = patient.height_cm,
        weight_kg = patient.weight_kg,
        latitude = patient.latitude,
        longitude = patient.longitude,
        best_pef = patient.best_pef,
        gerd = baseline.gerd,
        osa = baseline.osa,
        active_smoking = baseline.active_smoking,
        past_exacerbations = baseline.past_exacerbations,
        crs = baseline.crs
    )
    return PatientProfile

@api.get('/patients/{patient_username}/assessments')
def get_assessments(patient_username: str, db: Annotated[Session, Depends(get_db)]):
    patient = db.query(models.Patient).filter(models.Patient.username == patient_username).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    assessments = db.query(models.Assessment).filter(models.Assessment.patient_id == patient.id).all()

    assessment_dicts = [{
        "assessment_id": assessment.assessment_id,
        "created_at": assessment.created_at,
        "risk_score": assessment.risk_score,
        "risk_category": assessment.risk_category,
    }for assessment in assessments]

    return assessment_dicts

@api.get('/patients/{patient_username}/assessments/{assessment_id}', response_model=PatientState)
def get_assessment(patient_username: str, assessment_id: uuid.UUID, db: Annotated[Session, Depends(get_db)]):
    assessment = db.query(models.Assessment).filter(models.Assessment.assessment_id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    raw_patient_state = json.loads(assessment.patient_state_snapshot)
    final_patient_state = PatientState(**raw_patient_state)

    return final_patient_state

@api.delete('/patients/{patient_username}')
def delete_patient(patient_username: str, db: Annotated[Session, Depends(get_db)]):
    patient = db.query(models.Patient).filter(models.Patient.username == patient_username).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    # THIS IS HARD DELETE. HEALTHCARE PRODUCTION APPS WORK BETTER WITH SOFT DELETE.
    db.delete(patient)
    db.commit()

    return {"message": f"The Patient: {patient_username} has been deleted."}




# POSTING PATIENT INFORMATION TO FHIR SERVER
HAPI_FHIR_URL = "http://localhost:8080/fhir/"


@api.post('/fhir/push/{patient_username}')
async def export_patient(patient_username: str, db: Annotated[Session, Depends(get_db)]):
    patient = db.query(models.Patient).filter(models.Patient.username == patient_username).first() # THIS IS HARD DELETE. HEALTHCARE PRODUCTION APPS WORK BETTER WITH SOFT DELETE.
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    assessment = db.query(models.Assessment).filter(models.Assessment.patient_id == patient.id).order_by(models.Assessment.assessment_id.desc()).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    raw_patient_state = json.loads(assessment.patient_state_snapshot)
    patient_state = PatientState(**raw_patient_state)

    fhir_patient = export_patient_state_to_fhir(patient_state)
    fhir_observations = export_patient_diagnosis_to_fhir(patient_state, assessment.created_at, assessment.assessment_id)
    fhir_assessment = export_patient_assessment_to_fhir(patient_state, assessment.created_at, assessment.assessment_id)
    bundle = export_bundle(patient_state, assessment.created_at, assessment.assessment_id)


    async with httpx.AsyncClient(timeout = 180) as client:
        bundle_response = await client.post(
            HAPI_FHIR_URL,
            content = bundle.model_dump_json(indent=4, exclude_none=True),
            headers = {
                "Content-Type": "application/fhir+json",
                "Accept": "application/fhir+json"
            }
        )

        # if patient_response.status_code != 200 or patient_response.text != 201:
        #     raise HTTPException(status_code=patient_response.status_code, detail=patient_response.text)
        # if observation_response.status_code != 200 or observation_response.text != 201:
        #     raise HTTPException(status_code=observation_response.status_code, detail=observation_response.text)

        if bundle_response.status_code != 200 or bundle_response.text != 201:
            raise HTTPException(status_code=bundle_response.status_code, detail=bundle_response.text)

        return {
            "status": "Pushed",
            "status_code": bundle_response.status_code,
            "message": f"The Patient: {patient_username} has been exported."
        }
