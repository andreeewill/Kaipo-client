import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../config/api';
import { 
  ApiResponse, 
  CreatePatientRequest, 
  PatientResponse, 
  Province, 
  City, 
  District, 
  SubDistrict 
} from '../../../types/api';

// Query keys for patients
export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: () => [...patientKeys.lists()] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
}

// Patient API hooks
export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patientData: CreatePatientRequest): Promise<void> => {
      await apiClient.post('/patients', patientData);
      // POST returns 204 status code (no content)
    },
    onSuccess: () => {
      // Invalidate and refetch patients list
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create patient:', error);
    },
  });
};

export const usePatients = () => {
  return useQuery({
    queryKey: patientKeys.list(),
    queryFn: async (): Promise<PatientResponse[]> => {
      const response = await apiClient.get<ApiResponse<PatientResponse[]>>('/patients');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single patient by ID (if endpoint exists in the future)
export const usePatient = (id: string) => {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: async (): Promise<PatientResponse> => {
      const response = await apiClient.get<ApiResponse<PatientResponse>>(`/patients/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Reference data API hooks
export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async (): Promise<ApiResponse<Province[]>> => {
      const response = await apiClient.get('/reference/provinces');
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - provinces don't change often
  });
};

export const useCities = (provinceCode?: string) => {
  return useQuery({
    queryKey: ['cities', provinceCode],
    queryFn: async (): Promise<ApiResponse<City[]>> => {
      const response = await apiClient.get('/reference/cities', {
        params: provinceCode ? { provinceCode } : undefined,
      });
      return response.data;
    },
    enabled: !!provinceCode,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useDistricts = (cityCode?: string) => {
  return useQuery({
    queryKey: ['districts', cityCode],
    queryFn: async (): Promise<ApiResponse<District[]>> => {
      const response = await apiClient.get(`/reference/districts?cityCode=${cityCode}`);
      return response.data;
    },
    enabled: !!cityCode,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useSubDistricts = (districtCode?: string) => {
  return useQuery({
    queryKey: ['subDistricts', districtCode],
    queryFn: async (): Promise<ApiResponse<SubDistrict[]>> => {
      const response = await apiClient.get(`/reference/sub-districts?districtCode=${districtCode}`);
      return response.data;
    },
    enabled: !!districtCode,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
