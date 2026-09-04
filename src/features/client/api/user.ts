import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../shared/lib/client";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ClientProfileData {
  id: string;
  userId: string;
  description?: string | null;
}

export interface PortfolioItemData {
  id: string;
  description: string;
  externalUrl: string;
  imageUrl?: string | null;
  title?: string | null;
  projectUrl?: string | null;
  createdAt: string;
}

export interface FreelancerProfileData {
  id: string;
  userId: string;
  description?: string | null;
  skills: string[];
  rating: number;
  completedCount: number;
  totalEarning?: number;
  portfolioItems?: PortfolioItemData[];
  _count?: {
    assignedProjects?: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  avatarUrl?: string | null;
  createdAt: string;
  clientProfile?: ClientProfileData | null;
  freelancerProfile?: FreelancerProfileData | null;
}

export interface PublicUserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  avatarUrl?: string | null;
  freelancerProfile?: FreelancerProfileData | null;
  clientProfile?: ClientProfileData | null;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  description?: string;
  skills?: string[];
  avatarUrl?: string | null;
}

const getMe = async (): Promise<UserProfile> => {
  const response = await apiClient.get<ApiResponse<UserProfile>>("/users/me");
  return response.data?.data || (response.data as unknown as UserProfile);
};

const getPublicProfile = async (userId: string): Promise<PublicUserProfile> => {
  const response = await apiClient.get<ApiResponse<PublicUserProfile>>(`/users/${userId}/profile`);
  return response.data?.data || (response.data as unknown as PublicUserProfile);
};

const updateProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  const response = await apiClient.patch<ApiResponse<UserProfile>>("/users/me", payload);
  return response.data?.data || (response.data as unknown as UserProfile);
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: getMe,
  });
};

export const useGetPublicProfile = (userId: string) => {
  return useQuery({
    queryKey: ["user", "profile", userId],
    queryFn: () => getPublicProfile(userId),
    enabled: !!userId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      queryClient.invalidateQueries({ queryKey: ["client", "dashboard"] });
    },
  });
};
