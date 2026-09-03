import type { ReactNode } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../ui/BrandIcons';
import type { CvData } from '../../../types';
import { formatRange } from '../../../lib/format';

export interface TemplateProps {
  cv: CvData;
  sections: import('../../../types').SectionId[];
}

export function ContactRow({ cv, className = '', iconSize = 12 }: { cv: CvData; className?: string; iconSize?: number }) {
  const p = cv.personal;
  const items: { icon: ReactNode; text: string }[] = [
    p.email && { icon: <Mail size={iconSize} />, text: p.email },
    p.phone && { icon: <Phone size={iconSize} />, text: p.phone },
    p.location && { icon: <MapPin size={iconSize} />, text: p.location },
    p.website && { icon: <Globe size={iconSize} />, text: p.website },
    p.linkedin && { icon: <LinkedinIcon size={iconSize} />, text: p.linkedin },
    p.github && { icon: <GithubIcon size={iconSize} />, text: p.github },
  ].filter(Boolean) as { icon: ReactNode; text: string }[];

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`} style={{ color: '#555' }}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {it.icon}
          {it.text}
        </span>
      ))}
    </div>
  );
}

export function ExperienceBlock({ cv, accentText = false }: { cv: CvData; accentText?: boolean }) {
  return (
    <div className="flex flex-col gap-3.5">
      {cv.experience.map((e) => (
        <div key={e.id}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="font-semibold text-[13.5px]" style={{ color: '#111' }}>
              {e.role}
              {e.company && <span className="font-normal"> · {e.company}</span>}
            </p>
            <p className="text-[11px] whitespace-nowrap" style={{ color: accentText ? 'var(--cv-accent)' : '#666' }}>
              {formatRange(e.startDate, e.endDate, e.current)}
            </p>
          </div>
          {e.location && <p className="text-[11px]" style={{ color: '#777' }}>{e.location}</p>}
          {e.bullets.filter(Boolean).length > 0 && (
            <ul className="mt-1.5 flex flex-col gap-1">
              {e.bullets.filter(Boolean).map((b, i) => (
                <li key={i} className="flex gap-1.5 text-[12px] leading-snug" style={{ color: '#222' }}>
                  <span className="mt-1.5 h-[3px] w-[3px] shrink-0 rounded-full" style={{ background: '#999' }} />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function EducationBlock({ cv }: { cv: CvData }) {
  return (
    <div className="flex flex-col gap-2.5">
      {cv.education.map((ed) => (
        <div key={ed.id}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="font-semibold text-[13px]" style={{ color: '#111' }}>
              {ed.degree} {ed.field && `in ${ed.field}`}
            </p>
            <p className="text-[11px] whitespace-nowrap" style={{ color: '#666' }}>
              {formatRange(ed.startDate, ed.endDate, false)}
            </p>
          </div>
          <p className="text-[12px]" style={{ color: '#444' }}>
            {ed.school}
            {ed.location && ` · ${ed.location}`}
          </p>
          {ed.details && <p className="mt-0.5 text-[11.5px]" style={{ color: '#666' }}>{ed.details}</p>}
        </div>
      ))}
    </div>
  );
}

export function ProjectsBlock({ cv }: { cv: CvData }) {
  return (
    <div className="flex flex-col gap-2.5">
      {cv.projects.map((p) => (
        <div key={p.id}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="font-semibold text-[13px]" style={{ color: '#111' }}>{p.name}</p>
            {p.link && <p className="text-[11px]" style={{ color: '#666' }}>{p.link}</p>}
          </div>
          {p.description && <p className="text-[12px] leading-snug" style={{ color: '#333' }}>{p.description}</p>}
          {p.tech.length > 0 && <p className="mt-0.5 text-[11px]" style={{ color: '#777' }}>{p.tech.join(' · ')}</p>}
        </div>
      ))}
    </div>
  );
}

export function SkillsBlock({ cv }: { cv: CvData }) {
  return (
    <div className="flex flex-col gap-1.5">
      {cv.skills.map((g) => (
        <p key={g.id} className="text-[12px] leading-snug" style={{ color: '#333' }}>
          {g.category && <span className="font-semibold" style={{ color: '#111' }}>{g.category}: </span>}
          {g.items.join(', ')}
        </p>
      ))}
    </div>
  );
}

export function CertificationsBlock({ cv }: { cv: CvData }) {
  return (
    <div className="flex flex-col gap-1.5">
      {cv.certifications.map((c) => (
        <div key={c.id} className="flex flex-wrap items-baseline justify-between gap-x-3 text-[12px]">
          <p style={{ color: '#222' }}>
            <span className="font-semibold">{c.name}</span>
            {c.issuer && ` — ${c.issuer}`}
          </p>
          <p className="whitespace-nowrap text-[11px]" style={{ color: '#777' }}>{formatMonthShort(c.date)}</p>
        </div>
      ))}
    </div>
  );
}

function formatMonthShort(v: string) {
  return v || '';
}

export function LanguagesBlock({ cv }: { cv: CvData }) {
  return (
    <div className="flex flex-col gap-1">
      {cv.languages.map((l) => (
        <p key={l.id} className="text-[12px]" style={{ color: '#333' }}>
          <span className="font-semibold" style={{ color: '#111' }}>{l.name}</span>
          {l.level && ` — ${l.level}`}
        </p>
      ))}
    </div>
  );
}
