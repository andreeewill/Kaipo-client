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

// Patient API hooks
export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patientData: CreatePatientRequest): Promise<ApiResponse<PatientResponse>> => {
      const response = await apiClient.post('/patients', patientData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch patients list
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const usePatients = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: async (): Promise<ApiResponse<PatientResponse[]>> => {
      const response = await apiClient.get('/patients');
      return response.data;
    },
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
