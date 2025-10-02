"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProperties, useDeleteProperty } from "@/hooks/use-properties";
import { PropertyCard, PropertyFilters } from "@/components";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { Property } from "@/lib/types";
import { useModal } from "@/hooks/use-modal";
import { showSuccessToast } from "@/lib/error-handler";

function PropertyListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-background border border-border rounded-lg overflow-hidden shadow-sm"
        >
          {/* Image skeleton */}
          <div className="h-48 w-full bg-muted animate-pulse" />

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title and Price */}
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-8 w-1/2 bg-muted animate-pulse rounded" />
            </div>

            {/* Address */}
            <div className="h-4 w-full bg-muted animate-pulse rounded" />

            {/* Owner */}
            <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PropertiesPage() {
  const router = useRouter();
  const { openCreateModal, openEditModal } = useModal();
  const deletePropertyMutation = useDeleteProperty();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    address: "",
    minPrice: "",
    maxPrice: "",
  });
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null
  );

  // Prepare filters for API call
  const apiFilters = {
    name: searchQuery || undefined,
    address: filters.address || undefined,
    minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
  };

  const { data: properties = [], isLoading, error } = useProperties(apiFilters);

  const handleCreateProperty = () => {
    openCreateModal("property");
  };

  const handleEditProperty = (property: Property) => {
    openEditModal("property", property);
  };

  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
  };

  const handleViewProperty = (property: Property) => {
    if (property.idProperty) {
      router.push(`/properties/${property.idProperty}`);
    }
  };

  const confirmDeleteProperty = async () => {
    if (!propertyToDelete?.idProperty) return;

    // Close modal immediately when user confirms
    const propertyToDeleteRef = propertyToDelete;
    setPropertyToDelete(null);

    if (propertyToDeleteRef.idProperty) {
      await deletePropertyMutation.mutateAsync(propertyToDeleteRef.idProperty);
      showSuccessToast("Property deleted successfully!");
    }
  };

  const cancelDeleteProperty = () => {
    setPropertyToDelete(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Error loading properties
            </h2>
            <p className="text-muted-foreground">
              An error occurred while loading properties. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with title and filters */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Properties</h1>
              <div className="hidden md:block">
                <button
                  onClick={handleCreateProperty}
                  className="bg-foreground text-background px-6 py-2 rounded-md hover:bg-foreground/90 transition-colors font-medium cursor-pointer"
                >
                  New Property
                </button>
              </div>
            </div>

            {/* Filters */}
            <PropertyFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {isLoading ? (
          <PropertyListSkeleton />
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {properties.length === 0
                ? "No properties registered"
                : "No properties found"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {properties.length === 0
                ? "Start by adding your first property."
                : "Try adjusting the search filters."}
            </p>
            {properties.length === 0 && (
              <button
                onClick={handleCreateProperty}
                className="bg-foreground text-background px-6 py-3 rounded-md hover:bg-foreground/90 transition-colors font-medium"
              >
                Create First Property
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results counter */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {`${properties.length} propert${
                  properties.length !== 1 ? "ies" : "y"
                } total`}
              </p>
            </div>

            {/* Properties grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20 md:pb-8">
              {properties.map((property: Property) => (
                <PropertyCard
                  key={property.idProperty}
                  property={property}
                  onEdit={handleEditProperty}
                  onDelete={handleDeleteProperty}
                  onView={handleViewProperty}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button for mobile */}
      <FloatingActionButton
        onClick={handleCreateProperty}
        label="New Property"
      />

      {/* Delete confirmation dialog */}
      <ConfirmDeleteDialog
        isOpen={!!propertyToDelete}
        onClose={cancelDeleteProperty}
        onConfirm={confirmDeleteProperty}
        title={propertyToDelete?.name || ""}
        isLoading={deletePropertyMutation.isPending}
      />
    </div>
  );
}
