import { Palette, Check } from 'lucide-react';
import { useCvStore } from '../../store/useCvStore';
import type { TemplateId } from '../../types';
import { SectionCard } from '../ui/Card';

const TEMPLATES: { id: TemplateId; label: string; blurb: string }[] = [
  { id: 'modern', label: 'Modern', blurb: 'Bold header, clean two-tone layout' },
  { id: 'classic', label: 'Classic', blurb: 'Traditional, serif, ATS-safe' },
  { id: 'minimal', label: 'Minimal', blurb: 'Lots of whitespace, understated' },
  { id: 'bold', label: 'Bold', blurb: 'Dark sidebar, strong hierarchy' },
];

const ACCENTS = ['#6d28d9', '#0f766e', '#b91c1c', '#1d4ed8', '#c2410c', '#4d7c0f', '#0891b2', '#57534e'];

export function DesignPanel() {
  const { cv, setTemplate, setAccentColor, setFontFamily, setFontScale } = useCvStore();

  return (
    <SectionCard title="Design" icon={<Palette size={16} />}>
      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-2 text-sm font-medium text-ink-200">Template</p>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  cv.template === t.id ? 'border-violet-500 bg-violet-500/10' : 'border-ink-700 bg-ink-950/40 hover:border-ink-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink-50">{t.label}</span>
                  {cv.template === t.id && <Check size={14} className="text-violet-400" />}
                </div>
                <p className="mt-0.5 text-xs text-ink-400">{t.blurb}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink-200">Accent color</p>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setAccentColor(c)}
                className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-ink-900 transition ${cv.accentColor === c ? 'ring-2 ring-white' : ''}`}
                style={{ backgroundColor: c }}
                aria-label={c}
              />
            ))}
            <label className="relative h-7 w-7 overflow-hidden rounded-full border border-dashed border-ink-600">
              <input
                type="color"
                value={cv.accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="absolute -left-1 -top-1 h-9 w-9 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink-200">Font</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFontFamily('sans')}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm ${cv.fontFamily === 'sans' ? 'border-violet-500 bg-violet-500/10 text-ink-50' : 'border-ink-700 text-ink-300'}`}
            >
              Sans-serif
            </button>
            <button
              type="button"
              onClick={() => setFontFamily('serif')}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-serif ${cv.fontFamily === 'serif' ? 'border-violet-500 bg-violet-500/10 text-ink-50' : 'border-ink-700 text-ink-300'}`}
            >
              Serif
            </button>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-ink-200">Text size</p>
            <span className="text-xs text-ink-400">{Math.round(cv.fontScale * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.85}
            max={1.15}
            step={0.05}
            value={cv.fontScale}
            onChange={(e) => setFontScale(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
        </div>
      </div>
    </SectionCard>
  );
}
