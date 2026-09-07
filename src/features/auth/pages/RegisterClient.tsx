import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { register } from "../api/auth";

import BackButton from "../../../shared/components/IconButton";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";

export default function RegisterClient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agree) {
      setError("You must agree to the terms and privacy policy.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "client",
        phone: formData.phone,
      });

      navigate("/client", { replace: true });
    } catch (err: any) {
      const message = err.response?.data?.message;
      const errorMessage = Array.isArray(message) ? message[0] : message;
      setError(errorMessage || err.message || "Failed to create account. Please try again.");
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
        <h2 className="text-h2 italic font-serif text-text-primary">Let's Roll!</h2>
        <h1 className="text-h1 font-semibold text-text-primary mb-2">Create an Account</h1>
        <p className="text-body text-text-secondary">Ready to get started? Let's set up your account.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 text-body-sm text-error bg-error-bg border border-error-border rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password (min 8 characters)"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="w-5 h-5 text-primary"
          />
          <label htmlFor="terms" className="text-body-sm text-text-secondary">
            I have read and agree to{" "}
            <Link to="/terms" className="text-primary font-semibold underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary font-semibold underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <div className="mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
          <p className="text-center text-body-sm text-text-secondary mt-4">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
