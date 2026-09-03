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
  experience: (cv) => <ExperienceBlock cv={cv} />,
  education: (cv) => <EducationBlock cv={cv} />,
  projects: (cv) => <ProjectsBlock cv={cv} />,
  skills: (cv) => <SkillsBlock cv={cv} />,
  certifications: (cv) => <CertificationsBlock cv={cv} />,
  languages: (cv) => <LanguagesBlock cv={cv} />,
};

export function MinimalTemplate({ cv, sections }: TemplateProps) {
  const p = cv.personal;

  return (
    <div className="flex h-full flex-col bg-white px-12 py-11" style={{ fontFamily: cv.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)' }}>
      <header className="mb-8">
        <h1 className="text-[22px] font-medium tracking-tight" style={{ color: '#111' }}>{p.fullName || 'Your Name'}</h1>
        {p.title && <p className="mt-1 text-[13px]" style={{ color: '#666' }}>{p.title}</p>}
        <ContactRow cv={cv} className="mt-3 text-[11px]" iconSize={10} />
      </header>

      <div className="flex flex-col gap-6">
        {sections.map((id) => (
          <section key={id}>
            <h2 className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--cv-accent)' }}>
              {SECTION_LABELS[id]}
            </h2>
            {BLOCKS[id](cv)}
          </section>
        ))}
      </div>
    </div>
  );
}
