import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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

function TabContent({ activeTab, scenario, activeScenario }) {
  const tab = TABS.find((t) => t.id === activeTab);
  if (tab && !canAccess(USER_TIER, tab.requiredTier)) {
    return <LockedView tab={tab} />;
  }

  switch (activeTab) {
    case 'compress':
      return <CompressView activeScenario={activeScenario} />;
    case 'your-view':
      return <YourView scenario={scenario} />;
    case 'divergence':
      return <DivergenceView />;
    case 'heatmap':
      return <HeatmapView />;
    case 'seasons':
      return <SeasonsView />;
    case 'rankings':
    case 'performance':
    default:
      return <DataGridView activeTab={activeTab} />;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('compress');
  const [activeScenario, setActiveScenario] = useState('spring');

  const scenario = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];

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
          <TabContent
            key={activeTab}
            activeTab={activeTab}
            scenario={scenario}
            activeScenario={activeScenario}
          />
        </AnimatePresence>
      </main>
    </div>
  );
}
