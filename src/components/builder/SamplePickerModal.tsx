import { useCvStore } from '../../store/useCvStore';
import { SAMPLE_PROFILES } from '../../data/sampleData';
import { Modal } from '../ui/Modal';

export function SamplePickerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cv, loadSampleById } = useCvStore();
  const hasContent = Boolean(cv.personal.fullName.trim()) || cv.experience.length > 0;

  function pick(id: string) {
    if (hasContent && !confirm('This replaces what you have with the sample resume. Continue?')) return;
    loadSampleById(id);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Choose a sample resume" maxWidthClass="max-w-2xl">
      <p className="mb-4 text-sm text-ink-400">
        Start from a resume that's closest to your field, then swap in your own details.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SAMPLE_PROFILES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => pick(p.id)}
            className="group flex flex-col items-start gap-2 rounded-xl border border-ink-800 bg-ink-950/40 p-4 text-left transition hover:border-violet-500/50 hover:bg-ink-800/60"
          >
            <div className="flex w-full items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: p.data.accentColor }} />
              <span className="font-medium text-ink-50">{p.label}</span>
            </div>
            <p className="text-xs text-ink-400">{p.blurb}</p>
            <span className="mt-1 text-[10px] uppercase tracking-wide text-ink-500 group-hover:text-violet-400">
              {p.data.template} template
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
