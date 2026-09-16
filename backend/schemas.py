import uuid
from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, conint, Field
"""
The Schema collects all the data models that are used in the project.

"""
class FactorValue(BaseModel):
    value: bool | float | int
    unit: str # „µg/m³", „L/min", „°C", „‰"
    effect_type: Literal['OR','IRR','RR']
    timestamp: datetime
    source: Literal['api','FHIR','manual', 'derived']

class PatientInput(BaseModel):
    # Profile
    age: int
    height_cm: float
    weight_kg: float
    latitude: float
    longitude: float
    # Baseline
    gerd: bool
    osa: bool
    active_smoking: bool
    past_exacerbations: int
    crs: bool
    best_pef: float
    # Dynamic
    recent_exacerbations: bool
    current_pef: float
    smoke_exposure: bool
    chemical_exposure: bool
    saba_use: int

class EnvironmentalFactors(BaseModel):
    current_PM25_mean: float
    current_NO2_mean: float
    current_O3_mean: float
    birch_pollen_72H_mean: float
    grass_pollen_72H_mean: float
    ragweed_pollen_72H_mean: float
    mean_RH_difference: float
    current_temp_diff: float

class BaselineFactors(BaseModel):
    bmi: float
    gerd: bool
    osa: bool
    active_smoking: bool
    past_exacerbations: int
    crs: bool

class DynamicFactors(BaseModel):
    recent_exacerbations: bool
    pef_percent_of_best: float
    smoke_exposure: bool
    chemical_exposure: bool
    saba_use: int

class RiskFactors(BaseModel):
    environmental: EnvironmentalFactors
    baseline: BaselineFactors
    dynamic: DynamicFactors

class DerivedRisk(BaseModel):
    risk_score: Optional[float] = None
    risk_category: Optional[Literal['LOW', 'MODERATE', 'HIGH']] = None

class PatientState(BaseModel):
    patient_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    patient_input: PatientInput
    risk_factors: RiskFactors
    exacerbation_risk: DerivedRisk = Field(default_factory = DerivedRisk)

# print()
