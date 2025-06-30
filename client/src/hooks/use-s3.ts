import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedQuery, useAuthenticatedMutation } from './use-auth';

export function useS3Buckets() {
  return useAuthenticatedQuery(['/api/buckets'], {
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUserPermissions() {
  return useAuthenticatedQuery(['/api/permissions/my'], {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAccessRequests() {
  return useAuthenticatedQuery(['/api/access-requests'], {
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function usePendingRequests() {
  return useAuthenticatedQuery(['/api/access-requests/pending'], {
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useStats() {
  return useAuthenticatedQuery(['/api/stats'], {
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateAccessRequest() {
  const queryClient = useQueryClient();
  const mutation = useAuthenticatedMutation();
  
  return useMutation({
    mutationFn: (data: { bucketId: number; requestedDuration: number; justification: string }) => 
      mutation.mutate({ url: '/api/access-requests', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/access-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}

export function useUpdateAccessRequest() {
  const queryClient = useQueryClient();
  const mutation = useAuthenticatedMutation();
  
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; status: string; duration?: number }) => 
      mutation.mutate({ 
        url: `/api/access-requests/${id}`, 
        method: 'PATCH',
        data 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/access-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/access-requests/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
  });
}
