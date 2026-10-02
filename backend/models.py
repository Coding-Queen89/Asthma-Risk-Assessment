from __future__ import annotations
from datetime import datetime,timezone, UTC
from sqlalchemy import Column, Boolean, Integer, Float, String,DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship, Mapped, mapped_column

from database import Base

class Patient(Base):
    __tablename__ = 'patients'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index = True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    age: Mapped[int] = mapped_column(Integer)
    height_cm: Mapped[float] = mapped_column(Float)
    weight_kg: Mapped[float] = mapped_column(Float)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    best_pef: Mapped[float] = mapped_column(Float)

    # Relationships
    baseline_factors = relationship('BaselineFactor', back_populates='patient', cascade = 'all, delete-orphan', uselist=False)
    dynamic_factors = relationship('DynamicFactor', back_populates='patient', cascade = 'all, delete-orphan')
    assessments: Mapped[list[Assessment]] = relationship('Assessment', back_populates='patient', cascade = 'all, delete-orphan')

class DynamicFactor(Base):
    __tablename__ = 'dynamic_factors'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index = True)
    recent_exacerbations: Mapped[bool] = mapped_column(Boolean)
    pef_percent_of_best: Mapped[float] = mapped_column(Float)
    smoke_exposure: Mapped[bool] = mapped_column(Boolean)
    chemical_exposure: Mapped[bool] = mapped_column(Boolean)
    saba_use: Mapped[int] = mapped_column(Integer)

    patient_id: Mapped[int] = mapped_column(Integer, ForeignKey('patients.id'))
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC)
    )

    # Relationships
    patient = relationship('Patient', back_populates='dynamic_factors')
    assessments = relationship('Assessment', back_populates='dynamic_factors')


class BaselineFactor(Base):
    __tablename__ = 'baseline_factors'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index = True)
    bmi: Mapped[float] = mapped_column(Float)
    gerd: Mapped[bool] = mapped_column(Boolean)
    osa: Mapped[bool] = mapped_column(Boolean)
    active_smoking: Mapped[bool] = mapped_column(Boolean)
    past_exacerbations: Mapped[int] = mapped_column(Integer)
    crs: Mapped[bool] = mapped_column(Boolean)

    patient_id = Column(Integer, ForeignKey('patients.id'))

    # Relationships
    patient = relationship('Patient', back_populates='baseline_factors')
    assessments = relationship('Assessment', back_populates='baseline_factors')

class Assessment(Base):
    __tablename__ = 'assessments'
    assessment_id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    patient_id = Column(Integer, ForeignKey('patients.id'))
    dynamic_factors_id = Column(Integer, ForeignKey('dynamic_factors.id'))
    baseline_factors_id = Column(Integer, ForeignKey('baseline_factors.id'))


    # Asthma contributing Environmental Factors
    PM25_mean = Column(Float)
    NO2_mean = Column(Float)
    O3_mean = Column(Float)
    birch_pollen_72H_mean = Column(Float)
    grass_pollen_72H_mean = Column(Float)
    ragweed_pollen_72H_mean = Column(Float)
    mean_RH_difference = Column(Float)
    diurnal_temp_diff = Column(Float)

    # Risk Score and Risk Category
    risk_score = Column(Float)
    risk_category = Column(String)
    patient_state_snapshot = Column(JSON)

    # Relationships
    patient = relationship('Patient', back_populates='assessments')
    baseline_factors = relationship('BaselineFactor', back_populates='assessments', uselist=False)
    dynamic_factors = relationship('DynamicFactor', back_populates='assessments')
