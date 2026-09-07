import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../shared/lib/client";

export interface ParticipantUser {
  id: string;
  fullName: string;
  profilePhotoUrl?: string | null;
}

export interface LastMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readStatus: "UNREAD" | "READ";
  createdAt: string;
}

export interface ConversationItemData {
  id: string;
  participantA: ParticipantUser;
  participantB: ParticipantUser;
  lastMessage: LastMessage | null;
  unreadCount: number;
  updatedAt: string;
}

export interface MessageItemData {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readStatus: "UNREAD" | "READ";
  createdAt: string;
  sender: ParticipantUser;
}

export interface MessagesResponse {
  messages: MessageItemData[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

const getConversations = async (filter?: string): Promise<ConversationItemData[]> => {
  const response = await apiClient.get<ApiResponse<ConversationItemData[]>>("/conversations", {
    params: filter ? { filter } : undefined,
  });
  return response.data?.data || (response.data as unknown as ConversationItemData[]);
};

const getMessages = async (conversationId: string, page = 1, limit = 50): Promise<MessagesResponse> => {
  const response = await apiClient.get<ApiResponse<MessagesResponse>>(`/conversations/${conversationId}/messages`, {
    params: { page, limit },
  });
  return response.data?.data || (response.data as unknown as MessagesResponse);
};

const sendMessage = async ({
  conversationId,
  content,
}: {
  conversationId: string;
  content: string;
}): Promise<MessageItemData> => {
  const response = await apiClient.post<ApiResponse<MessageItemData>>(`/conversations/${conversationId}/messages`, {
    content,
  });
  return response.data?.data || (response.data as unknown as MessageItemData);
};

const markAsRead = async (conversationId: string): Promise<{ markedAsRead: number }> => {
  const response = await apiClient.patch<ApiResponse<{ markedAsRead: number }>>(`/conversations/${conversationId}/read`);
  return response.data?.data || (response.data as unknown as { markedAsRead: number });
};

const getOrCreateConversation = async (participantId: string): Promise<ConversationItemData> => {
  const response = await apiClient.post<ApiResponse<ConversationItemData>>("/conversations", {
    participantId,
  });
  return response.data?.data || (response.data as unknown as ConversationItemData);
};

export const useGetConversations = (filter?: string) => {
  return useQuery({
    queryKey: ["conversations", filter],
    queryFn: () => getConversations(filter),
    refetchInterval: 5000,
  });
};

export const useGetMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: 3000,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useGetOrCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: getOrCreateConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
