import { useEffect, useRef, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useLocalAiStore } from '../../store/useLocalAiStore';
import { hasApiKey } from '../../lib/gemini';

export function LocalAiStatusToast() {
  const { status, progress } = useLocalAiStore();
  const [showReady, setShowReady] = useState(false);
  const prevStatusRef = useRef(status);

  useEffect(() => {
    if (prevStatusRef.current === 'loading' && status === 'ready') {
      setShowReady(true);
      const t = setTimeout(() => setShowReady(false), 4000);
      prevStatusRef.current = status;
      return () => clearTimeout(t);
    }
    prevStatusRef.current = status;
  }, [status]);

  if (hasApiKey() || (status !== 'loading' && !showReady)) return null;

  return (
    <div className="no-print fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/95 px-4 py-2.5 text-xs text-ink-200 shadow-2xl backdrop-blur">
      {status === 'loading' ? (
        <>
          <Loader2 size={14} className="animate-spin text-violet-400" />
          Downloading built-in AI model… {progress}%
        </>
      ) : (
        <>
          <CheckCircle2 size={14} className="text-emerald-400" />
          AI ready — cached on this device for next time
        </>
      )}
    </div>
  );
}
