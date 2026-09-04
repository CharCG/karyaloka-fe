import { Navigate, Outlet } from "react-router";
import type { Role } from "../features/auth/api/auth";
import { storage } from "../shared/lib/storage";

export interface RoleRouteProps {
  allowedRoles: Role[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const rawRole = storage.getRole();
  const role = (rawRole ? rawRole.toLowerCase() : null) as Role | null;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
