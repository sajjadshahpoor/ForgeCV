import { ArrowRight, Sparkles, ShieldCheck, LayoutTemplate, Zap, Lock, Download } from 'lucide-react';
import { Logo } from '../components/layout/Logo';
import { GithubIcon } from '../components/ui/BrandIcons';
import { Button } from '../components/ui/Button';

const FEATURES = [
  {
    icon: <Sparkles size={18} />,
    title: 'AI keyword matching, built in',
    body: 'Paste a job description and instantly see your ATS match score, missing keywords, and suggested bullets — computed offline in your browser, free forever.',
  },
  {
    icon: <Zap size={18} />,
    title: 'Optional live AI writing',
    body: 'Connect a free Google Gemini key to get AI-drafted summaries and one-click bullet rewrites. Your key never leaves your browser.',
  },
  {
    icon: <LayoutTemplate size={18} />,
    title: '4 crafted templates',
    body: 'Modern, Classic, Minimal, and Bold — each tuned for readability and ATS parsing, with custom accent colors and fonts.',
  },
  {
    icon: <Lock size={18} />,
    title: 'Private by design',
    body: 'No account, no server, no tracking. Your resume lives in your browser and exports straight to PDF or JSON.',
  },
  {
    icon: <ShieldCheck size={18} />,
    title: 'ATS-safe output',
    body: 'Clean semantic structure and standard fonts so your resume parses correctly in applicant tracking systems.',
  },
  {
    icon: <GithubIcon size={18} />,
    title: '100% open source',
    body: 'Hosted on GitHub Pages, MIT licensed. Fork it, self-host it, or contribute a template.',
  },
];

export function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative overflow-hidden bg-ink-950">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] animate-float rounded-full bg-violet-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-40 h-[500px] w-[500px] rounded-full bg-amber-500/15 blur-[120px]" style={{ animationDelay: '1s' }} />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <a
          href="https://github.com/sajjadshahpoor/ForgeCV"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm text-ink-300 hover:text-white"
        >
          <GithubIcon size={16} /> Star on GitHub
        </a>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-900/60 px-3 py-1 text-xs text-ink-300">
          <Sparkles size={12} className="text-amber-400" /> Free · Open source · No sign-up
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight text-ink-50 sm:text-6xl">
          Build a resume that gets you <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">hired</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-300">
          ForgeCV pairs a beautiful builder with an AI that actually helps — matching your resume against real job
          descriptions and sharpening every bullet point. Runs entirely in your browser.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" size="md" onClick={onStart} className="px-6 py-3 text-base">
            Start building free <ArrowRight size={16} />
          </Button>
          <a href="#features">
            <Button variant="secondary" size="md" className="px-6 py-3 text-base">
              See what's inside
            </Button>
          </a>
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-ink-800 bg-ink-900/50 p-2 shadow-2xl shadow-violet-500/10 backdrop-blur">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <div className="grid grid-cols-5 gap-3 rounded-xl bg-white p-4 text-left">
            <div className="col-span-2 rounded-lg bg-ink-100 p-3">
              <div className="h-3 w-2/3 rounded bg-ink-700/60" />
              <div className="mt-2 h-2 w-1/2 rounded bg-violet-500/60" />
              <div className="mt-4 space-y-1.5">
                <div className="h-1.5 w-full rounded bg-ink-300" />
                <div className="h-1.5 w-5/6 rounded bg-ink-300" />
                <div className="h-1.5 w-full rounded bg-ink-300" />
              </div>
            </div>
            <div className="col-span-3 rounded-lg border border-ink-200 p-3">
              <div className="h-3 w-1/2 rounded bg-ink-800" />
              <div className="mt-3 flex items-center gap-2 rounded-md bg-emerald-50 px-2 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="h-1.5 w-2/3 rounded bg-emerald-300" />
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-md bg-amber-50 px-2 py-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="h-1.5 w-1/2 rounded bg-amber-300" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-ink-800 bg-ink-900/40 p-5 text-left backdrop-blur transition hover:border-violet-500/40">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">{f.icon}</div>
              <h3 className="mb-1.5 font-semibold text-ink-50">{f.title}</h3>
              <p className="text-sm leading-relaxed text-ink-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 text-center">
        <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-amber-500/10 p-10">
          <h2 className="text-2xl font-bold text-ink-50">Ready to forge yours?</h2>
          <p className="mx-auto mt-2 max-w-md text-ink-300">No account. No paywall. Your data never leaves your browser.</p>
          <Button variant="primary" size="md" onClick={onStart} className="mx-auto mt-6 px-6 py-3 text-base">
            <Download size={16} /> Open the builder
          </Button>
        </div>
      </section>

      <footer className="relative z-10 border-t border-ink-800 py-8 text-center text-sm text-ink-500">
        Built by{' '}
        <a href="https://github.com/sajjadshahpoor" target="_blank" rel="noreferrer" className="text-ink-300 hover:text-violet-400">
          Sajjad Shahpoor
        </a>
        . MIT licensed —{' '}
        <a href="https://github.com/sajjadshahpoor/ForgeCV" target="_blank" rel="noreferrer" className="text-ink-300 hover:text-violet-400">
          view source
        </a>
        .
      </footer>
    </div>
  );
}
