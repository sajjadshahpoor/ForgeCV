import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { BuilderPage } from './pages/BuilderPage';

type View = 'landing' | 'builder';

function App() {
  const [view, setView] = useState<View>('landing');

  if (view === 'builder') return <BuilderPage onBack={() => setView('landing')} />;
  return <LandingPage onStart={() => setView('builder')} />;
}

export default App;
