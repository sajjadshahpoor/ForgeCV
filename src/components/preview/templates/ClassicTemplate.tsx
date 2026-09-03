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

export function ClassicTemplate({ cv, sections }: TemplateProps) {
  const p = cv.personal;

  return (
    <div className="flex h-full flex-col bg-white px-11 py-10 font-serif">
      <header className="mb-5 text-center">
        <h1 className="text-[24px] font-semibold tracking-wide" style={{ color: '#111' }}>{p.fullName || 'Your Name'}</h1>
        {p.title && <p className="mt-1 text-[13px] italic" style={{ color: '#444' }}>{p.title}</p>}
        <ContactRow cv={cv} className="mt-2 justify-center text-[11px]" />
        <div className="mx-auto mt-4 h-px w-full" style={{ background: '#ccc' }} />
      </header>

      <div className="flex flex-col gap-4">
        {sections.map((id) => (
          <section key={id}>
            <h2 className="mb-1.5 text-center text-[12px] font-semibold uppercase tracking-[0.15em]" style={{ color: '#111' }}>
              {SECTION_LABELS[id]}
            </h2>
            {BLOCKS[id](cv)}
          </section>
        ))}
      </div>
    </div>
  );
}
