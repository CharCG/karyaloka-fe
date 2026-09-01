import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-body-sm font-semibold text-text-primary">{label}</label>
      <input
        className={`px-4 py-3 bg-background-surface border border-border rounded-lg text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
