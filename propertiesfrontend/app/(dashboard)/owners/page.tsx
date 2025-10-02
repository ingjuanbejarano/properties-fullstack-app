"use client";

import React from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { OwnerCard } from "@/components/cards";
import { useModal } from "@/hooks/use-modal";
import { useOwners, useDeleteOwner } from "@/hooks/use-owners";
import { showSuccessToast } from "@/lib/error-handler";
import type { Owner } from "@/lib/types";

export default function OwnersPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [ownerToDelete, setOwnerToDelete] = React.useState<Owner | null>(null);
  const { openCreateModal, openEditModal } = useModal();
  const deleteOwnerMutation = useDeleteOwner();

  const { data: allOwners = [], isLoading, error } = useOwners();

  // Filter owners locally based on search term
  const owners = React.useMemo(() => {
    if (!searchTerm.trim()) return allOwners;

    const lowerSearch = searchTerm.toLowerCase();
    return allOwners.filter(
      (owner: Owner) =>
        owner.name.toLowerCase().includes(lowerSearch) ||
        owner.address.toLowerCase().includes(lowerSearch)
    );
  }, [allOwners, searchTerm]);

  const handleCreateOwner = () => {
    openCreateModal("owner");
  };

  const handleEditOwner = (owner: Owner) => {
    openEditModal("owner", owner);
  };

  const handleDeleteOwner = (owner: Owner) => {
    setOwnerToDelete(owner);
  };

  const confirmDeleteOwner = async () => {
    if (!ownerToDelete?.idOwner) return;

    // Close modal immediately when user confirms
    const ownerToDeleteRef = ownerToDelete;
    setOwnerToDelete(null);

    if (ownerToDeleteRef.idOwner) {
      await deleteOwnerMutation.mutateAsync(ownerToDeleteRef.idOwner);
      showSuccessToast("Owner deleted successfully!");
    }
  };

  const cancelDeleteOwner = () => {
    setOwnerToDelete(null);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Error loading owners</h3>
          <p className="text-muted-foreground">
            There was an error loading the owners list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header with title and search */}
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="space-y-4">
              {/* Title and Desktop Create Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Owners</h1>
                </div>
                <div className="hidden md:block">
                  <button
                    onClick={handleCreateOwner}
                    className="bg-foreground text-background px-6 py-2 rounded-md hover:bg-foreground/90 transition-colors font-medium cursor-pointer"
                  >
                    New Owner
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search owners by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Loading */}
          {isLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 rounded-lg border bg-card animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Owners Grid */}
          {!isLoading && owners.length > 0 && (
            <>
              {/* Results counter */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  {`${owners.length} owner${
                    owners.length !== 1 ? "s" : ""
                  } total`}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {owners.map((owner) => (
                  <OwnerCard
                    key={owner.idOwner}
                    owner={owner}
                    onEdit={handleEditOwner}
                    onDelete={handleDeleteOwner}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {!isLoading && owners.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {searchTerm ? "No owners found" : "No owners registered"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? `No owners match "${searchTerm}". Try a different search term.`
                  : "Start by adding your first owner."}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreateOwner}
                  className="bg-foreground text-background px-6 py-3 rounded-md hover:bg-foreground/90 transition-colors font-medium"
                >
                  Create First Owner
                </button>
              )}
            </div>
          )}
        </div>

        {/* Floating Action Button for mobile */}
        <FloatingActionButton onClick={handleCreateOwner} label="New Owner" />
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!ownerToDelete}
        onClose={cancelDeleteOwner}
        onConfirm={confirmDeleteOwner}
        title="Delete Owner"
        description={
          ownerToDelete
            ? `Are you sure you want to delete "${ownerToDelete.name}"? This action cannot be undone.`
            : ""
        }
        isLoading={deleteOwnerMutation.isPending}
      />
    </>
  );
}
