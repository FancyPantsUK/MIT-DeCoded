import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import ScenarioSelector from './components/ScenarioSelector';
import FactorStrip from './components/FactorStrip';
import CompressView from './components/CompressView';
import DataGridView from './components/DataGridView';
import YourView from './components/YourView';
import DivergenceView from './components/DivergenceView';
import HeatmapView from './components/HeatmapView';
import SeasonsView from './components/SeasonsView';
import LockedView from './components/LockedView';
import { SCENARIOS, TABS } from './data/scenarios';
import { canAccess, USER_TIER } from './utils/access';
import './styles.css';

function TabContent({ activeTab, scenario, activeScenario, draftUserFactors, appliedUserFactors, onDraftChange, onApply, onReset }) {
  const tab = TABS.find((t) => t.id === activeTab);
  if (tab && !canAccess(USER_TIER, tab.requiredTier)) {
    return <LockedView tab={tab} />;
  }

  switch (activeTab) {
    case 'compress':
      return <CompressView activeScenario={activeScenario} appliedUserFactors={appliedUserFactors} />;
    case 'your-view':
      return (
        <YourView
          scenario={scenario}
          draftUserFactors={draftUserFactors}
          appliedUserFactors={appliedUserFactors}
          onDraftChange={onDraftChange}
          onApply={onApply}
          onReset={onReset}
        />
      );
    case 'divergence':
      return <DivergenceView scenario={scenario} appliedUserFactors={appliedUserFactors} />;
    case 'heatmap':
      return <HeatmapView />;
    case 'seasons':
      return <SeasonsView />;
    case 'rankings':
    case 'performance':
    default:
      return <DataGridView activeTab={activeTab} scenario={scenario} appliedUserFactors={appliedUserFactors} />;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('compress');
  const [activeScenario, setActiveScenario] = useState('spring');
  const [draftUserFactors, setDraftUserFactors] = useState(null);
  const [appliedUserFactors, setAppliedUserFactors] = useState(null);

  const scenario = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];

  // Reset user factors when scenario changes
  useEffect(() => {
    setDraftUserFactors({ ...scenario.factors });
    setAppliedUserFactors({ ...scenario.factors });
  }, [activeScenario]);

  // Initialize on first render
  useEffect(() => {
    if (!draftUserFactors) {
      setDraftUserFactors({ ...scenario.factors });
      setAppliedUserFactors({ ...scenario.factors });
    }
  }, []);

  const handleDraftChange = useCallback((factorId, value) => {
    setDraftUserFactors((prev) => ({ ...prev, [factorId]: value }));
  }, []);

  const handleApply = useCallback(() => {
    setAppliedUserFactors({ ...draftUserFactors });
  }, [draftUserFactors]);

  const handleReset = useCallback(() => {
    setDraftUserFactors({ ...scenario.factors });
  }, [scenario.factors]);

  return (
    <div className="app">
      <Header userTier={USER_TIER} />

      <nav className="nav-tabs">
        {TABS.map((tab) => {
          const locked = !canAccess(USER_TIER, tab.requiredTier);
          return (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''} ${locked ? 'locked' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.requiredTier === 'pro' && <span className="pro-dot" />}
            </button>
          );
        })}
      </nav>

      <ScenarioSelector
        activeScenario={activeScenario}
        onSelect={setActiveScenario}
      />

      <FactorStrip scenarioFactors={scenario.factors} />

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TabContent
              activeTab={activeTab}
              scenario={scenario}
              activeScenario={activeScenario}
              draftUserFactors={draftUserFactors || scenario.factors}
              appliedUserFactors={appliedUserFactors || scenario.factors}
              onDraftChange={handleDraftChange}
              onApply={handleApply}
              onReset={handleReset}
            />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
