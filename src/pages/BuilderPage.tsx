import { useRef, useState } from 'react';
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
import { exportCvAsJson, importCvFromFile } from '../lib/storage';

type Tab = 'content' | 'design' | 'ai';

export function BuilderPage({ onBack }: { onBack: () => void }) {
  const { cv, setCv, resetCv, loadSample } = useCvStore();
  const [tab, setTab] = useState<Tab>('content');
  const [zoom, setZoom] = useState(0.72);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: cv.personal.fullName ? `${cv.personal.fullName} - Resume` : 'Resume',
  });

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

  return (
    <div className="flex h-dvh flex-col bg-ink-950">
      <header className="no-print flex items-center justify-between border-b border-ink-800 px-5 py-3">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-ink-400 hover:text-ink-100" title="Back to home">
            <ArrowLeft size={18} />
          </button>
          <Logo size={24} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="ghost" onClick={loadSample}>
            <Wand2 size={13} /> Load sample
          </Button>
          <Button size="sm" variant="ghost" onClick={() => fileRef.current?.click()}>
            <Upload size={13} /> Import
          </Button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={onImport} />
          <Button size="sm" variant="ghost" onClick={() => exportCvAsJson(cv)}>
            <FileJson size={13} /> Export JSON
          </Button>
          <Button size="sm" variant="ghost" onClick={onReset}>
            <RotateCcw size={13} /> Reset
          </Button>
          <Button size="sm" variant="primary" onClick={() => handlePrint()}>
            <Download size={13} /> Export PDF
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="no-print flex w-full max-w-[560px] flex-col border-r border-ink-800">
          <nav className="flex gap-1 border-b border-ink-800 p-2">
            <TabButton active={tab === 'content'} onClick={() => setTab('content')} icon={<FileText size={14} />} label="Content" />
            <TabButton active={tab === 'design'} onClick={() => setTab('design')} icon={<Palette size={14} />} label="Design" />
            <TabButton active={tab === 'ai'} onClick={() => setTab('ai')} icon={<Target size={14} />} label="AI Match" />
          </nav>
          <div className="app-scroll flex-1 overflow-y-auto p-4">
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

        <div className="app-scroll relative flex-1 overflow-auto bg-ink-900 p-10">
          <div className="no-print sticky top-0 z-10 mb-4 flex justify-end gap-1">
            <button onClick={() => setZoom((z) => Math.max(0.4, z - 0.08))} className="rounded-md bg-ink-800 p-1.5 text-ink-300 hover:text-white">
              <ZoomOut size={14} />
            </button>
            <button onClick={() => setZoom((z) => Math.min(1, z + 0.08))} className="rounded-md bg-ink-800 p-1.5 text-ink-300 hover:text-white">
              <ZoomIn size={14} />
            </button>
          </div>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}>
            <CvPreview ref={previewRef} cv={cv} />
          </div>
        </div>
      </div>
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
