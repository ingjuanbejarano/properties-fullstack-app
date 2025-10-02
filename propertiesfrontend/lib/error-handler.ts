import { AxiosError } from "axios";

// Global reference to toast function - will be set when app initializes
let globalShowToast:
  | ((
      message: string,
      type?: "success" | "error" | "warning" | "info",
      duration?: number
    ) => void)
  | null = null;

export function setGlobalToast(
  showToast: (
    message: string,
    type?: "success" | "error" | "warning" | "info",
    duration?: number
  ) => void
) {
  globalShowToast = showToast;
}

export function handleApiError(error: unknown): string {
  let errorMessage = "An unexpected error occurred";

  if (error instanceof AxiosError) {
    // Handle Axios errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      // Try to extract message from different possible structures
      if (typeof data === "string") {
        errorMessage = data;
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (data?.error) {
        errorMessage = data.error;
      } else if (data?.title) {
        errorMessage = data.title;
      } else {
        // Default messages based on status code
        switch (status) {
          case 400:
            errorMessage = "Invalid request data";
            break;
          case 401:
            errorMessage = "Authentication required";
            break;
          case 403:
            errorMessage = "Access forbidden";
            break;
          case 404:
            errorMessage = "Resource not found";
            break;
          case 409:
            errorMessage = "Conflict - resource already exists";
            break;
          case 422:
            errorMessage = "Validation failed";
            break;
          case 500:
            errorMessage = "Internal server error";
            break;
          case 502:
            errorMessage = "Service temporarily unavailable";
            break;
          case 503:
            errorMessage = "Service maintenance";
            break;
          default:
            errorMessage = `Server error (${status})`;
        }
      }
    } else if (error.request) {
      // Network error
      errorMessage = "Network error - please check your connection";
    } else {
      // Request setup error
      errorMessage = error.message || "Request failed";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  // Show toast notification if available
  if (globalShowToast) {
    globalShowToast(errorMessage, "error", 6000);
  }

  // Also log to console for debugging
  console.error("API Error:", error);

  return errorMessage;
}

export function showSuccessToast(message: string) {
  if (globalShowToast) {
    globalShowToast(message, "success", 4000);
  }
}

export function showWarningToast(message: string) {
  if (globalShowToast) {
    globalShowToast(message, "warning", 5000);
  }
}

export function showInfoToast(message: string) {
  if (globalShowToast) {
    globalShowToast(message, "info", 4000);
  }
}
