import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useNavigate } from "react-router";

import ArrowLeftIcon from "../../assets/icons/arrow-left.svg?react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "surface";
  icon?: ReactNode;
  className?: string;
}

export default function IconButton({
  variant = "primary",
  icon = <ArrowLeftIcon className="w-6 h-6" />,
  className = "",
  onClick,
  ...props
}: IconButtonProps) {
  const navigate = useNavigate();

  const variantStyles = {
    primary: "bg-primary text-background-surface",
    surface: "bg-background-surface text-primary border border-border",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
