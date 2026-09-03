import { Award, Languages as LangIcon, Plus, Trash2 } from 'lucide-react';
import { useCvStore } from '../../store/useCvStore';
import { Input } from '../ui/Field';
import { SectionCard } from '../ui/Card';
import { Button } from '../ui/Button';

export function CertificationsForm() {
  const { cv, addCertification, updateCertification, removeCertification } = useCvStore();

  return (
    <SectionCard
      title="Certifications"
      icon={<Award size={16} />}
      action={
        <Button type="button" size="sm" onClick={addCertification}>
          <Plus size={13} /> Add
        </Button>
      }
    >
      {cv.certifications.length === 0 && (
        <p className="rounded-lg border border-dashed border-ink-700 p-4 text-sm text-ink-400">
          Licenses, certifications, or courses that back up your skills.
        </p>
      )}
      <div className="flex flex-col gap-2">
        {cv.certifications.map((c) => (
          <div key={c.id} className="relative grid grid-cols-1 gap-2 rounded-xl border border-ink-800 bg-ink-950/40 p-3 pr-9 sm:grid-cols-[1fr_1fr_110px] sm:items-center sm:pr-10">
            <Input placeholder="Certification name" value={c.name} onChange={(e) => updateCertification(c.id, { name: e.target.value })} />
            <Input placeholder="Issuer" value={c.issuer} onChange={(e) => updateCertification(c.id, { issuer: e.target.value })} />
            <Input type="month" value={c.date} onChange={(e) => updateCertification(c.id, { date: e.target.value })} />
            <button
              type="button"
              onClick={() => removeCertification(c.id)}
              className="absolute right-3 top-3 text-ink-400 hover:text-red-400 sm:top-1/2 sm:-translate-y-1/2"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

const LEVELS = ['Native', 'Fluent', 'Professional working proficiency', 'Conversational', 'Basic'];

export function LanguagesForm() {
  const { cv, addLanguage, updateLanguage, removeLanguage } = useCvStore();

  return (
    <SectionCard
      title="Languages"
      icon={<LangIcon size={16} />}
      action={
        <Button type="button" size="sm" onClick={addLanguage}>
          <Plus size={13} /> Add
        </Button>
      }
    >
      {cv.languages.length === 0 && (
        <p className="rounded-lg border border-dashed border-ink-700 p-4 text-sm text-ink-400">Spoken languages and fluency.</p>
      )}
      <div className="flex flex-col gap-2">
        {cv.languages.map((l) => (
          <div key={l.id} className="relative grid grid-cols-1 gap-2 rounded-xl border border-ink-800 bg-ink-950/40 p-3 pr-9 sm:grid-cols-[1fr_1fr] sm:items-center sm:pr-10">
            <Input placeholder="Language" value={l.name} onChange={(e) => updateLanguage(l.id, { name: e.target.value })} />
            <select
              value={l.level}
              onChange={(e) => updateLanguage(l.id, { level: e.target.value })}
              className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-50 outline-none focus:border-violet-500"
            >
              <option value="">Select level</option>
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeLanguage(l.id)}
              className="absolute right-3 top-3 text-ink-400 hover:text-red-400 sm:top-1/2 sm:-translate-y-1/2"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
