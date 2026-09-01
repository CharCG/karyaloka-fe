import { useEffect } from "react";
import { useNavigate } from "react-router";
import { storage } from "../../../shared/lib/storage";

import Logo from "../../../assets/icons/logo.svg?react";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const isLoggedIn = storage.getAccessToken();
      const userRole = storage.getRole();

      if (isLoggedIn) {
        if (userRole === "client") {
          navigate("/client", { replace: true });
        } else if (userRole === "freelancer") {
          navigate("/freelancer", { replace: true });
        } else {
          navigate("/onboarding", { replace: true });
        }
      } else {
        navigate("/onboarding", { replace: true });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary">
      <Logo className="w-32" />
    </main>
  );
}
