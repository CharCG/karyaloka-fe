import { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { apiClient } from "../../../shared/lib/client";
import Button from "../../../shared/components/Button";
import CheckIcon from "../../../assets/icons/check.svg?react";

export default function PaymentSuccess() {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("order_id");
  let extractedProjectId: string | undefined;
  if (orderId) {
    if (orderId.includes("_")) {
      extractedProjectId = orderId.split("_")[1];
    } else if (orderId.includes("-")) {
      extractedProjectId = orderId.split("-")[1];
    }
  }
  const projectId = routeProjectId || extractedProjectId;

  useEffect(() => {
    if (projectId) {
      apiClient.post(`/payments/verify/${projectId}`).catch(() => {});
    }
  }, [projectId]);

  return (
    <div className="min-h-screen flex flex-col bg-background-base px-5 py-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-success-bg flex items-center justify-center mb-6">
          <CheckIcon className="w-8 h-8 text-success" />
        </div>

        <h2 className="text-h2 font-semibold text-text-primary mb-2">Payment Successful!</h2>

        <div className="w-full bg-background-surface rounded-lg p-4 border border-border flex items-center justify-between text-body-sm">
          <span className="text-text-secondary">Project Status</span>
          <span className="font-semibold text-primary">In Progress</span>
        </div>
      </div>

      <div className="w-full pt-6">
        <Button onClick={() => navigate("/client/projects")}>Back to Projects</Button>
      </div>
    </div>
  );
}
