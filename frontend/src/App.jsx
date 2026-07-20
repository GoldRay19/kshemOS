import { useState } from 'react';
import Shell from './components/Shell';
import CitizenPortal from './components/CitizenPortal';
import OfficerCommandCenter from './components/OfficerCommandCenter';
import AwarenessPage from './components/AwarenessPage';
import MotivationPage from './components/MotivationPage';
import AboutPage from './components/AboutPage';
import HomePage from './components/HomePage';
import ContactPage from './components/ContactPage';
import HowItWorksPage from './components/HowItWorksPage';
import ScamExamplesPage from './components/ScamExamplesPage';
import SafetyTipsPage from './components/SafetyTipsPage';
import ThreatLibraryPage from './components/ThreatLibraryPage';
import ScamIntelligencePage from './components/ScamIntelligencePage';

export default function App() {
  const [portal, setPortal] = useState('citizen');
  const [activeView, setActiveView] = useState('home');

  function renderContent() {
    if (activeView === 'home') return <HomePage setActiveView={setActiveView} />;
    if (activeView === 'awareness') return <AwarenessPage setActiveView={setActiveView} />;
    if (activeView === 'motivation') return <MotivationPage setActiveView={setActiveView} />;
    if (activeView === 'about') return <AboutPage setActiveView={setActiveView} />;
    if (activeView === 'contact') return <ContactPage setActiveView={setActiveView} />;
    if (activeView === 'how-it-works') return <HowItWorksPage setActiveView={setActiveView} />;
    if (activeView === 'scam-examples') return <ScamExamplesPage setActiveView={setActiveView} />;
    if (activeView === 'rule-library') return <ThreatLibraryPage setActiveView={setActiveView} />;
    if (activeView === 'intelligence') return <ScamIntelligencePage setActiveView={setActiveView} />;
    if (activeView === 'safety-tips') return <SafetyTipsPage setActiveView={setActiveView} />;
    if (activeView === 'officer') return <OfficerCommandCenter />;
    if (activeView === 'portal') {
      return portal === 'citizen' ? <CitizenPortal /> : <OfficerCommandCenter />;
    }
    return <HomePage setActiveView={setActiveView} />;
  }

  return (
    <Shell portal={portal} setPortal={setPortal} activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </Shell>
  );
}
