import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../shared/lib/client";
import { storage } from "../../../shared/lib/storage";

export type Role = "client" | "freelancer";
export type BackendRole = "CLIENT" | "FREELANCER";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  phone?: string;
  profilePhotoUrl?: string;
  bio?: string;
}

export interface BackendLoginData {
  userId: string;
  name: string;
  role: BackendRole;
  accessToken: string;
}

export interface BackendRegisterData {
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  role: BackendRole;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<BackendLoginData>>("/auth/login", {
    email: payload.email,
    password: payload.password,
  });

  const resData = response.data?.data || (response.data as unknown as BackendLoginData);
  const normalizedRole = resData.role.toLowerCase() as Role;

  const authResponse: AuthResponse = {
    accessToken: resData.accessToken,
    user: {
      id: resData.userId,
      fullName: resData.name,
      email: payload.email,
      role: normalizedRole,
    },
  };

  storage.setAccessToken(authResponse.accessToken);
  storage.setRole(authResponse.user.role);
  storage.setUser({
    id: authResponse.user.id,
    name: authResponse.user.fullName,
    email: authResponse.user.email,
    role: authResponse.user.role,
  });

  return authResponse;
};

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const backendRole = payload.role.toUpperCase() as BackendRole;

  await apiClient.post<ApiResponse<BackendRegisterData>>("/auth/register", {
    name: payload.fullName,
    email: payload.email,
    password: payload.password,
    phone: payload.phone || undefined,
    role: backendRole,
  });

  return login({
    email: payload.email,
    password: payload.password,
  });
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>("/auth/forgot-password", { email });
  return response.data?.data || (response.data as unknown as { message: string });
};

export const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data?.data || (response.data as unknown as { message: string });
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<any>>("/users/me");
  const data = response.data?.data || response.data;
  return {
    id: data.id,
    fullName: data.name,
    email: data.email,
    role: (data.role?.toLowerCase() || "client") as Role,
    phone: data.phone,
    profilePhotoUrl: data.avatarUrl,
    bio: data.clientProfile?.description || data.freelancerProfile?.description,
  };
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: !!storage.getAccessToken(),
    staleTime: 1000 * 60 * 5,
  });
};

export const logout = (): void => {
  storage.clearAll();
};
