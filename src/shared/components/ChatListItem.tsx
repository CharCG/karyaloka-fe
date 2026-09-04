export interface ChatParticipant {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface ChatListItemProps {
  participant: ChatParticipant;
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
  onClick?: () => void;
  className?: string;
}

export default function ChatListItem({
  participant,
  lastMessage = "",
  time = "",
  unreadCount = 0,
  onClick,
  className = "",
}: ChatListItemProps) {
  const initials = (participant.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={onClick}
      className={`w-full p-4 flex items-center gap-4 cursor-pointer active:bg-background-base/50 border-b border-border last:border-b-0 ${className}`.trim()}
    >
      <div className="relative shrink-0">
        {participant.avatarUrl ? (
          <img
            src={participant.avatarUrl}
            alt={participant.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-body font-semibold text-white">
            {initials}
          </div>
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-error text-white text-[11px] font-semibold flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-body font-semibold text-text-primary truncate">
            {participant.name}
          </h4>
          {time && <span className="text-caption text-text-tertiary shrink-0">{time}</span>}
        </div>
        <p className="text-body-sm text-text-secondary truncate">
          {lastMessage || "No messages yet"}
        </p>
      </div>
    </div>
  );
}
