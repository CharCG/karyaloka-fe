import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import Skeleton from "react-loading-skeleton";
import { useGetMessages, useSendMessage, useMarkAsRead, useGetConversations } from "../api/conversation";
import { useGetCurrentUser } from "../../auth/api/auth";
import { storage } from "../../../shared/lib/storage";

import HeaderBar from "../../../shared/components/HeaderBar";
import ChatBox from "../../../shared/components/ChatBox";

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function ChatRoom() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: currentUser } = useGetCurrentUser();
  const currentUserId = currentUser?.id || storage.getUser()?.id;

  const { data, isLoading } = useGetMessages(conversationId || "");
  const { data: conversations } = useGetConversations();
  const sendMessageMutation = useSendMessage();
  const { mutate: markAsRead } = useMarkAsRead();

  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId);
    }
  }, [conversationId, markAsRead]);

  const messages = data?.messages ? [...data.messages].reverse() : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const conv = conversations?.find((c) => c.id === conversationId);
  const conversationPartner = conv
    ? conv.participantA?.id === currentUserId
      ? conv.participantB
      : conv.participantA
    : null;
  const otherParticipant = messages.find((m) => m.senderId !== currentUserId)?.sender || conversationPartner;
  const chatTitle = otherParticipant?.name || "Chat";

  const handleSend = async (content: string) => {
    if (!conversationId) return;
    await sendMessageMutation.mutateAsync({ conversationId, content });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-base">
      <HeaderBar title={chatTitle} showBack variant="surface" className="sticky top-0 z-10" />

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <div className="self-start max-w-[70%]">
              <Skeleton width={180} height={44} borderRadius={8} />
            </div>
            <div className="self-end max-w-[70%]">
              <Skeleton width={220} height={44} borderRadius={8} />
            </div>
            <div className="self-start max-w-[70%]">
              <Skeleton width={150} height={44} borderRadius={8} />
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-16">
            <div className="text-center flex flex-col gap-2">
              <p className="text-body font-semibold text-text-primary">No messages yet</p>
              <p className="text-body-sm text-text-secondary">Send a message to start the conversation.</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === currentUserId;

            return (
              <div
                key={message.id}
                className={`flex flex-col gap-1 max-w-[75%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
              >
                <div
                  className={`rounded-lg p-3 text-body-sm leading-relaxed break-words ${
                    isMe ? "bg-primary text-white" : "bg-background-surface border border-border text-text-primary"
                  }`}
                >
                  {message.content}
                </div>
                <span className="text-[11px] text-text-tertiary px-1">{formatTime(message.createdAt)}</span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatBox onSend={handleSend} isSending={sendMessageMutation.isPending} />
    </div>
  );
}
