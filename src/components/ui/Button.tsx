import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/25 hover:brightness-110',
  secondary: 'bg-ink-800 text-ink-100 border border-ink-700 hover:bg-ink-700',
  ghost: 'text-ink-200 hover:bg-ink-800',
  danger: 'text-red-400 hover:bg-red-500/10',
};

const sizes: Record<Size, string> = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = 'secondary', size = 'md', className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  );
}
