import { useEffect, useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { BuilderPage } from './pages/BuilderPage';
import { SharedResumePage } from './pages/SharedResumePage';
import { decodeShareHash, isShareHash } from './lib/shareLink';
import { useCvStore } from './store/useCvStore';
import type { CvData } from './types';

type View = 'landing' | 'builder' | 'shared';

function App() {
  const [view, setView] = useState<View>('landing');
  const [sharedCv, setSharedCv] = useState<CvData | null>(null);
  const [shareLinkBroken, setShareLinkBroken] = useState(false);
  const setCv = useCvStore((s) => s.setCv);

  useEffect(() => {
    if (!isShareHash(window.location.hash)) return;
    let cancelled = false;
    decodeShareHash(window.location.hash).then((decoded) => {
      if (cancelled) return;
      if (decoded) {
        setSharedCv(decoded);
        setView('shared');
      } else {
        setShareLinkBroken(true);
        window.history.replaceState(null, '', window.location.pathname);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function backToHome() {
    window.history.replaceState(null, '', window.location.pathname);
    setView('landing');
  }

  if (view === 'shared' && sharedCv) {
    return (
      <SharedResumePage
        cv={sharedCv}
        onLogoClick={backToHome}
        onEditCopy={() => {
          setCv(sharedCv);
          window.history.replaceState(null, '', window.location.pathname);
          setView('builder');
        }}
      />
    );
  }

  if (view === 'builder') return <BuilderPage onBack={() => setView('landing')} />;
  return <LandingPage onStart={() => setView('builder')} shareLinkBroken={shareLinkBroken} />;
}

export default App;
