import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { login } from "../api/auth";
import { storage } from "../../../shared/lib/storage";

import BackButton from "../../../shared/components/IconButton";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      const res = await login({
        email: formData.identifier,
        password: formData.password,
      });

      storage.setAccessToken(res.accessToken);
      storage.setRole(res.user.role);

      const destination = res.user.role === "client" ? "/client" : "/freelancer";
      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-base px-5 py-8">
      <div className="mb-8">
        <BackButton variant="primary" />
      </div>

      <div className="mb-8">
        <h1 className="text-h1 font-bold text-text-primary mb-2">Sign In</h1>
        <p className="text-body text-text-secondary">Your next great match is waiting.</p>
      </div>

      {error && (
        <div className="mb-8 p-4 text-body-sm text-error bg-error-bg border border-error-border rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email Address / Phone Number"
          name="identifier"
          placeholder="Enter your email or phone number"
          value={formData.identifier}
          onChange={handleChange}
          required
        />
        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="text-right mt-2">
            <Link to="/auth/forgot-password" className="text-body-sm text-primary font-semibold underline">
              Forgot Password
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <Button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
          <p className="text-center text-body-sm text-text-secondary mt-4">
            Don't have an account?{" "}
            <Link to="/onboarding" className="text-primary font-semibold">
              Create One
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
