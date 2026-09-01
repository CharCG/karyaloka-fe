import { useEffect } from "react";
import { useNavigate } from "react-router";
import { storage } from "../lib/storage";

import Logo from "../assets/icons/logo.svg";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const isFirstTime = !storage.hasCompletedOnboarding();
      const isLoggedIn = storage.getAccessToken();
      const userRole = storage.getRole();

      if (isFirstTime) {
        navigate("/onboarding", { replace: true });
      } else if (isLoggedIn) {
        if (userRole === "client") {
          navigate("/client", { replace: true });
        } else if (userRole === "freelancer") {
          navigate("/freelancer", { replace: true });
        } else {
          // Fallback if token exists but no role is found
          navigate("/auth/login", { replace: true });
        }
      } else {
        navigate("/auth/login", { replace: true });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary">
      <img src={Logo} alt="Logo" className="w-32" />
    </main>
  );
}
