import type { TemplateProps } from './shared';
import {
  ContactRow,
  ExperienceBlock,
  EducationBlock,
  ProjectsBlock,
  SkillsBlock,
  CertificationsBlock,
  LanguagesBlock,
} from './shared';
import { SECTION_LABELS } from '../../../types';

const BLOCKS: Record<string, (cv: TemplateProps['cv']) => React.ReactNode> = {
  summary: (cv) => <p className="text-[12.5px] leading-relaxed" style={{ color: '#333' }}>{cv.personal.summary}</p>,
  experience: (cv) => <ExperienceBlock cv={cv} accentText />,
  education: (cv) => <EducationBlock cv={cv} />,
  projects: (cv) => <ProjectsBlock cv={cv} />,
  skills: (cv) => <SkillsBlock cv={cv} />,
  certifications: (cv) => <CertificationsBlock cv={cv} />,
  languages: (cv) => <LanguagesBlock cv={cv} />,
};

export function ModernTemplate({ cv, sections }: TemplateProps) {
  const p = cv.personal;

  return (
    <div className="flex h-full flex-col bg-white px-10 py-9" style={{ fontFamily: cv.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)' }}>
      <header className="mb-5 flex items-start justify-between gap-4 border-b-[3px] pb-4" style={{ borderColor: 'var(--cv-accent)' }}>
        <div>
          <h1 className="text-[26px] font-bold leading-tight" style={{ color: '#111' }}>{p.fullName || 'Your Name'}</h1>
          {p.title && <p className="mt-0.5 text-[14px] font-medium" style={{ color: 'var(--cv-accent)' }}>{p.title}</p>}
          <ContactRow cv={cv} className="mt-2 text-[11px]" />
        </div>
        {p.photo && <img src={p.photo} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover" />}
      </header>

      <div className="flex flex-col gap-4">
        {sections.map((id) => (
          <section key={id}>
            <h2
              className="mb-1.5 text-[11px] font-bold uppercase tracking-wider"
              style={{ color: 'var(--cv-accent)' }}
            >
              {SECTION_LABELS[id]}
            </h2>
            {BLOCKS[id](cv)}
          </section>
        ))}
      </div>
    </div>
  );
}
