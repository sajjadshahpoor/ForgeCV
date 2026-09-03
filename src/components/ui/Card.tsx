import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-ink-800 bg-ink-900/60 backdrop-blur ${className}`}>{children}</div>
  );
}

export function SectionCard({
  title,
  icon,
  action,
  children,
  className = '',
}: {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-200">
          {icon}
          {title}
        </h3>
        {action}
      </div>
      {children}
    </Card>
  );
}
