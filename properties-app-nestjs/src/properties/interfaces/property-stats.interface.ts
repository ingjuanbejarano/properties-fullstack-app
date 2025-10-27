export interface PropertyStats {
  totalProperties: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface PropertyByOwner {
  idOwner: string;
  count: number;
}

export interface CompleteStats extends PropertyStats {
  propertiesByOwner: PropertyByOwner[];
}
