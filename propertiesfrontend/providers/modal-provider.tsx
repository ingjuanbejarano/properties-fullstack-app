"use client";

import {
  ModalProvider as ModalContextProvider,
  useModal,
} from "@/context/modal-context";
import { ModalManager } from "@/components/modals";

function ModalRenderer() {
  const modal = useModal();
  return <ModalManager modal={modal} />;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ModalContextProvider>
      {children}
      <ModalRenderer />
    </ModalContextProvider>
  );
}
