import { useMemo, useState } from 'react';
import { Target, KeyRound, CheckCircle2, XCircle, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { useCvStore } from '../../store/useCvStore';
import { scoreAgainstJob } from '../../lib/ats';
import { getStoredApiKey, setStoredApiKey, testApiKey, hasApiKey, suggestKeywordBullet } from '../../lib/gemini';
import { SectionCard } from '../ui/Card';
import { TextArea, Input } from '../ui/Field';
import { Button } from '../ui/Button';

function ScoreRing({ score }: { score: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 70 ? '#4ade80' : score >= 40 ? '#fbbf24' : '#f87171';

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#2a2542" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-ink-50">{score}</span>
        <span className="text-[10px] uppercase tracking-wide text-ink-400">match</span>
      </div>
    </div>
  );
}

function KeywordSuggestButton({ keyword }: { keyword: string }) {
  const { cv, addSkillGroup, updateSkillGroup } = useCvStore();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  function quickAddToSkills() {
    const misc = cv.skills.find((g) => g.category.toLowerCase() === 'additional skills');
    if (misc) {
      if (!misc.items.includes(keyword)) updateSkillGroup(misc.id, { items: [...misc.items, keyword] });
    } else {
      addSkillGroup();
      // addSkillGroup appends synchronously to state; grab the new one on next tick via store
      setTimeout(() => {
        const latest = useCvStore.getState().cv.skills.at(-1);
        if (latest) useCvStore.getState().updateSkillGroup(latest.id, { category: 'Additional skills', items: [keyword] });
      }, 0);
    }
  }

  async function onSuggestBullet() {
    setLoading(true);
    try {
      const text = await suggestKeywordBullet(keyword, cv.personal.title);
      setSuggestion(text);
    } catch {
      setSuggestion('Could not reach AI — check your API key in the settings above.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-amber-400/10 px-2 py-1 text-xs text-amber-300">{keyword}</span>
        <button type="button" onClick={quickAddToSkills} className="text-[11px] text-ink-400 underline decoration-dotted hover:text-ink-100">
          add to skills
        </button>
        {hasApiKey() && (
          <button
            type="button"
            onClick={onSuggestBullet}
            disabled={loading}
            className="text-[11px] text-ink-400 underline decoration-dotted hover:text-violet-400 disabled:opacity-50"
          >
            {loading ? 'thinking…' : 'suggest bullet'}
          </button>
        )}
      </div>
      {suggestion && <p className="ml-1 rounded-md bg-ink-800/60 p-2 text-xs text-ink-200">{suggestion}</p>}
    </div>
  );
}

function ApiKeySettings() {
  const [key, setKey] = useState(getStoredApiKey());
  const [status, setStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');

  async function onSave() {
    setStoredApiKey(key.trim());
    if (!key.trim()) {
      setStatus('idle');
      return;
    }
    setStatus('testing');
    const ok = await testApiKey(key.trim());
    setStatus(ok ? 'ok' : 'fail');
  }

  return (
    <div className="rounded-xl border border-ink-800 bg-ink-950/40 p-4">
      <div className="mb-2 flex items-center gap-2">
        <KeyRound size={15} className="text-violet-400" />
        <p className="text-sm font-medium text-ink-100">Optional: connect live AI writing</p>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-ink-400">
        The keyword matcher above works fully offline, for free, forever. For AI-written summaries and bullet
        rewrites, paste a free Google Gemini API key — it's stored only in your browser (localStorage) and sent
        directly to Google, never through any server of ours.
      </p>
      <div className="flex gap-2">
        <Input
          type="password"
          placeholder="AIza…"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          wrapperClassName="flex-1"
        />
        <Button type="button" onClick={onSave} disabled={status === 'testing'}>
          {status === 'testing' ? <Loader2 size={14} className="animate-spin" /> : 'Save & test'}
        </Button>
      </div>
      <div className="mt-2 flex items-center justify-between">
        {status === 'ok' && (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <CheckCircle2 size={13} /> Connected
          </span>
        )}
        {status === 'fail' && (
          <span className="flex items-center gap-1 text-xs text-red-400">
            <XCircle size={13} /> Couldn't verify that key
          </span>
        )}
        {status === 'idle' && <span />}
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs text-ink-400 hover:text-violet-400"
        >
          Get a free key <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

export function AIPanel() {
  const { cv } = useCvStore();
  const [jobDescription, setJobDescription] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  const result = useMemo(() => (analyzed ? scoreAgainstJob(cv, jobDescription) : null), [analyzed, cv, jobDescription]);

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="AI keyword match" icon={<Target size={16} />}>
        <p className="mb-3 text-xs text-ink-400">
          Paste a job description. ForgeCV scans it offline in your browser, extracts the skills and keywords that
          matter, and checks which ones already appear in your resume — the same signal applicant-tracking systems
          look for.
        </p>
        <TextArea
          rows={6}
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);
            setAnalyzed(false);
          }}
          placeholder="Paste the full job description here…"
        />
        <Button type="button" variant="primary" className="mt-3" onClick={() => setAnalyzed(true)} disabled={!jobDescription.trim()}>
          <Sparkles size={14} /> Analyze match
        </Button>

        {result && (
          <div className="mt-5 flex flex-col gap-4 border-t border-ink-800 pt-4">
            <div className="flex items-center gap-4">
              <ScoreRing score={result.score} />
              <div className="text-sm text-ink-300">
                <p className="text-ink-100">
                  {result.matched.length} of {result.totalExtracted} key terms found in your resume.
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  {result.score >= 70
                    ? 'Strong match — this resume is well-tailored for this role.'
                    : result.score >= 40
                      ? 'Decent overlap. Weave a few missing terms into your bullets or skills.'
                      : 'Low overlap. Consider tailoring your summary and skills to this role.'}
                </p>
              </div>
            </div>

            {result.missing.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">Missing keywords</p>
                <div className="flex flex-col gap-2">
                  {result.missing.map((k) => (
                    <KeywordSuggestButton key={k} keyword={k} />
                  ))}
                </div>
              </div>
            )}

            {result.matched.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">Already covered</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.matched.map((k) => (
                    <span key={k} className="rounded-md bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      <ApiKeySettings />
    </div>
  );
}
