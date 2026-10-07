"""
Exporting the final PatientState Model to FHIR.
"""
import uuid
import yaml
from pathlib import Path
from datetime import datetime,timezone
from fhir.resources.patient import Patient
from fhir.resources.observation import Observation
from fhir.resources.condition import Condition
from fhir.resources.bundle import Bundle
from fhir.resources.riskassessment import RiskAssessment
from fhir.resources.codeableconcept import CodeableConcept
from fhir.resources.coding import Coding

from schemas import PatientState, PatientBase, CategoryDetails

parent_dir = Path(__file__).parents[1]
yaml_path = parent_dir/"docs"/"config.yaml"

with open(yaml_path, 'r', encoding='utf-8') as f:
    config = yaml.safe_load(f)


# EXPORTING PATIENT BASE DETAILS TO FHIR SERVER
def export_patient_state_to_fhir(patient_state: PatientState) -> Patient:
    # patient_base = patient_state.patient_input
    new_patient = Patient(
        resourceType = "Patient",
        # id = patient_state.patient_id,
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Patient:</b> {patient_state.patient_input.username}</p></div>"
        },
        identifier = [
            {
                "use": "usual",
                "system":  "https://asthma-risk-assessment.app/patient-usernames",
                "value": patient_state.patient_input.username
            }
        ],
        active = True
    )
    return new_patient

# EXPORTING PATIENT OBSERVATIONS TO FHIR SERVER
def export_patient_diagnosis_to_fhir(patient_state: PatientState, created_at: datetime, assessment_id: int) -> list[Observation]:
    patient_base = patient_state.patient_input
    risk_factors = patient_state.risk_factors
    observations = []

    # Height
    height_value = patient_base.height_cm
    height = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> height </p></div>"
        },
        category=[{
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "vital-signs",
                "display": "Vital Signs"
            }]
        }],
        code = {
            "coding": [{
                "system": "http://loinc.org",
                "code": "8302-2",
                "display": "Körpergröße"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Patient (Selbst-Diagnose)"
        }],
        valueQuantity = {
            "value": height_value,
            "unit": "cm",
            "system": "http://unitsofmeasure.org",
            "code": "cm"
        },
    )
    observations.append(height)

    # Weight
    weight_value = patient_base.weight_kg
    weight = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> weight </p></div>"
        },
        category=[{
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "vital-signs",
                "display": "Vital Signs"
            }]
        }],
        code = {
            "coding": [{
                "system": "http://loinc.org",
                "code": "29463-7",
                "display": "Körpergewicht"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Patient (Selbst-Diagnose)"
        }],
        valueQuantity = {
            "value": weight_value,
            "unit": "kg",
            "system": "http://unitsofmeasure.org",
            "code": "kg"
        },
    )
    observations.append(weight)

    # Best PEF
    best_pef_value = patient_base.best_pef
    best_pef = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> best_pef </p></div>"
        },
        category=[{
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "vital-signs",
                "display": "Vital Signs"
            }]
        }],
        code = {
            "coding": [{
                "system": "http://loinc.org",
                "code": "83368-1",
                "display": "Persönlicher Bestwert des maximalen Ausatemstroms (PEV)"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Patient (Selbst-Diagnose)"
        }],
        valueQuantity = {
            "value": best_pef_value,
            "unit": "L/min",
            "system": "http://unitsofmeasure.org",
            "code": "L/min"
        },
    )
    observations.append(best_pef)

    # Current PEF
    current_pef_value = risk_factors.dynamic.current_pef
    current_pef = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> current_pef </p></div>"
        },
        category=[{
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "vital-signs",
                "display": "Vital Signs"
            }]
        }],
        code = {
            "coding": [{
                "system": "http://loinc.org",
                "code": "33452-4",
                "display": "Maximum expiratory gas flow Respiratory system airway"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Patient (Selbst-Diagnose)"
        }],
        valueQuantity = {
            "value": current_pef_value,
            "unit": "L/min",
            "system": "http://unitsofmeasure.org",
            "code": "L/min"
        },
    )
    observations.append(current_pef)

    # PEF Percent of Best
    pef_percent_of_best_value = risk_factors.dynamic.pef_percent_of_best
    pef_percent_of_best = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> pef_percent_of_best </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "pef_percent_of_best",
                "display": "Percentage of Best Peak Expiratory Flow"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Asthma Risk Assessment Berechnungs-Module"
        }],
        valueQuantity = {
            "value": pef_percent_of_best_value,
            "unit": "%",
            "system": "http://unitsofmeasure.org",
            "code": "%"
        },
    )
    observations.append(pef_percent_of_best)

    # BMI
    bmi_value = risk_factors.baseline.bmi
    bmi = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> bmi </p></div>"
        },
        category=[{
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "vital-signs",
                "display": "Vital Signs"
            }]
        }],
        code = {
            "coding": [{
                "system": "http://loinc.org",
                "code": "39156-5",
                "display": "Body-Mass-Index (BMI)"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Asthma Risk Assessment Berechnungs-Module"
        }],
        valueQuantity = {
            "value": bmi_value,
            "unit": "kg/m2",
            "system": "http://unitsofmeasure.org",
            "code": "kg/m2"
        },
    )
    observations.append(bmi)

    # Past Exacerbations
    past_exacerbations_value = risk_factors.baseline.past_exacerbations
    past_exacerbations = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> past_exacerbations </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "past_exacerbations",
                "display": "Past Asthma Exacerbations"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Patient (Selbst-Diagnose)"
        }],
        valueQuantity = {
            "value": past_exacerbations_value,
            "unit": "count",
            "system": "http://unitsofmeasure.org",
            "code": "{count}" # Unified Code for Units of Measure (UCUM) Convention for counting
        },
    )
    observations.append(past_exacerbations)

    # Recent Exacerbations
    recent_exacerbations_value = risk_factors.dynamic.recent_exacerbations
    recent_exacerbations = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> recent_exacerbations </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "recent_exacerbations",
                "display": "Recent Asthma Exacerbations"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Patient (Selbst-Diagnose)"
        }],
        valueBoolean = recent_exacerbations_value,
    )
    observations.append(recent_exacerbations)

    # Smoke Exposure
    smoke_exposure_value = risk_factors.dynamic.smoke_exposure
    smoke_exposure = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> smoke_exposure </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "smoke_exposure",
                "display": "Smoke Exposure"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Patient (Selbst-Diagnose)"
        }],
        valueBoolean = smoke_exposure_value,
    )
    observations.append(smoke_exposure)

    # Chemical Exposure
    chemical_exposure_value = risk_factors.dynamic.chemical_exposure
    chemical_exposure = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> chemical_exposure </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "chemical_exposure",
                "display": "Irritant/Chemical Exposure"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Patient (Selbst-Diagnose)"
        }],
        valueBoolean = chemical_exposure_value,
    )
    observations.append(chemical_exposure)

    # SABA Use
    saba_use_value = risk_factors.dynamic.saba_use
    saba_use = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> saba_use </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "saba_use",
                "display": "SABA Use"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Patient (Selbst-Diagnose)"
        }],
        valueQuantity = {
            "value": saba_use_value,
            "unit": "puffs",
            "system": "http://unitsofmeasure.org",
            "code": "{puff}"
        },
    )
    observations.append(saba_use)

    #Pm2.5 Mean
    pm25_mean_value = risk_factors.environmental.current_PM25_mean
    pm25_mean = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> pm25_mean </p></div>"
        },
        category=[{
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "vital-signs",
                "display": "Vital Signs"
            }]
        }],
        code = {
            "coding": [{
                "system": "http://loinc.org",
                "code": "106008-6",
                "display": "Particle matter 2.5 [#/volume] Reporting Period Community Calculated"
            }],
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Umweltbundesamt API"
        }],
        valueQuantity = {
            "value": pm25_mean_value,
            "unit": "μg/m3",
            "system": "http://unitsofmeasure.org",
            "code": "ug/m3"
        },
    )
    observations.append(pm25_mean)

    # NO2 Mean
    no2_mean_value = risk_factors.environmental.current_NO2_mean
    no2_mean = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> no2_mean </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "no2_mean",
                "display": "Ambient Nitrogen Dioxide Concentration"
            }],
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Umweltbundesamt API"
        }],
        valueQuantity = {
            "value": no2_mean_value,
            "unit": "μg/m3",
            "system": "http://unitsofmeasure.org",
            "code": "ug/m3"
        },
    )
    observations.append(no2_mean)

    # O3 Mean
    o3_mean_value = risk_factors.environmental.current_O3_mean
    o3_mean = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> o3_mean </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "o3_mean",
                "display": "Ambient Ozone Concentration"
            }],
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Umweltbundesamt API"
        }],
        valueQuantity = {
            "value": o3_mean_value,
            "unit": "μg/m3",
            "system": "http://unitsofmeasure.org",
            "code": "ug/m3"
        },
    )
    observations.append(o3_mean)

    # Birch Pollen
    birch_pollen_72H_mean_value = risk_factors.environmental.birch_pollen_72H_mean
    birch_pollen_72H_mean = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> birch_pollen_72H_mean </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "birch_pollen_72H_mean",
                "display": "Birch Pollen"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Umweltbundesamt API"
        }],
        valueQuantity = {
            "value": birch_pollen_72H_mean_value,
            "unit": "grains/m3",
            "system": "http://unitsofmeasure.org",
            "code": "[gr]/m3"
        },
    )
    observations.append(birch_pollen_72H_mean)

    # Grass Pollen
    grass_pollen_72H_mean_value = risk_factors.environmental.grass_pollen_72H_mean
    grass_pollen_72H_mean = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> grass_pollen_72H_mean </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "grass_pollen_72H_mean",
                "display": "Grass Pollen"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Umweltbundesamt API"
        }],
        valueQuantity = {
            "value": grass_pollen_72H_mean_value,
            "unit": "grains/m3",
            "system": "http://unitsofmeasure.org",
            "code": "[gr]/m3"
        },
    )
    observations.append(grass_pollen_72H_mean)

    # Ragweed Pollen
    ragweed_pollen_72H_mean_value = risk_factors.environmental.ragweed_pollen_72H_mean
    ragweed_pollen_72H_mean = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> ragweed_pollen_72H_mean </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "ragweed_pollen_72H_mean",
                "display": "Ragweed Pollen"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Umweltbundesamt API"
        }],
        valueQuantity = {
            "value": ragweed_pollen_72H_mean_value,
            "unit": "grains/m3",
            "system": "http://unitsofmeasure.org",
            "code": "[gr]/m3"
        },
    )
    observations.append(ragweed_pollen_72H_mean)

    # Mean Relative Humidity
    mean_RH_difference_value = risk_factors.environmental.mean_RH_difference
    mean_RH_difference = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> mean_RH_difference </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "mean_RH_difference",
                "display": "Relative Humidity"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Umweltbundesamt API"
        }],
        valueQuantity = {
            "value": mean_RH_difference_value,
            "unit": "%",
            "system": "http://unitsofmeasure.org",
            "code": "%"
        },
    )
    observations.append(mean_RH_difference)

    # Diural Temperature Range
    current_temp_diff_value = risk_factors.environmental.current_temp_diff
    current_temp_diff = Observation(
        resourceType = "Observation",
        id= f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Observation:</b> current_temp_diff </p></div>"
        },
        code = {
            "coding": [{
                "system": "https://asthma-risk-assessment.app/observation_codes",
                "code": "current_temp_diff",
                "display": "Diural Temperature Range"
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        effectiveDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        performer = [{
            "reference": f"urn:uuid:{patient_state.patient_id}",
            "display": "Umweltbundesamt API"
        }],
        valueQuantity = {
            "value": current_temp_diff_value,
            "unit": "Cel",
            "system": "http://unitsofmeasure.org",
            "code": "Cel"
        },
    )
    observations.append(current_temp_diff)

    return observations

# METHOD FOR FHIR CONDITION OBJECTS FOR EACH PATIENT
def make_condition_code(code: str, condition: str, patient_id: str, assessment_id: str) -> Condition:
    return Condition(
        resourceType = "Condition",
        id = f"{assessment_id}",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Condition:</b> {condition} </p></div>"
        },
        clinicalStatus = {
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                "code": "active"
            }]
        },
        verificationStatus = {
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                "code": "confirmed"
            }]
        },
        code = {
            "coding": [{
                "system": "http://snomed.info/sct",
                "code": code,
                "display": condition
            }]
        },
        subject = {"reference": f"urn:uuid:{patient_id}"}, # This should be the business ID of the patient
    )

# EXPORTING PATIENT CONDITION TO FHIR SERVER
def export_patient_condition_to_fhir(patient_state: PatientState, assessment_id: str) -> list[Condition]:
    baseline = patient_state.risk_factors.baseline
    conditions = []

    # Asthma
    asthma =  make_condition_code(
        code = "195967001",
        condition = "Asthma",
        patient_id =  patient_state.patient_id,
        assessment_id= assessment_id)
    conditions.append(asthma)

    # GERD
    if baseline.gerd:
        gerd = make_condition_code(
            code = "235595009",
            condition = "Gastroesophageal reflux disease",
            patient_id = patient_state.patient_id,
            assessment_id= assessment_id)
        conditions.append(gerd)

    # OSA
    if baseline.osa:
        osa = make_condition_code(
            code = "78275009",
            condition = "Obstructive sleep apnea syndrome (disorder)",
            patient_id = patient_state.patient_id,
            assessment_id= assessment_id)
        conditions.append(osa)

    # Active Smoking
    if baseline.active_smoking:
        active_smoking = make_condition_code(
            code = "77176002",
            condition = "Smoker (finding)",
            patient_id = patient_state.patient_id,
            assessment_id= assessment_id)
        conditions.append(active_smoking)

    # CRS
    if baseline.crs:
        crs = make_condition_code(
            code = "897657000",
            condition = "Chronic rhinosinusitis",
            patient_id = patient_state.patient_id,
            assessment_id= assessment_id)
        conditions.append(crs)

    return conditions


# MAPPING THE APP'S CATEGORES TO FHIR'S RISK PROBABILITY CATEGORIES
def map_risk_category(risk_category: str | None) -> str:
    categories = [CategoryDetails(**category) for category in config["Categories"]]

    mapping = {category.Label: category.id for category in categories}

    if risk_category in mapping:
        return mapping[risk_category]

    return "Category cannot be mapped to FHIR."

# EXPORTING ASSESSMENT TO FHIR SERVER
def export_patient_assessment_to_fhir(patient_state: PatientState, created_at: datetime, assessment_id: int) -> RiskAssessment:
    risk_assessment = patient_state.exacerbation_risk
    risk_score = risk_assessment.risk_score
    risk_category = risk_assessment.risk_category

    assessment = RiskAssessment(
        resourceType = "RiskAssessment",
        id = f"{assessment_id}",
        status = "final",
        text = {
            "status": "generated",
            "div": f"<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Assessment:</b> assessment </p></div>"
        },
        subject = {"reference": f"urn:uuid:{patient_state.patient_id}"}, # This should be the business ID of the patient
        occurrenceDateTime = created_at.replace(tzinfo=timezone.utc).isoformat(),
        prediction = [{
            "outcome": {
                "coding": [{
                    "system": "http://snomed.info/sct",
                    "code": "281239006",
                    "display": "Acute asthma"
                }]
            },
            "qualitativeRisk": CodeableConcept(
                coding=[Coding(
                    system="http://terminology.hl7.org/CodeSystem/risk-probability",
                    code= map_risk_category(risk_category),
                )]
            )
        }],
        note=[{
            "text": f"Internal log-odds score is: {risk_score}."
        }]
    )
    return assessment

# EXPORTING ENTIRE PATIENT BUNDLE TO FHIR SERVER
def export_bundle(patient_state: PatientState, created_at: datetime, assessment_id: int) -> Bundle:
    patient_base = export_patient_state_to_fhir(patient_state)
    observations = export_patient_diagnosis_to_fhir(patient_state, created_at, assessment_id)
    conditions = export_patient_condition_to_fhir(patient_state, assessment_id)
    assessment = export_patient_assessment_to_fhir(patient_state, created_at, assessment_id)

    bundle = Bundle(
        resourceType = "Bundle",
        type = "transaction",
        entry = [
            {
                "fullUrl": f"urn:uuid:{patient_state.patient_id}",
                "resource": patient_base,
                "request": {
                    "method": "POST",
                    "url": "Patient",
                    "ifNoneExist": f"identifier=https://asthma-risk-assessment.app/patient-usernames|{patient_state.patient_input.username}"
                }
            },
            *map(lambda obs: {
                    # "fullUrl": f"urn:uuid:{uuid.uuid4()}",
                    "resource": obs,
                    "request": {
                        "method": "POST",
                        "url": "Observation"
                    },
                }, observations
            ),
            *map(lambda cond: {
                # "fullUrl": f"urn:uuid:{uuid.uuid4()}",
                "resource": cond,
                "request": {
                    "method": "POST",
                    "url": "Condition"
                },
                }, conditions
            ),
            {
                "fullUrl": f"urn:uuid:{assessment_id}",
                "resource": assessment,
                "request": {
                    "method": "POST",
                    "url": "RiskAssessment"
                }
            },
        ]
    )
    return bundle
