import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../config/api'
import type { Reservation, ApiResponse } from '../types'

// Query keys for reservations
export const reservationKeys = {
  all: ['reservations'] as const,
  list: (organizationId?: string) => [...reservationKeys.all, 'list', organizationId] as const,
}

// Get all reservations
export function useReservations(organizationId?: string) {
  return useQuery({
    queryKey: reservationKeys.list(organizationId),
    queryFn: async (): Promise<Reservation[]> => {
      const params = organizationId ? `?organizationId=${organizationId}` : ''
      const response = await apiClient.get<ApiResponse<Reservation[]>>(
        `/reservation${params}`
      )
      return response.data.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute (reservations change frequently)
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  })
}
