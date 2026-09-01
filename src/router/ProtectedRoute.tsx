import { Navigate, Outlet, useLocation } from "react-router";
import { storage } from "../shared/lib/storage";

export default function ProtectedRoute() {
  const location = useLocation();
  const token = storage.getAccessToken();

  if (!token) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
