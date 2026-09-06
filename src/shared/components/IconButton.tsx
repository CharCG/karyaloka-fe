import type { ButtonHTMLAttributes, ReactNode, MouseEvent } from "react";
import { useNavigate } from "react-router";

import ArrowLeftIcon from "../../assets/icons/arrow-left.svg?react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "surface";
  icon?: ReactNode;
  className?: string;
}

export default function IconButton({
  variant = "primary",
  icon = <ArrowLeftIcon className="w-6 h-6" />,
  className = "",
  onClick,
  type = "button",
  "aria-label": ariaLabel = "Go back",
  ...props
}: IconButtonProps) {
  const navigate = useNavigate();

  const variantStyles = {
    primary: "bg-primary text-background-surface",
    surface: "bg-background-surface text-primary border border-border",
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer active:opacity-80 ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {icon}
    </button>
  );
}
