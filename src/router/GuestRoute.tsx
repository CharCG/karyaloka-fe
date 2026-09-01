import { Navigate, Outlet } from "react-router";
import { storage } from "../shared/lib/storage";

export default function GuestRoute() {
  const token = storage.getAccessToken();
  const role = storage.getRole();

  if (token) {
    if (role === "client") {
      return <Navigate to="/client" replace />;
    } else if (role === "freelancer") {
      return <Navigate to="/freelancer" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
