const GEMINI_KEY_STORAGE = 'forgecv_gemini_key';
const MODEL = 'gemini-2.0-flash';

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(GEMINI_KEY_STORAGE) ?? '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string) {
  try {
    if (key) localStorage.setItem(GEMINI_KEY_STORAGE, key);
    else localStorage.removeItem(GEMINI_KEY_STORAGE);
  } catch {
    // ignore storage failures (private browsing etc.)
  }
}

export function hasApiKey(): boolean {
  return getStoredApiKey().length > 0;
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 512 },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    if (res.status === 400 || res.status === 403) throw new Error('Invalid API key or request rejected.');
    if (res.status === 429) throw new Error('Rate limit reached on the free tier. Try again in a moment.');
    throw new Error(`AI request failed (${res.status}). ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from the model.');
  return text.trim();
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    await callGemini('Reply with just the word: OK', apiKey);
    return true;
  } catch {
    return false;
  }
}

export async function rewriteBullet(bullet: string, roleTitle: string, jobDescription: string): Promise<string> {
  const apiKey = getStoredApiKey();
  if (!apiKey) throw new Error('No API key configured.');

  const prompt = `You are an expert resume writer. Rewrite the following resume bullet point to be more impactful, concise, and ATS-friendly. Start with a strong action verb, quantify impact where plausible, and keep it to one line (max ~220 characters). Do not invent specific numbers that weren't implied; if no metric is present, phrase it to highlight scope/impact instead.
${roleTitle ? `Target role: ${roleTitle}` : ''}
${jobDescription ? `Relevant job description context:\n${jobDescription.slice(0, 1500)}` : ''}

Original bullet:
"${bullet}"

Return ONLY the rewritten bullet text, no quotes, no explanation, no markdown.`;

  const result = await callGemini(prompt, apiKey);
  return result.replace(/^["'-]+|["'-]+$/g, '').trim();
}

export async function generateSummary(
  title: string,
  yearsExperience: string,
  topSkills: string,
  jobDescription: string
): Promise<string> {
  const apiKey = getStoredApiKey();
  if (!apiKey) throw new Error('No API key configured.');

  const prompt = `Write a compelling 3-sentence professional resume summary for a candidate.
Title: ${title || 'Professional'}
Years of experience: ${yearsExperience || 'unspecified'}
Key skills: ${topSkills || 'unspecified'}
${jobDescription ? `Tailor the tone and keywords to this target job description:\n${jobDescription.slice(0, 1500)}` : ''}

Return ONLY the summary paragraph, no headers, no markdown, no quotes.`;

  const result = await callGemini(prompt, apiKey);
  return result.replace(/^["']+|["']+$/g, '').trim();
}

export async function suggestKeywordBullet(keyword: string, roleTitle: string): Promise<string> {
  const apiKey = getStoredApiKey();
  if (!apiKey) throw new Error('No API key configured.');

  const prompt = `Write ONE realistic, plausible resume bullet point (max 200 characters) for a "${roleTitle || 'professional'}" that naturally incorporates the skill/keyword "${keyword}". Start with a strong action verb. It should read as a template the candidate can edit with their own real details/numbers — use bracketed placeholders like [X%] or [team size] for any metric.

Return ONLY the bullet text, no quotes, no explanation.`;

  const result = await callGemini(prompt, apiKey);
  return result.replace(/^["'-]+|["'-]+$/g, '').trim();
}
