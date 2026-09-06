import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../shared/lib/client";

export interface WalletBalance {
  balance: number | string;
}

export interface WithdrawalItem {
  id: string;
  walletId: string;
  amount: number | string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

const getWallet = async (): Promise<WalletBalance> => {
  const response = await apiClient.get<ApiResponse<WalletBalance>>("/wallet");
  return response.data?.data || (response.data as unknown as WalletBalance);
};

const getWithdrawals = async (): Promise<WithdrawalItem[]> => {
  const response = await apiClient.get<ApiResponse<WithdrawalItem[]>>("/wallet/withdrawals");
  return response.data?.data || (response.data as unknown as WithdrawalItem[]);
};

const withdraw = async (payload: { amount: number }): Promise<WithdrawalItem> => {
  const response = await apiClient.post<ApiResponse<WithdrawalItem>>("/wallet/withdraw", payload);
  return response.data?.data || (response.data as unknown as WithdrawalItem);
};

export const useGetWallet = () => {
  return useQuery({
    queryKey: ["freelancer", "wallet"],
    queryFn: getWallet,
  });
};

export const useGetWithdrawals = () => {
  return useQuery({
    queryKey: ["freelancer", "wallet", "withdrawals"],
    queryFn: getWithdrawals,
  });
};

export const useWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancer", "wallet"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer", "wallet", "withdrawals"] });
    },
  });
};
