import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../shared/lib/client";

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  skills: string[];
  budget: string;
  deadline: string;
  status: "open" | "closed" | "in_progress" | "submitted" | "completed" | "need_review";
  selectedFreelancerId?: string;
  deliverableUrl?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FreelancerUser {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface AssignedFreelancer {
  id: string;
  user: FreelancerUser;
}

export interface ApplicationFreelancer {
  id: string;
  user: FreelancerUser;
  rating?: number;
  completedCount?: number;
}

export interface ProjectApplication {
  id: string;
  freelancerId: string;
  status: string;
  appliedAt: string;
  freelancer: ApplicationFreelancer;
}

export interface ProjectDetail extends Project {
  client?: {
    id: string;
    user: FreelancerUser;
  };
  assignedFreelancer?: AssignedFreelancer | null;
  applications?: ProjectApplication[];
  payment?: any;
}

export interface ClientDashboardProject {
  id: string;
  title: string;
  description: string;
  budget: number | string;
  deadline: string;
  status: string;
  submittedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  assignedFreelancer?: AssignedFreelancer | null;
  _count?: {
    applications?: number;
  };
}

export interface ClientDashboardOverview {
  openCount: number;
  activeCount: number;
  completedCount: number;
}

export interface ClientDashboardData {
  overview: ClientDashboardOverview;
  needReviewProjects: ClientDashboardProject[];
  recentProjects: ClientDashboardProject[];
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  skills: string[];
  budget: number | string;
  deadline: string;
}

export interface ClientListProject extends Project {
  assignedFreelancer?: AssignedFreelancer | null;
  _count?: {
    applications?: number;
  };
}

const getClientDashboard = async (): Promise<ClientDashboardData> => {
  const response = await apiClient.get<ApiResponse<ClientDashboardData>>("/projects/dashboard");
  return response.data?.data || (response.data as unknown as ClientDashboardData);
};

const getClientProjects = async (tab?: string): Promise<ClientListProject[]> => {
  const response = await apiClient.get<ApiResponse<ClientListProject[]>>("/projects/mine", {
    params: { tab },
  });
  return response.data?.data || (response.data as unknown as ClientListProject[]);
};

const getProjectDetail = async (projectId: string): Promise<ProjectDetail> => {
  const response = await apiClient.get<ApiResponse<ProjectDetail>>(`/projects/${projectId}`);
  return response.data?.data || (response.data as unknown as ProjectDetail);
};

const createProject = async (payload: CreateProjectPayload): Promise<Project> => {
  const response = await apiClient.post<ApiResponse<Project>>("/projects", payload);
  return response.data?.data || (response.data as unknown as Project);
};

const closeProject = async (projectId: string): Promise<Project> => {
  const response = await apiClient.patch<ApiResponse<Project>>(`/projects/${projectId}/close`);
  return response.data?.data || (response.data as unknown as Project);
};

const getProjectApplications = async (projectId: string): Promise<ProjectApplication[]> => {
  const response = await apiClient.get<ApiResponse<ProjectApplication[]>>(`/projects/${projectId}/applications`);
  return response.data?.data || (response.data as unknown as ProjectApplication[]);
};

export const useGetProjectApplications = (projectId: string) => {
  return useQuery({
    queryKey: ["client", "project", projectId, "applications"],
    queryFn: () => getProjectApplications(projectId),
    enabled: !!projectId,
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useGetClientDashboard = () => {
  return useQuery({
    queryKey: ["client", "dashboard"],
    queryFn: getClientDashboard,
  });
};

export const useGetClientProjects = (tab?: string) => {
  return useQuery({
    queryKey: ["client", "projects", tab],
    queryFn: () => getClientProjects(tab),
  });
};

export const useGetProjectDetail = (projectId: string) => {
  return useQuery({
    queryKey: ["client", "project", projectId],
    queryFn: () => getProjectDetail(projectId),
    enabled: !!projectId,
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["client", "projects"] });
    },
  });
};

export const useCloseProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeProject,
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ["client", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["client", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["client", "project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["client", "project", projectId, "applications"] });
    },
  });
};

export interface ApproveCompletionPayload {
  rating: number;
}

const approveCompletion = async (projectId: string, payload: ApproveCompletionPayload): Promise<Project> => {
  const response = await apiClient.patch<ApiResponse<Project>>(`/projects/${projectId}/approve`, payload);
  return response.data?.data || (response.data as unknown as Project);
};

export const useApproveCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, rating }: { projectId: string; rating: number }) =>
      approveCompletion(projectId, { rating }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["client", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["client", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["client", "project", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["freelancer", "project", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["freelancer", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer", "wallet"] });
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};
