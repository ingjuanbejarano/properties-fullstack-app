import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ownersApi } from "@/lib/api";
import { OwnerCreateOrUpdate } from "@/lib/types";

// Query keys for React Query
export const ownerKeys = {
  all: ["owners"] as const,
  lists: () => [...ownerKeys.all, "list"] as const,
  list: () => [...ownerKeys.lists()] as const,
  details: () => [...ownerKeys.all, "detail"] as const,
  detail: (id: string) => [...ownerKeys.details(), id] as const,
};

// Hook to get all owners
export function useOwners(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ownerKeys.list(),
    queryFn: () => ownersApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled ?? true, // Default to true for backward compatibility
  });
}

// Hook to get a single owner by ID
export function useOwner(id: string) {
  return useQuery({
    queryKey: ownerKeys.detail(id),
    queryFn: () => ownersApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook to create a new owner
export function useCreateOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OwnerCreateOrUpdate) => ownersApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch owners list
      queryClient.invalidateQueries({ queryKey: ownerKeys.lists() });
    },
  });
}

// Hook to update an existing owner
export function useUpdateOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OwnerCreateOrUpdate }) =>
      ownersApi.update(id, data),
    onSuccess: (updatedOwner) => {
      // Update the specific owner in cache
      queryClient.setQueryData(
        ownerKeys.detail(updatedOwner.idOwner!),
        updatedOwner
      );

      // Invalidate lists to refresh
      queryClient.invalidateQueries({ queryKey: ownerKeys.lists() });
    },
  });
}

// Hook to delete an owner
export function useDeleteOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ownersApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ownerKeys.detail(deletedId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: ownerKeys.lists() });
    },
  });
}
