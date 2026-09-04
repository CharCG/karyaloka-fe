import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  prefix?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isTextArea?: boolean;
  requiredMark?: boolean;
  rows?: number;
  containerClassName?: string;
  className?: string;
}

export default function Input({
  label,
  prefix,
  leftIcon,
  rightIcon,
  isTextArea = false,
  requiredMark,
  required,
  rows = 4,
  containerClassName = "",
  className = "",
  id,
  ...props
}: InputProps) {
  const isRequired = requiredMark ?? required;
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`flex flex-col gap-2 w-full ${containerClassName}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="text-body-sm font-semibold text-text-primary flex items-center gap-1">
          {label}
          {isRequired && <span className="text-error font-semibold">*</span>}
        </label>
      )}

      <div
        className={`relative flex items-center bg-background-surface border border-border rounded-lg focus-within:border-primary ${
          isTextArea ? "items-start" : ""
        }`}
      >
        {prefix && <span className="pl-4 text-body font-semibold text-text-secondary select-none">{prefix}</span>}

        {leftIcon && <span className="pl-4 text-text-secondary flex items-center justify-center">{leftIcon}</span>}

        {isTextArea ? (
          <textarea
            id={inputId}
            className={`w-full px-4 py-3 bg-transparent text-body text-text-primary placeholder:text-text-tertiary focus:outline-none resize-none rounded-lg ${className}`.trim()}
            rows={rows}
            {...(props as unknown as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={inputId}
            className={`w-full px-4 py-3 bg-transparent text-body text-text-primary placeholder:text-text-tertiary focus:outline-none rounded-lg ${
              prefix ? "pl-2" : ""
            } ${leftIcon ? "pl-2" : ""} ${rightIcon ? "pr-2" : ""} ${className}`.trim()}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {rightIcon && <span className="pr-4 text-text-tertiary flex items-center justify-center">{rightIcon}</span>}
      </div>
    </div>
  );
}
