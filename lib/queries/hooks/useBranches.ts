import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../config/api'
import type { Branch, ApiResponse } from '../types'

// Query keys for branches
export const branchKeys = {
  all: ['branches'] as const,
  list: (organizationId?: string) => [...branchKeys.all, 'list', organizationId] as const,
}

// Get all branches
export function useBranches(organizationId?: string) {
  return useQuery({
    queryKey: branchKeys.list(organizationId),
    queryFn: async (): Promise<Branch[]> => {
      const params = organizationId ? `?organizationId=${organizationId}` : ''
      const response = await apiClient.get<ApiResponse<Branch[]>>(
        `/reservation/branches${params}`
      )
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (branches don't change often)
  })
}
