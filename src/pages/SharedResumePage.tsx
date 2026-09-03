import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, Pencil } from 'lucide-react';
import type { CvData } from '../types';
import { CvPreview } from '../components/preview/CvPreview';
import { Logo } from '../components/layout/Logo';
import { Button } from '../components/ui/Button';

export function SharedResumePage({ cv, onEditCopy, onLogoClick }: { cv: CvData; onEditCopy: () => void; onLogoClick: () => void }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: cv.personal.fullName ? `${cv.personal.fullName} - Resume` : 'Resume',
  });

  return (
    <div className="flex min-h-dvh flex-col bg-ink-950">
      <header className="no-print flex items-center justify-between gap-2 border-b border-ink-800 px-4 py-3 sm:px-6">
        <button onClick={onLogoClick} className="shrink-0">
          <Logo size={24} />
        </button>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => handlePrint()}>
            <Download size={13} /> <span className="hidden sm:inline">Download PDF</span>
          </Button>
          <Button size="sm" variant="primary" onClick={onEditCopy}>
            <Pencil size={13} /> <span className="hidden sm:inline">Edit a copy in ForgeCV</span>
            <span className="sm:hidden">Edit a copy</span>
          </Button>
        </div>
      </header>

      <div className="app-scroll flex-1 overflow-auto p-4 sm:p-10">
        <CvPreview ref={previewRef} cv={cv} />
      </div>

      <footer className="no-print border-t border-ink-800 py-4 text-center text-xs text-ink-500">
        Made with <button onClick={onLogoClick} className="underline hover:text-violet-400">ForgeCV</button> — a
        free, open-source resume builder. This is a read-only shared view; nothing here is stored on a server.
      </footer>
    </div>
  );
}
