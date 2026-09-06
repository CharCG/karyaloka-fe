import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../shared/lib/client";

export interface DiscoverProject {
  id: string;
  title: string;
  description: string;
  skills: string[];
  budget: number | string;
  deadline: string;
  status: string;
  createdAt: string;
  client?: {
    id: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string | null;
    };
  };
}

export interface DiscoverResponse {
  projects: DiscoverProject[];
  total: number;
  page: number;
  limit: number;
}

export interface FreelancerProject {
  id: string;
  title: string;
  description: string;
  skills: string[];
  budget: number | string;
  deadline: string;
  status: string;
  deliverableUrl?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  applicationStatus?: string;
  appliedAt?: string;
  client?: {
    id: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string | null;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

const getDiscoverProjects = async (page = 1, limit = 10): Promise<DiscoverResponse> => {
  const response = await apiClient.get<ApiResponse<DiscoverResponse>>("/projects/discover", {
    params: { page, limit },
  });
  return response.data?.data || (response.data as unknown as DiscoverResponse);
};

const getFreelancerProjects = async (tab?: string): Promise<FreelancerProject[]> => {
  const response = await apiClient.get<ApiResponse<FreelancerProject[]>>("/projects/mine", {
    params: { tab },
  });
  return response.data?.data || (response.data as unknown as FreelancerProject[]);
};

const getProjectDetail = async (id: string): Promise<FreelancerProject> => {
  const response = await apiClient.get<ApiResponse<FreelancerProject>>(`/projects/${id}`);
  return response.data?.data || (response.data as unknown as FreelancerProject);
};

const applyProject = async (projectId: string) => {
  const response = await apiClient.post<ApiResponse<any>>(`/projects/${projectId}/apply`);
  return response.data?.data;
};

const withdrawApplication = async (projectId: string) => {
  const response = await apiClient.delete<ApiResponse<any>>(`/projects/${projectId}/apply`);
  return response.data?.data;
};

const submitDeliverable = async ({
  projectId,
  deliverableUrl,
}: {
  projectId: string;
  deliverableUrl: string;
}) => {
  const response = await apiClient.patch<ApiResponse<any>>(`/projects/${projectId}/submit`, {
    deliverableUrl,
  });
  return response.data?.data;
};

export const useGetDiscoverProjects = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["freelancer", "discover", page, limit],
    queryFn: () => getDiscoverProjects(page, limit),
  });
};

export const useGetFreelancerProjects = (tab?: string) => {
  return useQuery({
    queryKey: ["freelancer", "projects", tab],
    queryFn: () => getFreelancerProjects(tab),
  });
};

export const useGetFreelancerProjectDetail = (projectId: string) => {
  return useQuery({
    queryKey: ["freelancer", "project", projectId],
    queryFn: () => getProjectDetail(projectId),
    enabled: !!projectId,
  });
};

export const useApplyProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyProject,
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ["freelancer", "discover"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["client", "project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["client", "project", projectId, "applications"] });
      queryClient.invalidateQueries({ queryKey: ["client", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["client", "dashboard"] });
    },
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdrawApplication,
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ["freelancer", "discover"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["client", "project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["client", "project", projectId, "applications"] });
      queryClient.invalidateQueries({ queryKey: ["client", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["client", "dashboard"] });
    },
  });
};

export const useSubmitDeliverable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitDeliverable,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["freelancer", "project", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["freelancer", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["client", "project", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["client", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["client", "dashboard"] });
    },
  });
};
