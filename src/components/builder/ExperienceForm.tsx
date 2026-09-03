import { useState } from 'react';
import { Briefcase, Plus, Trash2, Sparkles, AlertCircle, Wand2 } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCvStore } from '../../store/useCvStore';
import type { ExperienceItem } from '../../types';
import { Input, TextArea } from '../ui/Field';
import { SectionCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { SortableItem, DragHandle } from '../ui/SortableItem';
import { critiqueBullets } from '../../lib/ats';
import { hasApiKey, rewriteBullet } from '../../lib/gemini';

function BulletRow({ exp, index, bullet }: { exp: ExperienceItem; index: number; bullet: string }) {
  const { updateBullet, removeBullet } = useCvStore();
  const [rewriting, setRewriting] = useState(false);
  const issues = critiqueBullets(exp.bullets).filter((s) => s.bulletIndex === index);
  const issue = issues[0];

  async function onRewrite() {
    setRewriting(true);
    try {
      const improved = await rewriteBullet(bullet, exp.role, '');
      updateBullet(exp.id, index, improved);
    } catch {
      // silent - key issues surface in the AI panel
    } finally {
      setRewriting(false);
    }
  }

  return (
    <div className="group flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink-400" />
        <textarea
          value={bullet}
          onChange={(e) => updateBullet(exp.id, index, e.target.value)}
          rows={2}
          placeholder="Led the redesign of the checkout flow, increasing conversion by 14%"
          className="flex-1 resize-none rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 text-sm text-ink-50 outline-none placeholder:text-ink-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
        />
        <div className="flex shrink-0 flex-col gap-1 pt-0.5">
          {hasApiKey() && (
            <button
              type="button"
              title="Rewrite with AI"
              onClick={onRewrite}
              disabled={rewriting}
              className="text-ink-400 hover:text-violet-400 disabled:opacity-50"
            >
              <Wand2 size={14} className={rewriting ? 'animate-pulse' : ''} />
            </button>
          )}
          <button
            type="button"
            title="Remove bullet"
            onClick={() => removeBullet(exp.id, index)}
            className="text-ink-400 hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {issue && (
        <div className="ml-3 flex items-start gap-1.5 text-xs text-amber-400/90">
          <AlertCircle size={12} className="mt-0.5 shrink-0" />
          <span>
            {issue.message}
            {issue.replacements && (
              <>
                {' '}
                Try:{' '}
                {issue.replacements.map((r, i) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => updateBullet(exp.id, index, bullet.replace(/^\S+(\s+\S+)?/, r))}
                    className="mx-0.5 underline decoration-dotted underline-offset-2 hover:text-amber-300"
                  >
                    {r}
                    {i < issue.replacements!.length - 1 ? ',' : ''}
                  </button>
                ))}
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

function ExperienceEntry({ exp, handleProps }: { exp: ExperienceItem; handleProps: object }) {
  const { updateExperience, removeExperience, addBullet } = useCvStore();

  return (
    <div className="rounded-xl border border-ink-800 bg-ink-950/40 p-4">
      <div className="mb-3 flex items-start gap-2">
        <DragHandle {...handleProps} />
        <div className="grid flex-1 grid-cols-2 gap-2">
          <Input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
          <Input placeholder="Role / title" value={exp.role} onChange={(e) => updateExperience(exp.id, { role: e.target.value })} />
          <Input placeholder="Location" value={exp.location} onChange={(e) => updateExperience(exp.id, { location: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <Input type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} />
            <Input
              type="month"
              value={exp.endDate}
              disabled={exp.current}
              onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
            />
          </div>
        </div>
        <button type="button" onClick={() => removeExperience(exp.id)} className="mt-1 text-ink-400 hover:text-red-400">
          <Trash2 size={16} />
        </button>
      </div>

      <label className="mb-3 flex items-center gap-2 text-xs text-ink-300">
        <input
          type="checkbox"
          checked={exp.current}
          onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
          className="accent-violet-500"
        />
        I currently work here
      </label>

      <div className="flex flex-col gap-2">
        {exp.bullets.map((b, i) => (
          <BulletRow key={i} exp={exp} index={i} bullet={b} />
        ))}
      </div>

      <Button type="button" size="sm" variant="ghost" className="mt-2" onClick={() => addBullet(exp.id)}>
        <Plus size={13} /> Add bullet
      </Button>
    </div>
  );
}

export function ExperienceForm() {
  const { cv, addExperience, reorderExperience } = useCvStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) reorderExperience(String(active.id), String(over.id));
  }

  return (
    <SectionCard
      title="Experience"
      icon={<Briefcase size={16} />}
      action={
        <Button type="button" size="sm" onClick={addExperience}>
          <Plus size={13} /> Add role
        </Button>
      }
    >
      {cv.experience.length === 0 ? (
        <EmptyHint />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={cv.experience.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {cv.experience.map((exp) => (
                <SortableItem key={exp.id} id={exp.id}>
                  {(handleProps) => <ExperienceEntry exp={exp} handleProps={handleProps} />}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </SectionCard>
  );
}

function EmptyHint() {
  return (
    <p className="flex items-center gap-2 rounded-lg border border-dashed border-ink-700 p-4 text-sm text-ink-400">
      <Sparkles size={14} /> Add your work history — the AI Match tab will help you tailor each bullet to a job description.
    </p>
  );
}
