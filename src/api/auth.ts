import { apiClient } from "./client";

export type Role = "client" | "freelancer";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  phone?: string;
  profilePhotoUrl?: string;
  bio?: string;
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
  data: T;
  meta: unknown;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload);
  return response.data.data;
};

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", payload);
  return response.data.data;
};

export const forgotPassword = async (email: string): Promise<void> => {
  await apiClient.post("/auth/forgot-password", { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await apiClient.post("/auth/reset-password", { token, newPassword });
};
