import { Wrench, Plus, Trash2 } from 'lucide-react';
import { useCvStore } from '../../store/useCvStore';
import { Input } from '../ui/Field';
import { SectionCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { TagInput } from '../ui/TagInput';

export function SkillsForm() {
  const { cv, addSkillGroup, updateSkillGroup, removeSkillGroup } = useCvStore();

  return (
    <SectionCard
      title="Skills"
      icon={<Wrench size={16} />}
      action={
        <Button type="button" size="sm" onClick={addSkillGroup}>
          <Plus size={13} /> Add group
        </Button>
      }
    >
      {cv.skills.length === 0 && (
        <p className="rounded-lg border border-dashed border-ink-700 p-4 text-sm text-ink-400">
          Group your skills, e.g. "Languages", "Frameworks", "Tools".
        </p>
      )}
      <div className="flex flex-col gap-3">
        {cv.skills.map((group) => (
          <div key={group.id} className="rounded-xl border border-ink-800 bg-ink-950/40 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Input
                className="flex-1"
                placeholder="Category (e.g. Frameworks)"
                value={group.category}
                onChange={(e) => updateSkillGroup(group.id, { category: e.target.value })}
              />
              <button type="button" onClick={() => removeSkillGroup(group.id)} className="text-ink-400 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
            <TagInput tags={group.items} onChange={(items) => updateSkillGroup(group.id, { items })} placeholder="Add a skill…" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
