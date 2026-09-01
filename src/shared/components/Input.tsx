import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  prefix?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isTextArea?: boolean;
  requiredMark?: boolean;
  rows?: number;
}

export default function Input({
  label,
  error,
  prefix,
  leftIcon,
  rightIcon,
  isTextArea = false,
  requiredMark,
  required,
  rows = 4,
  className = "",
  id,
  ...props
}: InputProps) {
  const isRequired = requiredMark ?? required;
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-body-sm font-semibold text-text-primary flex items-center gap-1">
          {label}
          {isRequired && <span className="text-error font-bold">*</span>}
        </label>
      )}

      <div
        className={`relative flex items-center bg-background-surface border rounded-xl transition-colors ${
          error ? "border-error focus-within:border-error ring-1 ring-error/20" : "border-border focus-within:border-primary"
        } ${isTextArea ? "items-start" : ""}`}
      >
        {prefix && (
          <span className="pl-4 pr-1 text-body font-medium text-text-secondary select-none">
            {prefix}
          </span>
        )}

        {leftIcon && (
          <span className="pl-3.5 pr-1 text-text-tertiary flex items-center justify-center">
            {leftIcon}
          </span>
        )}

        {isTextArea ? (
          <textarea
            id={inputId}
            className={`w-full px-4 py-3 bg-transparent text-body text-text-primary placeholder:text-text-tertiary focus:outline-none resize-none rounded-xl ${className}`}
            rows={4}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={inputId}
            className={`w-full px-4 py-3 bg-transparent text-body text-text-primary placeholder:text-text-tertiary focus:outline-none rounded-xl ${
              prefix ? "pl-2" : ""
            } ${leftIcon ? "pl-2" : ""} ${rightIcon ? "pr-2" : ""} ${className}`}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {rightIcon && (
          <span className="pr-3.5 pl-1 text-text-tertiary flex items-center justify-center">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <span className="text-caption text-error font-medium">{error}</span>}
    </div>
  );
}

