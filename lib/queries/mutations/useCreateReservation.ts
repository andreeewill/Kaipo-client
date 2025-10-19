import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../config/api'
import type { CreateReservationData } from '../types'
import { branchKeys } from '../hooks/useBranches'
import { doctorKeys } from '../hooks/useDoctors'
import { timeslotKeys } from '../hooks/useTimeslots'

// Create reservation mutation
export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateReservationData): Promise<void> => {
      await apiClient.post('/reservation', data)
    },
    onSuccess: () => {
      // Invalidate related queries to refetch after creating
      queryClient.invalidateQueries({ queryKey: branchKeys.all })
      queryClient.invalidateQueries({ queryKey: doctorKeys.all })
      queryClient.invalidateQueries({ queryKey: timeslotKeys.all })
    },
    onError: (error) => {
      console.error('Failed to create reservation:', error)
    },
  })
}
