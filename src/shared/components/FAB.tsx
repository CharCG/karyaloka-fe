import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { useNavigate } from "react-router";
import PlusIcon from "../../assets/icons/plus.svg?react";

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
  className?: string;
}

export default function FAB({ to, className = "", onClick, ...props }: FABProps) {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (to) {
      navigate(to);
    }
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-28 right-6 w-14 h-14 bg-primary text-background-surface rounded-full flex items-center justify-center cursor-pointer z-40 active:scale-95 ${className}`.trim()}
      {...props}
    >
      <PlusIcon className="w-6 h-6 text-white" />
    </button>
  );
}
