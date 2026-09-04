import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../shared/lib/client";

export interface InitiatePaymentPayload {
  projectId: string;
  freelancerId: string;
}

export interface InitiatePaymentResponse {
  snapToken: string;
  redirectUrl: string;
  orderId: string;
  budgetAmount: number;
  serviceFee: number;
  totalAmount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

const initiatePayment = async (payload: InitiatePaymentPayload): Promise<InitiatePaymentResponse> => {
  const response = await apiClient.post<ApiResponse<InitiatePaymentResponse>>("/payments/initiate", payload);
  return response.data?.data || (response.data as unknown as InitiatePaymentResponse);
};

export const useInitiatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiatePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["client", "project"] });
      queryClient.invalidateQueries({ queryKey: ["client", "dashboard"] });
    },
  });
};
