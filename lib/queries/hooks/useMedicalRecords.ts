import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../config/api'
import type { 
  MedicalRecord, 
  CreateMedicalRecordData, 
  UpdateMedicalRecordData,
  ApiResponse, 
  PaginatedResponse,
  PaginationParams 
} from '../types'

// Query keys for medical records
export const medicalRecordKeys = {
  all: ['medicalRecords'] as const,
  lists: () => [...medicalRecordKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...medicalRecordKeys.lists(), params] as const,
  details: () => [...medicalRecordKeys.all, 'detail'] as const,
  detail: (id: string) => [...medicalRecordKeys.details(), id] as const,
}

// Get medical records with pagination
export function useMedicalRecords(params: PaginationParams = {}) {
  return useQuery({
    queryKey: medicalRecordKeys.list(params),
    queryFn: async (): Promise<PaginatedResponse<MedicalRecord>> => {
      const searchParams = new URLSearchParams()
      if (params.page) searchParams.set('page', params.page.toString())
      if (params.limit) searchParams.set('limit', params.limit.toString())
      if (params.search) searchParams.set('search', params.search)
      if (params.sortBy) searchParams.set('sortBy', params.sortBy)
      if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)

      const response = await apiClient.get<ApiResponse<PaginatedResponse<MedicalRecord>>>(
        `/medical-records?${searchParams.toString()}`
      )
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single medical record
export function useMedicalRecord(id: string) {
  return useQuery({
    queryKey: medicalRecordKeys.detail(id),
    queryFn: async (): Promise<MedicalRecord> => {
      const response = await apiClient.get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`)
      return response.data.data
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Create medical record mutation
export function useCreateMedicalRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateMedicalRecordData): Promise<MedicalRecord> => {
      const response = await apiClient.post<ApiResponse<MedicalRecord>>('/medical-records', data)
      return response.data.data
    },
    onSuccess: (newRecord) => {
      // Invalidate and refetch medical records list
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.lists() })
      
      // Add the new record to the cache
      queryClient.setQueryData(
        medicalRecordKeys.detail(newRecord.id),
        newRecord
      )
    },
    onError: (error) => {
      console.error('Failed to create medical record:', error)
    },
  })
}

// Update medical record mutation
export function useUpdateMedicalRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMedicalRecordData }): Promise<MedicalRecord> => {
      const response = await apiClient.put<ApiResponse<MedicalRecord>>(`/medical-records/${id}`, data)
      return response.data.data
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: medicalRecordKeys.detail(id) })

      // Snapshot the previous value
      const previousRecord = queryClient.getQueryData<MedicalRecord>(medicalRecordKeys.detail(id))

      // Optimistically update to the new value
      if (previousRecord) {
        queryClient.setQueryData<MedicalRecord>(
          medicalRecordKeys.detail(id),
          { ...previousRecord, ...data, updatedAt: new Date().toISOString() }
        )
      }

      // Return a context object with the snapshotted value
      return { previousRecord }
    },
    onError: (error, { id }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousRecord) {
        queryClient.setQueryData(medicalRecordKeys.detail(id), context.previousRecord)
      }
      console.error('Failed to update medical record:', error)
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.lists() })
    },
  })
}

// Delete medical record mutation
export function useDeleteMedicalRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/medical-records/${id}`)
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: medicalRecordKeys.lists() })

      // Snapshot the previous value
      const previousRecords = queryClient.getQueriesData({ queryKey: medicalRecordKeys.lists() })

      // Optimistically remove the record from all lists
      queryClient.setQueriesData<PaginatedResponse<MedicalRecord>>(
        { queryKey: medicalRecordKeys.lists() },
        (old) => {
          if (!old) return old
          return {
            ...old,
            data: old.data.filter(record => record.id !== id),
            pagination: {
              ...old.pagination,
              totalItems: old.pagination.totalItems - 1,
            }
          }
        }
      )

      return { previousRecords }
    },
    onError: (error, id, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousRecords) {
        context.previousRecords.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      console.error('Failed to delete medical record:', error)
    },
    onSuccess: (data, id) => {
      // Remove the record from individual cache
      queryClient.removeQueries({ queryKey: medicalRecordKeys.detail(id) })
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.lists() })
    },
  })
}
