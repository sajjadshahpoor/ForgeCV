export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#0b0a14" />
        <path d="M9 8h14v4H13v5h9v4h-9v7H9V8Z" fill="url(#logo-g)" />
        <defs>
          <linearGradient id="logo-g" x1="9" y1="8" x2="23" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a78bfa" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-lg font-semibold tracking-tight text-ink-50">
        Forge<span className="text-violet-400">CV</span>
      </span>
    </div>
  );
}
