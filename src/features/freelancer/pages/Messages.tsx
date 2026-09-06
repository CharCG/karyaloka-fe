import { useState } from "react";
import { useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import { useGetConversations } from "../../client/api/conversation";
import { useGetCurrentUser } from "../../auth/api/auth";
import { storage } from "../../../shared/lib/storage";

import BottomNav from "../../../shared/components/BottomNav";
import HeaderBar from "../../../shared/components/HeaderBar";
import ChatListItem from "../../../shared/components/ChatListItem";
import Input from "../../../shared/components/Input";

import SearchIcon from "../../../assets/icons/magnifying-glass.svg?react";

type MessageTab = "all" | "unread";

const tabs: { key: MessageTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
];

function formatMessageTime(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function Messages() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MessageTab>("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: currentUser } = useGetCurrentUser();
  const currentUserId = currentUser?.id || storage.getUser()?.id;

  const filterParam = activeTab === "unread" ? "unread" : undefined;
  const { data: conversations, isLoading } = useGetConversations(filterParam);

  const filteredConversations =
    conversations?.filter((conv) => {
      const other = conv.participantA.id === currentUserId ? conv.participantB : conv.participantA;
      return (other.name || "").toLowerCase().includes(searchQuery.trim().toLowerCase());
    }) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background-base pb-32">
      <HeaderBar
        title="Messages"
        variant="surface"
        className="border-b-0"
        actionIcon={<SearchIcon className="w-8 h-8 text-primary" />}
        actionAriaLabel="Search conversations"
        onActionClick={() => setIsSearchOpen((prev) => !prev)}
      />

      {isSearchOpen && (
        <div className="px-5 pb-2 bg-background-surface border-b-0">
          <Input
            placeholder="Search conversations..."
            aria-label="Search conversations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
      )}

      <div className="w-full bg-background-surface border-b border-border flex items-center justify-around px-5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative py-4 px-6 text-body font-medium cursor-pointer text-center ${
                isActive ? "text-primary" : "text-text-secondary"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
            </button>
          );
        })}
      </div>

      <div className="px-5 py-5 flex flex-col gap-4">
        {isLoading ? (
          <div className="bg-background-surface rounded-lg border border-border p-4 flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton circle width={48} height={48} />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton width={120} height={16} borderRadius={4} />
                  <Skeleton width={200} height={14} borderRadius={4} />
                </div>
                <Skeleton width={50} height={12} borderRadius={4} />
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="bg-background-surface rounded-lg p-8 border border-border text-center flex flex-col items-center justify-center gap-2 mt-4">
            <p className="text-body font-semibold text-text-primary">No messages found</p>
            <p className="text-body-sm text-text-secondary">
              {searchQuery
                ? "No conversations match your search."
                : activeTab === "unread"
                ? "You don't have any unread messages."
                : "You don't have any conversations yet."}
            </p>
          </div>
        ) : (
          <div className="bg-background-surface rounded-lg border border-border overflow-hidden">
            {filteredConversations.map((conv) => {
              const other = conv.participantA.id === currentUserId ? conv.participantB : conv.participantA;
              const lastContent = conv.lastMessage?.content || "";
              const time = formatMessageTime(conv.lastMessage?.createdAt || conv.updatedAt);

              return (
                <ChatListItem
                  key={conv.id}
                  participant={other}
                  lastMessage={lastContent}
                  time={time}
                  unreadCount={conv.unreadCount}
                  onClick={() => navigate(`/freelancer/messages/${conv.id}`)}
                />
              );
            })}
          </div>
        )}
      </div>

      <BottomNav role="freelancer" />
    </div>
  );
}
