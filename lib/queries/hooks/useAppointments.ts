import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../config/api'
import type { 
  Appointment, 
  CreateAppointmentData, 
  UpdateAppointmentData,
  ApiResponse, 
  PaginatedResponse,
  PaginationParams 
} from '../types'

// Query keys for appointments
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  upcoming: () => [...appointmentKeys.all, 'upcoming'] as const,
  today: () => [...appointmentKeys.all, 'today'] as const,
}

// Get appointments with pagination
export function useAppointments(params: PaginationParams = {}) {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<Appointment>> => {
      const searchParams = new URLSearchParams()
      if (params.page) searchParams.set('page', params.page.toString())
      if (params.limit) searchParams.set('limit', params.limit.toString())
      if (params.search) searchParams.set('search', params.search)
      if (params.sortBy) searchParams.set('sortBy', params.sortBy)
      if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)

      const response = await apiClient.get<ApiResponse<PaginatedResponse<Appointment>>>(
        `/appointments?${searchParams.toString()}`
      )
      return response.data.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (appointments change more frequently)
  })
}

// Get single appointment
export function useAppointment(id: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: async (): Promise<Appointment> => {
      const response = await apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`)
      return response.data.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get upcoming appointments
export function useUpcomingAppointments(limit: number = 5) {
  return useQuery({
    queryKey: [...appointmentKeys.upcoming(), { limit }],
    queryFn: async (): Promise<Appointment[]> => {
      const response = await apiClient.get<ApiResponse<Appointment[]>>(
        `/appointments/upcoming?limit=${limit}`
      )
      return response.data.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  })
}

// Get today's appointments
export function useTodayAppointments() {
  return useQuery({
    queryKey: appointmentKeys.today(),
    queryFn: async (): Promise<Appointment[]> => {
      const response = await apiClient.get<ApiResponse<Appointment[]>>('/appointments/today')
      return response.data.data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

// Create appointment mutation
export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAppointmentData): Promise<Appointment> => {
      const response = await apiClient.post<ApiResponse<Appointment>>('/appointments', data)
      return response.data.data
    },
    onSuccess: (newAppointment) => {
      // Invalidate and refetch appointments lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.upcoming() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() })
      
      // Add the new appointment to the cache
      queryClient.setQueryData(
        appointmentKeys.detail(newAppointment.id),
        newAppointment
      )
    },
    onError: (error) => {
      console.error('Failed to create appointment:', error)
    },
  })
}

// Update appointment mutation
export function useUpdateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAppointmentData }): Promise<Appointment> => {
      const response = await apiClient.put<ApiResponse<Appointment>>(`/appointments/${id}`, data)
      return response.data.data
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: appointmentKeys.detail(id) })

      // Snapshot the previous value
      const previousAppointment = queryClient.getQueryData<Appointment>(appointmentKeys.detail(id))

      // Optimistically update to the new value
      if (previousAppointment) {
        queryClient.setQueryData<Appointment>(
          appointmentKeys.detail(id),
          { ...previousAppointment, ...data, updatedAt: new Date().toISOString() }
        )
      }

      // Return a context object with the snapshotted value
      return { previousAppointment }
    },
    onError: (error, { id }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAppointment) {
        queryClient.setQueryData(appointmentKeys.detail(id), context.previousAppointment)
      }
      console.error('Failed to update appointment:', error)
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.upcoming() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() })
    },
  })
}

// Delete appointment mutation
export function useDeleteAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/appointments/${id}`)
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: appointmentKeys.lists() })

      // Snapshot the previous values
      const previousData = {
        lists: queryClient.getQueriesData({ queryKey: appointmentKeys.lists() }),
        upcoming: queryClient.getQueryData(appointmentKeys.upcoming()),
        today: queryClient.getQueryData(appointmentKeys.today()),
      }

      // Optimistically remove the appointment from all lists
      queryClient.setQueriesData<PaginatedResponse<Appointment>>(
        { queryKey: appointmentKeys.lists() },
        (old) => {
          if (!old) return old
          return {
            ...old,
            data: old.data.filter(appointment => appointment.id !== id),
            pagination: {
              ...old.pagination,
              totalItems: old.pagination.totalItems - 1,
            }
          }
        }
      )

      // Remove from upcoming appointments
      queryClient.setQueryData<Appointment[]>(
        appointmentKeys.upcoming(),
        (old) => old?.filter(appointment => appointment.id !== id) || []
      )

      // Remove from today's appointments
      queryClient.setQueryData<Appointment[]>(
        appointmentKeys.today(),
        (old) => old?.filter(appointment => appointment.id !== id) || []
      )

      return { previousData }
    },
    onError: (error, id, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousData) {
        context.previousData.lists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
        if (context.previousData.upcoming) {
          queryClient.setQueryData(appointmentKeys.upcoming(), context.previousData.upcoming)
        }
        if (context.previousData.today) {
          queryClient.setQueryData(appointmentKeys.today(), context.previousData.today)
        }
      }
      console.error('Failed to delete appointment:', error)
    },
    onSuccess: (data, id) => {
      // Remove the appointment from individual cache
      queryClient.removeQueries({ queryKey: appointmentKeys.detail(id) })
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.upcoming() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() })
    },
  })
}
