"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function FloatingActionButton({
  onClick,
  label = "Agregar",
  className,
  disabled = false,
}: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 cursor-pointer",
        "sm:h-12 sm:w-auto sm:px-4 sm:rounded-md",
        className
      )}
      size="icon"
    >
      <Plus className="h-6 w-6 sm:h-4 sm:w-4 sm:mr-2" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
