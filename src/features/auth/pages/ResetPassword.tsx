import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { resetPassword } from "../api/auth";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await resetPassword(token, formData.password);

      setSuccess(true);
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-base px-5 py-8">
      <div className="mb-8">
        <h1 className="text-h1 font-bold text-text-primary mb-2">Create New Password</h1>
        <p className="text-body text-text-secondary">Almost there. Let's set up a new password for your account.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 text-body-sm text-error bg-error-bg border border-error-border rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 text-body-sm text-success bg-success-bg border border-success-border rounded-lg">
          Reset successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <Input
          label="New Password"
          type="password"
          name="password"
          placeholder="Enter new password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <div className="mt-auto">
          <Button type="submit" disabled={loading || success}>
            {loading ? "Resetting..." : "Reset"}
          </Button>
        </div>
      </form>
    </div>
  );
}
