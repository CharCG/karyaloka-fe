import { Navigate, Outlet } from "react-router";
import type { Role } from "../api/auth";
import { storage } from "../lib/storage";

interface RoleRouteProps {
  allowedRoles: Role[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const role = storage.getRole() as Role | null;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
