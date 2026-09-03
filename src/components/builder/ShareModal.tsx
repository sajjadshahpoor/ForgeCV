import { useEffect, useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import type { CvData } from '../../types';
import { buildShareUrl } from '../../lib/shareLink';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function ShareModal({ open, onClose, cv }: { open: boolean; onClose: () => void; cv: CvData }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCopied(false);
    setLoading(true);
    buildShareUrl(cv)
      .then(setUrl)
      .finally(() => setLoading(false));
  }, [open, cv]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — the field is still selectable for manual copy.
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Share your resume">
      <p className="mb-3 text-sm text-ink-400">
        This link contains your whole resume, compressed — there's no account and nothing is uploaded anywhere.
        Anyone who opens it sees a clean, read-only view they can download as a PDF, and can start their own
        resume in ForgeCV from a copy of it.
      </p>
      <div className="flex gap-2">
        <input
          readOnly
          value={loading ? 'Generating link…' : url}
          onFocus={(e) => e.target.select()}
          className="flex-1 truncate rounded-lg border border-ink-700 bg-ink-950 px-3 py-2 text-xs text-ink-200"
        />
        <Button onClick={copy} disabled={loading || !url} variant="primary" size="sm">
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs text-ink-400 hover:text-violet-400"
        >
          Open in a new tab <ExternalLink size={11} />
        </a>
      )}
      <p className="mt-3 text-xs text-ink-500">
        Your photo isn't included, to keep the link short enough to paste anywhere. Editing your resume later
        won't change this link — generate a new one whenever you update it.
      </p>
    </Modal>
  );
}
