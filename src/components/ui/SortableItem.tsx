import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortableItem({ id, children }: { id: string; children: (handleProps: object) => ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ ...attributes, ...listeners })}
    </div>
  );
}

export function DragHandle(props: object) {
  return (
    <button
      type="button"
      className="cursor-grab touch-none text-ink-400 hover:text-ink-100 active:cursor-grabbing"
      {...props}
    >
      <GripVertical size={16} />
    </button>
  );
}
