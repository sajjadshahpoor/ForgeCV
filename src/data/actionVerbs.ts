export const ACTION_VERBS: Record<string, string[]> = {
  Leadership: ['Led', 'Directed', 'Orchestrated', 'Championed', 'Spearheaded', 'Mentored', 'Coordinated', 'Founded'],
  Achievement: ['Achieved', 'Delivered', 'Exceeded', 'Accelerated', 'Boosted', 'Increased', 'Reduced', 'Generated'],
  Technical: ['Built', 'Engineered', 'Architected', 'Automated', 'Optimized', 'Implemented', 'Deployed', 'Refactored'],
  Analysis: ['Analyzed', 'Diagnosed', 'Evaluated', 'Investigated', 'Modeled', 'Forecasted', 'Audited'],
  Communication: ['Presented', 'Authored', 'Negotiated', 'Facilitated', 'Advised', 'Trained', 'Documented'],
  Creation: ['Designed', 'Launched', 'Created', 'Established', 'Pioneered', 'Developed', 'Redesigned'],
};

export const ALL_ACTION_VERBS = Object.values(ACTION_VERBS).flat();

export const WEAK_STARTERS = [
  'responsible for',
  'worked on',
  'helped with',
  'helped to',
  'in charge of',
  'tasked with',
  'duties included',
  'was involved in',
  'assisted with',
  'participated in',
  'handled',
];

export const FILLER_WORDS = ['very', 'really', 'basically', 'just', 'a lot of', 'stuff', 'things', 'etc'];

const WEAK_STARTER_REPLACEMENTS: Record<string, string[]> = {
  'responsible for': ['Owned', 'Managed', 'Led'],
  'worked on': ['Built', 'Developed', 'Drove'],
  'helped with': ['Contributed to', 'Supported', 'Partnered on'],
  'helped to': ['Contributed to', 'Enabled'],
  'in charge of': ['Led', 'Directed', 'Owned'],
  'tasked with': ['Owned', 'Drove'],
  'duties included': ['Delivered', 'Managed'],
  'was involved in': ['Contributed to', 'Drove'],
  'assisted with': ['Supported', 'Partnered on'],
  'participated in': ['Contributed to', 'Collaborated on'],
  handled: ['Managed', 'Owned', 'Resolved'],
};

export function suggestReplacementsFor(weakPhrase: string): string[] {
  return WEAK_STARTER_REPLACEMENTS[weakPhrase] ?? ['Led', 'Built', 'Drove'];
}
