import type { ButtonHTMLAttributes } from "react";
import { useNavigate } from "react-router";

import ArrowLeftIcon from "../../assets/icons/arrow-left.svg?react";

interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "surface";
  className?: string;
}

export default function BackButton({ variant = "primary", className = "", ...props }: BackButtonProps) {
  const navigate = useNavigate();

  const variantStyles = {
    primary: "bg-primary text-background-surface",
    surface: "bg-background-surface text-primary border border-border",
  };

  return (
    <button
      onClick={() => navigate(-1)}
      className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <ArrowLeftIcon className="w-6 h-6" />
    </button>
  );
}
