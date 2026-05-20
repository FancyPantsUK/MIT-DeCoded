import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import ScenarioSelector from './components/ScenarioSelector';
import FactorStrip from './components/FactorStrip';
import CompressView from './components/CompressView';
import CompressionHero from './components/CompressionHero';
import DataGridView from './components/DataGridView';
import YourView from './components/YourView';
import DivergenceView from './components/DivergenceView';
import HeatmapView from './components/HeatmapView';
import SeasonsView from './components/SeasonsView';
import LockedView from './components/LockedView';
import SensitivitySandbox from './components/SensitivitySandbox';
import AdminControlPanel from './components/AdminControlPanel';
import DataSourceLayer from './components/DataSourceLayer';
import { SCENARIOS, TABS } from './data/scenarios';
import { canAccess, getInitialTier } from './utils/access';
import './styles.css';

function TabContent({ activeTab, scenario, activeScenario, userTier, draftUserFactors, appliedUserFactors, onDraftChange, onApply, onReset }) {
  const tab = TABS.find((t) => t.id === activeTab);
  if (tab && !canAccess(userTier, tab.requiredTier)) {
    return <LockedView tab={tab} />;
  }

  switch (activeTab) {
    case 'compress':
      return <CompressView activeScenario={activeScenario} appliedUserFactors={appliedUserFactors} userTier={userTier} />;
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
      return <HeatmapView scenario={scenario} appliedUserFactors={appliedUserFactors} userTier={userTier} />;
    case 'seasons':
      return <SeasonsView scenario={scenario} appliedUserFactors={appliedUserFactors} userTier={userTier} />;
    case 'rankings':
    case 'performance':
    default:
      return <DataGridView activeTab={activeTab} scenario={scenario} appliedUserFactors={appliedUserFactors} userTier={userTier} />;
  }
}

export default function App() {
  const [viewMode, setViewMode] = useState('hero'); // 'hero' | 'expert'
  const [activeTab, setActiveTab] = useState('rankings');
  const [activeScenario, setActiveScenario] = useState('spring');
  const [draftUserFactors, setDraftUserFactors] = useState(null);
  const [appliedUserFactors, setAppliedUserFactors] = useState(null);
  const [userTier, setUserTier] = useState(getInitialTier);

  const scenario = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];

  useEffect(() => {
    setDraftUserFactors({ ...scenario.factors });
    setAppliedUserFactors({ ...scenario.factors });
  }, [activeScenario]);

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

  const enterExpert = useCallback(() => {
    setViewMode('expert');
    setActiveTab('rankings');
  }, []);

  const exitExpert = useCallback(() => {
    setViewMode('hero');
  }, []);

  return (
    <div className="app">
      <Header
        userTier={userTier}
        onTierChange={setUserTier}
        viewMode={viewMode}
        onExitExpert={exitExpert}
      />

      <AnimatePresence mode="wait">
        {viewMode === 'hero' ? (
          <motion.div
            key="hero"
            className="hero-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <CompressionHero
              activeScenario={activeScenario}
              onSelectScenario={setActiveScenario}
              appliedUserFactors={appliedUserFactors || scenario.factors}
              userTier={userTier}
              onEnterExpert={enterExpert}
            />
          </motion.div>
        ) : (
          <motion.div
            key="expert"
            className="expert-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav className="nav-tabs">
              {TABS.map((tab) => {
                const locked = !canAccess(userTier, tab.requiredTier);
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
                    userTier={userTier}
                    draftUserFactors={draftUserFactors || scenario.factors}
                    appliedUserFactors={appliedUserFactors || scenario.factors}
                    onDraftChange={handleDraftChange}
                    onApply={handleApply}
                    onReset={handleReset}
                  />

                  {activeTab === 'heatmap' && canAccess(userTier, 'sandbox') && (
                    <div className="vision-panels">
                      <SensitivitySandbox />
                    </div>
                  )}
                  {activeTab === 'compress' && canAccess(userTier, 'pro') && (
                    <div className="vision-panels">
                      <DataSourceLayer />
                    </div>
                  )}
                  {activeTab === 'compress' && canAccess(userTier, 'admin') && (
                    <div className="vision-panels">
                      <AdminControlPanel />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
