import type { CvData } from '../types';

const HASH_PREFIX = '#r/';

async function gzipCompress(text: string): Promise<Uint8Array> {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'));
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

async function gzipDecompress(bytes: Uint8Array): Promise<string> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('gzip'));
  const buf = await new Response(stream).arrayBuffer();
  return new TextDecoder().decode(buf);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(b64url.length / 4) * 4, '=');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Builds a self-contained share URL: the whole resume lives compressed in the hash, so no backend is involved. */
export async function buildShareUrl(cv: CvData): Promise<string> {
  // Photos are dropped to keep the link short enough to paste into forms/emails without truncation.
  const payload: CvData = { ...cv, personal: { ...cv.personal, photo: '' } };
  const json = JSON.stringify(payload);

  let encoded: string;
  let mode: 'z' | 'p' = 'z';
  try {
    encoded = bytesToBase64Url(await gzipCompress(json));
  } catch {
    mode = 'p';
    encoded = bytesToBase64Url(new TextEncoder().encode(json));
  }

  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}${HASH_PREFIX}${mode}${encoded}`;
}

export function isShareHash(hash: string): boolean {
  return hash.startsWith(HASH_PREFIX);
}

export async function decodeShareHash(hash: string): Promise<CvData | null> {
  if (!isShareHash(hash)) return null;
  const mode = hash[HASH_PREFIX.length];
  const encoded = hash.slice(HASH_PREFIX.length + 1);
  try {
    const bytes = base64UrlToBytes(encoded);
    const json = mode === 'z' ? await gzipDecompress(bytes) : new TextDecoder().decode(bytes);
    return JSON.parse(json) as CvData;
  } catch {
    return null;
  }
}
