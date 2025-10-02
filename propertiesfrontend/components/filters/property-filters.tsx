"use client";

import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

interface FiltersState {
  address: string;
  minPrice: string;
  maxPrice: string;
}

interface PropertyFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
}

export function PropertyFilters({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: PropertyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localFilters, setLocalFilters] = useState(filters);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  // Debounce filters
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange(localFilters);
    }, 300);

    return () => clearTimeout(timer);
  }, [localFilters, onFiltersChange]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearch(e.target.value);
    },
    []
  );

  const handleFilterChange = useCallback(
    (key: keyof FiltersState, value: string) => {
      setLocalFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setLocalSearch("");
    setLocalFilters({
      address: "",
      minPrice: "",
      maxPrice: "",
    });
    setShowAdvanced(false);
  }, []);

  const hasActiveFilters =
    localSearch ||
    localFilters.address ||
    localFilters.minPrice ||
    localFilters.maxPrice;

  return (
    <div className="space-y-4">
      {/* Main search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by property name..."
          value={localSearch}
          onChange={handleSearchChange}
          className="pl-10 pr-12"
        />
        {localSearch && (
          <button
            onClick={() => setLocalSearch("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[16px] h-4 flex items-center justify-center">
              {
                [
                  localSearch,
                  localFilters.address,
                  localFilters.minPrice,
                  localFilters.maxPrice,
                ].filter(Boolean).length
              }
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
          <h3 className="font-medium text-sm text-foreground mb-3">
            Advanced filters
          </h3>

          {/* Address filter */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm">
              Address
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Filter by specific address..."
              value={localFilters.address}
              onChange={(e) => handleFilterChange("address", e.target.value)}
            />
          </div>

          {/* Price filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPrice" className="text-sm">
                Minimum price
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={localFilters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                min="0"
                step="1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPrice" className="text-sm">
                Maximum price
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="No limit"
                value={localFilters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                min="0"
                step="1000"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
