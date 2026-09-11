# Clinical Baseline factors have been identified as important predictors of asthma attacks.
# The factors studied, collected and to be observed in this project include
# Body Mass Index (BMI) greater than or equal to 30 kg/m², obstructivesleep apnea, active smoking,
# past exacerbation, chronic rhinosinusitis (CRS) and gastroesophageal reflux disease (GERD).

# The patient profile will be created henceforth based on the above risk factors, along with
# demographic information such as name, age and gender. It will also acquire baseline data for
# future decision making and risk assessment, like type of pollen allergy and best PEF.


def calculate_bmi(weight, height):
    """
    Calculate the Body Mass Index (BMI) given weight in kilograms and height in centimeters.

    :param weight: Weight in kilograms
    :param height: Height in centimeters
    :return: BMI value
    """
    if height <= 0:
        raise ValueError("Height must be greater than zero.")

    height_in_meters = height / 100  # Convert centimeters to meters
    bmi = round(weight / (height_in_meters ** 2), 2)
    return bmi

def profile():
    name = input("Enter your name: ")
    age = int(input("Enter your age: "))
    gender = input("Enter your gender (M/F): ")
    weight = float(input("Enter your weight in kilograms: "))
    height = float(input("Enter your height in centimeters: "))
    allergy = input("Which allergy do you have? Tree, Grass or Pollen?")
    best_pef = float(input("What is your best PEF?"))

    bmi = calculate_bmi(weight=weight, height=height)
    osa = bool(input("Do you have obstructive sleep apnea? (yes/no): ").lower().startswith('y'))
    smoking = bool(input("Are you an active smoker? (yes/no): ").lower().startswith('y'))
    past_exacerbations = int(input("How many asthma flare-ups have you had in the past year? (Enter a number): "))
    crs = bool(input("Do you have chronic rhinosinusitis? (yes/no): ").lower().startswith('y'))
    gerd = bool(input("Do you have gastroesophageal reflux disease? (yes/no): ").lower().startswith('y'))

    my_profile = {
            "name": name,
            "age": age,
            "gender": gender,
            "weight": weight,
            "height": height,
            "allergy": allergy,
            "best_pef": best_pef,
            "bmi": bmi,
            "osa": osa,
            "active_smoking": smoking,
            "past_exacerbations": past_exacerbations,
            "crs": crs,
            "gerd": gerd
        }

    clinical_baseline_factors = {
        "bmi": bmi,
        "osa": osa,
        "active_smoking": smoking,
        "past_exacerbations": past_exacerbations,
        "crs": crs,
        "gerd": gerd
    }
    return clinical_baseline_factors

print("Clinical Baseline Factors:", profile())
