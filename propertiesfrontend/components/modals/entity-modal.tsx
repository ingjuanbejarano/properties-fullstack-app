"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EntityType } from "@/lib/types";

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: EntityType;
  mode: "create" | "edit";
  title?: string;
  description?: string;
  children: React.ReactNode;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function EntityModal({
  isOpen,
  onClose,
  entityType,
  mode,
  title,
  description,
  children,
  onCancel,
  isLoading = false,
}: EntityModalProps) {
  const defaultTitle = React.useMemo(() => {
    if (title) return title;

    const entityName = entityType === "property" ? "Property" : "Owner";
    return mode === "create" ? `Create ${entityName}` : `Edit ${entityName}`;
  }, [title, entityType, mode]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>{defaultTitle}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-4">{children}</div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="entity-form"
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading
              ? "Saving..."
              : mode === "create"
              ? `Create ${entityType === "property" ? "Property" : "Owner"}`
              : `Update ${entityType === "property" ? "Property" : "Owner"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
