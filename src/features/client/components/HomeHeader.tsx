import type { ReactNode } from "react";

interface HomeHeaderProps {
  name?: string;
  children?: ReactNode;
}

export default function HomeHeader({
  name = "Sarah",
  children,
}: HomeHeaderProps) {
  return (
    <div className="w-full bg-primary rounded-b-[32px] pt-12 pb-16 px-6 text-white relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold tracking-tight text-white flex items-center gap-1.5">
            Hi, {name}! <span>👋</span>
          </h1>
        </div>
      </div>

      {children}
    </div>
  );
}
