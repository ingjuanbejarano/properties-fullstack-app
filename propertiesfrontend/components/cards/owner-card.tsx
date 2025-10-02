"use client";

import React from "react";
import { Edit, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import type { Owner } from "@/lib/types";

interface OwnerCardProps {
  owner: Owner;
  onEdit?: (owner: Owner) => void;
  onDelete?: (owner: Owner) => void;
}

export function OwnerCard({ owner, onEdit, onDelete }: OwnerCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(owner);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(owner);
    }
  };

  const propertiesCount = owner.properties?.length || 0;

  return (
    <div className="group bg-card text-card-foreground rounded-lg border border-border/50 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-border">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar with initials */}
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {getInitials(owner.name)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-none mb-1">
                {owner.name}
              </h3>
              <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                Owner
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <div className="space-y-3">
          {/* Address */}
          <div className="flex items-start space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-muted-foreground leading-relaxed">
              {owner.address}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 pt-0">
        <div className="flex space-x-2 w-full">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex-1 cursor-pointer"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="flex-1 text-destructive hover:text-destructive-foreground hover:bg-destructive cursor-pointer"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
