---
title: PAYGUARD-X AI Defense Lab
emoji: 🛡️
colorFrom: red
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# PAYGUARD-X: Autonomous AI Defense Lab for Next-Gen Payment Security

<p align="center">
  <b>Closed-Loop Co-Evolutionary AI Pipeline for Synthetic Attack Generation, Fraud Defense, and Adversarial Hardening</b>
</p>

---

## 🎯 Executive Overview

Modern payments face an existential threat: **Generative AI has democratized weaponized fraud**. Attackers can now orchestrate deepfake voice wire authorizations, high-cadence account takeovers with behavioral mimicry, and synthetic identity rings at scale. Traditional static rule engines and fixed supervised models only learn *after* fraud loss occurs.

**PAYGUARD-X** is an end-to-end, closed-loop AI defense laboratory that turns the tables. It continuously synthesizes emerging GenAI attack vectors, validates statistical non-separability, deploys an AI stacking ensemble defense with granular explainability, attributes defense blindspots, and executes iterative adversarial co-evolution in a safe sandbox.

```
       [ 01. IDENTIFY ] ➔ 40+ Attack Taxonomy (10 GenAI Families)
              ⬇
       [ 02. GENERATE ] ➔ High-Fidelity Synthetic Engine (Wasserstein & JS Div)
              ⬇
       [ 03. DEFEND   ] ➔ Multi-Model Stacking Arbiter (XGB + RF + IsoForest)
              ⬇
       [ 04. ADAPT    ] ➔ Blindspot Attribution & False-Negative Telemetry
              ⬇
       [ 05. HARDEN   ] ➔ Red vs Blue Adversarial Arena Co-Evolution
```

---

## ⚡ Key Capabilities & Modules

### 1. Stage 01: Threat Intelligence & Attack Taxonomy (IDENTIFY)
- **40+ Pre-Configured Attack Scenarios** classified across **10 core attack families**:
  1. *Social Engineering & Phishing*
  2. *Voice & Audio Deepfakes*
  3. *Account Takeover (ATO) & Session Hijacking*
  4. *Synthetic Identity Fraud (SIF)*
  5. *Transaction & Amount Manipulation*
  6. *Digital & Instant Payment Exploits (FedNow / RTP / UPI)*
  7. *Automated Botnets & Credential Stuffing*
  8. *Network Fraud & Money Mule Rings*
  9. *Cross-Channel Infiltration*
  10. *Emerging GenAI Multi-Vector Infiltration*

### 2. Stage 02: High-Fidelity Synthetic Engine (GENERATE)
- Parametric continuous probability distributions: Log-Normal transaction amounts, Gamma customer tenures, Poisson velocity rates.
- **Statistical Fidelity Validation**: Measures **Wasserstein Distance** and **Jensen-Shannon Divergence** to guarantee that synthesized fraud realistically overlaps with legitimate traffic (**Optimal Non-Separability**), avoiding trivial classification shortcuts.
- Real-time batch generation with export to CSV / JSON.

### 3. Stage 03: Multi-Model AI Defense Center (DEFEND)
- **Stacking Meta-Classifier Architecture**:
  - **XGBoost Classifier**: Non-linear gradient boosting for high-dimensional feature interactions.
  - **Random Forest**: Bagged decision forest for robust out-of-distribution resilience.
  - **Isolation Forest**: Unsupervised anomaly detection capturing novel zero-day outliers.
  - **Calibrated Arbiter**: Configurable policy weights and tiered decision boundaries (`ALLOW`, `REVIEW`, `BLOCK`).
- **Explainability & Attribution**: SHAP-style waterfall contributions highlighting the exact risk drivers per transaction.

### 4. Stage 04 & 05: Red vs Blue Arena & Adversarial Feedback Loop (ADAPT & HARDEN)
- **Adversarial Mutator**: Identifies false negatives (missed attacks) and applies safe parametric feature mutations (amount distribution smoothing, velocity dispersion, timing jumps).
- **Autonomous Co-Evolution**: Simulates multi-round red vs blue battles with automated inter-round retraining, demonstrating continuous recall improvement on stealthy evasion variants.

### 5. 🌟 1-Click "Judge Mode" (Autonomous Live Proof)
- Instant hackathon demo mode that autonomously triggers the entire 5-stage closed-loop pipeline and presents live measured metrics (Fidelity, Precision, Recall, F1, ROC-AUC, Adaptation Delta).

---

## 🏗️ Architecture & Technology Stack

| Tier | Technologies |
| :--- | :--- |
| **Backend API** | Python 3.11 / FastAPI / Pydantic v2 / Uvicorn |
| **ML & AI Engine** | Scikit-Learn / XGBoost / SciPy / NumPy / Pandas / SHAP |
| **Frontend UI** | React 18 / TypeScript / Tailwind CSS / Vite / Recharts / Lucide Icons |
| **DevOps & Testing** | Docker / Docker Compose / Pytest (100% Passing Unit & Integration Tests) |

---

---

## 🚀 Deployment & Quickstart Guide

### Option 1: 1-Click Cloud Deployment (Render.com)
The repository includes a ready-to-deploy [`render.yaml`](file:///Users/pujansonani/Desktop/PAYGUARD%20X/render.yaml) blueprint that automatically provisions both the FastAPI backend service and the Vite React frontend:
1. Go to [Render Dashboard](https://dashboard.render.com/) ➔ **New** ➔ **Blueprint**.
2. Connect your GitHub repository (`https://github.com/pujansonani/PAYGUARD-X`).
3. Render will automatically read `render.yaml`, spin up `payguard-x-backend` (Python) and `payguard-x-frontend` (Static Site), and link their environment variables.

---

### Option 2: Deploy Frontend on Vercel + Backend on Render / Railway

#### A. Deploy Backend on Render / Railway
1. **New Web Service** on [Render](https://render.com) or [Railway](https://railway.app).
2. Root Directory: `payguard-x/backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Copy your deployed backend URL (e.g. `https://payguard-x-backend.onrender.com`).

#### B. Deploy Frontend on Vercel
1. Go to [Vercel](https://vercel.com) ➔ **Add New Project** ➔ Import `pujansonani/PAYGUARD-X`.
2. Root Directory: `payguard-x/frontend`
3. Framework Preset: **Vite**
4. Environment Variable:
   - `VITE_API_URL` = `https://payguard-x-backend.onrender.com` (your backend URL)
5. Click **Deploy**.

---

### Option 3: Docker & Docker Compose (Any Cloud VM / AWS / GCP / DigitalOcean)

Run the full production stack with one command:
```bash
cd payguard-x
docker compose up --build -d
```
- **Frontend Dashboard UI**: `http://<YOUR_SERVER_IP>:5173`
- **Backend FastAPI API**: `http://<YOUR_SERVER_IP>:8000`
- **Interactive Swagger Docs**: `http://<YOUR_SERVER_IP>:8000/docs`

---

### Option 4: Local Development Setup

#### 1. Start the Backend API
```bash
cd payguard-x/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Start the Frontend Dashboard
```bash
cd payguard-x/frontend
npm install
npm run dev
```

---

## 🧪 Testing & Verification

### Run the Automated Pytest Suite
```bash
cd payguard-x/backend
pytest
```
*Executes all 17 unit and integration tests across synthetic generation, feature engineering, model training, adversarial mutator, and API endpoints.*

### Run the Standalone Arena CLI Script
```bash
python3 payguard-x/scripts/run_arena.py
```

### Build Submission Package
```bash
python3 build_zip.py
```
*Generates a clean `PAYGUARD_X_SUBMISSION.zip` containing all code, tests, and configurations.*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | System health, model training status, and dataset size |
| `GET` | `/attacks` | Full 40+ attack scenario taxonomy with category filters |
| `GET` | `/attacks/{id}` | Detailed metadata and evasion vectors for a specific scenario |
| `POST` | `/attacks/generate` | Synthesize parametric attack datasets with fidelity validation |
| `POST` | `/detect` | Single transaction real-time scoring with SHAP waterfall signals |
| `POST` | `/detect/batch` | Batch transaction risk inference |
| `GET` | `/models/performance` | 5-model comparative benchmark matrix (Precision, Recall, ROC-AUC, PR-AUC) |
| `POST` | `/adversarial/run` | Execute multi-round Red vs Blue adversarial co-evolution |
| `GET` | `/adversarial/results` | Historical audit of adversarial adaptation rounds |
| `GET` | `/transactions` | Telemetry ledger with live risk scores and predictions |
| `GET` | `/experiments` | ML experiment audit trail and hyperparameters |
| `POST` | `/experiments` | Record a new model training experiment run |
| `POST` | `/reports` | Generate comprehensive technical markdown security report |
| `GET` | `/demo/judge-mode` | Autonomous 5-stage verification demonstration |
| `POST` | `/settings` | Tune decision thresholds (ALLOW/REVIEW/BLOCK) and stacking weights |

---

## 📄 License & Integrity
PAYGUARD-X is engineered for high-security fintech environments, digital payment rails (FedNow, RTP, SEPA, UPI), and financial intelligence defense centers.
