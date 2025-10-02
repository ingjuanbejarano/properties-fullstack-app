"use client";

import * as React from "react";
import Image from "next/image";
import { Edit, Trash2, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types";

interface PropertyCardProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  onView?: (property: Property) => void;
}

export function PropertyCard({
  property,
  onEdit,
  onDelete,
  onView,
}: PropertyCardProps) {
  const handleCardClick = () => {
    if (onView) {
      onView(property);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(property);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(property);
    }
  };

  // Function to format image src for display
  const getImageSrc = (image: string) => {
    // If it's already a data URI, return as is
    if (image.startsWith("data:")) {
      return image;
    }

    // If it's a base64 string without data URI prefix, add it
    if (image && !image.startsWith("http")) {
      return `data:image/jpeg;base64,${image}`;
    }

    // Otherwise assume it's a URL
    return image;
  };

  return (
    <div
      className="bg-background border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-48 bg-muted">
        {property.image ? (
          <Image
            src={getImageSrc(property.image)}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={
              property.image.startsWith("data:") ||
              (!property.image.startsWith("http") && !!property.image)
            }
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground text-sm">No image</div>
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          {onEdit && (
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm cursor-pointer"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 text-white" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Price */}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg line-clamp-1">
            {property.name}
          </h3>
          <p className="text-2xl font-bold text-white">
            ${property.price?.toLocaleString() || 0}
          </p>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{property.address}</span>
        </div>

        {/* Owner info - if available */}
        {property.idOwner && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">ID: {property.idOwner}</span>
          </div>
        )}
      </div>
    </div>
  );
}
