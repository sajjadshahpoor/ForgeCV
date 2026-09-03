import { useState } from 'react';
import { X } from 'lucide-react';

export function TagInput({
  tags,
  onChange,
  placeholder = 'Type and press Enter…',
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  function commit() {
    const value = draft.trim();
    if (value && !tags.includes(value)) onChange([...tags, value]);
    setDraft('');
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-900 p-2 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/30">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-md bg-ink-700 px-2 py-1 text-xs text-ink-100"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="text-ink-400 hover:text-red-400"
            aria-label={`Remove ${tag}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Backspace' && !draft && tags.length) {
            onChange(tags.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="min-w-[100px] flex-1 bg-transparent text-sm text-ink-50 outline-none placeholder:text-ink-400"
      />
    </div>
  );
}
