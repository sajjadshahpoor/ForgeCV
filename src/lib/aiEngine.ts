import { hasApiKey, rewriteBullet as rewriteBulletGemini, generateSummary as generateSummaryGemini, suggestKeywordBullet as suggestKeywordBulletGemini } from './gemini';
import { rewriteBulletLocal, generateSummaryLocal, suggestKeywordBulletLocal } from './localAi';

export type AiEngine = 'local' | 'gemini';

/** Gemini (if the user opted in with their own key) is preferred for speed/quality; the built-in
 * local model is always available with zero setup and is the default for everyone else. */
export function currentAiEngine(): AiEngine {
  return hasApiKey() ? 'gemini' : 'local';
}

export async function rewriteBulletAI(bullet: string, roleTitle: string, jobDescription = ''): Promise<string> {
  if (hasApiKey()) return rewriteBulletGemini(bullet, roleTitle, jobDescription);
  return rewriteBulletLocal(bullet, roleTitle);
}

export async function generateSummaryAI(title: string, yearsExperience: string, topSkills: string, jobDescription = ''): Promise<string> {
  if (hasApiKey()) return generateSummaryGemini(title, yearsExperience, topSkills, jobDescription);
  return generateSummaryLocal(title, yearsExperience, topSkills);
}

export async function suggestKeywordBulletAI(keyword: string, roleTitle: string): Promise<string> {
  if (hasApiKey()) return suggestKeywordBulletGemini(keyword, roleTitle);
  return suggestKeywordBulletLocal(keyword, roleTitle);
}
