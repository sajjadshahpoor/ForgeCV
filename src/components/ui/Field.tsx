import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface WrapperProps {
  label?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

function FieldWrapper({ label, hint, className = '', children }: WrapperProps) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-sm font-medium text-ink-200">{label}</span>}
      {children}
      {hint && <span className="text-xs text-ink-400">{hint}</span>}
    </label>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; wrapperClassName?: string };

export function Input({ label, hint, wrapperClassName, className = '', ...rest }: InputProps) {
  return (
    <FieldWrapper label={label} hint={hint} className={wrapperClassName}>
      <input
        className={`rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-50 placeholder:text-ink-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 ${className}`}
        {...rest}
      />
    </FieldWrapper>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string; wrapperClassName?: string };

export function TextArea({ label, hint, wrapperClassName, className = '', ...rest }: TextAreaProps) {
  return (
    <FieldWrapper label={label} hint={hint} className={wrapperClassName}>
      <textarea
        className={`rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-50 placeholder:text-ink-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 ${className}`}
        {...rest}
      />
    </FieldWrapper>
  );
}
