import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import { useGetProjectDetail } from "../api/projects";
import { useInitiatePayment } from "../api/payment";

import HeaderBar from "../../../shared/components/HeaderBar";
import Button from "../../../shared/components/Button";
import ProjectStatusBadge from "../../../shared/components/ProjectStatusBadge";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

function formatBudget(budget: number | string): string {
  const num = typeof budget === "string" ? parseFloat(budget) : budget;
  if (isNaN(num)) return `Rp${budget}`;
  return `Rp${num.toLocaleString("id-ID")}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatRating(rating?: number | string | null): string {
  if (rating === undefined || rating === null) return "-";
  const num = typeof rating === "string" ? parseFloat(rating) : rating;
  if (isNaN(num) || num <= 0) return "-";
  return num.toFixed(1);
}

export default function Checkout() {
  const { projectId, freelancerId } = useParams<{ projectId: string; freelancerId: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading } = useGetProjectDetail(projectId || "");
  const initiatePaymentMutation = useInitiatePayment();

  const [error, setError] = useState("");

  if (isLoading || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-background-base pb-12">
        <HeaderBar title="Project Payment" showBack variant="surface" />
        <div className="px-5 py-5 flex flex-col gap-4">
          <Skeleton height={140} borderRadius={8} />
          <Skeleton height={100} borderRadius={8} />
          <Skeleton height={160} borderRadius={8} />
          <Skeleton height={48} borderRadius={8} className="mt-4" />
        </div>
      </div>
    );
  }

  const applicant = project.applications?.find(
    (a) => a.freelancerId === freelancerId || a.freelancer?.id === freelancerId,
  );
  const freelancer = applicant?.freelancer;
  const freelancerUser = freelancer?.user;

  const budgetAmount = Number(project.budget) || 0;
  const serviceFee = Math.round(budgetAmount * 0.02);
  const totalAmount = budgetAmount + serviceFee;

  const handlePay = async () => {
    if (!projectId || !freelancerId) return;

    try {
      setError("");
      const result = await initiatePaymentMutation.mutateAsync({
        projectId,
        freelancerId,
      });

      if (window.snap && result.snapToken) {
        try {
          window.snap.pay(result.snapToken, {
            onSuccess: () => {
              navigate(`/client/projects/${projectId}/payment/success`);
            },
            onPending: () => {
              navigate(`/client/projects/${projectId}/payment/success`);
            },
            onError: () => {
              if (result.redirectUrl) {
                window.location.href = result.redirectUrl;
              } else {
                setError("Payment processing failed. Please try again.");
              }
            },
            onClose: () => {
              setError("Payment window closed before completion.");
            },
          });
        } catch {
          if (result.redirectUrl) {
            window.location.href = result.redirectUrl;
          } else {
            navigate(`/client/projects/${projectId}/payment/success`);
          }
        }
      } else if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        navigate(`/client/projects/${projectId}/payment/success`);
      }
    } catch (err: any) {
      const message = err.response?.data?.message;
      const errorMessage = Array.isArray(message) ? message[0] : message;
      setError(errorMessage || err.message || "Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-base pb-12">
      <HeaderBar title="Project Payment" showBack variant="surface" />

      <div className="px-5 py-5 flex flex-col gap-4">
        {error && (
          <div className="p-4 text-body-sm text-error bg-error-bg border border-error-border rounded-lg">{error}</div>
        )}

        <div className="bg-background-surface rounded-lg p-5 border border-border flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-body-lg font-semibold text-primary">{project.title}</h3>
            <ProjectStatusBadge status="open" statusLabel="Open" className="shrink-0" />
          </div>

          <p className="text-body-sm text-text-secondary line-clamp-2">{project.description}</p>

          <div className="flex items-center justify-between text-body-sm pt-2 border-t border-border">
            <span className="text-text-secondary">Deadline</span>
            <span className="font-semibold text-text-primary">{formatDate(project.deadline)}</span>
          </div>
        </div>

        {freelancerUser && (
          <div className="bg-background-surface rounded-lg p-5 border border-border flex flex-col gap-3">
            <p className="text-body-sm font-semibold text-text-primary">Assigned Freelancer</p>
            <div className="flex items-center gap-3">
              {freelancerUser.avatarUrl ? (
                <img
                  src={freelancerUser.avatarUrl}
                  alt={freelancerUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-body">
                  {(freelancerUser.name || "F")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-body font-semibold text-text-primary">{freelancerUser.name}</span>
                <span className="text-caption text-text-secondary">
                  ⭐ {formatRating(freelancer?.rating)} • ({freelancer?.completedCount ?? 0} Completed)
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-background-surface rounded-lg p-5 border border-border flex flex-col gap-3">
          <h4 className="text-body font-semibold text-text-primary mb-1">Payment Summary</h4>

          <div className="flex items-center justify-between text-body-sm">
            <span className="text-text-secondary">Project Budget</span>
            <span className="font-semibold text-text-primary">{formatBudget(budgetAmount)}</span>
          </div>

          <div className="flex items-center justify-between text-body-sm">
            <span className="text-text-secondary">Platform Service Fee (2%)</span>
            <span className="font-semibold text-text-primary">{formatBudget(serviceFee)}</span>
          </div>

          <div className="border-t border-border my-1" />

          <div className="flex items-center justify-between text-body">
            <span className="font-semibold text-text-primary">Total Payment</span>
            <span className="text-body-lg font-semibold text-primary">{formatBudget(totalAmount)}</span>
          </div>
        </div>

        <div className="mt-2">
          <Button onClick={handlePay} disabled={initiatePaymentMutation.isPending}>
            {initiatePaymentMutation.isPending ? "Processing..." : "Pay"}
          </Button>
        </div>
      </div>
    </div>
  );
}
