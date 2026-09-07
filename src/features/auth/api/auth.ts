import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../shared/lib/client";
import { storage } from "../../../shared/lib/storage";

export type Role = "client" | "freelancer";
export type BackendRole = "CLIENT" | "FREELANCER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
  description?: string;
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
  name: string;
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
  const response = await apiClient.post<any>("/auth/login", {
    email: payload.email,
    password: payload.password,
  });

  const raw = response.data?.data || response.data;
  const accessToken = raw.accessToken;
  const userObj = raw.user || raw;

  const roleRaw = userObj.role || raw.role || "client";
  const normalizedRole = String(roleRaw).toLowerCase() as Role;

  const authResponse: AuthResponse = {
    accessToken,
    user: {
      id: userObj.id || raw.userId || "",
      name: userObj.name || "",
      email: userObj.email || payload.email,
      role: normalizedRole,
      phone: userObj.phone,
      avatarUrl: userObj.avatarUrl,
      description: userObj.description,
    },
  };

  storage.setAccessToken(authResponse.accessToken);
  storage.setRole(authResponse.user.role);
  storage.setUser({
    id: authResponse.user.id,
    name: authResponse.user.name,
    email: authResponse.user.email,
    role: authResponse.user.role,
  });

  return authResponse;
};

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const role = payload.role.toLowerCase() as Role;

  const response = await apiClient.post<any>("/auth/register", {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role,
    phone: payload.phone || undefined,
  });

  const raw = response.data?.data || response.data;
  if (raw && raw.accessToken) {
    const accessToken = raw.accessToken;
    const userObj = raw.user || raw;
    const roleRaw = userObj.role || role;
    const normalizedRole = String(roleRaw).toLowerCase() as Role;

    const authResponse: AuthResponse = {
      accessToken,
      user: {
        id: userObj.id || "",
        name: userObj.name || payload.name,
        email: userObj.email || payload.email,
        role: normalizedRole,
        phone: userObj.phone || payload.phone,
        avatarUrl: userObj.avatarUrl,
        description: userObj.description,
      },
    };

    storage.setAccessToken(authResponse.accessToken);
    storage.setRole(authResponse.user.role);
    storage.setUser({
      id: authResponse.user.id,
      name: authResponse.user.name,
      email: authResponse.user.email,
      role: authResponse.user.role,
    });

    return authResponse;
  }

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
    name: data.name || "",
    email: data.email,
    role: (data.role?.toLowerCase() || "client") as Role,
    phone: data.phone,
    avatarUrl: data.avatarUrl,
    description: data.description || data.clientProfile?.description || data.freelancerProfile?.description,
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
