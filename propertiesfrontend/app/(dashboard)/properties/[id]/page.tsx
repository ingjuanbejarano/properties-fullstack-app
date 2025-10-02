"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  User,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { useProperty, useDeleteProperty } from "@/hooks/use-properties";
import { useModal } from "@/hooks/use-modal";
import { showSuccessToast } from "@/lib/error-handler";

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

export default function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleted, setIsDeleted] = React.useState(false);
  const { openEditModal } = useModal();
  const deletePropertyMutation = useDeleteProperty();

  const {
    data: property,
    isLoading,
    error,
  } = useProperty(params.id, {
    enabled: !isDeleted,
  });

  const handleEdit = () => {
    if (property) {
      openEditModal("property", property);
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!property?.idProperty) return;

    if (property.idProperty) {
      // Disable the query immediately to prevent 404 refetch
      setIsDeleted(true);

      await deletePropertyMutation.mutateAsync(property.idProperty);
      setShowDeleteDialog(false);
      showSuccessToast("Property deleted successfully!");
      router.push("/properties");
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const getImageSrc = (image: string) => {
    if (image.startsWith("data:")) {
      return image;
    }
    if (image && !image.startsWith("http")) {
      return `data:image/jpeg;base64,${image}`;
    }
    return image;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="mb-6">
            <div className="h-10 w-32 bg-muted animate-pulse rounded mb-4" />
            <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          </div>

          {/* Image skeleton */}
          <div className="h-96 w-full bg-muted animate-pulse rounded-lg mb-8" />

          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Property not found
            </h2>
            <p className="text-muted-foreground mb-6">
              The property you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </p>
            <Button onClick={() => router.push("/properties")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Desktop layout */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-foreground">
                  Property Details
                </h1>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Mobile layout */}
            <div className="md:hidden space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-2xl font-bold text-foreground">
                  Property Details
                </h1>
              </div>

              {/* Action buttons below title on mobile */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="cursor-pointer flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive cursor-pointer flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Property image */}
          <div className="relative h-96 bg-muted rounded-lg overflow-hidden mb-8">
            {property.image ? (
              <Image
                src={getImageSrc(property.image)}
                alt={property.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                unoptimized={
                  property.image.startsWith("data:") ||
                  (!property.image.startsWith("http") && !!property.image)
                }
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground text-lg">
                  No image available
                </div>
              </div>
            )}
          </div>

          {/* Property details */}
          <div className="space-y-8">
            {/* Title and Price */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {property.name}
              </h2>
              <div className="flex items-center space-x-2 text-2xl font-bold text-white">
                <DollarSign className="w-6 h-6" />
                <span>{property.price?.toLocaleString() || 0}</span>
              </div>
            </div>

            {/* Property information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Location
                </h3>
                <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-foreground">{property.address}</span>
                </div>
              </div>

              {/* Owner Information */}
              {property.idOwner && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Owner
                  </h3>
                  <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <span className="text-foreground">
                        Owner ID: {property.idOwner}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Property ID */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Property ID:</span>
                <code className="px-2 py-1 bg-muted rounded text-xs">
                  {property.idProperty}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDeleteDialog
        isOpen={showDeleteDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title={property.name}
        isLoading={deletePropertyMutation.isPending}
      />
    </>
  );
}
