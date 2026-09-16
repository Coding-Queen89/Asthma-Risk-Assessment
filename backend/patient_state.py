"""
Patient State is a collection of Patient Profile data, risk factors, and risk scores.
It will be the main stage to exporting the data to FHIR.
"""
import uuid
# import JSON
from schemas import PatientInput, RiskFactors, DerivedRisk, PatientState
from risk_factors import risk_factors

def patient_state(api: PatientInput) -> PatientState:
    return PatientState(
        patient_id = uuid.uuid4(),
        patient_input = api,
        risk_factors = risk_factors(api),
        exacerbation_risk = DerivedRisk(
            risk_score = None,
            risk_category = None
        )
    )
# print(patient_state(PatientInput))
# patient_state().model_dump_json()
