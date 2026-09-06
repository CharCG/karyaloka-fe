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
      fullName: userObj.fullName || raw.name || "",
      email: userObj.email || payload.email,
      role: normalizedRole,
      phone: userObj.phone,
      profilePhotoUrl: userObj.profilePhotoUrl || userObj.avatarUrl,
      bio: userObj.bio,
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
  const role = payload.role.toLowerCase() as Role;

  const response = await apiClient.post<any>("/auth/register", {
    fullName: payload.fullName,
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
        fullName: userObj.fullName || payload.fullName,
        email: userObj.email || payload.email,
        role: normalizedRole,
        phone: userObj.phone || payload.phone,
        profilePhotoUrl: userObj.profilePhotoUrl,
        bio: userObj.bio,
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
  const response = await apiClient.get<ApiResponse<any>>("/auth/me");
  const data = response.data?.data || response.data;
  return {
    id: data.id,
    fullName: data.fullName || data.name || "",
    email: data.email,
    role: (data.role?.toLowerCase() || "client") as Role,
    phone: data.phone,
    profilePhotoUrl: data.profilePhotoUrl || data.avatarUrl,
    bio: data.bio || data.clientProfile?.description || data.freelancerProfile?.description,
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
