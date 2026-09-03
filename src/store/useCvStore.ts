import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type {
  CvData,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  SkillGroup,
  CertificationItem,
  LanguageItem,
  SectionId,
  TemplateId,
} from '../types';
import { emptyCv, SAMPLE_PROFILES } from '../data/sampleData';
import { loadCv, saveCv } from '../lib/storage';

interface CvStore {
  cv: CvData;
  setCv: (cv: CvData) => void;
  resetCv: () => void;
  loadSampleById: (id: string) => void;

  updatePersonal: (patch: Partial<PersonalInfo>) => void;

  addExperience: () => void;
  updateExperience: (id: string, patch: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (fromId: string, toId: string) => void;
  addBullet: (expId: string, text?: string) => void;
  updateBullet: (expId: string, index: number, text: string) => void;
  removeBullet: (expId: string, index: number) => void;
  reorderBullets: (expId: string, from: number, to: number) => void;

  addEducation: () => void;
  updateEducation: (id: string, patch: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;

  addProject: () => void;
  updateProject: (id: string, patch: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;

  addSkillGroup: () => void;
  updateSkillGroup: (id: string, patch: Partial<SkillGroup>) => void;
  removeSkillGroup: (id: string) => void;

  addCertification: () => void;
  updateCertification: (id: string, patch: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;

  addLanguage: () => void;
  updateLanguage: (id: string, patch: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;

  setSectionOrder: (order: SectionId[]) => void;
  toggleSectionVisibility: (id: SectionId) => void;
  setTemplate: (t: TemplateId) => void;
  setAccentColor: (c: string) => void;
  setFontFamily: (f: 'sans' | 'serif') => void;
  setFontScale: (s: number) => void;
}

const initial = loadCv() ?? emptyCv;

export const useCvStore = create<CvStore>((set) => ({
  cv: initial,

  setCv: (cv) => set({ cv }),
  resetCv: () => set({ cv: { ...emptyCv, sectionOrder: [...emptyCv.sectionOrder] } }),
  loadSampleById: (id) => {
    const profile = SAMPLE_PROFILES.find((p) => p.id === id);
    if (profile) set({ cv: JSON.parse(JSON.stringify(profile.data)) });
  },

  updatePersonal: (patch) =>
    set((s) => ({ cv: { ...s.cv, personal: { ...s.cv.personal, ...patch } } })),

  addExperience: () =>
    set((s) => ({
      cv: {
        ...s.cv,
        experience: [
          ...s.cv.experience,
          { id: uuid(), company: '', role: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] },
        ],
      },
    })),
  updateExperience: (id, patch) =>
    set((s) => ({
      cv: { ...s.cv, experience: s.cv.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) },
    })),
  removeExperience: (id) =>
    set((s) => ({ cv: { ...s.cv, experience: s.cv.experience.filter((e) => e.id !== id) } })),
  reorderExperience: (fromId, toId) =>
    set((s) => {
      const list = [...s.cv.experience];
      const fromIdx = list.findIndex((e) => e.id === fromId);
      const toIdx = list.findIndex((e) => e.id === toId);
      if (fromIdx === -1 || toIdx === -1) return s;
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      return { cv: { ...s.cv, experience: list } };
    }),
  addBullet: (expId, text = '') =>
    set((s) => ({
      cv: {
        ...s.cv,
        experience: s.cv.experience.map((e) => (e.id === expId ? { ...e, bullets: [...e.bullets, text] } : e)),
      },
    })),
  updateBullet: (expId, index, text) =>
    set((s) => ({
      cv: {
        ...s.cv,
        experience: s.cv.experience.map((e) =>
          e.id === expId ? { ...e, bullets: e.bullets.map((b, i) => (i === index ? text : b)) } : e
        ),
      },
    })),
  removeBullet: (expId, index) =>
    set((s) => ({
      cv: {
        ...s.cv,
        experience: s.cv.experience.map((e) =>
          e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== index) } : e
        ),
      },
    })),
  reorderBullets: (expId, from, to) =>
    set((s) => ({
      cv: {
        ...s.cv,
        experience: s.cv.experience.map((e) => {
          if (e.id !== expId) return e;
          const bullets = [...e.bullets];
          const [moved] = bullets.splice(from, 1);
          bullets.splice(to, 0, moved);
          return { ...e, bullets };
        }),
      },
    })),

  addEducation: () =>
    set((s) => ({
      cv: {
        ...s.cv,
        education: [
          ...s.cv.education,
          { id: uuid(), school: '', degree: '', field: '', location: '', startDate: '', endDate: '', details: '' },
        ],
      },
    })),
  updateEducation: (id, patch) =>
    set((s) => ({
      cv: { ...s.cv, education: s.cv.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) },
    })),
  removeEducation: (id) =>
    set((s) => ({ cv: { ...s.cv, education: s.cv.education.filter((e) => e.id !== id) } })),

  addProject: () =>
    set((s) => ({
      cv: { ...s.cv, projects: [...s.cv.projects, { id: uuid(), name: '', description: '', link: '', tech: [] }] },
    })),
  updateProject: (id, patch) =>
    set((s) => ({
      cv: { ...s.cv, projects: s.cv.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) },
    })),
  removeProject: (id) =>
    set((s) => ({ cv: { ...s.cv, projects: s.cv.projects.filter((p) => p.id !== id) } })),

  addSkillGroup: () =>
    set((s) => ({ cv: { ...s.cv, skills: [...s.cv.skills, { id: uuid(), category: '', items: [] }] } })),
  updateSkillGroup: (id, patch) =>
    set((s) => ({ cv: { ...s.cv, skills: s.cv.skills.map((g) => (g.id === id ? { ...g, ...patch } : g)) } })),
  removeSkillGroup: (id) =>
    set((s) => ({ cv: { ...s.cv, skills: s.cv.skills.filter((g) => g.id !== id) } })),

  addCertification: () =>
    set((s) => ({
      cv: { ...s.cv, certifications: [...s.cv.certifications, { id: uuid(), name: '', issuer: '', date: '', link: '' }] },
    })),
  updateCertification: (id, patch) =>
    set((s) => ({
      cv: { ...s.cv, certifications: s.cv.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)) },
    })),
  removeCertification: (id) =>
    set((s) => ({ cv: { ...s.cv, certifications: s.cv.certifications.filter((c) => c.id !== id) } })),

  addLanguage: () =>
    set((s) => ({ cv: { ...s.cv, languages: [...s.cv.languages, { id: uuid(), name: '', level: '' }] } })),
  updateLanguage: (id, patch) =>
    set((s) => ({ cv: { ...s.cv, languages: s.cv.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)) } })),
  removeLanguage: (id) =>
    set((s) => ({ cv: { ...s.cv, languages: s.cv.languages.filter((l) => l.id !== id) } })),

  setSectionOrder: (order) => set((s) => ({ cv: { ...s.cv, sectionOrder: order } })),
  toggleSectionVisibility: (id) =>
    set((s) => {
      const hidden = s.cv.hiddenSections.includes(id)
        ? s.cv.hiddenSections.filter((h) => h !== id)
        : [...s.cv.hiddenSections, id];
      return { cv: { ...s.cv, hiddenSections: hidden } };
    }),
  setTemplate: (template) => set((s) => ({ cv: { ...s.cv, template } })),
  setAccentColor: (accentColor) => set((s) => ({ cv: { ...s.cv, accentColor } })),
  setFontFamily: (fontFamily) => set((s) => ({ cv: { ...s.cv, fontFamily } })),
  setFontScale: (fontScale) => set((s) => ({ cv: { ...s.cv, fontScale } })),
}));

let saveTimer: ReturnType<typeof setTimeout> | undefined;
useCvStore.subscribe((state) => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveCv(state.cv), 300);
});
