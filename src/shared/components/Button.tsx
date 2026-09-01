import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, disabled, className = "", ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`w-full py-4 rounded-lg text-body font-semibold text-background-surface transition-colors ${
        disabled ? "bg-primary opacity-50 cursor-not-allowed" : "bg-primary"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
