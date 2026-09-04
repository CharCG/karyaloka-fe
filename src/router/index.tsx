import { createBrowserRouter } from "react-router";

import { SplashScreen, Onboarding, TermsOfService, PrivacyPolicy } from "../features/onboarding";
import { Login, RegisterClient, RegisterFreelancer, ForgotPassword, ResetPassword } from "../features/auth";
import {
  ClientHome,
  PostProject,
  ClientProfile,
  ClientEditProfile,
  ClientProjects,
  ClientProjectDetail,
  ClientMessages,
  ClientChatRoom,
  ClientCheckout,
  ClientPaymentSuccess,
  ClientCandidateProfile,
} from "../features/client";
import {
  FreelancerDiscover,
  FreelancerProjects,
  FreelancerProjectDetail,
  FreelancerMessages,
  FreelancerProfile,
  FreelancerEditProfile,
  FreelancerWallet,
} from "../features/freelancer";

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
          { path: "/client/projects", element: <ClientProjects /> },
          { path: "/client/projects/:projectId", element: <ClientProjectDetail /> },
          { path: "/client/projects/:projectId/candidate/:freelancerUserId", element: <ClientCandidateProfile /> },
          { path: "/client/projects/:projectId/checkout/:freelancerId", element: <ClientCheckout /> },
          { path: "/client/projects/:projectId/payment/success", element: <ClientPaymentSuccess /> },
          { path: "/client/payment/success", element: <ClientPaymentSuccess /> },
          { path: "/payment/success", element: <ClientPaymentSuccess /> },
          { path: "/client/messages", element: <ClientMessages /> },
          { path: "/client/messages/:conversationId", element: <ClientChatRoom /> },
          { path: "/client/profile", element: <ClientProfile /> },
          { path: "/client/profile/edit", element: <ClientEditProfile /> },
        ],
      },
      {
        element: <RoleRoute allowedRoles={["freelancer"]} />,
        children: [
          { path: "/freelancer", element: <FreelancerDiscover /> },
          { path: "/freelancer/projects", element: <FreelancerProjects /> },
          { path: "/freelancer/projects/:projectId", element: <FreelancerProjectDetail /> },
          { path: "/freelancer/messages", element: <FreelancerMessages /> },
          { path: "/freelancer/messages/:conversationId", element: <ClientChatRoom /> },
          { path: "/freelancer/profile", element: <FreelancerProfile /> },
          { path: "/freelancer/profile/edit", element: <FreelancerEditProfile /> },
          { path: "/freelancer/wallet", element: <FreelancerWallet /> },
        ],
      },
    ],
  },
]);
