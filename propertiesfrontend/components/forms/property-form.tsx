"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { propertyFormSchema, type PropertyFormData } from "@/lib/validations";
import { Property, Owner } from "@/lib/types";
import { formatFileSize, fileToBase64, formatImageSrc } from "@/lib/utils";

interface PropertyFormProps {
  initialData?: Property;
  owners: Owner[];
  onSubmit: (data: PropertyFormData) => void;
  isLoading?: boolean;
}

export function PropertyForm({
  initialData,
  owners,
  onSubmit,
  isLoading = false,
}: PropertyFormProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      idOwner: initialData?.idOwner || "",
      name: initialData?.name || "",
      address: initialData?.address || "",
      price: initialData?.price || 0,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        idOwner: initialData.idOwner,
        name: initialData.name,
        address: initialData.address,
        price: initialData.price,
      });

      // Set image preview if exists
      if (initialData.image) {
        setImagePreview(formatImageSrc(initialData.image));
      }
    }
  }, [initialData, reset]);

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setValue("imageFile", file);

    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
    } catch (error) {
      console.error("Error converting file to base64:", error);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview("");
    setValue("imageFile", undefined);
  };

  const handleFormSubmit = (data: PropertyFormData) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
      id="entity-form"
    >
      {/* Owner Selection */}
      <div className="space-y-2">
        <Label htmlFor="idOwner">Owner *</Label>
        <select
          id="idOwner"
          disabled={isLoading}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register("idOwner")}
        >
          <option value="">Select an owner</option>
          {owners.map((owner) => (
            <option key={owner.idOwner} value={owner.idOwner}>
              {owner.name}
            </option>
          ))}
        </select>
        {errors.idOwner && (
          <p className="text-sm text-red-500">{errors.idOwner.message}</p>
        )}
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Property Name *</Label>
        <Input
          id="name"
          placeholder="Ex: Country house, Downtown apartment, etc."
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
          placeholder="Enter the property address"
          disabled={isLoading}
          {...register("address")}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      {/* Price Field */}
      <div className="space-y-2">
        <Label htmlFor="price">Price *</Label>
        <Input
          id="price"
          type="number"
          placeholder="0"
          step="0.01"
          min="0"
          disabled={isLoading}
          {...register("price", { valueAsNumber: true })}
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Property Image</Label>

        {imagePreview ? (
          <div className="relative">
            <Image
              src={imagePreview}
              alt="Preview"
              width={400}
              height={128}
              className="w-full h-32 object-cover rounded-md border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
            {selectedFile && (
              <p className="text-xs text-muted-foreground mt-1">
                {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or JPEG (MAX. 5MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageSelect}
                disabled={isLoading}
              />
            </label>
          </div>
        )}

        {errors.imageFile && (
          <p className="text-sm text-red-500">{errors.imageFile.message}</p>
        )}
      </div>
    </form>
  );
}
