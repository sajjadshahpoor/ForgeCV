import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { useCvStore } from '../../store/useCvStore';
import { Input, TextArea } from '../ui/Field';
import { SectionCard } from '../ui/Card';
import { Button } from '../ui/Button';

export function EducationForm() {
  const { cv, addEducation, updateEducation, removeEducation } = useCvStore();

  return (
    <SectionCard
      title="Education"
      icon={<GraduationCap size={16} />}
      action={
        <Button type="button" size="sm" onClick={addEducation}>
          <Plus size={13} /> Add school
        </Button>
      }
    >
      {cv.education.length === 0 && (
        <p className="rounded-lg border border-dashed border-ink-700 p-4 text-sm text-ink-400">
          Add your degrees, bootcamps, or relevant coursework.
        </p>
      )}
      <div className="flex flex-col gap-3">
        {cv.education.map((ed) => (
          <div key={ed.id} className="rounded-xl border border-ink-800 bg-ink-950/40 p-4">
            <div className="mb-2 flex items-start gap-2">
              <div className="grid flex-1 grid-cols-2 gap-2">
                <Input placeholder="School" value={ed.school} onChange={(e) => updateEducation(ed.id, { school: e.target.value })} />
                <Input placeholder="Degree (e.g. B.S.)" value={ed.degree} onChange={(e) => updateEducation(ed.id, { degree: e.target.value })} />
                <Input placeholder="Field of study" value={ed.field} onChange={(e) => updateEducation(ed.id, { field: e.target.value })} />
                <Input placeholder="Location" value={ed.location} onChange={(e) => updateEducation(ed.id, { location: e.target.value })} />
                <Input type="month" value={ed.startDate} onChange={(e) => updateEducation(ed.id, { startDate: e.target.value })} />
                <Input type="month" value={ed.endDate} onChange={(e) => updateEducation(ed.id, { endDate: e.target.value })} />
              </div>
              <button type="button" onClick={() => removeEducation(ed.id)} className="mt-1 text-ink-400 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
            <TextArea
              rows={2}
              placeholder="Honors, GPA, relevant coursework…"
              value={ed.details}
              onChange={(e) => updateEducation(ed.id, { details: e.target.value })}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
