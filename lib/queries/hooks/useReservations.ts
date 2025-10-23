import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../config/api'
import type { Reservation, ApiResponse } from '../types'

// Query keys for reservations
export const reservationKeys = {
  all: ['reservations'] as const,
  list: (organizationId?: string) => [...reservationKeys.all, 'list', organizationId] as const,
  byDate: (date: string, doctorId?: string, branchId?: string) => [...reservationKeys.all, 'byDate', date, doctorId, branchId] as const,
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

// Get reservations by date and doctor
export function useReservationsByDate(date: string, doctorId?: string, branchId?: string) {
  return useQuery({
    queryKey: reservationKeys.byDate(date, doctorId, branchId),
    queryFn: async (): Promise<Reservation[]> => {
      const params = new URLSearchParams()
      params.set('date', date)
      if (doctorId) params.set('doctorId', doctorId)
      if (branchId) params.set('branchId', branchId)
      
      const response = await apiClient.get<ApiResponse<Reservation[]>>(
        `/reservation/by-date?${params.toString()}`
      )
      return response.data.data
    },
    enabled: !!date,
    staleTime: 30 * 1000, // 30 seconds (frequent updates for schedule planning)
    refetchInterval: 1 * 60 * 1000, // Refetch every minute
  })
}
