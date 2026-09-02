import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useNavigate } from "react-router";

import PlusIcon from "../../../assets/icons/plus.svg?react";

interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  icon?: ReactNode;
}

export default function FAB({
  to,
  onClick,
  className = "",
  icon = <PlusIcon className="w-8 h-8 text-background-surface" />,
  ...props
}: FABProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`fixed bottom-36 right-5 w-16 h-16 bg-primary text-background-surface rounded-full flex items-center justify-center cursor-pointer ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
