'use client'

import { useRecentActivities } from '@/lib/queries'

export function RecentActivity() {
  const { data: activities, isLoading, isError } = useRecentActivities()

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg mt-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {[1, 2, 3].map((i) => (
                <li key={i}>
                  <div className="relative pb-8">
                    {i !== 3 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse ring-8 ring-white" />
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    // Fallback to static data on error
    const fallbackActivities = [
      { id: 1, action: 'Logged in successfully', time: 'Just now', type: 'success' as const },
      { id: 2, action: 'Profile updated', time: '2 hours ago', type: 'info' as const },
      { id: 3, action: 'New notification received', time: '1 day ago', type: 'info' as const },
    ]

    return (
      <div className="bg-white shadow rounded-lg mt-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h3>
            <div className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
              Using fallback data
            </div>
          </div>
          <ActivityList activities={fallbackActivities} />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg mt-6">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Recent Activity
        </h3>
        <ActivityList activities={activities || []} />
      </div>
    </div>
  )
}

interface ActivityListProps {
  activities: Array<{
    id: number
    action: string
    time: string
    type: 'success' | 'info' | 'warning' | 'error'
  }>
}

function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.712-3.714M14 40v-4a9.971 9.971 0 01.712-3.714M28 16a4 4 0 11-8 0 4 4 0 018 0zm0 0c0 11 9 20 9 20s9-9 9-20c0-5.523-4.477-10-10-10s-10 4.477-10 10z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by performing some actions.</p>
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((item, itemIdx) => (
          <li key={item.id}>
            <div className="relative pb-8">
              {itemIdx !== activities.length - 1 && (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                    item.type === 'success' ? 'bg-green-500' : 
                    item.type === 'warning' ? 'bg-yellow-500' :
                    item.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    {item.type === 'success' ? (
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : item.type === 'error' ? (
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : item.type === 'warning' ? (
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">{item.action}</p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    {item.time}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
