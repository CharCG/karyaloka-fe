import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../shared/lib/client";
import { storage } from "../../../shared/lib/storage";

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
  totalSpent?: number | string;
  activeJobsCount?: number;
  completedJobsCount?: number;
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
  completedJobsCount?: number;
  activeJobsCount?: number;
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
  description?: string | null;
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
  description?: string | null;
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
  const response = await apiClient.get<ApiResponse<any>>("/users/me");
  const raw = response.data?.data || response.data;
  if (!raw) return raw;

  return {
    ...raw,
    description: raw.description || raw.clientProfile?.description || raw.freelancerProfile?.description || null,
  };
};

const getPublicProfile = async (userId: string): Promise<PublicUserProfile> => {
  const response = await apiClient.get<ApiResponse<any>>(`/users/${userId}/profile`);
  const raw = response.data?.data || response.data;
  if (!raw) return raw;

  return {
    ...raw,
    description: raw.description || raw.clientProfile?.description || raw.freelancerProfile?.description || null,
  };
};

const updateProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  const response = await apiClient.patch<ApiResponse<any>>("/users/me", payload);
  const raw = response.data?.data || response.data;

  const resolvedName = raw?.name || payload.name || "";
  
  const stored = storage.getUser();
  if (stored && resolvedName) {
    storage.setUser({
      ...stored,
      name: resolvedName,
    });
  }

  return {
    ...raw,
    description: raw?.description || payload.description || raw?.clientProfile?.description || raw?.freelancerProfile?.description || null,
  };
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
