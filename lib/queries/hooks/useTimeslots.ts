import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../config/api'
import type { Timeslot, ApiResponse } from '../types'

// Query keys for timeslots
export const timeslotKeys = {
  all: ['timeslots'] as const,
  list: (branchId: string, doctorId: string) => [...timeslotKeys.all, 'list', branchId, doctorId] as const,
}

// Get timeslots by branch and doctor
export function useTimeslots(branchId: string, doctorId: string) {
  return useQuery({
    queryKey: timeslotKeys.list(branchId, doctorId),
    queryFn: async (): Promise<Timeslot[]> => {
      const response = await apiClient.get<ApiResponse<Timeslot[]>>(
        `/reservation/timeslots?branchId=${branchId}&doctorId=${doctorId}`
      )
      return response.data.data
    },
    enabled: !!branchId && !!doctorId,
    staleTime: 2 * 60 * 1000, // 2 minutes (timeslots might be more dynamic)
  })
}
