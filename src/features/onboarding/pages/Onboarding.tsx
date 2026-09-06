import { useState } from "react";
import { useNavigate, Link } from "react-router";

import RoleCard from "../components/RoleCard";
import Button from "../../../shared/components/Button";
import BackButton from "../../../shared/components/IconButton";

import Client from "../../../assets/images/client.png";
import Freelancer from "../../../assets/images/freelancer.png";

export default function Onboarding() {
  const [selectedRole, setSelectedRole] = useState<"client" | "freelancer" | null>(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (!selectedRole) return;
    navigate(`/auth/register/${selectedRole}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-base">
      <div className="bg-primary px-5 py-8 flex flex-col justify-center">
        <BackButton variant="surface" aria-label="Go back" className="mb-8" />
        <h1 className="text-h1 font-semibold text-background-surface">
          <span className="block text-h2 italic font-serif text-background-surface/90 mb-1">Hola!</span>
          What Brings You Here?
        </h1>
      </div>

      <div className="flex flex-col bg-background-base px-5 py-8">
        <div className="flex flex-col gap-4">
          <RoleCard
            title="I'm Hiring"
            description="I hire talent for myself, company, or clients."
            image={Client}
            selected={selectedRole === "client"}
            onClick={() => setSelectedRole("client")}
          />
          <RoleCard
            title="I'm Freelancing"
            description="I'm looking for projects or job opportunities."
            image={Freelancer}
            selected={selectedRole === "freelancer"}
            onClick={() => setSelectedRole("freelancer")}
          />
        </div>

        <Button onClick={handleNext} disabled={!selectedRole} className="mt-16">
          Next
        </Button>
        <p className="text-center text-body-sm text-text-secondary mt-4">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
