# War in clinical_baseline_factors.py
def baseline_print_statements():
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


# War in schemas.py
class PatientInput(BaseModel):
    Later FhIR Server will create a Patient ID upon POST call
        first_name: str
        last_name: str
        gender: Literal['male', 'female']
        They say it's not needed.
