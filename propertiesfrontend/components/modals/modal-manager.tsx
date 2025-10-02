"use client";

import * as React from "react";
import { EntityModal } from "./entity-modal";
import { OwnerForm, PropertyForm } from "@/components/forms";
import { ModalContextType } from "@/context/modal-context";
import { useCreateOwner, useUpdateOwner, useOwners } from "@/hooks/use-owners";
import { useCreateProperty, useUpdateProperty } from "@/hooks/use-properties";
import { OwnerFormData, PropertyFormData } from "@/lib/validations";
import { Owner, Property } from "@/lib/types";
import { showSuccessToast } from "@/lib/error-handler";

interface ModalManagerProps {
  modal: ModalContextType;
}

export function ModalManager({ modal }: ModalManagerProps) {
  // Only fetch owners when modal is open and it's for properties
  const shouldFetchOwners = modal.isOpen && modal.entityType === "property";
  const { data: owners = [] } = useOwners({
    enabled: shouldFetchOwners,
  });

  // Owner mutations
  const createOwnerMutation = useCreateOwner();
  const updateOwnerMutation = useUpdateOwner();

  // Property mutations
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();

  const isLoading = React.useMemo(() => {
    return (
      createOwnerMutation.isPending ||
      updateOwnerMutation.isPending ||
      createPropertyMutation.isPending ||
      updatePropertyMutation.isPending
    );
  }, [
    createOwnerMutation.isPending,
    updateOwnerMutation.isPending,
    createPropertyMutation.isPending,
    updatePropertyMutation.isPending,
  ]);

  const handleOwnerSubmit = async (data: OwnerFormData) => {
    try {
      if (modal.mode === "create") {
        await createOwnerMutation.mutateAsync(data);
        showSuccessToast("Owner created successfully!");
      } else if (modal.data && "idOwner" in modal.data) {
        await updateOwnerMutation.mutateAsync({
          id: modal.data.idOwner!,
          data,
        });
        showSuccessToast("Owner updated successfully!");
      }
      modal.closeModal();
    } catch (error) {
      console.error("Error saving owner:", error);
      // Error is handled by the interceptor
    }
  };

  const handlePropertySubmit = async (data: PropertyFormData) => {
    try {
      const { imageFile, ...propertyData } = data;

      if (modal.mode === "create") {
        await createPropertyMutation.mutateAsync({
          data: propertyData,
          imageFile,
        });
        showSuccessToast("Property created successfully!");
      } else if (modal.data && "idProperty" in modal.data) {
        await updatePropertyMutation.mutateAsync({
          id: modal.data.idProperty!,
          data: propertyData,
          imageFile,
        });
        showSuccessToast("Property updated successfully!");
      }
      modal.closeModal();
    } catch (error) {
      console.error("Error saving property:", error);
      // Error is handled by the interceptor
    }
  };

  const renderFormContent = () => {
    if (modal.entityType === "owner") {
      return (
        <OwnerForm
          initialData={modal.data as Owner}
          onSubmit={handleOwnerSubmit}
          isLoading={isLoading}
        />
      );
    } else {
      return (
        <PropertyForm
          initialData={modal.data as Property}
          owners={owners}
          onSubmit={handlePropertySubmit}
          isLoading={isLoading}
        />
      );
    }
  };

  return (
    <EntityModal
      isOpen={modal.isOpen}
      onClose={modal.closeModal}
      entityType={modal.entityType}
      mode={modal.mode}
      isLoading={isLoading}
    >
      {renderFormContent()}
    </EntityModal>
  );
}
