import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../shared/lib/client";

export interface PortfolioItem {
  id: string;
  freelancerId: string;
  imageUrl: string;
  description: string;
  externalUrl: string;
  createdAt: string;
}

export interface CreatePortfolioPayload {
  description: string;
  externalUrl: string;
  imageUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

const getPortfolios = async (): Promise<PortfolioItem[]> => {
  const response = await apiClient.get<ApiResponse<PortfolioItem[]>>("/portfolios");
  return response.data?.data || (response.data as unknown as PortfolioItem[]);
};

const createPortfolio = async (payload: CreatePortfolioPayload): Promise<PortfolioItem> => {
  const response = await apiClient.post<ApiResponse<PortfolioItem>>("/portfolios", payload);
  return response.data?.data || (response.data as unknown as PortfolioItem);
};

const deletePortfolio = async (id: string): Promise<any> => {
  const response = await apiClient.delete<ApiResponse<any>>(`/portfolios/${id}`);
  return response.data?.data;
};

export const useGetPortfolios = () => {
  return useQuery({
    queryKey: ["freelancer", "portfolios"],
    queryFn: getPortfolios,
  });
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancer", "portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancer", "portfolios"] });
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};
