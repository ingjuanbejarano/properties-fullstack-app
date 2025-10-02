"use client";

import { useEffect } from "react";
import {
  ToastProvider as ToastContextProvider,
  useToast,
} from "@/context/toast-context";
import { setGlobalToast } from "@/lib/error-handler";
import { ToastContainer } from "@/components/ui/toast";

function ToastInitializer({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  useEffect(() => {
    // Set the global toast function so the error handler can use it
    setGlobalToast(showToast);
  }, [showToast]);

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastContextProvider>
      <ToastInitializer>{children}</ToastInitializer>
    </ToastContextProvider>
  );
}
