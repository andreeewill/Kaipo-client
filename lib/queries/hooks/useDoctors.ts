import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../config/api'
import type { Doctor, ApiResponse } from '../types'

// Query keys for doctors
export const doctorKeys = {
  all: ['doctors'] as const,
  list: (branchId: string) => [...doctorKeys.all, 'list', branchId] as const,
}

// Get doctors by branch
export function useDoctors(branchId: string) {
  return useQuery({
    queryKey: doctorKeys.list(branchId),
    queryFn: async (): Promise<Doctor[]> => {
      const response = await apiClient.get<ApiResponse<Doctor[]>>(
        `/reservation/doctors?branchId=${branchId}`
      )
      return response.data.data
    },
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
