# React Query Setup Documentation

## Overview

This project uses React Query (TanStack Query) for server state management alongside Zustand for client state management.

## Architecture

### State Management Pattern
- **Zustand**: Handles client-side state (authentication, UI state)
- **React Query**: Handles server state (API data, caching, synchronization)

### Folder Structure
```
lib/queries/
├── config/
│   ├── api.ts              # Axios client with interceptors
│   └── queryClient.tsx     # React Query client configuration
├── hooks/
│   ├── useDashboard.ts     # Dashboard-related queries
│   ├── useMedicalRecords.ts # Medical records queries & mutations
│   └── useAppointments.ts  # Appointments queries & mutations
├── types/
│   └── index.ts            # TypeScript types for API responses
└── index.ts                # Exports all queries and providers
```

## Usage Examples

### 1. Using Queries (Data Fetching)

```tsx
import { useDashboardStats } from '@/lib/queries'

function DashboardComponent() {
  const { data, isLoading, isError, error } = useDashboardStats()

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorMessage error={error} />
  
  return <div>Active Users: {data?.activeUsers}</div>
}
```

### 2. Using Mutations (Data Updates)

```tsx
import { useCreateMedicalRecord } from '@/lib/queries'

function CreateRecordForm() {
  const createRecord = useCreateMedicalRecord()
  
  const handleSubmit = async (formData) => {
    try {
      await createRecord.mutateAsync(formData)
      // Success handling (automatic cache updates)
    } catch (error) {
      // Error handling
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        disabled={createRecord.isPending}
        type="submit"
      >
        {createRecord.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
```

### 3. Optimistic Updates

The mutations automatically implement optimistic updates:

1. **Immediate UI update**: Changes appear instantly
2. **Server sync**: Request sent to server
3. **Success**: Changes persist
4. **Error**: UI rolls back to previous state

## Key Features

### Authentication Integration
- Automatic JWT token handling via cookies
- 401/403 error handling with auto-logout
- Seamless integration with Zustand auth store

### Caching Strategy
- **Queries**: Cached for 1-5 minutes depending on data type
- **Background refetch**: Critical data updates every 30s-5min
- **Stale-while-revalidate**: Shows cached data while fetching fresh data

### Error Handling
- **Automatic retries**: Up to 3 retries for 5xx errors
- **No retry for client errors**: 4xx errors fail immediately  
- **Fallback data**: Components show fallback content on error
- **Global error boundaries**: Centralized error handling

### Performance Optimizations
- **Request deduplication**: Identical requests are merged
- **Background updates**: Data refreshes without user interaction
- **Optimistic updates**: Instant UI feedback
- **Selective invalidation**: Only relevant data is refetched

## Environment Configuration

Set your API base URL in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001  # Development
# NEXT_PUBLIC_API_BASE_URL=https://api.kaipo.my.id  # Production
```

## Adding New Queries

1. **Define types** in `lib/queries/types/index.ts`
2. **Create query keys** for cache management
3. **Implement hooks** following the existing pattern
4. **Export** from `lib/queries/index.ts`

### Example: Adding User Profile Queries

```tsx
// In lib/queries/hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../config/api'

export const profileKeys = {
  all: ['profile'] as const,
  detail: (id: string) => [...profileKeys.all, id] as const,
}

export function useProfile(userId: string) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: async () => {
      const response = await apiClient.get(`/users/${userId}`)
      return response.data.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
```

## Best Practices

### Query Keys
- Use hierarchical structure: `['resource', 'action', params]`
- Create key factories for consistency
- Enable selective invalidation

### Error Boundaries
- Wrap components with error boundaries
- Provide meaningful fallback UI
- Log errors for monitoring

### Loading States
- Show skeleton screens for better UX
- Disable form controls during mutations
- Provide visual feedback for background updates

### Cache Management
- Set appropriate stale times based on data volatility
- Use `invalidateQueries` after successful mutations
- Consider `removeQueries` for deleted data

## Integration with Zustand

The auth pattern works as follows:

1. **Zustand** manages authentication state (isAuthenticated, userInfo)
2. **React Query** handles API calls with automatic token attachment
3. **API interceptors** handle token refresh and logout scenarios
4. **Components** can use both stores simultaneously

```tsx
function MyComponent() {
  // Client state (Zustand)
  const { isAuthenticated, userInfo } = useAuthStore()
  
  // Server state (React Query)
  const { data: appointments } = useAppointments()
  
  // Both work together seamlessly
  return (
    <div>
      <h1>Welcome {userInfo?.sub}</h1>
      {appointments?.map(apt => <AppointmentCard key={apt.id} {...apt} />)}
    </div>
  )
}
```

## Debugging

- **React Query DevTools**: Available in development mode
- **Network tab**: Monitor API calls and responses
- **Console logs**: Error details and cache status
- **Query keys**: Use browser DevTools to inspect query cache

## Migration from useState/useEffect

### Before (useState/useEffect)
```tsx
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  fetchData()
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false))
}, [])
```

### After (React Query)
```tsx
const { data, isLoading, error } = useMyQuery()
```

Benefits: Automatic caching, background updates, error handling, loading states, and much more!
