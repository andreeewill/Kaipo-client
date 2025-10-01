import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../config/api'
import type { DashboardStats, ActivityItem, ApiResponse } from '../types'

// Query keys for dashboard
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  activities: () => [...dashboardKeys.all, 'activities'] as const,
  activity: (id: string) => [...dashboardKeys.activities(), id] as const,
}

// Get dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async (): Promise<DashboardStats> => {
      const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats')
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

// Get recent activities
export function useRecentActivities(limit: number = 10) {
  return useQuery({
    queryKey: [...dashboardKeys.activities(), { limit }],
    queryFn: async (): Promise<ActivityItem[]> => {
      const response = await apiClient.get<ApiResponse<ActivityItem[]>>(
        `/dashboard/activities?limit=${limit}`
      )
      return response.data.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

// Get user dashboard data (combining stats and activities)
export function useDashboardData() {
  const statsQuery = useDashboardStats()
  const activitiesQuery = useRecentActivities()

  return {
    stats: statsQuery.data,
    activities: activitiesQuery.data,
    isLoading: statsQuery.isLoading || activitiesQuery.isLoading,
    isError: statsQuery.isError || activitiesQuery.isError,
    error: statsQuery.error || activitiesQuery.error,
    refetch: () => {
      statsQuery.refetch()
      activitiesQuery.refetch()
    },
  }
}
