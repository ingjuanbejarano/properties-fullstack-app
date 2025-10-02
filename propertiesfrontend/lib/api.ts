import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  Property,
  Owner,
  PropertyCreateOrUpdate,
  OwnerCreateOrUpdate,
  PropertyFilters,
} from "./types";
import { handleApiError } from "./error-handler";

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5007/api";

  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Use the centralized error handler
      handleApiError(error);
      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();

// Properties API functions
export const propertiesApi = {
  // Get all properties with optional filters
  getAll: async (filters?: PropertyFilters): Promise<Property[]> => {
    const params = new URLSearchParams();

    if (filters?.name) params.append("name", filters.name);
    if (filters?.address) params.append("address", filters.address);
    if (filters?.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());

    const queryString = params.toString();
    const url = queryString ? `/Properties?${queryString}` : "/Properties";

    const response: AxiosResponse<Property[]> = await apiClient.get(url);
    return response.data;
  },

  // Get property by ID
  getById: async (id: string): Promise<Property> => {
    const response: AxiosResponse<Property> = await apiClient.get(
      `/Properties/${id}`
    );
    return response.data;
  },

  // Create new property
  create: async (
    data: PropertyCreateOrUpdate,
    imageFile?: File
  ): Promise<Property> => {
    const formData = new FormData();

    // Append property data as JSON string
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    // Append image file if provided
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    const response: AxiosResponse<Property> = await apiClient.post(
      "/Properties",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Update existing property
  update: async (
    id: string,
    data: PropertyCreateOrUpdate,
    imageFile?: File
  ): Promise<Property> => {
    const formData = new FormData();

    // Append property data
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    // Append image file if provided
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    const response: AxiosResponse<Property> = await apiClient.put(
      `/Properties/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Delete property
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/Properties/${id}`);
  },
};

// Owners API functions
export const ownersApi = {
  // Get all owners
  getAll: async (): Promise<Owner[]> => {
    const response: AxiosResponse<Owner[]> = await apiClient.get("/Owners");
    return response.data;
  },

  // Get owner by ID
  getById: async (id: string): Promise<Owner> => {
    const response: AxiosResponse<Owner> = await apiClient.get(`/Owners/${id}`);
    return response.data;
  },

  // Create new owner
  create: async (data: OwnerCreateOrUpdate): Promise<Owner> => {
    const response: AxiosResponse<Owner> = await apiClient.post(
      "/Owners",
      data
    );
    return response.data;
  },

  // Update existing owner
  update: async (id: string, data: OwnerCreateOrUpdate): Promise<Owner> => {
    const response: AxiosResponse<Owner> = await apiClient.put(
      `/Owners/${id}`,
      data
    );
    return response.data;
  },

  // Delete owner
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/Owners/${id}`);
  },
};

// Export the axios instance for custom requests if needed
export { apiClient };
