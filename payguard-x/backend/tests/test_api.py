import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert data["system"] == "PAYGUARD-X"

def test_attacks():
    res = client.get("/attacks")
    assert res.status_code == 200
    data = res.json()
    assert data["total_scenarios"] >= 40
    assert len(data["categories"]) == 10

def test_detect():
    payload = {
        "amount": 2500.0,
        "currency": "USD",
        "payment_channel": "INSTANT_PAYMENT",
        "merchant_category": "CRYPTO",
        "behavioural_deviation": 88.0,
        "transaction_velocity": 8,
        "device_change": 1,
        "location_change": 1
    }
    res = client.post("/detect", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "risk_score" in data
    assert "recommended_action" in data
    assert len(data["top_contributing_features"]) > 0

def test_models_performance():
    res = client.get("/models/performance")
    assert res.status_code == 200
    data = res.json()
    assert "comparison" in data
    assert len(data["comparison"]) == 5
    assert "feature_importance" in data

def test_judge_mode():
    res = client.get("/demo/judge-mode")
    assert res.status_code == 200
    data = res.json()
    assert data["demonstration_verdict"] == "CLOSED_LOOP_ADAPTATION_VERIFIED"
    assert "step_1_threat_intel" in data
    assert "step_5_adaptive_evolution" in data
