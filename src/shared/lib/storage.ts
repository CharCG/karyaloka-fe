const ACCESS_TOKEN_KEY = "accessToken";
const ROLE_KEY = "userRole";
const USER_KEY = "userData";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const storage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clearAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  getRole(): string | null {
    const role = localStorage.getItem(ROLE_KEY);
    return role ? role.toLowerCase() : null;
  },

  setRole(role: string): void {
    localStorage.setItem(ROLE_KEY, role.toLowerCase());
  },

  clearRole(): void {
    localStorage.removeItem(ROLE_KEY);
  },

  getUser(): StoredUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  },

  setUser(user: StoredUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  clearAll(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
