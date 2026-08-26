import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { JudgeModeModal } from './components/JudgeModeModal';

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

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState<boolean>(false);
  const [datasetSize, setDatasetSize] = useState<number>(3000);

  useEffect(() => {
    api.getHealth()
      .then((h) => {
        if (h.dataset_size) setDatasetSize(h.dataset_size);
      })
      .catch((err) => console.log('API health initial sync:', err));

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsJudgeModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={(view) => setCurrentView(view)}
            onOpenJudgeMode={() => setIsJudgeModalOpen(true)}
          />
        );
      case 'attack-intelligence':
        return <AttackIntelligence />;
      case 'attack-generator':
        return <AttackGenerator onNavigate={(view) => setCurrentView(view)} />;
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
        return <Transactions />;
      case 'experiments':
        return <Experiments />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <Dashboard
            onNavigate={(view) => setCurrentView(view)}
            onOpenJudgeMode={() => setIsJudgeModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-red-500/[0.03] rounded-full blur-3xl pointer-events-none -z-10"></div>

      <Navbar
        onOpenJudgeMode={() => setIsJudgeModalOpen(true)}
        datasetSize={datasetSize}
        activeView={currentView}
      />

      <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
        <Sidebar
          currentView={currentView}
          onSelectView={(view) => setCurrentView(view)}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full min-w-0">
          {renderActiveView()}
        </main>
      </div>

      <JudgeModeModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
      />
    </div>
  );
}
