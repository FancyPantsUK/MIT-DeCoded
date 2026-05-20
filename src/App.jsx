import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ScenarioSelector from './components/ScenarioSelector';
import FactorStrip from './components/FactorStrip';
import CompressView from './components/CompressView';
import DataGridView from './components/DataGridView';
import { SCENARIOS, TABS } from './data/scenarios';
import { canAccess, USER_TIER } from './utils/access';
import './styles.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('compress');
  const [activeScenario, setActiveScenario] = useState('spring');

  const scenario = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];
  const accessibleTabs = TABS.filter((t) => canAccess(USER_TIER, t.requiredTier));

  return (
    <div className="app">
      <Header userTier={USER_TIER} />

      <nav className="nav-tabs">
        {accessibleTabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.requiredTier === 'pro' && <span className="pro-dot" />}
          </button>
        ))}
      </nav>

      <ScenarioSelector
        activeScenario={activeScenario}
        onSelect={setActiveScenario}
      />

      <FactorStrip scenarioFactors={scenario.factors} />

      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'compress' ? (
            <CompressView
              key="compress"
              activeScenario={activeScenario}
            />
          ) : (
            <DataGridView key={activeTab} activeTab={activeTab} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
