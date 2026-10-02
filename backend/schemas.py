import uuid
from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field, ConfigDict
"""
The Schema collects all the data models that are used in the project.

"""
class FactorDetails(BaseModel):
    id: str
    Label: str
    category: str
    datatype: Literal['continuous', 'threshold', 'boolean']
    look_back: str
    effect_value: Optional[float] = None
    effect_type: Optional[Literal['OR', 'RR', 'IRR', 'aOR', 'aRR', 'RRf']] = None
    exposure_window: str
    evidence: str
    notes: Optional[str] = None
    baseline: Optional[float] = None
    scale: Optional[float] = None
    direction: Optional[Literal['two-sided']] = None
    unit: Optional[str] = None

class CategoryDetails(BaseModel):
    id: str
    Label: str
    max_score: Optional[float] = None
    color: str
    explanation: Optional[str] = None
    guidance: str

class PEF_Override(BaseModel):
    id: str
    asthma_state: str
    color: str
    min_percent: float
    override: bool
    target_ind: Optional[int] = None
    explanation: Optional[str] = None

class PatientInput(BaseModel):
    # Profile
    username: str
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

class UpdatePatient(PatientInput):
    pass

class DynamicQuestionnaire(BaseModel):
     # Dynamic
    recent_exacerbations: bool
    current_pef: float
    smoke_exposure: bool
    chemical_exposure: bool
    saba_use: int

class PatientBase(BaseModel):
    # Profile
    username: str = Field(min_length=3, max_length=20)
    age: int = Field(..., description="Age in years")
    height_cm: float
    weight_kg: float
    latitude: float
    longitude: float
    best_pef: float

class CreateProfile(PatientBase):
    pass

class PatientResponse(PatientBase):
    model_config = ConfigDict(from_attributes=True)
    pass

class EnvironmentalFactors(BaseModel):
    current_PM25_mean: float
    current_NO2_mean: float
    current_O3_mean: float
    birch_pollen_72H_mean: Optional[float] = None
    grass_pollen_72H_mean: Optional[float] = None
    ragweed_pollen_72H_mean: Optional[float] = None
    mean_RH_difference: float
    current_temp_diff: float

class BaselineFactors(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    bmi: float
    gerd: bool
    osa: bool
    active_smoking: bool
    past_exacerbations: int
    crs: bool

class CreateBaseline(BaselineFactors):
    username: str

class BaselineResponse(BaselineFactors):
    pass

class DynamicFactors(BaseModel):
    model_config = ConfigDict(from_attributes=True)
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
    risk_category: Optional[Literal['Low Risk', 'Moderate Risk', 'High Risk', 'Very High Risk']] = None
    risk_score: Optional[float] = None
    asthma_state: Optional[str] = None
    risk_color: Optional[str] = None
    factor_contribution: dict
    risk_explanation: Optional[str] = None
    risk_guidance: Optional[str] = None

class PatientState(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    patient_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    patient_input: PatientBase
    risk_factors: RiskFactors
    exacerbation_risk: DerivedRisk = Field(default_factory = DerivedRisk)

# print()
