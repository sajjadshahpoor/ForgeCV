import { useRef, useState } from 'react';
import { User, Sparkles, Upload, X } from 'lucide-react';
import { useCvStore } from '../../store/useCvStore';
import { Input, TextArea } from '../ui/Field';
import { SectionCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { hasApiKey, generateSummary } from '../../lib/gemini';

export function PersonalForm() {
  const { cv, updatePersonal } = useCvStore();
  const p = cv.personal;
  const fileRef = useRef<HTMLInputElement>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  function onPhotoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePersonal({ photo: reader.result as string });
    reader.readAsDataURL(file);
  }

  async function onGenerateSummary() {
    setError('');
    setGenerating(true);
    try {
      const topSkills = cv.skills.flatMap((s) => s.items).slice(0, 8).join(', ');
      const years = cv.experience.length ? `${cv.experience.length}+ roles` : '';
      const text = await generateSummary(p.title, years, topSkills, '');
      updatePersonal({ summary: text });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <SectionCard title="Personal details" icon={<User size={16} />}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-ink-700 bg-ink-800">
            {p.photo ? (
              <img src={p.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-400">
                <User size={22} />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhotoPick} />
            <Button type="button" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload size={13} /> {p.photo ? 'Change photo' : 'Add photo'}
            </Button>
            {p.photo && (
              <Button type="button" size="sm" variant="ghost" onClick={() => updatePersonal({ photo: '' })}>
                <X size={13} /> Remove
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input label="Full name" value={p.fullName} onChange={(e) => updatePersonal({ fullName: e.target.value })} placeholder="Jane Doe" />
          <Input label="Job title" value={p.title} onChange={(e) => updatePersonal({ title: e.target.value })} placeholder="Product Designer" />
          <Input label="Email" type="email" value={p.email} onChange={(e) => updatePersonal({ email: e.target.value })} placeholder="jane@email.com" />
          <Input label="Phone" value={p.phone} onChange={(e) => updatePersonal({ phone: e.target.value })} placeholder="+1 555 010 2020" />
          <Input label="Location" value={p.location} onChange={(e) => updatePersonal({ location: e.target.value })} placeholder="Berlin, Germany" />
          <Input label="Website" value={p.website} onChange={(e) => updatePersonal({ website: e.target.value })} placeholder="janedoe.com" />
          <Input label="LinkedIn" value={p.linkedin} onChange={(e) => updatePersonal({ linkedin: e.target.value })} placeholder="linkedin.com/in/janedoe" />
          <Input label="GitHub" value={p.github} onChange={(e) => updatePersonal({ github: e.target.value })} placeholder="github.com/janedoe" />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-ink-200">Professional summary</span>
            {hasApiKey() && (
              <Button type="button" size="sm" variant="ghost" onClick={onGenerateSummary} disabled={generating}>
                <Sparkles size={13} className={generating ? 'animate-pulse' : ''} />
                {generating ? 'Writing…' : 'Write with AI'}
              </Button>
            )}
          </div>
          <TextArea
            rows={4}
            value={p.summary}
            onChange={(e) => updatePersonal({ summary: e.target.value })}
            placeholder="2–3 sentences on who you are, your experience, and your biggest wins."
          />
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          {!hasApiKey() && (
            <p className="mt-1 text-xs text-ink-400">
              Tip: connect a free Gemini key in the AI Match tab to auto-draft this.
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
