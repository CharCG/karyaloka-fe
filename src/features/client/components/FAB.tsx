import type { ButtonHTMLAttributes } from "react";
import { useNavigate } from "react-router";

interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string;
}

export default function FAB({ to = "/client/post-project", onClick, className = "", ...props }: FABProps) {
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
      aria-label="Post Project"
      className={`fixed bottom-28 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 hover:bg-primary/95 active:scale-95 transition-all z-20 cursor-pointer ${className}`}
      {...props}
    >
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  );
}
