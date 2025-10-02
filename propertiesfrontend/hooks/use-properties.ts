import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertiesApi } from "@/lib/api";
import { PropertyCreateOrUpdate, PropertyFilters } from "@/lib/types";

// Query keys for React Query
export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters?: PropertyFilters) =>
    [...propertyKeys.lists(), { filters }] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
};

// Hook to get all properties with optional filters
export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: () => propertiesApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

// Hook to get a single property by ID
export function useProperty(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertiesApi.getById(id),
    enabled: !!id && options?.enabled !== false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook to create a new property
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      imageFile,
    }: {
      data: PropertyCreateOrUpdate;
      imageFile?: File;
    }) => propertiesApi.create(data, imageFile),
    onSuccess: () => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

// Hook to update an existing property
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      imageFile,
    }: {
      id: string;
      data: PropertyCreateOrUpdate;
      imageFile?: File;
    }) => propertiesApi.update(id, data, imageFile),
    onSuccess: (updatedProperty) => {
      // Update the specific property in cache
      queryClient.setQueryData(
        propertyKeys.detail(updatedProperty.idProperty!),
        updatedProperty
      );

      // Invalidate lists to refresh
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

// Hook to delete a property
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertiesApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: propertyKeys.detail(deletedId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}
