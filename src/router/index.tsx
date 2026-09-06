import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router";

import SplashScreen from "../features/onboarding/pages/SplashScreen";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import GuestRoute from "./GuestRoute";

import PageLoader from "./PageLoader";

const withSuspense = (node: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{node}</Suspense>
);

// Lazy feature routes
const Onboarding = lazy(() => import("../features/onboarding/pages/Onboarding"));
const TermsOfService = lazy(() => import("../features/onboarding/pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("../features/onboarding/pages/PrivacyPolicy"));

const Login = lazy(() => import("../features/auth/pages/Login"));
const RegisterClient = lazy(() => import("../features/auth/pages/RegisterClient"));
const RegisterFreelancer = lazy(() => import("../features/auth/pages/RegisterFreelancer"));
const ForgotPassword = lazy(() => import("../features/auth/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../features/auth/pages/ResetPassword"));

const ClientHome = lazy(() => import("../features/client/pages/Home"));
const PostProject = lazy(() => import("../features/client/pages/PostProject"));
const ClientProfile = lazy(() => import("../features/client/pages/Profile"));
const ClientEditProfile = lazy(() => import("../features/client/pages/EditProfile"));
const ClientProjects = lazy(() => import("../features/client/pages/Projects"));
const ClientProjectDetail = lazy(() => import("../features/client/pages/ProjectDetail"));
const ClientMessages = lazy(() => import("../features/client/pages/Messages"));
const ClientChatRoom = lazy(() => import("../features/client/pages/ChatRoom"));
const ClientCheckout = lazy(() => import("../features/client/pages/Checkout"));
const ClientPaymentSuccess = lazy(() => import("../features/client/pages/PaymentSuccess"));
const ClientCandidateProfile = lazy(() => import("../features/client/pages/CandidateProfile"));

const FreelancerDiscover = lazy(() => import("../features/freelancer/pages/Discover"));
const FreelancerProjects = lazy(() => import("../features/freelancer/pages/Projects"));
const FreelancerProjectDetail = lazy(() => import("../features/freelancer/pages/ProjectDetail"));
const FreelancerMessages = lazy(() => import("../features/freelancer/pages/Messages"));
const FreelancerProfile = lazy(() => import("../features/freelancer/pages/Profile"));
const FreelancerEditProfile = lazy(() => import("../features/freelancer/pages/EditProfile"));
const FreelancerWallet = lazy(() => import("../features/freelancer/pages/Wallet"));

export const router = createBrowserRouter([
  { path: "/", element: <SplashScreen /> },
  { path: "/onboarding", element: withSuspense(<Onboarding />) },
  { path: "/terms", element: withSuspense(<TermsOfService />) },
  { path: "/privacy", element: withSuspense(<PrivacyPolicy />) },
  {
    path: "/auth",
    element: <GuestRoute />,
    children: [
      { path: "login", element: withSuspense(<Login />) },
      { path: "register/client", element: withSuspense(<RegisterClient />) },
      { path: "register/freelancer", element: withSuspense(<RegisterFreelancer />) },
      { path: "forgot-password", element: withSuspense(<ForgotPassword />) },
      { path: "reset-password", element: withSuspense(<ResetPassword />) },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={["client"]} />,
        children: [
          { path: "/client", element: withSuspense(<ClientHome />) },
          { path: "/client/post-project", element: withSuspense(<PostProject />) },
          { path: "/client/projects", element: withSuspense(<ClientProjects />) },
          { path: "/client/projects/:projectId", element: withSuspense(<ClientProjectDetail />) },
          { path: "/client/projects/:projectId/candidate/:freelancerUserId", element: withSuspense(<ClientCandidateProfile />) },
          { path: "/client/projects/:projectId/checkout/:freelancerId", element: withSuspense(<ClientCheckout />) },
          { path: "/client/projects/:projectId/payment/success", element: withSuspense(<ClientPaymentSuccess />) },
          { path: "/client/payment/success", element: withSuspense(<ClientPaymentSuccess />) },
          { path: "/payment/success", element: withSuspense(<ClientPaymentSuccess />) },
          { path: "/client/messages", element: withSuspense(<ClientMessages />) },
          { path: "/client/messages/:conversationId", element: withSuspense(<ClientChatRoom />) },
          { path: "/client/profile", element: withSuspense(<ClientProfile />) },
          { path: "/client/profile/edit", element: withSuspense(<ClientEditProfile />) },
        ],
      },
      {
        element: <RoleRoute allowedRoles={["freelancer"]} />,
        children: [
          { path: "/freelancer", element: withSuspense(<FreelancerDiscover />) },
          { path: "/freelancer/projects", element: withSuspense(<FreelancerProjects />) },
          { path: "/freelancer/projects/:projectId", element: withSuspense(<FreelancerProjectDetail />) },
          { path: "/freelancer/messages", element: withSuspense(<FreelancerMessages />) },
          { path: "/freelancer/messages/:conversationId", element: withSuspense(<ClientChatRoom />) },
          { path: "/freelancer/profile", element: withSuspense(<FreelancerProfile />) },
          { path: "/freelancer/profile/edit", element: withSuspense(<FreelancerEditProfile />) },
          { path: "/freelancer/wallet", element: withSuspense(<FreelancerWallet />) },
        ],
      },
    ],
  },
]);
