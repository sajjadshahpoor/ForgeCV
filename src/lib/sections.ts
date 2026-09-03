import type { CvData, SectionId } from '../types';

function isSectionEmpty(cv: CvData, id: SectionId): boolean {
  switch (id) {
    case 'summary':
      return !cv.personal.summary.trim();
    case 'experience':
      return cv.experience.length === 0;
    case 'education':
      return cv.education.length === 0;
    case 'skills':
      return cv.skills.length === 0;
    case 'projects':
      return cv.projects.length === 0;
    case 'certifications':
      return cv.certifications.length === 0;
    case 'languages':
      return cv.languages.length === 0;
    default:
      return false;
  }
}

export function visibleSections(cv: CvData): SectionId[] {
  return cv.sectionOrder.filter((id) => !cv.hiddenSections.includes(id) && !isSectionEmpty(cv, id));
}
