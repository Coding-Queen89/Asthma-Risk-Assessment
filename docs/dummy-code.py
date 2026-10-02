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




models.py


from datetime import datetime
from sqlalchemy import create_engine, Column, Boolean, Integer, String,DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

engine = create_engine('sqlite:///database.db', echo=True)
Base = declarative_base()

class Patient(Base):
    __tablename__ = 'patients'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)
    height_cm = Column(Integer)
    weight_kg = Column(Integer)
    latitude = Column(Integer)
    longitude = Column(Integer)
    gerd = Column(Integer)
    osa = Column(Integer)
    active_smoking = Column(Integer)
    past_exacerbations = Column(Integer)
    crs = Column(Integer)
    best_pef = Column(Integer)
    recent_exacerbations = Column(Integer)
    current_pef = Column(Integer)
    smoke_exposure = Column(Integer)
    chemical_exposure = Column(Integer)
    saba_use = Column(Integer)


    assessments = relationship('Assessment', back_populates='patient')

class DynamicFactor(Base):
    __tablename__ = 'dynamic_factors'
    id = Column(Integer, primary_key=True)
    recent_exacerbations = Column(Boolean)
    pef_percent_of_best = Column(Integer)
    smoke_exposure = Column(Boolean)
    chemical_exposure = Column(Boolean)
    saba_use = Column(Integer)

    patient_id = Column(Integer, ForeignKey('patients.id'))


class BaselineFactor(Base):
    __tablename__ = 'baseline_factors'
    id = Column(Integer, primary_key=True)
    bmi = Column(Integer)
    gerd = Column(Boolean)
    osa = Column(Boolean)
    active_smoking = Column(Boolean)
    past_exacerbations = Column(Integer)
    crs = Column(Boolean)

    patient_id = Column(Integer, ForeignKey('patients.id'))

class Assessment(Base):
    __tablename__ = 'assessments'
    assessment_id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.now(datetime.timezone.utc))
    patient_id = Column(Integer, ForeignKey('patients.id'))
    dynamic_factors_id = Column(Integer, ForeignKey('dynamic_factors.id'))

    # Raw Inputs for audit trail and reconstruction
    height_cm = Column(Integer)
    weight_kg = Column(Integer)

    # Asthma specified Baseline factors
    bmi = Column(Integer)
    gerd = Column(Boolean)
    osa = Column(Boolean)
    active_smoking = Column(Boolean)
    past_exacerbations = Column(Integer)
    crs = Column(Boolean)

    # Asthma specific Dynamic factors
    recent_exacerbations = Column(Boolean)
    pef_percent_of_best = Column(Integer)
    smoke_exposure = Column(Boolean)
    chemical_exposure = Column(Boolean)
    saba_use = Column(Integer)

    # Asthma contributing Environmental Factors
    PM25_mean = Column(Integer)
    NO2_mean = Column(Integer)
    O3_mean = Column(Integer)
    birch_pollen_72H_mean = Column(Integer)
    grass_pollen_72H_mean = Column(Integer)
    ragweed_pollen_72H_mean = Column(Integer)
    mean_RH_difference = Column(Integer)
    dirual_temp_diff = Column(Integer)

    # Risk Score and Risk Category
    risk_score = Column(Integer)
    risk_category = Column(String)

    patient = relationship('Patient', back_populates='assessments')


Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

new_patient = Patient(
    name = "John Doe",
    age = 30,
    height_cm = 170,
    weight_kg = 70,
    latitude = 52.520008,
    longitude = 13.404954,
    gerd = True,
    osa = True,
    active_smoking = True,
    past_exacerbations = 6,
    crs = False,
    best_pef = 120.0,
    recent_exacerbations = False,
    current_pef = 90.0,
    smoke_exposure = False,
    chemical_exposure = False,
    saba_use = 2
)
session.add(new_patient)
session.flush()

new_assessment = Assessment(
    patient_id = new_patient.id,
    height_cm = 170,
    weight_kg = 70,
    bmi = 30.0,
    gerd = True,
    osa = True,
    active_smoking = True,
    past_exacerbations = 6,
    crs = False,
    recent_exacerbations = False,
    pef_percent_of_best = 90.0,
    smoke_exposure = False,
    chemical_exposure = False,
    saba_use = 2,
    PM25_mean = 11,
    NO2_mean = 11,
    O3_mean = 11,
    birch_pollen_72H_mean = 11,
    grass_pollen_72H_mean = 11,
    ragweed_pollen_72H_mean = 11,
    mean_RH_difference = 11,
    dirual_temp_diff = 11,

    # Risk Score and Risk Category
    risk_score = 11,
    risk_category = "Low Risk"
)
session.add(new_assessment)
session.commit()
