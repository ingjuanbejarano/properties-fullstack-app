"use client";

import * as React from "react";
import { EntityType, Owner, Property } from "@/lib/types";

export interface ModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  entityType: EntityType;
  data?: Owner | Property;
}

export interface ModalActions {
  openCreateModal: (entityType: EntityType) => void;
  openEditModal: (entityType: EntityType, data: Owner | Property) => void;
  closeModal: () => void;
}

export interface ModalContextType extends ModalState, ModalActions {}

const ModalContext = React.createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ModalState>({
    isOpen: false,
    mode: "create",
    entityType: "property",
    data: undefined,
  });

  const openCreateModal = React.useCallback((entityType: EntityType) => {
    setState({
      isOpen: true,
      mode: "create",
      entityType,
      data: undefined,
    });
  }, []);

  const openEditModal = React.useCallback(
    (entityType: EntityType, data: Owner | Property) => {
      setState({
        isOpen: true,
        mode: "edit",
        entityType,
        data,
      });
    },
    []
  );

  const closeModal = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const value: ModalContextType = {
    ...state,
    openCreateModal,
    openEditModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal(): ModalContextType {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
