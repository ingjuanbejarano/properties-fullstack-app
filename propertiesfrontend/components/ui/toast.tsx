"use client";

import { useToast } from "@/context/toast-context";
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "./button";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 p-4 rounded-lg border shadow-lg
            ${getBackgroundColor(toast.type)}
            animate-in slide-in-from-right duration-300
          `}
        >
          {getIcon(toast.type)}
          <p className="text-sm font-medium text-gray-900 flex-1">
            {toast.message}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-500 hover:text-gray-700"
            onClick={() => removeToast(toast.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
