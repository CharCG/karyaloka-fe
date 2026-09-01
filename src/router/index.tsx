import { createBrowserRouter } from "react-router";

import { SplashScreen, Onboarding, TermsOfService, PrivacyPolicy } from "../features/onboarding";
import { Login, RegisterClient, RegisterFreelancer, ForgotPassword, ResetPassword } from "../features/auth";
import { ClientHome, PostProject } from "../features/client";
import { FreelancerDiscover } from "../features/freelancer";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import GuestRoute from "./GuestRoute";

export const router = createBrowserRouter([
  { path: "/", element: <SplashScreen /> },
  { path: "/onboarding", element: <Onboarding /> },
  { path: "/terms", element: <TermsOfService /> },
  { path: "/privacy", element: <PrivacyPolicy /> },
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
        children: [
          { path: "/client", element: <ClientHome /> },
          { path: "/client/post-project", element: <PostProject /> },
        ],
      },
      {
        element: <RoleRoute allowedRoles={["freelancer"]} />,
        children: [{ path: "/freelancer", element: <FreelancerDiscover /> }],
      },
    ],
  },
]);
