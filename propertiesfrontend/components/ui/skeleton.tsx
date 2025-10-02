"use client";

import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title and Price */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>

        {/* Address */}
        <Skeleton className="h-4 w-full" />

        {/* Owner */}
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
