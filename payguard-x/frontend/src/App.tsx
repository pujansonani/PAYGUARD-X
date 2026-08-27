import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ThreatTicker } from './components/ThreatTicker';
import { CommandPalette } from './components/CommandPalette';
import { JudgeModeModal } from './components/JudgeModeModal';
import { TransactionDrawer } from './components/TransactionDrawer';
import { CyberLoadingScreen } from './components/CyberLoadingScreen';

// Pages
import { Dashboard } from './pages/Dashboard';
import { AttackIntelligence } from './pages/AttackIntelligence';
import { AttackGenerator } from './pages/AttackGenerator';
import { SimulationLab } from './pages/SimulationLab';
import { DefenseCenter } from './pages/DefenseCenter';
import { RedBlueArena } from './pages/RedBlueArena';
import { FeedbackLoop } from './pages/FeedbackLoop';
import { ModelPerformance } from './pages/ModelPerformance';
import { Transactions } from './pages/Transactions';
import { Experiments } from './pages/Experiments';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

import { api } from './services/api';
import { SyntheticTransaction } from './types';
import { playCyberSound } from './utils/audio';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SyntheticTransaction | null>(null);
  const [datasetSize, setDatasetSize] = useState<number>(3000);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial health fetch
    api.getHealth()
      .then((h) => {
        if (h.dataset_size) setDatasetSize(h.dataset_size);
      })
      .catch((err) => console.log('API health initial sync:', err))
      .finally(() => {
        setTimeout(() => setIsInitialLoading(false), 900);
      });

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsJudgeModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (view: string) => {
    playCyberSound('click');
    setCurrentView(view);
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={handleNavigate}
            onOpenJudgeMode={() => setIsJudgeModalOpen(true)}
            onSelectTransaction={(tx) => setSelectedTransaction(tx)}
          />
        );
      case 'attack-intelligence':
        return <AttackIntelligence />;
      case 'attack-generator':
        return <AttackGenerator onNavigate={handleNavigate} />;
      case 'simulation-lab':
        return <SimulationLab />;
      case 'defense-center':
        return <DefenseCenter />;
      case 'red-blue-arena':
        return <RedBlueArena />;
      case 'feedback-loop':
        return <FeedbackLoop />;
      case 'model-performance':
        return <ModelPerformance />;
      case 'transactions':
        return <Transactions onSelectTransaction={(tx) => setSelectedTransaction(tx)} />;
      case 'experiments':
        return <Experiments />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <Dashboard
            onNavigate={handleNavigate}
            onOpenJudgeMode={() => setIsJudgeModalOpen(true)}
            onSelectTransaction={(tx) => setSelectedTransaction(tx)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Initial Startup Cyber Holographic Loader */}
      <CyberLoadingScreen isLoading={isInitialLoading} message="INITIALIZING SOC AI DEFENSE LAB" />

      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/[0.035] rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-red-500/[0.035] rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Top Navbar */}
      <Navbar
        onOpenJudgeMode={() => setIsJudgeModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        datasetSize={datasetSize}
        activeView={currentView}
      />

      {/* Real-time Threat Intelligence Marquee */}
      <ThreatTicker />

      {/* Main Body */}
      <div className="flex flex-1 w-full max-w-[1680px] mx-auto">
        <Sidebar
          currentView={currentView}
          onSelectView={handleNavigate}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full min-w-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals & Slide-out Drawers */}
      <JudgeModeModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        onOpenJudgeMode={() => setIsJudgeModalOpen(true)}
      />

      <TransactionDrawer
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
