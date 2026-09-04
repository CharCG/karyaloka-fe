import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "danger" | "danger-outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

export default function Button({ children, variant = "primary", disabled, className = "", ...props }: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary text-background-surface",
    outline: "bg-background-surface border border-border text-text-primary",
    danger: "bg-error text-background-surface",
    "danger-outline": "bg-background-surface border border-error text-error",
  };

  return (
    <button
      disabled={disabled}
      className={`w-full py-4 rounded-lg text-body font-semibold ${
        variantStyles[variant]
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:opacity-90"} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
