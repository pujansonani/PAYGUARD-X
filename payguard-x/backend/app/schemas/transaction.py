from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class TransactionInput(BaseModel):
    transaction_id: str = Field(default_factory=lambda: f"TX-REQ-{datetime.now().strftime('%Y%m%d%H%M%S')}")
    amount: float = Field(..., gt=0.0)
    currency: str = "USD"
    payment_channel: str = "CARD_NOT_PRESENT"
    merchant_category: str = "RETAIL"
    account_age_days: float = 120.0
    device_age_days: float = 90.0
    device_change: int = 0
    location_change: int = 0
    transaction_velocity: int = 1
    average_transaction_amount: float = 100.0
    amount_deviation: float = 0.2
    behavioural_deviation: float = 15.0
    hour_of_day: int = 14
    previous_transaction_gap: float = 360.0
    customer_risk_score: float = 20.0
    merchant_risk_score: float = 25.0

class FeatureContribution(BaseModel):
    feature: str
    raw_feature: Optional[str] = None
    contribution_points: float
    impact_direction: Optional[str] = "INCREASES_RISK"
    value: float

class TransactionPredictionResponse(BaseModel):
    transaction_id: str
    risk_score: float
    risk_level: str
    recommended_action: str
    top_contributing_features: List[FeatureContribution]
    model_timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class GenerateAttacksRequest(BaseModel):
    n_samples: int = Field(default=1000, ge=10, le=20000)
    fraud_ratio: float = Field(default=0.15, ge=0.01, le=0.90)
    attack_family: Optional[str] = None
    difficulty: float = Field(default=1.0, ge=0.5, le=3.0)

class AdversarialRoundRequest(BaseModel):
    rounds: int = Field(default=3, ge=1, le=10)
    samples_per_round: int = Field(default=1000, ge=100, le=5000)
    mutation_rate: float = Field(default=0.35, ge=0.05, le=0.8)
    attack_family: Optional[str] = None
    retrain_between_rounds: bool = True

class SettingsUpdateRequest(BaseModel):
    threshold_low_medium: Optional[float] = Field(default=None, ge=10.0, le=50.0)
    threshold_medium_high: Optional[float] = Field(default=None, ge=50.0, le=95.0)
    weight_xgb: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    weight_rf: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    weight_iso: Optional[float] = Field(default=None, ge=0.0, le=1.0)

class ExperimentRecord(BaseModel):
    experiment_id: str
    timestamp: str
    dataset_size: int
    attack_family: str
    model: str
    parameters: Dict[str, Any]
    precision: float
    recall: float
    f1: float
    roc_auc: float
    pr_auc: float
    false_positive_rate: float
    notes: Optional[str] = None

class CreateExperimentRequest(BaseModel):
    name: str
    attack_family: str = "ALL"
    dataset_size: int = 1500
    fraud_ratio: float = 0.15
    difficulty: float = 1.0
    notes: Optional[str] = "Standard experiment run"
