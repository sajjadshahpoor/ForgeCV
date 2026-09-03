import type { CvData } from '../types';

export const emptyCv: CvData = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
    photo: '',
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'languages'],
  hiddenSections: [],
  template: 'modern',
  accentColor: '#6d28d9',
  fontFamily: 'sans',
  fontScale: 1,
};

export const sampleCv: CvData = {
  personal: {
    fullName: 'Alex Rivera',
    title: 'Senior Frontend Engineer',
    email: 'alex.rivera@email.com',
    phone: '+1 (555) 012-3456',
    location: 'Austin, TX',
    website: 'alexrivera.dev',
    linkedin: 'linkedin.com/in/alexrivera',
    github: 'github.com/alexrivera',
    summary:
      'Frontend engineer with 6+ years building performant, accessible web applications used by millions of users. Specializes in React, TypeScript, and design systems. Led a 5-person team that cut page load time by 40% and shipped a component library adopted across 12 product teams.',
    photo: '',
  },
  experience: [
    {
      id: 'exp-1',
      company: 'Northwind Labs',
      role: 'Senior Frontend Engineer',
      location: 'Austin, TX',
      startDate: '2022-03',
      endDate: '',
      current: true,
      bullets: [
        'Led migration of a legacy Angular app to React and TypeScript, reducing bundle size by 38% and cutting time-to-interactive from 4.2s to 1.6s',
        'Built and open-sourced a component library adopted by 12 internal teams, reducing duplicate UI code by an estimated 6,000 lines',
        'Mentored 4 junior engineers through structured pairing and code review, with 3 promoted within 18 months',
        'Partnered with design and product to launch a redesigned checkout flow that increased conversion by 14%',
      ],
    },
    {
      id: 'exp-2',
      company: 'Brightpath Software',
      role: 'Frontend Engineer',
      location: 'Remote',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      bullets: [
        'Developed and maintained a customer-facing dashboard serving 80,000+ monthly active users',
        'Implemented automated visual regression testing, cutting UI bugs shipped to production by 60%',
        'Improved Lighthouse accessibility score from 71 to 96 across core product surfaces',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of Texas at Austin',
      degree: 'B.S.',
      field: 'Computer Science',
      location: 'Austin, TX',
      startDate: '2015-08',
      endDate: '2019-05',
      details: 'Graduated with honors. Coursework in distributed systems, HCI, and algorithms.',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Forge UI',
      description:
        'Open-source, accessible React component library with 1,800+ GitHub stars, used in production by 20+ companies.',
      link: 'github.com/alexrivera/forge-ui',
      tech: ['React', 'TypeScript', 'Radix UI', 'Vite'],
    },
  ],
  skills: [
    { id: 'sk-1', category: 'Languages', items: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3'] },
    { id: 'sk-2', category: 'Frameworks', items: ['React', 'Next.js', 'Vue', 'Node.js'] },
    { id: 'sk-3', category: 'Tools', items: ['Vite', 'Webpack', 'Playwright', 'Figma'] },
  ],
  certifications: [
    { id: 'cert-1', name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', date: '2023-05', link: '' },
  ],
  languages: [
    { id: 'lang-1', name: 'English', level: 'Native' },
    { id: 'lang-2', name: 'Spanish', level: 'Professional working proficiency' },
  ],
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'languages'],
  hiddenSections: [],
  template: 'modern',
  accentColor: '#6d28d9',
  fontFamily: 'sans',
  fontScale: 1,
};
