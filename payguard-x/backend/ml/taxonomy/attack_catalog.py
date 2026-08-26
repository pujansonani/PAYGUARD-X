from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

class AttackScenario(BaseModel):
    id: str
    name: str
    category: str
    description: str
    payment_channels: List[str]
    attack_surface: str
    severity: str
    novelty_score: float = Field(ge=0.0, le=1.0)
    difficulty: float = Field(ge=0.0, le=1.0)
    observable_signals: List[str]
    simulation_parameters: Dict[str, Any]
    detection_features: List[str]
    blindspot_profile: Optional[str] = None

CATEGORIES = [
    "Social Engineering",
    "Phishing / Smishing",
    "Voice / Deepfake",
    "Account Takeover",
    "Synthetic Identity",
    "Transaction Manipulation",
    "Digital Payment",
    "Automated Fraud",
    "Network Fraud",
    "Cross-Channel"
]

EXPLICIT_SCENARIOS: List[AttackScenario] = [
    # 1. Social Engineering
    AttackScenario(
        id="SE-001",
        name="Executive Deepfake Voice Authorization",
        category="Social Engineering",
        description="GenAI voice clone impersonating C-suite executive pressuring finance staff for out-of-band urgent wire settlement.",
        payment_channels=["WIRE", "INSTANT_PAYMENT"],
        attack_surface="Voice / Executive Authorization Flow",
        severity="CRITICAL",
        novelty_score=0.94,
        difficulty=0.88,
        observable_signals=["Off-cycle high amount deviation", "Compressed transaction gap", "Urgent off-hours settlement"],
        simulation_parameters={"amount_multiplier": 5.2, "velocity_factor": 2.5, "device_anomaly": 0.3, "behavioural_dev_base": 78.0},
        detection_features=["amount_deviation", "hour_of_day", "behavioural_deviation", "merchant_risk_score"],
        blindspot_profile="Authorized by legitimate internal employee credentials; bypasses traditional device-reputation filters."
    ),
    AttackScenario(
        id="SE-002",
        name="Conversational AI Customer Support Impersonation",
        category="Social Engineering",
        description="Automated LLM agent impersonates fintech fraud specialist, tricking victim into authorizing instant token migration.",
        payment_channels=["P2P", "INSTANT_PAYMENT", "WEB_GATEWAY"],
        attack_surface="Customer Support & OTP Redirection",
        severity="HIGH",
        novelty_score=0.89,
        difficulty=0.79,
        observable_signals=["Rapid successive P2P outbound transfers", "High behavioural deviation score", "Session velocity burst"],
        simulation_parameters={"amount_multiplier": 2.8, "velocity_factor": 3.8, "device_anomaly": 0.2, "behavioural_dev_base": 84.0},
        detection_features=["behavioural_deviation", "transaction_velocity", "previous_transaction_gap"],
        blindspot_profile="Transaction originates from consumer's verified mobile device, confounding device-fingerprint heuristics."
    ),
    AttackScenario(
        id="SE-003",
        name="Personalized Romance & Investment Scam Escalation",
        category="Social Engineering",
        description="Multi-week LLM-guided grooming relationship escalating from micro-test payments into large-scale crypto gateway payouts.",
        payment_channels=["INSTANT_PAYMENT", "WEB_GATEWAY", "CARD_NOT_PRESENT"],
        attack_surface="P2P & Crypto Merchant Gateways",
        severity="HIGH",
        novelty_score=0.85,
        difficulty=0.84,
        observable_signals=["Steep geometric escalation in transaction amounts", "Shift to high-risk merchant category (CRYPTO)", "Customer risk acceleration"],
        simulation_parameters={"amount_multiplier": 4.0, "velocity_factor": 2.0, "device_anomaly": 0.1, "behavioural_dev_base": 72.0},
        detection_features=["amount_deviation", "merchant_risk_score", "customer_risk_score"],
        blindspot_profile="Paced over weeks, mimicking organic customer discretionary spending growth."
    ),
    AttackScenario(
        id="SE-004",
        name="Emergency Family Distress Multi-Channel Scam",
        category="Social Engineering",
        description="Generative conversational persona simulates family emergency with cloned voice notes, urging instant P2P transfer.",
        payment_channels=["P2P", "INSTANT_PAYMENT"],
        attack_surface="Messaging & Mobile P2P Apps",
        severity="HIGH",
        novelty_score=0.87,
        difficulty=0.76,
        observable_signals=["Uncharacteristic new beneficiary destination", "Sudden late-night velocity spike", "Immediate maximum limit withdrawal"],
        simulation_parameters={"amount_multiplier": 3.5, "velocity_factor": 3.0, "device_anomaly": 0.0, "behavioural_dev_base": 80.0},
        detection_features=["amount_deviation", "hour_of_day", "behavioural_deviation"],
        blindspot_profile="Zero device anomaly; consumer acts under extreme synthetic psychological duress."
    ),

    # 2. Phishing / Smishing
    AttackScenario(
        id="PS-001",
        name="Dynamic Generative Spear-Phishing Gateway",
        category="Phishing / Smishing",
        description="Context-aware LLM generates personalized fake invoice payment portals scraping corporate vendor telemetry.",
        payment_channels=["WEB_GATEWAY", "CARD_NOT_PRESENT"],
        attack_surface="B2B Supplier Web Portal",
        severity="CRITICAL",
        novelty_score=0.91,
        difficulty=0.83,
        observable_signals=["Unrecognized merchant redirect", "Sudden device fingerprint reset", "Mismatched geo-IP routing"],
        simulation_parameters={"amount_multiplier": 3.8, "velocity_factor": 2.2, "device_anomaly": 0.9, "behavioural_dev_base": 75.0},
        detection_features=["device_change", "location_change", "merchant_risk_score"],
        blindspot_profile="Dynamic domains bypass static URL blocklists; invoice amounts match expected vendor billing cycles."
    ),
    AttackScenario(
        id="PS-002",
        name="Adaptive Multilingual Smishing Token Intercept",
        category="Phishing / Smishing",
        description="AI-translated localized smishing lures victims to replica banking apps, capturing one-time credentials in real-time.",
        payment_channels=["CARD_NOT_PRESENT", "INSTANT_PAYMENT"],
        attack_surface="Mobile SMS & Web Gateway",
        severity="HIGH",
        novelty_score=0.88,
        difficulty=0.80,
        observable_signals=["Rapid login-to-payment transition", "Unregistered mobile user agent", "Velocity surge"],
        simulation_parameters={"amount_multiplier": 2.5, "velocity_factor": 3.5, "device_anomaly": 0.85, "behavioural_dev_base": 79.0},
        detection_features=["device_change", "transaction_velocity", "amount_deviation"],
        blindspot_profile="Hyper-localized language nuance reduces user suspicion score significantly."
    ),
    AttackScenario(
        id="PS-003",
        name="Brand-Mimicking Instant Notification Gateway",
        category="Phishing / Smishing",
        description="Synthetic fraud alert notification directs victim to mirrored verification portal, draining card limits immediately.",
        payment_channels=["CARD_NOT_PRESENT", "WEB_GATEWAY"],
        attack_surface="Card Authorization Switch",
        severity="HIGH",
        novelty_score=0.82,
        difficulty=0.75,
        observable_signals=["Instantaneous payment authorization post-alert", "Elevated merchant risk", "Abnormal amount deviation"],
        simulation_parameters={"amount_multiplier": 2.9, "velocity_factor": 3.0, "device_anomaly": 0.8, "behavioural_dev_base": 70.0},
        detection_features=["amount_deviation", "merchant_risk_score", "device_change"],
        blindspot_profile="User is actively expecting a security confirmation step, masking behavioral hesitations."
    ),
    AttackScenario(
        id="PS-004",
        name="Adaptive QR-Code Invoice MITM Hijack",
        category="Phishing / Smishing",
        description="Malicious synthetic PDF statement replaces utility/merchant QR payment payload with dynamic laundering routing.",
        payment_channels=["QR_PAYMENT", "INSTANT_PAYMENT"],
        attack_surface="Physical & Digital Invoicing",
        severity="HIGH",
        novelty_score=0.86,
        difficulty=0.78,
        observable_signals=["Merchant endpoint routing mutation", "Discrepancy in beneficiary account tenure", "Unusual velocity burst"],
        simulation_parameters={"amount_multiplier": 2.2, "velocity_factor": 2.8, "device_anomaly": 0.4, "behavioural_dev_base": 68.0},
        detection_features=["merchant_risk_score", "amount_deviation", "customer_risk_score"],
        blindspot_profile="QR payload scanned in physical/mobile app; visual invoice looks 100% authentic to customer."
    ),

    # 3. Voice / Deepfake
    AttackScenario(
        id="VD-001",
        name="Real-Time Audio Latency-Compensated IVR Spoofing",
        category="Voice / Deepfake",
        description="Low-latency generative voice model navigates interactive voice response (IVR) phone banking to execute transfers.",
        payment_channels=["WIRE", "INSTANT_PAYMENT"],
        attack_surface="Telephony Banking IVR Switch",
        severity="CRITICAL",
        novelty_score=0.95,
        difficulty=0.90,
        observable_signals=["IVR navigation speed anomaly", "High-value wire initiation", "New beneficiary setup"],
        simulation_parameters={"amount_multiplier": 4.8, "velocity_factor": 2.6, "device_anomaly": 0.7, "behavioural_dev_base": 82.0},
        detection_features=["amount_deviation", "behavioural_deviation", "hour_of_day"],
        blindspot_profile="Passes acoustic biometric voiceprint matching algorithms through high-fidelity spectral synthesis."
    ),
    AttackScenario(
        id="VD-002",
        name="Synthetic Biometric Voiceprint Extraction & Replay",
        category="Voice / Deepfake",
        description="Extracts voice tokens from public video interviews to bypass bank voice-ID verification during high-risk transfers.",
        payment_channels=["WIRE", "CARD_NOT_PRESENT"],
        attack_surface="Biometric Voice ID Layer",
        severity="CRITICAL",
        novelty_score=0.93,
        difficulty=0.87,
        observable_signals=["Abnormal transaction velocity following auth", "Immediate limit drain", "Off-peak timing"],
        simulation_parameters={"amount_multiplier": 4.5, "velocity_factor": 2.4, "device_anomaly": 0.65, "behavioural_dev_base": 80.0},
        detection_features=["amount_deviation", "hour_of_day", "customer_risk_score"],
        blindspot_profile="Triggers positive biometric match on authentication servers."
    ),
    AttackScenario(
        id="VD-003",
        name="Multi-Speaker Synthetic Authorization Conference",
        category="Voice / Deepfake",
        description="Simulated dual-approver conference call where GenAI synthesizes both CFO and CEO approval tokens for escrow release.",
        payment_channels=["WIRE"],
        attack_surface="Multi-Sig Corporate Escrow",
        severity="CRITICAL",
        novelty_score=0.96,
        difficulty=0.92,
        observable_signals=["Massive single transaction amount spike", "Immediate full balance depletion", "Velocity anomaly"],
        simulation_parameters={"amount_multiplier": 6.5, "velocity_factor": 1.8, "device_anomaly": 0.5, "behavioural_dev_base": 88.0},
        detection_features=["amount_deviation", "behavioural_deviation", "merchant_risk_score"],
        blindspot_profile="Complies with dual-control policy checks using two synchronized synthetic personas."
    ),
    AttackScenario(
        id="VD-004",
        name="Voice-Agent Telemetry Desynchronization",
        category="Voice / Deepfake",
        description="AI voice agent keeps bank rep engaged while secondary automated bot performs simultaneous web-channel cashout.",
        payment_channels=["WEB_GATEWAY", "INSTANT_PAYMENT"],
        attack_surface="Omnichannel Sync Layer",
        severity="HIGH",
        novelty_score=0.88,
        difficulty=0.81,
        observable_signals=["Simultaneous multi-channel activity", "Elevated session velocity", "Location variance"],
        simulation_parameters={"amount_multiplier": 3.2, "velocity_factor": 4.2, "device_anomaly": 0.8, "behavioural_dev_base": 76.0},
        detection_features=["transaction_velocity", "location_change", "amount_deviation"],
        blindspot_profile="Exploits delayed cross-channel locking between call center and core banking switch."
    ),

    # 4. Account Takeover
    AttackScenario(
        id="ATO-001",
        name="Session Hijack with Silent Device Injection",
        category="Account Takeover",
        description="Adversary steals active session tokens via info-stealer malware and replays them with spoofed client device fingerprints.",
        payment_channels=["WEB_GATEWAY", "CARD_NOT_PRESENT"],
        attack_surface="Session Auth & Cookie Layer",
        severity="CRITICAL",
        novelty_score=0.86,
        difficulty=0.82,
        observable_signals=["Instantaneous geo-velocity jump", "Device age reset to 0", "Elevated velocity"],
        simulation_parameters={"amount_multiplier": 3.2, "velocity_factor": 4.1, "device_anomaly": 1.0, "behavioural_dev_base": 85.0},
        detection_features=["location_change", "device_change", "transaction_velocity"],
        blindspot_profile="Valid session cookie avoids triggering password prompt or step-up MFA."
    ),
    AttackScenario(
        id="ATO-002",
        name="Credential Stuffing with Geo-Distributed Proxies",
        category="Account Takeover",
        description="Distributed botnet attempts millions of credential pairs across residential IPs, then drains compromised balances.",
        payment_channels=["CARD_NOT_PRESENT", "WEB_GATEWAY"],
        attack_surface="Login API & Payment Gateway",
        severity="HIGH",
        novelty_score=0.79,
        difficulty=0.74,
        observable_signals=["Low account age vs device age", "Location change", "Velocity burst across cards"],
        simulation_parameters={"amount_multiplier": 2.6, "velocity_factor": 3.6, "device_anomaly": 0.9, "behavioural_dev_base": 78.0},
        detection_features=["location_change", "device_change", "transaction_velocity"],
        blindspot_profile="Residential proxies rotate IPs to stay under standard WAF rate limits."
    ),
    AttackScenario(
        id="ATO-003",
        name="Automated MFA Interception & Instant Drain",
        category="Account Takeover",
        description="SIM-swap or SS7 redirect captures SMS OTP, immediately initiating maximum allowable P2P instant payments.",
        payment_channels=["INSTANT_PAYMENT", "P2P"],
        attack_surface="Mobile SMS Auth Switch",
        severity="CRITICAL",
        novelty_score=0.84,
        difficulty=0.81,
        observable_signals=["High transaction velocity within 60 seconds", "Maximum threshold amounts", "New device fingerprint"],
        simulation_parameters={"amount_multiplier": 3.7, "velocity_factor": 4.5, "device_anomaly": 1.0, "behavioural_dev_base": 86.0},
        detection_features=["device_change", "amount_deviation", "transaction_velocity"],
        blindspot_profile="Proper 2FA token entered on first attempt; bypasses standard OTP challenge gates."
    ),
    AttackScenario(
        id="ATO-004",
        name="Dormant Account Revival with Behavioral Masking",
        category="Account Takeover",
        description="Compromised dormant accounts revived and slowly warmed with small transactions before high-value exfiltration.",
        payment_channels=["WEB_GATEWAY", "CARD_NOT_PRESENT"],
        attack_surface="Dormancy Reactivation Switch",
        severity="HIGH",
        novelty_score=0.87,
        difficulty=0.85,
        observable_signals=["Massive gap since previous transaction", "Sudden device shift", "Rapid amount escalation"],
        simulation_parameters={"amount_multiplier": 3.4, "velocity_factor": 2.8, "device_anomaly": 0.8, "behavioural_dev_base": 82.0},
        detection_features=["previous_transaction_gap", "device_change", "amount_deviation"],
        blindspot_profile="Warm-up micro-transactions train naive baseline models to accept new behavioral baseline."
    ),

    # 5. Synthetic Identity
    AttackScenario(
        id="SYN-001",
        name="GenAI-Fabricated Credit Profile Bust-Out",
        category="Synthetic Identity",
        description="Synthetic identity built using GenAI-generated utility bills and credit histories maxes out credit lines before vanishing.",
        payment_channels=["CARD_NOT_PRESENT", "POS"],
        attack_surface="Credit Line Onboarding & Issuance",
        severity="CRITICAL",
        novelty_score=0.90,
        difficulty=0.86,
        observable_signals=["Young account age", "Rapid escalation to 98% line utilization", "High merchant risk profile"],
        simulation_parameters={"amount_multiplier": 4.1, "velocity_factor": 3.2, "device_anomaly": 0.4, "behavioural_dev_base": 80.0},
        detection_features=["account_age_days", "amount_deviation", "merchant_risk_score"],
        blindspot_profile="Clean synthetic credit bureau file; no real victim files identity theft dispute immediately."
    ),
    AttackScenario(
        id="SYN-002",
        name="Ghost Merchant Rapid Settlement Scheme",
        category="Synthetic Identity",
        description="AI generates fake e-commerce store with synthetic reviews and fake orders, laundering funds before chargebacks land.",
        payment_channels=["WEB_GATEWAY", "CARD_NOT_PRESENT"],
        attack_surface="Merchant Acquiring Facility",
        severity="CRITICAL",
        novelty_score=0.92,
        difficulty=0.88,
        observable_signals=["Abnormal merchant risk score", "High transaction velocity", "Low variation in basket size"],
        simulation_parameters={"amount_multiplier": 3.0, "velocity_factor": 4.0, "device_anomaly": 0.5, "behavioural_dev_base": 78.0},
        detection_features=["merchant_risk_score", "transaction_velocity", "amount_deviation"],
        blindspot_profile="Transactions appear as legitimate consumer purchases on a modern storefront."
    ),
    AttackScenario(
        id="SYN-003",
        name="Fragmented Identity Inconsistency Swarm",
        category="Synthetic Identity",
        description="Multiple synthetic personas sharing overlapping SSN fragments and addresses execute synchronized cash withdrawals.",
        payment_channels=["POS", "INSTANT_PAYMENT"],
        attack_surface="ATM & POS Terminal Switch",
        severity="HIGH",
        novelty_score=0.85,
        difficulty=0.83,
        observable_signals=["High customer risk score", "Low account tenure", "Repeated fixed-amount pattern"],
        simulation_parameters={"amount_multiplier": 2.7, "velocity_factor": 3.4, "device_anomaly": 0.6, "behavioural_dev_base": 74.0},
        detection_features=["customer_risk_score", "account_age_days", "transaction_velocity"],
        blindspot_profile="Individual transaction sizes stay below statutory regulatory reporting thresholds."
    ),
    AttackScenario(
        id="SYN-004",
        name="Algorithmic Micro-Deposit Verification Bypass",
        category="Synthetic Identity",
        description="AI agent predicts and confirms ACH trial micro-deposits to link unverified synthetic accounts instantly.",
        payment_channels=["WIRE", "INSTANT_PAYMENT"],
        attack_surface="ACH / Bank Account Verification API",
        severity="HIGH",
        novelty_score=0.89,
        difficulty=0.84,
        observable_signals=["Unusually rapid bank link completion", "Immediate max payout initiation", "Device mismatch"],
        simulation_parameters={"amount_multiplier": 3.3, "velocity_factor": 2.9, "device_anomaly": 0.7, "behavioural_dev_base": 76.0},
        detection_features=["device_change", "amount_deviation", "customer_risk_score"],
        blindspot_profile="Passes legacy micro-deposit verification without requiring interactive user bank login."
    ),

    # 6. Transaction Manipulation
    AttackScenario(
        id="TM-001",
        name="Micro-Structuring Velocity Burst (Smurfing)",
        category="Transaction Manipulation",
        description="Automated algorithm slices a massive illicit balance into hundreds of sub-$500 payments routed across payment channels.",
        payment_channels=["INSTANT_PAYMENT", "P2P", "QR_PAYMENT"],
        attack_surface="Transaction Processing Switch",
        severity="HIGH",
        novelty_score=0.81,
        difficulty=0.76,
        observable_signals=["Extreme transaction velocity", "Amounts just below alert thresholds ($480–$495)", "Low transaction gap"],
        simulation_parameters={"amount_multiplier": 1.4, "velocity_factor": 6.2, "device_anomaly": 0.3, "behavioural_dev_base": 88.0},
        detection_features=["transaction_velocity", "previous_transaction_gap", "behavioural_deviation"],
        blindspot_profile="Evades fixed-threshold AML rules by keeping individual transaction values low."
    ),
    AttackScenario(
        id="TM-002",
        name="Cross-Border Currency Arbitrage Anomalies",
        category="Transaction Manipulation",
        description="Exploits minor conversion latency across multi-currency settlement rails to siphon currency spread repeatedly.",
        payment_channels=["WIRE", "WEB_GATEWAY"],
        attack_surface="FX Settlement Engine",
        severity="HIGH",
        novelty_score=0.88,
        difficulty=0.85,
        observable_signals=["Rapid recurring round-trip transfers", "Elevated transaction velocity", "High average amount"],
        simulation_parameters={"amount_multiplier": 3.6, "velocity_factor": 3.8, "device_anomaly": 0.2, "behavioural_dev_base": 73.0},
        detection_features=["transaction_velocity", "amount_deviation", "merchant_risk_score"],
        blindspot_profile="Transactions appear as regular international commercial settlements."
    ),
    AttackScenario(
        id="TM-003",
        name="Off-Hours High-Value Liquidity Exfiltration",
        category="Transaction Manipulation",
        description="High-value batch drains timed for 3:00 AM on holiday weekends when manual risk operations are minimal.",
        payment_channels=["WIRE", "INSTANT_PAYMENT"],
        attack_surface="Core Clearing & Settlement Rails",
        severity="CRITICAL",
        novelty_score=0.83,
        difficulty=0.78,
        observable_signals=["Severe hour-of-day anomaly (02:00-05:00)", "Massive amount deviation", "Elevated merchant risk score"],
        simulation_parameters={"amount_multiplier": 4.9, "velocity_factor": 2.2, "device_anomaly": 0.6, "behavioural_dev_base": 85.0},
        detection_features=["hour_of_day", "amount_deviation", "behavioural_deviation"],
        blindspot_profile="Exploits reduced human analyst coverage during holiday maintenance windows."
    ),
    AttackScenario(
        id="TM-004",
        name="Escalating Salami Slicing Technique",
        category="Transaction Manipulation",
        description="Fractions of cents or tiny $1.20 charges skimmed from thousands of active accounts aggregated into a single collector.",
        payment_channels=["CARD_NOT_PRESENT", "POS"],
        attack_surface="Recurring Billing Engine",
        severity="MEDIUM",
        novelty_score=0.84,
        difficulty=0.80,
        observable_signals=["Extreme aggregate merchant velocity", "Low amounts", "Elevated merchant risk"],
        simulation_parameters={"amount_multiplier": 0.4, "velocity_factor": 5.8, "device_anomaly": 0.2, "behavioural_dev_base": 65.0},
        detection_features=["transaction_velocity", "merchant_risk_score", "previous_transaction_gap"],
        blindspot_profile="Amounts are too small to prompt consumer SMS alerts or dispute filings."
    ),

    # 7. Digital Payment
    AttackScenario(
        id="DP-001",
        name="Dynamic QR Code MITM Destination Swap",
        category="Digital Payment",
        description="Physical/digital QR code generator replaced via MITM attack to redirect instant merchant settlements to attacker wallet.",
        payment_channels=["QR_PAYMENT"],
        attack_surface="Merchant POS & QR Display API",
        severity="HIGH",
        novelty_score=0.89,
        difficulty=0.82,
        observable_signals=["Beneficiary risk score divergence", "Sudden merchant location jump", "Burst in rapid payments"],
        simulation_parameters={"amount_multiplier": 2.1, "velocity_factor": 3.4, "device_anomaly": 0.4, "behavioural_dev_base": 71.0},
        detection_features=["merchant_risk_score", "location_change", "transaction_velocity"],
        blindspot_profile="Customers believe they are scanning an authorized store QR code."
    ),
    AttackScenario(
        id="DP-002",
        name="Instant P2P Cascading Ring Transfer",
        category="Digital Payment",
        description="Funds received via fraudulent instant payment instantly hop through 5 nested P2P wallets within seconds.",
        payment_channels=["P2P", "INSTANT_PAYMENT"],
        attack_surface="Real-time P2P Switch",
        severity="CRITICAL",
        novelty_score=0.91,
        difficulty=0.86,
        observable_signals=["Near-zero transaction gap (< 1 min)", "Equal inflow/outflow balance amounts", "High velocity"],
        simulation_parameters={"amount_multiplier": 2.8, "velocity_factor": 5.0, "device_anomaly": 0.6, "behavioural_dev_base": 84.0},
        detection_features=["previous_transaction_gap", "transaction_velocity", "behavioural_deviation"],
        blindspot_profile="Completes multi-hop exit before initial victim or issuing bank files recall request."
    ),
    AttackScenario(
        id="DP-003",
        name="Mobile Tokenization Replay Exploit",
        category="Digital Payment",
        description="Interception and replay of Apple Pay / Google Wallet device primary account tokens across malicious POS terminals.",
        payment_channels=["POS", "CARD_NOT_PRESENT"],
        attack_surface="NFC Tokenization Decryption Layer",
        severity="HIGH",
        novelty_score=0.90,
        difficulty=0.87,
        observable_signals=["Device age desynchronization", "Geographic impossibility jump", "Velocity spike"],
        simulation_parameters={"amount_multiplier": 3.1, "velocity_factor": 3.6, "device_anomaly": 0.95, "behavioural_dev_base": 79.0},
        detection_features=["device_change", "location_change", "amount_deviation"],
        blindspot_profile="Uses authenticated token cryptograms, giving appearance of secure hardware enclave approval."
    ),
    AttackScenario(
        id="DP-004",
        name="NFC Virtual Card Emulation Relay",
        category="Digital Payment",
        description="Relay attack where proxy phone at physical store reads POS challenge, forward-relays to victim phone in subway.",
        payment_channels=["POS"],
        attack_surface="NFC Contactless Terminal",
        severity="HIGH",
        novelty_score=0.87,
        difficulty=0.84,
        observable_signals=["Geographic leap from user home location", "Abnormal store merchant category", "High single amount"],
        simulation_parameters={"amount_multiplier": 2.9, "velocity_factor": 2.1, "device_anomaly": 0.8, "behavioural_dev_base": 75.0},
        detection_features=["location_change", "amount_deviation", "merchant_risk_score"],
        blindspot_profile="Physical tap occurs within standard contactless round-trip timing limits."
    ),

    # 8. Automated Fraud
    AttackScenario(
        id="AUT-001",
        name="Distributed Botnet Carding Sweep",
        category="Automated Fraud",
        description="Thousands of headless browser instances test stolen card numbers with low-value donation or game store purchases.",
        payment_channels=["CARD_NOT_PRESENT", "WEB_GATEWAY"],
        attack_surface="Merchant Checkout Gateway",
        severity="CRITICAL",
        novelty_score=0.83,
        difficulty=0.77,
        observable_signals=["High transaction velocity across distinct cards", "Low transaction gap", "Short device tenure"],
        simulation_parameters={"amount_multiplier": 0.6, "velocity_factor": 6.5, "device_anomaly": 0.85, "behavioural_dev_base": 82.0},
        detection_features=["transaction_velocity", "previous_transaction_gap", "device_change"],
        blindspot_profile="Spreads validation attempts across 50,000 distinct IP addresses to evade rate limiters."
    ),
    AttackScenario(
        id="AUT-002",
        name="Adaptive Timing Attack on Authorization Latencies",
        category="Automated Fraud",
        description="Exploits sub-second asynchronous delays between local balance deduction and international clearing ledger.",
        payment_channels=["WEB_GATEWAY", "INSTANT_PAYMENT"],
        attack_surface="Authorization Switch Clearing Queue",
        severity="HIGH",
        novelty_score=0.92,
        difficulty=0.89,
        observable_signals=["Near-instantaneous concurrent transaction firing", "Amounts matching exact balance", "Elevated velocity"],
        simulation_parameters={"amount_multiplier": 3.4, "velocity_factor": 5.4, "device_anomaly": 0.5, "behavioural_dev_base": 86.0},
        detection_features=["transaction_velocity", "previous_transaction_gap", "amount_deviation"],
        blindspot_profile="Hits during queue buffer flush cycles when concurrency locks temporarily degrade."
    ),
    AttackScenario(
        id="AUT-003",
        name="Headless Browser Payment Automation Swarm",
        category="Automated Fraud",
        description="Puppeteer/Playwright scripts mimicking human cursor movement and typing cadence execute checkout sweeps.",
        payment_channels=["WEB_GATEWAY", "CARD_NOT_PRESENT"],
        attack_surface="Web Checkout UI",
        severity="HIGH",
        novelty_score=0.86,
        difficulty=0.81,
        observable_signals=["Device change", "Elevated transaction velocity", "High-risk merchant destination"],
        simulation_parameters={"amount_multiplier": 2.7, "velocity_factor": 3.9, "device_anomaly": 0.9, "behavioural_dev_base": 77.0},
        detection_features=["device_change", "transaction_velocity", "merchant_risk_score"],
        blindspot_profile="Synthetic Bezier mouse curves defeat traditional behavioral biometrics scripts."
    ),
    AttackScenario(
        id="AUT-004",
        name="AI-Driven Rate Limit Evading Web-Crawler",
        category="Automated Fraud",
        description="Autonomous crawler optimizes transaction submission intervals dynamically based on payment gateway latency feedback.",
        payment_channels=["WEB_GATEWAY"],
        attack_surface="Payment Gateway REST API",
        severity="MEDIUM",
        novelty_score=0.89,
        difficulty=0.83,
        observable_signals=["Algorithmic spacing of transaction gap", "Continuous sustained velocity", "Elevated merchant risk"],
        simulation_parameters={"amount_multiplier": 1.9, "velocity_factor": 3.1, "device_anomaly": 0.6, "behavioural_dev_base": 70.0},
        detection_features=["previous_transaction_gap", "transaction_velocity", "merchant_risk_score"],
        blindspot_profile="Maintains transaction pacing precisely 5% below dynamic anomaly triggers."
    ),

    # 9. Network Fraud
    AttackScenario(
        id="NET-001",
        name="Synthetic Mule Ring Layering Topology",
        category="Network Fraud",
        description="Coordinated network of 50 synthetic mule accounts exchanging funds in graph cycles before funneling into crypto off-ramps.",
        payment_channels=["INSTANT_PAYMENT", "P2P", "WIRE"],
        attack_surface="Inter-Bank Settlement Graph",
        severity="CRITICAL",
        novelty_score=0.94,
        difficulty=0.90,
        observable_signals=["High customer and merchant risk scores", "Rapid pass-through velocity", "Elevated behavioural deviation"],
        simulation_parameters={"amount_multiplier": 3.5, "velocity_factor": 4.6, "device_anomaly": 0.7, "behavioural_dev_base": 88.0},
        detection_features=["customer_risk_score", "merchant_risk_score", "transaction_velocity", "behavioural_deviation"],
        blindspot_profile="Individually, each mule account maintains acceptable transaction limits; danger only visible in graph topology."
    ),
    AttackScenario(
        id="NET-002",
        name="Coordinated Multi-Account Merchant Collusion",
        category="Network Fraud",
        description="Colluding merchants and buyers create synthetic checkout loops to harvest credit card reward cashbacks.",
        payment_channels=["CARD_NOT_PRESENT", "WEB_GATEWAY"],
        attack_surface="Merchant Settlement Facility",
        severity="HIGH",
        novelty_score=0.88,
        difficulty=0.84,
        observable_signals=["Identical repetitive transaction amounts", "High velocity", "Elevated merchant risk score"],
        simulation_parameters={"amount_multiplier": 2.8, "velocity_factor": 4.2, "device_anomaly": 0.4, "behavioural_dev_base": 75.0},
        detection_features=["merchant_risk_score", "amount_deviation", "transaction_velocity"],
        blindspot_profile="No chargebacks ever filed; buyers and sellers are in active criminal collusion."
    ),
    AttackScenario(
        id="NET-003",
        name="Smurfing Cluster with High-Speed Decentralized Outflow",
        category="Network Fraud",
        description="Central syndicate dispenses illicit funds to 100 decentralized mobile wallets that cash out via P2P crypto brokers.",
        payment_channels=["P2P", "INSTANT_PAYMENT"],
        attack_surface="Mobile P2P Clearing Engine",
        severity="CRITICAL",
        novelty_score=0.91,
        difficulty=0.87,
        observable_signals=["Velocity surge across low-tenure accounts", "Near-zero transaction gaps", "High customer risk"],
        simulation_parameters={"amount_multiplier": 2.4, "velocity_factor": 4.8, "device_anomaly": 0.6, "behavioural_dev_base": 83.0},
        detection_features=["customer_risk_score", "transaction_velocity", "previous_transaction_gap"],
        blindspot_profile="Decentralized cash-out occurs in parallel across disparate jurisdictions."
    ),
    AttackScenario(
        id="NET-004",
        name="Star-Topology Smurfing via Neo-Bank Endpoints",
        category="Network Fraud",
        description="Central hub injects funds into dozens of virtual neo-bank accounts, executing automated ATM cardless cash withdrawals.",
        payment_channels=["INSTANT_PAYMENT", "POS"],
        attack_surface="Neo-Bank Virtual Card Gateway",
        severity="HIGH",
        novelty_score=0.87,
        difficulty=0.82,
        observable_signals=["Account age under 30 days", "Rapid balance depletion", "Velocity anomaly"],
        simulation_parameters={"amount_multiplier": 2.6, "velocity_factor": 4.0, "device_anomaly": 0.7, "behavioural_dev_base": 79.0},
        detection_features=["account_age_days", "transaction_velocity", "amount_deviation"],
        blindspot_profile="Uses cardless ATM OTP codes, leaving minimal physical forensics."
    ),

    # 10. Cross-Channel
    AttackScenario(
        id="CC-001",
        name="Phishing SMS Triggering Instant P2P Payment",
        category="Cross-Channel",
        description="SMS alert regarding package delivery leads victim to mobile P2P authorization prompt with disguised recipient payload.",
        payment_channels=["P2P", "INSTANT_PAYMENT"],
        attack_surface="Mobile SMS to P2P App Linkage",
        severity="HIGH",
        novelty_score=0.86,
        difficulty=0.79,
        observable_signals=["Unusual payment channel transition", "Amount deviation", "Elevated behavioural deviation"],
        simulation_parameters={"amount_multiplier": 2.5, "velocity_factor": 3.0, "device_anomaly": 0.3, "behavioural_dev_base": 76.0},
        detection_features=["behavioural_deviation", "amount_deviation", "payment_channel"],
        blindspot_profile="Action executed natively inside consumer's official banking application."
    ),
    AttackScenario(
        id="CC-002",
        name="Voice Call Prompting Unrecognized Web Gateway Charge",
        category="Cross-Channel",
        description="Attacker impersonates utility company on landline while instructing victim to pay through spoofed web checkout.",
        payment_channels=["WEB_GATEWAY", "CARD_NOT_PRESENT"],
        attack_surface="Telephony + Web Merchant Channel",
        severity="HIGH",
        novelty_score=0.88,
        difficulty=0.81,
        observable_signals=["Device change", "Elevated merchant risk score", "Significant amount deviation"],
        simulation_parameters={"amount_multiplier": 3.2, "velocity_factor": 2.4, "device_anomaly": 0.8, "behavioural_dev_base": 78.0},
        detection_features=["device_change", "merchant_risk_score", "amount_deviation"],
        blindspot_profile="Separation between attack origin (voice call) and transaction telemetry (web portal)."
    ),
    AttackScenario(
        id="CC-003",
        name="Social Media Direct Message to Wire Escrow Scam",
        category="Cross-Channel",
        description="Hacked friend account on Instagram requests wire transfer assistance for overseas medical emergency.",
        payment_channels=["WIRE", "INSTANT_PAYMENT"],
        attack_surface="Social Messaging to Wire Settlement",
        severity="HIGH",
        novelty_score=0.85,
        difficulty=0.78,
        observable_signals=["Large amount deviation", "New international beneficiary", "High behavioural deviation"],
        simulation_parameters={"amount_multiplier": 4.2, "velocity_factor": 1.9, "device_anomaly": 0.2, "behavioural_dev_base": 81.0},
        detection_features=["amount_deviation", "behavioural_deviation", "merchant_risk_score"],
        blindspot_profile="Transaction appears as normal customer-initiated wire transfer with valid credentials."
    ),
    AttackScenario(
        id="CC-004",
        name="Compromised Email Authorization Triggering POS Terminal Withdrawal",
        category="Cross-Channel",
        description="Business email compromise (BEC) instructs corporate branch to release funds via authorized corporate debit card POS terminal.",
        payment_channels=["POS", "CARD_NOT_PRESENT"],
        attack_surface="Corporate Email to Retail Terminal Channel",
        severity="CRITICAL",
        novelty_score=0.91,
        difficulty=0.86,
        observable_signals=["Location change jump", "Large amount deviation", "Velocity burst"],
        simulation_parameters={"amount_multiplier": 3.9, "velocity_factor": 3.3, "device_anomaly": 0.85, "behavioural_dev_base": 84.0},
        detection_features=["location_change", "amount_deviation", "transaction_velocity"],
        blindspot_profile="Internal branch staff enter card transaction manually under perceived executive email order."
    )
]

def build_attack_catalog() -> Dict[str, AttackScenario]:
    catalog: Dict[str, AttackScenario] = {}
    for sc in EXPLICIT_SCENARIOS:
        catalog[sc.id] = sc
    return catalog

FULL_ATTACK_TAXONOMY = build_attack_catalog()
