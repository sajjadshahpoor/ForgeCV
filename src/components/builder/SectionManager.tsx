import { ListOrdered, Eye, EyeOff } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useCvStore } from '../../store/useCvStore';
import type { SectionId } from '../../types';
import { SECTION_LABELS } from '../../types';
import { SectionCard } from '../ui/Card';
import { SortableItem, DragHandle } from '../ui/SortableItem';

export function SectionManager() {
  const { cv, setSectionOrder, toggleSectionVisibility } = useCvStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = cv.sectionOrder.indexOf(active.id as SectionId);
    const newIndex = cv.sectionOrder.indexOf(over.id as SectionId);
    setSectionOrder(arrayMove(cv.sectionOrder, oldIndex, newIndex));
  }

  return (
    <SectionCard title="Section order" icon={<ListOrdered size={16} />}>
      <p className="mb-3 text-xs text-ink-400">Drag to reorder how sections appear on your resume, or hide ones you don't need.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={cv.sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1.5">
            {cv.sectionOrder.map((id) => {
              const hidden = cv.hiddenSections.includes(id);
              return (
                <SortableItem key={id} id={id}>
                  {(handleProps) => (
                    <div
                      className={`flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-950/40 px-3 py-2 text-sm ${hidden ? 'opacity-50' : ''}`}
                    >
                      <DragHandle {...handleProps} />
                      <span className="flex-1 text-ink-100">{SECTION_LABELS[id]}</span>
                      <button
                        type="button"
                        onClick={() => toggleSectionVisibility(id)}
                        className="text-ink-400 hover:text-violet-400"
                        title={hidden ? 'Show section' : 'Hide section'}
                      >
                        {hidden ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  )}
                </SortableItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </SectionCard>
  );
}
