"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ownerCreateOrUpdateSchema,
  type OwnerFormData,
} from "@/lib/validations";
import { Owner } from "@/lib/types";

interface OwnerFormProps {
  initialData?: Owner;
  onSubmit: (data: OwnerFormData) => void;
  isLoading?: boolean;
}

export function OwnerForm({
  initialData,
  onSubmit,
  isLoading = false,
}: OwnerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OwnerFormData>({
    resolver: zodResolver(ownerCreateOrUpdateSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        address: initialData.address,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: OwnerFormData) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
      id="entity-form"
    >
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          placeholder="Enter the owner's name"
          disabled={isLoading}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Address Field */}
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          placeholder="Enter the owner's address"
          disabled={isLoading}
          {...register("address")}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>
    </form>
  );
}
