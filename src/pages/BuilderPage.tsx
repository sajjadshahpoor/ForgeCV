import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  ArrowLeft,
  Download,
  FileJson,
  Upload,
  RotateCcw,
  Wand2,
  FileText,
  Palette,
  Target,
  ZoomIn,
  ZoomOut,
  Eye,
  Pencil,
  Maximize,
  Share2,
} from 'lucide-react';
import { useCvStore } from '../store/useCvStore';
import { Logo } from '../components/layout/Logo';
import { Button } from '../components/ui/Button';
import { CvPreview } from '../components/preview/CvPreview';
import { PersonalForm } from '../components/builder/PersonalForm';
import { ExperienceForm } from '../components/builder/ExperienceForm';
import { EducationForm } from '../components/builder/EducationForm';
import { ProjectsForm } from '../components/builder/ProjectsForm';
import { SkillsForm } from '../components/builder/SkillsForm';
import { CertificationsForm, LanguagesForm } from '../components/builder/ExtrasForm';
import { SectionManager } from '../components/builder/SectionManager';
import { DesignPanel } from '../components/builder/DesignPanel';
import { AIPanel } from '../components/builder/AIPanel';
import { SamplePickerModal } from '../components/builder/SamplePickerModal';
import { ShareModal } from '../components/builder/ShareModal';
import { exportCvAsJson, importCvFromFile } from '../lib/storage';

type Tab = 'content' | 'design' | 'ai';
type MobileView = 'edit' | 'preview';

const PREVIEW_WIDTH_PX = 794; // 210mm at 96dpi

export function BuilderPage({ onBack }: { onBack: () => void }) {
  const { cv, setCv, resetCv } = useCvStore();
  const [tab, setTab] = useState<Tab>('content');
  const [mobileView, setMobileView] = useState<MobileView>('edit');
  const [zoom, setZoom] = useState(0.72);
  const [samplePickerOpen, setSamplePickerOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: cv.personal.fullName ? `${cv.personal.fullName} - Resume` : 'Resume',
  });

  // Auto-fit the preview to the available width (runs on mount, resize, and mobile tab switch).
  function fitToWidth() {
    const el = previewWrapRef.current;
    if (!el) return;
    const available = el.clientWidth - 32;
    const scale = Math.min(1, Math.max(0.28, available / PREVIEW_WIDTH_PX));
    setZoom(Math.round(scale * 100) / 100);
  }

  useEffect(() => {
    fitToWidth();
    window.addEventListener('resize', fitToWidth);
    return () => window.removeEventListener('resize', fitToWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mobileView === 'preview') fitToWidth();
  }, [mobileView]);

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importCvFromFile(file);
      setCv(data);
    } catch {
      alert('Could not import this file — make sure it is a ForgeCV JSON export.');
    }
    e.target.value = '';
  }

  function onReset() {
    if (confirm('This clears everything you have entered. Continue?')) resetCv();
  }

  const editVisible = mobileView === 'edit';

  return (
    <div className="flex h-dvh flex-col bg-ink-950">
      <header className="no-print flex items-center justify-between gap-2 border-b border-ink-800 px-3 py-2.5 sm:px-5 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onBack} className="shrink-0 text-ink-400 hover:text-ink-100" title="Back to home">
            <ArrowLeft size={18} />
          </button>
          <Logo size={22} />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <Button size="sm" variant="ghost" onClick={() => setSamplePickerOpen(true)} title="Load sample">
            <Wand2 size={13} /> <span className="hidden sm:inline">Load sample</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => fileRef.current?.click()} title="Import JSON">
            <Upload size={13} /> <span className="hidden sm:inline">Import</span>
          </Button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={onImport} />
          <Button size="sm" variant="ghost" onClick={() => exportCvAsJson(cv)} title="Export JSON">
            <FileJson size={13} /> <span className="hidden sm:inline">Export JSON</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={onReset} title="Reset">
            <RotateCcw size={13} /> <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShareModalOpen(true)} title="Share resume link">
            <Share2 size={13} /> <span className="hidden sm:inline">Share</span>
          </Button>
          <Button size="sm" variant="primary" onClick={() => handlePrint()} title="Export PDF">
            <Download size={13} /> <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
      </header>

      <div className="no-print flex gap-1 border-b border-ink-800 bg-ink-950 p-2 lg:hidden">
        <TabButton active={mobileView === 'edit'} onClick={() => setMobileView('edit')} icon={<Pencil size={14} />} label="Edit" />
        <TabButton active={mobileView === 'preview'} onClick={() => setMobileView('preview')} icon={<Eye size={14} />} label="Preview" />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        <div
          className={`no-print w-full flex-col border-r border-ink-800 lg:flex lg:max-w-[560px] ${
            editVisible ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <nav className="flex gap-1 border-b border-ink-800 p-2">
            <TabButton active={tab === 'content'} onClick={() => setTab('content')} icon={<FileText size={14} />} label="Content" />
            <TabButton active={tab === 'design'} onClick={() => setTab('design')} icon={<Palette size={14} />} label="Design" />
            <TabButton active={tab === 'ai'} onClick={() => setTab('ai')} icon={<Target size={14} />} label="AI Match" />
          </nav>
          <div className="app-scroll flex-1 overflow-y-auto p-3 sm:p-4">
            {tab === 'content' && (
              <div className="flex flex-col gap-4">
                <PersonalForm />
                <SectionManager />
                <ExperienceForm />
                <ProjectsForm />
                <EducationForm />
                <SkillsForm />
                <CertificationsForm />
                <LanguagesForm />
              </div>
            )}
            {tab === 'design' && <DesignPanel />}
            {tab === 'ai' && <AIPanel />}
          </div>
        </div>

        <div
          ref={previewWrapRef}
          className={`app-scroll relative flex-1 overflow-auto bg-ink-900 p-3 sm:p-6 lg:p-10 ${
            editVisible ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="no-print sticky top-0 z-10 mb-3 flex items-center justify-end gap-1.5">
            <span className="mr-auto rounded-md bg-ink-800/80 px-2 py-1 text-xs text-ink-400">{Math.round(zoom * 100)}%</span>
            <button onClick={fitToWidth} title="Fit to screen" className="rounded-md bg-ink-800 p-2 text-ink-300 hover:text-white">
              <Maximize size={14} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.28, Math.round((z - 0.08) * 100) / 100))}
              title="Zoom out"
              className="rounded-md bg-ink-800 p-2 text-ink-300 hover:text-white"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(1.2, Math.round((z + 0.08) * 100) / 100))}
              title="Zoom in"
              className="rounded-md bg-ink-800 p-2 text-ink-300 hover:text-white"
            >
              <ZoomIn size={14} />
            </button>
          </div>
          <div style={{ zoom }}>
            <CvPreview ref={previewRef} cv={cv} />
          </div>
        </div>
      </div>

      <SamplePickerModal open={samplePickerOpen} onClose={() => setSamplePickerOpen(false)} />
      <ShareModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} cv={cv} />
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active ? 'bg-violet-500/15 text-violet-300' : 'text-ink-400 hover:text-ink-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
