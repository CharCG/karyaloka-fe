import { createBrowserRouter } from "react-router";

import SplashScreen from "../pages/SplashScreen";
import Onboarding from "../pages/Onboarding";

import Login from "../pages/auth/Login";
import RegisterClient from "../pages/auth/RegisterClient";
import RegisterFreelancer from "../pages/auth/RegisterFreelancer";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Home from "../pages/client/Home";
import Discover from "../pages/freelancer/Discover";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import GuestRoute from "./GuestRoute";

export const router = createBrowserRouter([
  { path: "/", element: <SplashScreen /> },
  { path: "/onboarding", element: <Onboarding /> },
  {
    path: "/auth",
    element: <GuestRoute />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register/client", element: <RegisterClient /> },
      { path: "register/freelancer", element: <RegisterFreelancer /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={["client"]} />,
        children: [{ path: "/client", element: <Home /> }],
      },
      {
        element: <RoleRoute allowedRoles={["freelancer"]} />,
        children: [{ path: "/freelancer", element: <Discover /> }],
      },
    ],
  },
]);
