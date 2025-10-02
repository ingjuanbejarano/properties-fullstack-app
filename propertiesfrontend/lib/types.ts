// Types based on the backend API DTOs

// Owner types
export interface Owner {
  idOwner?: string;
  name: string;
  address: string;
  properties?: Property[];
}

export interface OwnerCreateOrUpdate {
  name: string;
  address: string;
}

// Property types
export interface Property {
  idProperty?: string;
  idOwner: string;
  name: string;
  address: string;
  price: number;
  image?: string; // Base64 string or URL
}

export interface PropertyCreateOrUpdate {
  idOwner: string;
  name: string;
  address: string;
  price: number;
}

// Form types for frontend forms
export interface PropertyFormData extends PropertyCreateOrUpdate {
  imageFile?: File;
}

export type OwnerFormData = OwnerCreateOrUpdate;

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Query filter types
export interface PropertyFilters {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
}

// UI State types
export interface ModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  data?: Property | Owner;
}

export type EntityType = "property" | "owner";

// Error types
export interface ApiError {
  message: string;
  status?: number;
  field?: string;
}
