import { useLocalAiStore } from '../store/useLocalAiStore';

// A small, modern instruction-tuned model. Tried the lighter 135M variant first, but its output was
// often incoherent or fabricated details — 360M (~350MB int8, one-time download) is the smallest size
// in this family that produced reliably usable, faithful rewrites in testing. Runs fully in the browser
// via WebAssembly (or WebGPU where available) — no key, no account, no server of ours involved.
const MODEL_ID = 'HuggingFaceTB/SmolLM2-360M-Instruct';

interface ProgressItem {
  status: string;
  file?: string;
  progress?: number;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

type ChatOutput = { generated_text: ChatMessage[] }[];
type Generator = (messages: ChatMessage[], options?: Record<string, unknown>) => Promise<ChatOutput>;

let pipelinePromise: Promise<Generator> | null = null;

function loadPipeline(): Promise<Generator> {
  if (pipelinePromise) return pipelinePromise;

  const { setStatus, setProgress, setError } = useLocalAiStore.getState();
  setStatus('loading');
  setProgress(0);

  pipelinePromise = (async () => {
    try {
      const { pipeline, env } = await import('@huggingface/transformers');
      env.allowLocalModels = false;

      const fileProgress = new Map<string, number>();
      const generator = (await pipeline('text-generation', MODEL_ID, {
        dtype: 'q8',
        progress_callback: (info: ProgressItem) => {
          if (info.status === 'progress' && info.file) {
            fileProgress.set(info.file, info.progress ?? 0);
            const values = [...fileProgress.values()];
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            setProgress(Math.min(99, Math.round(avg)));
          }
        },
      })) as unknown as Generator;

      setProgress(100);
      setStatus('ready');
      return generator;
    } catch (err) {
      pipelinePromise = null;
      setError(err instanceof Error ? err.message : 'Could not load the built-in AI model.');
      throw err;
    }
  })();

  return pipelinePromise;
}

const SYSTEM_PROMPT =
  'You rewrite and write resume text. You reply with ONLY the final text being requested — never a greeting, never an explanation, never a question, never commentary about the task. You never drop or generalize a number, percentage, or specific detail that was present in the original text.';

// Worked examples anchor a small model's behavior far more reliably than instructions alone.
// The second example specifically demonstrates keeping every number from the source bullet,
// since that's the failure mode small models slip into most (quietly dropping the metric).
const FEWSHOT: ChatMessage[] = [
  { role: 'system', content: SYSTEM_PROMPT },
  { role: 'user', content: 'Rewrite this resume bullet point as one single concise sentence starting with a strong action verb: "was in charge of the weekly team meeting and took notes"' },
  { role: 'assistant', content: 'Led weekly team meetings and maintained action-item notes for a cross-functional group.' },
  { role: 'user', content: 'Rewrite this resume bullet point as one single concise sentence starting with a strong action verb, keeping every number exactly as given: "helped the support team so tickets got answered faster, went from 48 hours to 6 hours, and we did this for over 10000 customers"' },
  { role: 'assistant', content: 'Reduced customer support response time from 48 hours to 6 hours for a base of over 10,000 customers.' },
];

async function runChat(userPrompt: string, maxNewTokens: number, sample = false): Promise<string> {
  const generator = await loadPipeline();
  const messages: ChatMessage[] = [...FEWSHOT, { role: 'user', content: userPrompt }];
  const output = await generator(messages, {
    max_new_tokens: maxNewTokens,
    do_sample: sample,
    ...(sample ? { temperature: 0.4, top_k: 40 } : {}),
    repetition_penalty: 1.15,
  });

  const resultMessages = output[0]?.generated_text ?? [];
  const reply = [...resultMessages].reverse().find((m) => m.role === 'assistant');
  return (reply?.content ?? '').trim();
}

function cleanUp(text: string): string {
  return text
    .replace(/^["'\-\s]+|["'\-\s]+$/g, '')
    .split('\n')[0]
    .trim();
}

export function extractNumbers(text: string): Set<string> {
  const matches = text.match(/\d[\d,.]*%?/g) ?? [];
  return new Set(matches.map((m) => m.replace(/,/g, '')));
}

/** Small models occasionally invent a plausible-sounding stat that wasn't in the original bullet.
 * That's the one failure mode dangerous enough to block automatically — it could put a false claim
 * on someone's resume before they notice. Every suggestion is also shown for the user to accept or
 * discard (never applied silently), which is what catches the milder failure mode of a rewrite
 * softening or dropping a metric instead of inventing one. */
function introducesFabricatedNumbers(original: string, rewritten: string): boolean {
  const originalNums = extractNumbers(original);
  for (const n of extractNumbers(rewritten)) {
    if (!originalNums.has(n)) return true;
  }
  return false;
}

export async function rewriteBulletLocal(bullet: string, roleTitle: string): Promise<string> {
  const context = roleTitle ? ` on a resume for a ${roleTitle}` : ' on a resume';
  const prompt = `Rewrite this resume bullet point${context} as one single concise sentence. Start with a strong action verb. Keep every number, percentage, and specific detail exactly as given — do not drop or generalize any of them.\n\nBullet: "${bullet}"`;

  // Greedy decoding first (most faithful); if it invents a number, one resampled attempt before giving up.
  for (const sample of [false, true]) {
    const result = await runChat(prompt, 70, sample);
    const cleaned = cleanUp(result);
    if (cleaned.length > 5 && !introducesFabricatedNumbers(bullet, cleaned)) return cleaned;
  }
  throw new Error("The AI draft included a number that wasn't in your original bullet, so it wasn't applied — try again.");
}

export async function generateSummaryLocal(title: string, yearsExperience: string, topSkills: string): Promise<string> {
  const prompt = `Write a professional resume summary of exactly 2 to 3 sentences for a ${title || 'professional'}${
    yearsExperience ? ` with ${yearsExperience} of experience` : ''
  }${topSkills ? `, skilled in ${topSkills}` : ''}.`;
  const result = await runChat(prompt, 130);
  return cleanUp(result);
}

export async function suggestKeywordBulletLocal(keyword: string, roleTitle: string): Promise<string> {
  const prompt = `Write one realistic resume bullet point, one sentence, for a ${roleTitle || 'professional'} that naturally includes the skill "${keyword}". Start with a strong action verb. Use a bracketed placeholder like [X%] for any specific metric.`;
  const result = await runChat(prompt, 55);
  return cleanUp(result);
}
