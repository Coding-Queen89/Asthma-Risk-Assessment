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


# INPUT VARIABLES FROM FRONTEND
# TO BE TAKEN FROM GET REQUEST
def get_patient_profile() -> PatientInput:
    return PatientInput(
        age = 30,
        height_cm = 180.0,
        weight_kg = 65.0,
        latitude = 40.41,
        longitude = -3.70,

        # Baseline
        gerd = True,
        osa = True,
        active_smoking = True,
        past_exacerbations = 1,
        crs = True,
        best_pef = 80,

        # Dynamic
        recent_exacerbations = True,
        current_pef = 20,
        smoke_exposure = True,
        chemical_exposure = True,
        saba_use = "4"
    )

if __name__ == "__main__":
    api = get_patient_profile()
    print(api)
    # print(f"\nRisk Factors are:\n{risk_factors(api)}")
    print(f"\nThe final Patient State is:\n{patient_state(api)}")
    # print(f"\nEnvironmental Factors are:\n{final_factors(api.latitude, api.longitude)}")
    # print(f"\nClinical Baseline Factors are:\n{baseline_factors(api)}")
    # print(f"\nClinical Dynamic Factors are:\n{dynamic_factors(api)}")
