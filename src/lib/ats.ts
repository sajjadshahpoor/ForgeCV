import { KNOWN_SKILL_TERMS, STOPWORDS } from '../data/keywordLibrary';
import { WEAK_STARTERS, suggestReplacementsFor } from '../data/actionVerbs';
import type { CvData } from '../types';

export interface KeywordMatch {
  term: string;
  present: boolean;
}

export interface AtsResult {
  score: number; // 0-100
  matched: string[];
  missing: string[];
  totalExtracted: number;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s+#./-]/g, ' ');
}

/** Extract candidate keywords from a job description: known-skill dictionary hits + frequent capitalized/technical tokens. */
export function extractKeywords(jobDescription: string, limit = 25): string[] {
  const lower = normalize(jobDescription);
  const found = new Set<string>();

  for (const term of KNOWN_SKILL_TERMS) {
    const pattern = new RegExp(`(?<![\\w-])${escapeRegExp(term)}(?![\\w-])`, 'i');
    if (pattern.test(lower)) found.add(term);
  }

  // Frequency-based fallback for domain words not in the dictionary (e.g. niche tools).
  const words = lower.split(/\s+/).filter((w) => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);

  const frequent = [...freq.entries()]
    .filter(([w, c]) => c >= 2 && !found.has(w))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w);

  for (const w of frequent) found.add(w);

  return [...found].slice(0, limit);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cvToText(cv: CvData): string {
  const parts: string[] = [cv.personal.summary, cv.personal.title];
  for (const e of cv.experience) parts.push(e.role, e.company, ...e.bullets);
  for (const p of cv.projects) parts.push(p.name, p.description, ...p.tech);
  for (const s of cv.skills) parts.push(s.category, ...s.items);
  for (const ed of cv.education) parts.push(ed.degree, ed.field, ed.school);
  for (const c of cv.certifications) parts.push(c.name, c.issuer);
  return normalize(parts.join(' '));
}

export function scoreAgainstJob(cv: CvData, jobDescription: string): AtsResult {
  const keywords = extractKeywords(jobDescription, 30);
  const cvText = cvToText(cv);

  const matched: string[] = [];
  const missing: string[] = [];

  for (const term of keywords) {
    const pattern = new RegExp(`(?<![\\w-])${escapeRegExp(term)}(?![\\w-])`, 'i');
    if (pattern.test(cvText)) matched.push(term);
    else missing.push(term);
  }

  const score = keywords.length === 0 ? 0 : Math.round((matched.length / keywords.length) * 100);

  return { score, matched, missing, totalExtracted: keywords.length };
}

export interface BulletSuggestion {
  bulletIndex: number;
  issue: 'weak-starter' | 'no-metric' | 'too-short';
  message: string;
  replacements?: string[];
}

/** Rule-based bullet critique: weak openers, missing metrics, too-short bullets. Runs entirely offline. */
export function critiqueBullets(bullets: string[]): BulletSuggestion[] {
  const suggestions: BulletSuggestion[] = [];

  bullets.forEach((bullet, i) => {
    const lower = bullet.toLowerCase().trim();
    if (!lower) return;

    const weakStarter = WEAK_STARTERS.find((w) => lower.startsWith(w));
    if (weakStarter) {
      suggestions.push({
        bulletIndex: i,
        issue: 'weak-starter',
        message: `Starts with a weak phrase ("${weakStarter}"). Lead with a strong action verb instead.`,
        replacements: suggestReplacementsFor(weakStarter),
      });
      return;
    }

    const hasMetric = /\d/.test(bullet) || /%/.test(bullet);
    if (!hasMetric && bullet.length > 25) {
      suggestions.push({
        bulletIndex: i,
        issue: 'no-metric',
        message: 'No measurable result detected. Add a number, %, or $ to quantify the impact.',
      });
      return;
    }

    if (bullet.trim().length < 25) {
      suggestions.push({
        bulletIndex: i,
        issue: 'too-short',
        message: 'This bullet is quite short — consider adding scope or impact (who, what, result).',
      });
    }
  });

  return suggestions;
}
