"""Clinical Baseline factors have been identified as important predictors of asthma attacks.
The factors studied, collected and to be observed in this project include
Body Mass Index (BMI) greater than or equal to 30 kg/m², obstructivesleep apnea, active smoking,
past exacerbation, chronic rhinosinusitis (CRS) and gastroesophageal reflux disease (GERD).

The patient profile will be created henceforth based on the above risk factors, along with
demographic information such as name, age and gender. It will also acquire baseline data for
future decision making and risk assessment, like type of pollen allergy and best PEF."""

from schemas import PatientInput, BaselineFactors

def calculate_bmi(weight, height):
    if height <= 0:
        raise ValueError("Height must be greater than zero.")

    height_in_meters = height / 100  # Convert centimeters to meters
    bmi = round(weight / (height_in_meters ** 2), 2)
    return bmi

def baseline_factors(api: PatientInput) -> BaselineFactors:
    return BaselineFactors(
        bmi = calculate_bmi(api.weight_kg, api.height_cm),
        gerd = api.gerd,
        osa = api.osa,
        active_smoking = api.active_smoking,
        past_exacerbations = api.past_exacerbations,
        crs = api.crs,
    )
