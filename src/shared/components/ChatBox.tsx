import { useState, type KeyboardEvent } from "react";
import PaperPlaneIcon from "../../assets/icons/paper-plane.svg?react";

export interface ChatBoxProps {
  onSend: (message: string) => void;
  isSending?: boolean;
  placeholder?: string;
  className?: string;
}

export default function ChatBox({
  onSend,
  isSending = false,
  placeholder = "Type a message...",
  className = "",
}: ChatBoxProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`w-full bg-background-surface border-t border-border p-4 flex items-center gap-2 ${className}`.trim()}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isSending}
        className="flex-1 bg-background-base rounded-lg px-4 py-3 text-body text-text-primary placeholder:text-text-tertiary focus:outline-none border border-border focus:border-primary"
      />

      <button
        type="button"
        onClick={handleSend}
        disabled={!text.trim() || isSending}
        className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:opacity-90"
      >
        <PaperPlaneIcon className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
