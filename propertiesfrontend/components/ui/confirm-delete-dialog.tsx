"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading = false,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-left">Delete Property</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {description && <>{description}</>}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Deleting..." : "Delete Property"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
