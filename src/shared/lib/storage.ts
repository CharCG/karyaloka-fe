const ACCESS_TOKEN_KEY = "accessToken";
const ROLE_KEY = "userRole";

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
    return localStorage.getItem(ROLE_KEY);
  },

  setRole(role: string): void {
    localStorage.setItem(ROLE_KEY, role);
  },

  clearRole(): void {
    localStorage.removeItem(ROLE_KEY);
  },
};
