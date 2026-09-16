"""
All risk factors, including clinical, environmental, and dynamic factors are collected here.
And then passed to the Risk Engine as a parsed JSON file to calculate the Risk Score and Risk Category.
"""
from schemas import PatientInput, EnvironmentalFactors, DynamicFactors, BaselineFactors, RiskFactors
from environmental_factors.environmental_calculations import final_factors
from clinical_baseline_factors import baseline_factors
from clinical_dynamic_factors import dynamic_factors



def risk_factors(api: PatientInput) -> RiskFactors:
    return RiskFactors(
        environmental = final_factors(api.latitude, api.longitude),
        baseline = baseline_factors(api),
        dynamic = dynamic_factors(api)
    )


# print(RiskFactors(api))
