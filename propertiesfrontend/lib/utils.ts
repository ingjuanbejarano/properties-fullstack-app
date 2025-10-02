import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency for displaying prices
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format file size for image uploads
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Convert File to base64 for preview
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// Format image src for display (handles base64 with/without data URI prefix)
export function formatImageSrc(image: string): string {
  // If it's already a data URI, return as is
  if (image.startsWith("data:")) {
    return image;
  }

  // If it's a base64 string without data URI prefix, add it
  if (image && !image.startsWith("http")) {
    return `data:image/jpeg;base64,${image}`;
  }

  // Otherwise assume it's a URL
  return image;
}

// Debounce function for search inputs
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Generate initials from name for avatar fallbacks
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Truncate text for mobile cards
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Check if the app is running on mobile
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

// API URL helper
export function getApiUrl(endpoint: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://localhost:7297/api";
  return `${baseUrl}${endpoint}`;
}
