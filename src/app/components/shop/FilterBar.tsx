import { useEffect, useState } from "react";
import { Search, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import * as Slider from "@radix-ui/react-slider";

interface FilterBarProps {
  onFiltersChange: (filters: any) => void;
  activeFilters: any;
  categories: string[];
  vendors: string[];
  maxPrice: number;
}

export function FilterBar({
  onFiltersChange,
  activeFilters,
  categories,
  vendors,
  maxPrice,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const sortOptions = [
    "Relevance",
    "Price: Low to High",
    "Price: High to Low",
    "Rating",
    "Newest",
  ];

  useEffect(() => {
    if (Array.isArray(activeFilters.priceRange)) {
      setPriceRange(activeFilters.priceRange);
    }
  }, [activeFilters.priceRange]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, maxPrice]);
    onFiltersChange({
      search: "",
      category: "All Categories",
      priceRange: [0, maxPrice],
      vendor: "All Vendors",
      rating: "All Ratings",
      availability: "All Items",
      sortBy: "Relevance",
    });
  };

  const activeFilterCount = Object.values(activeFilters).filter((v) => {
    if (typeof v === "string")
      return (
        v !== "All Categories" &&
        v !== "All Vendors" &&
        v !== "All Ratings" &&
        v !== "All Items" &&
        v !== "Relevance"
      );
    if (Array.isArray(v)) return v[0] !== 0 || v[1] !== maxPrice;
    return false;
  }).length;

  return (
    <>
      {/* Desktop Filter Bar */}
      <div className="hidden lg:block sticky top-16 z-50 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-12 gap-3">
            {/* Search */}
            <div className="col-span-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onFiltersChange({
                      ...activeFilters,
                      search: e.target.value,
                    });
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
                />
              </div>
            </div>

            {/* Category */}
            <div className="col-span-2">
              <Select.Root
                value={activeFilters.category}
                onValueChange={(value) =>
                  onFiltersChange({ ...activeFilters, category: value })
                }
              >
                <Select.Trigger className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm flex items-center justify-between bg-white hover:bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#16A34A]">
                  <Select.Value />
                  <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white rounded-lg shadow-lg border border-[#E5E7EB] overflow-hidden z-50">
                    <Select.Viewport className="p-1">
                      {categories.map((cat) => (
                        <Select.Item
                          key={cat}
                          value={cat}
                          className="px-4 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] cursor-pointer outline-none rounded"
                        >
                          <Select.ItemText>{cat}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Price Range */}
            <div className="col-span-2">
              <div className="px-4 py-2 border border-[#E5E7EB] rounded-lg bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#6B7280]">Price Range</span>
                  <span className="text-xs font-medium text-[#111827]">
                    Rs. {priceRange[0]} - Rs. {priceRange[1]}
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={priceRange}
                  onValueChange={(value) => {
                    setPriceRange(value);
                    onFiltersChange({ ...activeFilters, priceRange: value });
                  }}
                  max={maxPrice}
                  step={10}
                  minStepsBetweenThumbs={1}
                >
                  <Slider.Track className="bg-[#E5E7EB] relative grow rounded-full h-1">
                    <Slider.Range className="absolute bg-[#16A34A] rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-[#16A34A] rounded-full hover:bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#22C55E]" />
                  <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-[#16A34A] rounded-full hover:bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#22C55E]" />
                </Slider.Root>
              </div>
            </div>

            {/* Vendor */}
            <div className="col-span-2">
              <Select.Root
                value={activeFilters.vendor}
                onValueChange={(value) =>
                  onFiltersChange({ ...activeFilters, vendor: value })
                }
              >
                <Select.Trigger className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm flex items-center justify-between bg-white hover:bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#16A34A]">
                  <Select.Value />
                  <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white rounded-lg shadow-lg border border-[#E5E7EB] overflow-hidden z-50">
                    <Select.Viewport className="p-1">
                      {vendors.map((vendor) => (
                        <Select.Item
                          key={vendor}
                          value={vendor}
                          className="px-4 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] cursor-pointer outline-none rounded"
                        >
                          <Select.ItemText>{vendor}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Sort By */}
            <div className="col-span-2">
              <Select.Root
                value={activeFilters.sortBy}
                onValueChange={(value) =>
                  onFiltersChange({ ...activeFilters, sortBy: value })
                }
              >
                <Select.Trigger className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm flex items-center justify-between bg-white hover:bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#16A34A]">
                  <Select.Value placeholder="Sort by..." />
                  <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white rounded-lg shadow-lg border border-[#E5E7EB] overflow-hidden z-50">
                    <Select.Viewport className="p-1">
                      {sortOptions.map((option) => (
                        <Select.Item
                          key={option}
                          value={option}
                          className="px-4 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] cursor-pointer outline-none rounded"
                        >
                          <Select.ItemText>{option}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Clear Filters */}
            <div className="col-span-1">
              <button
                onClick={handleClearFilters}
                disabled={activeFilterCount === 0}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-sm text-[#6B7280]">Active filters:</span>
              {activeFilters.category !== "All Categories" && (
                <span className="px-3 py-1 bg-[#22C55E]/10 text-[#16A34A] text-sm rounded-full flex items-center gap-2">
                  {activeFilters.category}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() =>
                      onFiltersChange({
                        ...activeFilters,
                        category: "All Categories",
                      })
                    }
                  />
                </span>
              )}
              {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
                <span className="px-3 py-1 bg-[#22C55E]/10 text-[#16A34A] text-sm rounded-full flex items-center gap-2">
                  Rs. {priceRange[0]} - Rs. {priceRange[1]}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => {
                      setPriceRange([0, maxPrice]);
                      onFiltersChange({
                        ...activeFilters,
                        priceRange: [0, maxPrice],
                      });
                    }}
                  />
                </span>
              )}
              {activeFilters.vendor !== "All Vendors" && (
                <span className="px-3 py-1 bg-[#22C55E]/10 text-[#16A34A] text-sm rounded-full flex items-center gap-2">
                  {activeFilters.vendor}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() =>
                      onFiltersChange({
                        ...activeFilters,
                        vendor: "All Vendors",
                      })
                    }
                  />
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-[#16A34A] text-white rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#F59E0B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <Select.Root
            value={activeFilters.sortBy}
            onValueChange={(value) =>
              onFiltersChange({ ...activeFilters, sortBy: value })
            }
          >
            <Select.Trigger className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm flex items-center gap-2">
              <Select.Value />
              <ChevronDown className="w-4 h-4" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-lg shadow-lg border border-[#E5E7EB] z-50">
                <Select.Viewport className="p-1">
                  {sortOptions.map((option) => (
                    <Select.Item
                      key={option}
                      value={option}
                      className="px-4 py-2 text-sm hover:bg-[#F9FAFB] cursor-pointer"
                    >
                      <Select.ItemText>{option}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Mobile Filters Panel */}
        {showMobileFilters && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-[#E5E7EB] shadow-lg p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onFiltersChange({ ...activeFilters, search: e.target.value });
                }}
                className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm"
              />
            </div>
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 border-2 border-[#16A34A] text-[#16A34A] rounded-lg"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}
