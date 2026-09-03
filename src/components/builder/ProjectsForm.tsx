import { FolderGit2, Plus, Trash2 } from 'lucide-react';
import { useCvStore } from '../../store/useCvStore';
import { Input, TextArea } from '../ui/Field';
import { SectionCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { TagInput } from '../ui/TagInput';

export function ProjectsForm() {
  const { cv, addProject, updateProject, removeProject } = useCvStore();

  return (
    <SectionCard
      title="Projects"
      icon={<FolderGit2 size={16} />}
      action={
        <Button type="button" size="sm" onClick={addProject}>
          <Plus size={13} /> Add project
        </Button>
      }
    >
      {cv.projects.length === 0 && (
        <p className="rounded-lg border border-dashed border-ink-700 p-4 text-sm text-ink-400">
          Side projects, open source, or portfolio pieces worth showing off.
        </p>
      )}
      <div className="flex flex-col gap-3">
        {cv.projects.map((proj) => (
          <div key={proj.id} className="rounded-xl border border-ink-800 bg-ink-950/40 p-4">
            <div className="mb-2 flex items-start gap-2">
              <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                <Input placeholder="Project name" value={proj.name} onChange={(e) => updateProject(proj.id, { name: e.target.value })} />
                <Input placeholder="Link (optional)" value={proj.link} onChange={(e) => updateProject(proj.id, { link: e.target.value })} />
              </div>
              <button type="button" onClick={() => removeProject(proj.id)} className="mt-1 text-ink-400 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
            <TextArea
              rows={2}
              className="mb-2 w-full"
              placeholder="What it does and the impact/result"
              value={proj.description}
              onChange={(e) => updateProject(proj.id, { description: e.target.value })}
            />
            <TagInput tags={proj.tech} onChange={(tech) => updateProject(proj.id, { tech })} placeholder="Add tech used…" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
