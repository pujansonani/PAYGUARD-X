import React, { useState } from 'react';
import { ShieldCheck, Play, RotateCcw, RotateCw, AlertTriangle, Shield, CheckCircle, Zap, Layers, Activity, Sparkles, Send } from 'lucide-react';
import { RiskGauge } from '../components/RiskGauge';
import { ShapWaterfall } from '../components/ShapWaterfall';
import { CyberLoadingScreen } from '../components/CyberLoadingScreen';
import { api } from '../services/api';
import { TransactionPrediction, PaymentChannel, MerchantCategory } from '../types';
import { playCyberSound } from '../utils/audio';

export const DefenseCenter: React.FC = () => {
  const [formData, setFormData] = useState<{
    amount: number;
    currency: string;
    payment_channel: PaymentChannel;
    merchant_category: MerchantCategory;
    account_age_days: number;
    device_age_days: number;
    device_change: number;
    location_change: number;
    transaction_velocity: number;
    average_transaction_amount: number;
    behavioural_deviation: number;
    hour_of_day: number;
    previous_transaction_gap: number;
    customer_risk_score: number;
    merchant_risk_score: number;
  }>({
    amount: 1250.0,
    currency: 'USD',
    payment_channel: 'CARD_NOT_PRESENT',
    merchant_category: 'RETAIL',
    account_age_days: 180.0,
    device_age_days: 120.0,
    device_change: 0,
    location_change: 0,
    transaction_velocity: 2,
    average_transaction_amount: 150.0,
    behavioural_deviation: 25.0,
    hour_of_day: 14,
    previous_transaction_gap: 320.0,
    customer_risk_score: 20.0,
    merchant_risk_score: 25.0
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<TransactionPrediction | null>(null);

  const presets = [
    {
      name: 'Benign E-Commerce Purchase',
      category: 'LEGIT',
      data: {
        amount: 85.5,
        currency: 'USD',
        payment_channel: 'CARD_NOT_PRESENT' as PaymentChannel,
        merchant_category: 'GROCERY' as MerchantCategory,
        account_age_days: 340.0,
        device_age_days: 280.0,
        device_change: 0,
        location_change: 0,
        transaction_velocity: 1,
        average_transaction_amount: 90.0,
        behavioural_deviation: 12.0,
        hour_of_day: 15,
        previous_transaction_gap: 720.0,
        customer_risk_score: 15.0,
        merchant_risk_score: 18.0
      }
    },
    {
      name: 'ATO Session Hijack & Drain',
      category: 'ATTACK',
      data: {
        amount: 3200.0,
        currency: 'USD',
        payment_channel: 'INSTANT_PAYMENT' as PaymentChannel,
        merchant_category: 'CRYPTO' as MerchantCategory,
        account_age_days: 90.0,
        device_age_days: 1.0,
        device_change: 1,
        location_change: 1,
        transaction_velocity: 8,
        average_transaction_amount: 120.0,
        behavioural_deviation: 88.0,
        hour_of_day: 3,
        previous_transaction_gap: 2.0,
        customer_risk_score: 75.0,
        merchant_risk_score: 85.0
      }
    },
    {
      name: 'Executive Deepfake Wire Authorize',
      category: 'ATTACK',
      data: {
        amount: 9500.0,
        currency: 'USD',
        payment_channel: 'WIRE' as PaymentChannel,
        merchant_category: 'FINANCIAL_SERVICES' as MerchantCategory,
        account_age_days: 450.0,
        device_age_days: 300.0,
        device_change: 0,
        location_change: 1,
        transaction_velocity: 3,
        average_transaction_amount: 500.0,
        behavioural_deviation: 79.0,
        hour_of_day: 22,
        previous_transaction_gap: 45.0,
        customer_risk_score: 68.0,
        merchant_risk_score: 92.0
      }
    },
    {
      name: 'Synthetic Identity Mule Ring P2P',
      category: 'ATTACK',
      data: {
        amount: 880.0,
        currency: 'USD',
        payment_channel: 'P2P' as PaymentChannel,
        merchant_category: 'RETAIL' as MerchantCategory,
        account_age_days: 12.0,
        device_age_days: 8.0,
        device_change: 0,
        location_change: 0,
        transaction_velocity: 6,
        average_transaction_amount: 50.0,
        behavioural_deviation: 65.0,
        hour_of_day: 18,
        previous_transaction_gap: 12.0,
        customer_risk_score: 82.0,
        merchant_risk_score: 40.0
      }
    }
  ];

  const handleAnalyze = async () => {
    setLoading(true);
    playCyberSound('scan');
    try {
      const res = await api.detectTransaction(formData);
      setPrediction(res);
      if (res.recommended_action === 'BLOCK') {
        playCyberSound('alert');
      } else {
        playCyberSound('success');
      }
    } catch (err) {
      console.error('Detection error:', err);
      playCyberSound('alert');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetData: any) => {
    playCyberSound('click');
    setFormData(presetData);
    setPrediction(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Holographic Loader during multi-model evaluation */}
      <CyberLoadingScreen
        isLoading={loading}
        message="MULTI-MODEL STACKING ENSEMBLE SCORING"
        subMessage="Extracting SHAP tree feature attribution weights..."
      />

      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-cyan-950/40 via-[#070c18] to-emerald-950/40 border border-cyan-500/30 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 rounded-full shadow-neon-cyan">
              STAGE 03 — DEFEND
            </span>
            <span className="text-xs text-slate-400 font-mono">STACKING META-CLASSIFIER ARBITER</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-white">
            AI Multi-Model Real-Time Defense Center
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            Evaluates transactions across XGBoost, Random Forest, and Isolation Forest models with dynamic threshold policy calibrated for institutional payment rails.
          </p>
        </div>
      </div>

      {/* Preset Injection Chips */}
      <div className="p-4 bg-[#070c18]/90 border border-white/10 rounded-2xl flex flex-wrap items-center gap-2.5 shadow-glass-card">
        <span className="text-xs font-mono font-bold text-slate-400 mr-1 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>INJECT TEST INCIDENTS:</span>
        </span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(p.data)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all duration-200 flex items-center gap-1.5 hover:scale-105 active:scale-95 ${
              p.category === 'LEGIT'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80'
                : 'bg-red-950/60 border-red-500/40 text-red-300 hover:bg-red-900/80'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${p.category === 'LEGIT' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout: Parameters Inputs & Decision Readout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form */}
        <div className="lg:col-span-7 p-6 bg-[#070c18]/90 border border-white/10 rounded-3xl space-y-6 shadow-glass-card backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Transaction Telemetry Signals</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-500">15 Real-Time Features</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400">TRANSACTION AMOUNT ($):</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full bg-[#030712] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Baseline Average */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400">30-DAY AVERAGE AMOUNT ($):</label>
              <input
                type="number"
                value={formData.average_transaction_amount}
                onChange={(e) => setFormData({ ...formData, average_transaction_amount: Number(e.target.value) })}
                className="w-full bg-[#030712] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Payment Channel */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400">PAYMENT RAIL / CHANNEL:</label>
              <select
                value={formData.payment_channel}
                onChange={(e) => setFormData({ ...formData, payment_channel: e.target.value as PaymentChannel })}
                className="w-full bg-[#030712] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="CARD_NOT_PRESENT">CARD_NOT_PRESENT</option>
                <option value="INSTANT_PAYMENT">INSTANT_PAYMENT (RTP / FedNow)</option>
                <option value="WIRE">WIRE TRANSFER</option>
                <option value="P2P">P2P TRANSFER</option>
                <option value="QR_PAYMENT">QR_PAYMENT</option>
                <option value="POS">POS TERMINAL</option>
                <option value="WEB_GATEWAY">WEB_GATEWAY</option>
              </select>
            </div>

            {/* Merchant Category */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400">MERCHANT CATEGORY:</label>
              <select
                value={formData.merchant_category}
                onChange={(e) => setFormData({ ...formData, merchant_category: e.target.value as MerchantCategory })}
                className="w-full bg-[#030712] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="CRYPTO">CRYPTO</option>
                <option value="LUXURY">LUXURY</option>
                <option value="GAMING">GAMING</option>
                <option value="TRAVEL">TRAVEL</option>
                <option value="RETAIL">RETAIL</option>
                <option value="GROCERY">GROCERY</option>
                <option value="FINANCIAL_SERVICES">FINANCIAL_SERVICES</option>
              </select>
            </div>

            {/* Behavioural Deviation Slider */}
            <div className="space-y-1.5 sm:col-span-2 p-3.5 bg-[#030712] rounded-2xl border border-white/5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 font-bold">BEHAVIOURAL BIOMETRIC DEVIATION:</span>
                <span className="text-amber-400 font-black">{formData.behavioural_deviation.toFixed(1)} / 100</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={formData.behavioural_deviation}
                onChange={(e) => setFormData({ ...formData, behavioural_deviation: Number(e.target.value) })}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Velocity & Gap */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400">BURST VELOCITY (TX/HR):</label>
              <input
                type="number"
                min={1}
                max={30}
                value={formData.transaction_velocity}
                onChange={(e) => setFormData({ ...formData, transaction_velocity: Number(e.target.value) })}
                className="w-full bg-[#030712] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-slate-400">GAP FROM LAST TX (MIN):</label>
              <input
                type="number"
                min={0.1}
                value={formData.previous_transaction_gap}
                onChange={(e) => setFormData({ ...formData, previous_transaction_gap: Number(e.target.value) })}
                className="w-full bg-[#030712] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Boolean Anomaly Flags */}
            <div className="space-y-1.5 flex items-center gap-3 pt-3">
              <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.device_change === 1}
                  onChange={(e) => setFormData({ ...formData, device_change: e.target.checked ? 1 : 0 })}
                  className="rounded bg-slate-950 border-white/20 text-cyan-400 focus:ring-0"
                />
                <span>Device Change</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.location_change === 1}
                  onChange={(e) => setFormData({ ...formData, location_change: e.target.checked ? 1 : 0 })}
                  className="rounded bg-slate-950 border-white/20 text-cyan-400 focus:ring-0"
                />
                <span>Location Change</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-purple-600 to-red-500 hover:from-cyan-400 hover:to-red-400 text-slate-950 font-cyber font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-cyan flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin text-slate-950" />
                <span>EVALUATING STACKING ENSEMBLE...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 text-slate-950" />
                <span>EXECUTE MULTI-MODEL INFERENCE</span>
              </>
            )}
          </button>
        </div>

        {/* Inference Decision & SHAP Attribution Output */}
        <div className="lg:col-span-5 space-y-4">
          {prediction ? (
            <div className="space-y-4">
              <RiskGauge
                score={prediction.risk_score}
                level={prediction.risk_level}
                action={prediction.recommended_action}
              />

              <ShapWaterfall
                contributions={prediction.top_contributing_features}
                title="Telemetry Risk Attribution Breakdown"
              />
            </div>
          ) : (
            <div className="p-8 bg-[#070c18]/90 border border-white/10 rounded-3xl text-center space-y-3 backdrop-blur-xl shadow-glass-card">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-neon-cyan">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-display font-black text-white">Awaiting Incident Submission</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Adjust parameters on the left or select a preset incident above to trigger real-time AI scoring.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
