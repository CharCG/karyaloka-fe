import { useState } from "react";
import { Link } from "react-router";
import { forgotPassword } from "../../api/auth";

import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await forgotPassword(email);

      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset link. Please try again.");
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
        <h1 className="text-h1 font-bold text-text-primary mb-2">Forgot Password</h1>
        <p className="text-body text-text-secondary">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 text-body-sm text-error bg-error-bg border border-error-border rounded-lg">
          {error}
        </div>
      )}

      {success ? (
        <div className="flex flex-col flex-1">
          <div className="mb-8 p-4 text-body-sm text-success bg-success-bg rounded-lg border border-success-border">
            Sent to <span className="font-semibold">{email}</span>.
          </div>
          <div className="mt-auto pt-8">
            <Link to="/auth/login">
              <Button type="button">Back</Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="flex flex-col gap-4">
            <Input
              label="Email Address / Phone Number"
              type="email"
              name="email"
              placeholder="Enter your email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-auto">
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
            <p className="text-center text-body-sm text-text-secondary mt-4">
              Remember your password?{" "}
              <Link to="/auth/login" className="text-primary font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
