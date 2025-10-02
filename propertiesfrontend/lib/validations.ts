import { z } from "zod";

// Owner validation schemas
export const ownerCreateOrUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address cannot exceed 200 characters"),
});

export const ownerSchema = ownerCreateOrUpdateSchema.extend({
  idOwner: z.string().optional(),
});

// Property validation schemas
export const propertyCreateOrUpdateSchema = z.object({
  idOwner: z.string().min(1, "Owner ID is required"),
  name: z
    .string()
    .min(1, "Property name is required")
    .max(100, "Name cannot exceed 100 characters"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address cannot exceed 200 characters"),
  price: z
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(999999999, "Price is too high"),
});

export const propertyFormSchema = propertyCreateOrUpdateSchema.extend({
  imageFile: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024; // 5MB max
    }, "Image must be smaller than 5MB")
    .refine((file) => {
      if (!file) return true;
      return ["image/jpeg", "image/jpg", "image/png"].includes(file.type);
    }, "Only JPEG, JPG and PNG images are allowed"),
});

export const propertySchema = propertyCreateOrUpdateSchema.extend({
  idProperty: z.string().optional(),
  image: z.string().optional(), // Base64 or URL
});

// Filter schemas
export const propertyFiltersSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
});

// Type inference from schemas
export type OwnerFormData = z.infer<typeof ownerCreateOrUpdateSchema>;
export type PropertyFormData = z.infer<typeof propertyFormSchema>;
export type PropertyFiltersData = z.infer<typeof propertyFiltersSchema>;
