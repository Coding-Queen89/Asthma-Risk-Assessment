"""
Collects all Frontend patient input data over FastAPI and passes it to the corresponding
backend functions.
"""
from schemas import PatientInput, DynamicFactors, BaselineFactors, EnvironmentalFactors, RiskFactors
from clinical_dynamic_factors import dynamic_factors
from clinical_baseline_factors import baseline_factors
from environmental_factors.environmental_calculations import final_factors
from risk_factors import risk_factors
from patient_state import patient_state
from risk_engine import risk_engine


# INPUT VARIABLES FROM FRONTEND
# TO BE TAKEN FROM GET REQUEST
def get_patient_profile() -> PatientInput:
    return PatientInput(
        age = 30,
        height_cm = 140.0,
        weight_kg = 95.0,
        latitude = 47.498,
        longitude = 19.040,

        # Baseline
        gerd = True,
        osa = False,
        active_smoking = True,
        past_exacerbations = 5,
        crs = False,
        best_pef = 120,

        # Dynamic
        recent_exacerbations = True,
        current_pef= 47,
        smoke_exposure = False,
        chemical_exposure = True,
        saba_use = "4"
    )

if __name__ == "__main__":
    api = get_patient_profile()
    risk_factors = risk_factors(api)
    risk_score = risk_engine(risk_factors)
    patient_state = patient_state(api, risk_factors, risk_score)

    print(f"\nThe Input Patient Profile is:\n{api}")
    print(f"\nRisk Factors are:\n{risk_factors}")
    print(f"\nThe final Risk Score is:\n{risk_score}")
    # print(f"\nThe final Patient State is:\n{patient_state}")

    print(f"\n Full Patient State for FHIR transport:\n{patient_state.model_dump_json()}")
