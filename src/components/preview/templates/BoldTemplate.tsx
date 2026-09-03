import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../ui/BrandIcons';
import type { TemplateProps } from './shared';
import { ExperienceBlock, ProjectsBlock } from './shared';
import { SECTION_LABELS } from '../../../types';
import { formatRange } from '../../../lib/format';

const SIDEBAR_SECTIONS = new Set(['skills', 'education', 'certifications', 'languages']);

export function BoldTemplate({ cv, sections }: TemplateProps) {
  const p = cv.personal;
  const mainSections = sections.filter((s) => !SIDEBAR_SECTIONS.has(s));
  const sideSections = sections.filter((s) => SIDEBAR_SECTIONS.has(s));

  return (
    <div className="flex h-full bg-white" style={{ fontFamily: cv.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)' }}>
      <aside className="flex w-[34%] shrink-0 flex-col gap-5 px-6 py-9 text-white" style={{ background: 'var(--cv-accent)' }}>
        {p.photo && <img src={p.photo} alt="" className="h-24 w-24 rounded-full object-cover ring-4 ring-white/20" />}
        <div>
          <h1 className="text-[20px] font-bold leading-tight">{p.fullName || 'Your Name'}</h1>
          {p.title && <p className="mt-1 text-[12px] text-white/80">{p.title}</p>}
        </div>

        <div className="flex flex-col gap-1.5 text-[10.5px] text-white/90">
          {p.email && <span className="flex items-center gap-1.5"><Mail size={11} /> {p.email}</span>}
          {p.phone && <span className="flex items-center gap-1.5"><Phone size={11} /> {p.phone}</span>}
          {p.location && <span className="flex items-center gap-1.5"><MapPin size={11} /> {p.location}</span>}
          {p.website && <span className="flex items-center gap-1.5"><Globe size={11} /> {p.website}</span>}
          {p.linkedin && <span className="flex items-center gap-1.5"><LinkedinIcon size={11} /> {p.linkedin}</span>}
          {p.github && <span className="flex items-center gap-1.5"><GithubIcon size={11} /> {p.github}</span>}
        </div>

        {sideSections.map((id) => (
          <div key={id}>
            <h2 className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white/70">{SECTION_LABELS[id]}</h2>
            {id === 'skills' && (
              <div className="flex flex-col gap-1.5">
                {cv.skills.map((g) => (
                  <div key={g.id}>
                    {g.category && <p className="text-[10.5px] font-semibold text-white/90">{g.category}</p>}
                    <p className="text-[10.5px] leading-snug text-white/75">{g.items.join(', ')}</p>
                  </div>
                ))}
              </div>
            )}
            {id === 'education' && (
              <div className="flex flex-col gap-2">
                {cv.education.map((ed) => (
                  <div key={ed.id}>
                    <p className="text-[11px] font-semibold text-white/90">{ed.degree} {ed.field}</p>
                    <p className="text-[10.5px] text-white/70">{ed.school}</p>
                    <p className="text-[10px] text-white/60">{formatRange(ed.startDate, ed.endDate, false)}</p>
                  </div>
                ))}
              </div>
            )}
            {id === 'certifications' && (
              <div className="flex flex-col gap-1.5">
                {cv.certifications.map((c) => (
                  <div key={c.id}>
                    <p className="text-[10.5px] font-semibold text-white/90">{c.name}</p>
                    <p className="text-[10px] text-white/60">{c.issuer}</p>
                  </div>
                ))}
              </div>
            )}
            {id === 'languages' && (
              <div className="flex flex-col gap-1">
                {cv.languages.map((l) => (
                  <p key={l.id} className="text-[10.5px] text-white/85">
                    {l.name} <span className="text-white/55">— {l.level}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      <main className="flex flex-1 flex-col gap-5 px-7 py-9">
        {mainSections.map((id) => (
          <section key={id}>
            <h2 className="mb-1.5 text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--cv-accent)' }}>
              {SECTION_LABELS[id]}
            </h2>
            {id === 'summary' && <p className="text-[12.5px] leading-relaxed" style={{ color: '#333' }}>{p.summary}</p>}
            {id === 'experience' && <ExperienceBlock cv={cv} accentText />}
            {id === 'projects' && <ProjectsBlock cv={cv} />}
          </section>
        ))}
      </main>
    </div>
  );
}
