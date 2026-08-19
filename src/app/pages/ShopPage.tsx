import { useState, useEffect, useMemo, useRef } from "react";
import { FilterBar } from "@/app/components/shop/FilterBar";
import { MapView } from "@/app/components/shop/MapView";
import { ProductCard } from "@/app/components/shop/ProductCard";
import type { Product } from "@/app/components/shop/ProductCard";
import { Map, Grid3x3 } from "lucide-react";
import { storefrontApi } from "@/lib/store-api";
import { useSearchParams } from "react-router";

type CartItem = Product & { quantity: number };
type Location = {
  id: number;
  position: [number, number];
  vendorName: string;
  productCount: number;
  avgPrice: number;
};

interface ShopPageProps {
  products: Product[];
  productsLoading: boolean;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
}

export function ShopPage({
  products,
  productsLoading,
  cartItems,
  onAddToCart,
}: ShopPageProps) {
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    const highestPrice = Math.max(...products.map((product) => product.price), 1000);
    return Math.ceil(highestPrice / 100) * 100;
  }, [products]);

  const [categoryOptions, setCategoryOptions] = useState<string[]>(["All Categories"]);
  const [vendorOptions, setVendorOptions] = useState<string[]>(["All Vendors"]);
  const [showMap, setShowMap] = useState(true);
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [filterVisible, setFilterVisible] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
  const lastScrollY = useRef(0);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    search: "",
    category: "All Categories",
    priceRange: [0, 1000],
    vendor: "All Vendors",
    rating: "All Ratings",
    availability: "All Items",
    sortBy: "Relevance",
  });

  // Read ?search= param from URL (e.g. when navigating from Navbar search)
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setFilters((prev) => ({ ...prev, search: urlSearch }));
    }
  }, [searchParams]);

  // Smart hide/show on scroll — only tracks the RIGHT product list scroll
  const productListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const productList = productListRef.current;
    if (!productList) return;

    const handleScroll = () => {
      const currentY = productList.scrollTop;

      if (currentY < 10) {
        setFilterVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        setFilterVisible(false);
      } else if (currentY < lastScrollY.current - 5) {
        setFilterVisible(true);
      }

      lastScrollY.current = currentY;
    };

    productList.addEventListener("scroll", handleScroll, { passive: true });
    return () => productList.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [categories, vendors] = await Promise.all([
          storefrontApi.getCategories(),
          storefrontApi.getVendors(),
        ]);

        const categoryNames = Array.from(
          new Set(categories.map((category) => category.name).filter(Boolean)),
        );
        const vendorNames = Array.from(
          new Set(vendors.map((vendor) => vendor.storeName).filter(Boolean)),
        );

        setCategoryOptions(["All Categories", ...categoryNames]);
        setVendorOptions(["All Vendors", ...vendorNames]);
      } catch {
        const productCategories = Array.from(
          new Set(products.map((product) => product.badge).filter(Boolean) as string[]),
        );
        const productVendors = Array.from(
          new Set(products.map((product) => product.vendor).filter(Boolean)),
        );

        setCategoryOptions(["All Categories", ...productCategories]);
        setVendorOptions(["All Vendors", ...productVendors]);
      }
    };

    void loadFilterOptions();
  }, [products]);

  useEffect(() => {
    setFilters((prev) => {
      // Upgrade legacy/default range (0-1000) to real product max so expensive items are visible.
      if (prev.priceRange[0] === 0 && prev.priceRange[1] === 1000 && maxPrice !== 1000) {
        return {
          ...prev,
          priceRange: [0, maxPrice],
        };
      }

      return prev;
    });
  }, [maxPrice]);

  useEffect(() => {
    setFilters((prev) => {
      const nextCategory = categoryOptions.includes(prev.category)
        ? prev.category
        : "All Categories";
      const nextVendor = vendorOptions.includes(prev.vendor)
        ? prev.vendor
        : "All Vendors";

      if (nextCategory === prev.category && nextVendor === prev.vendor) {
        return prev;
      }

      return {
        ...prev,
        category: nextCategory,
        vendor: nextVendor,
      };
    });
  }, [categoryOptions, vendorOptions]);

  useEffect(() => {
    const loadVendorLocations = async () => {
      try {
        const vendors = await storefrontApi.getVendors();
        console.log('[ShopPage] fetched vendors:', vendors);

        const mappedLocations = vendors
          .filter((vendor) => vendor.latitude != null && vendor.longitude != null)
          .map((vendor) => ({
            id: vendor.id,
            position: [Number(vendor.latitude), Number(vendor.longitude)] as [number, number],
            vendorName: vendor.storeName,
            productCount: vendor.productsCount,
            avgPrice: 0,
          }));

        console.log('[ShopPage] mappedLocations:', mappedLocations);

        setLocations(mappedLocations);
      } catch (error) {
        console.error("Failed to load vendor locations:", error);
        setLocations([]);
      }
    };

    void loadVendorLocations();
  }, []);

  const handleSelectVendor = (vendorId: number | null) => {
    if (vendorId === null) {
      setSelectedVendorId(null);

      setFilters((prev) => ({
        ...prev,
        vendor: "All Vendors",
      }));

      return;
    }

    setSelectedVendorId(vendorId);

    const vendor = locations.find((l) => l.id === vendorId);

    if (vendor) {
      setFilters((prev) => ({
        ...prev,
        vendor: vendor.vendorName,
      }));
      // Auto-scroll slightly down to results header
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const filteredProducts = useMemo(() => {
    const searchQuery = filters.search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      if (filters.category !== "All Categories") {
        const productCategory = (product.badge ?? "").trim().toLowerCase();
        if (productCategory !== filters.category.trim().toLowerCase()) {
          return false;
        }
      }

      if (filters.vendor !== "All Vendors") {
        const productVendor = product.vendor.trim().toLowerCase();
        if (productVendor !== filters.vendor.trim().toLowerCase()) {
          return false;
        }
      }

      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      if (searchQuery) {
        const haystack = `${product.name} ${product.vendor} ${product.location}`.toLowerCase();
        if (!haystack.includes(searchQuery)) {
          return false;
        }
      }

      return true;
    });

    switch (filters.sortBy) {
      case "Price: Low to High":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "Price: High to Low":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "Rating":
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case "Newest":
      case "Relevance":
      default:
        return filtered;
    }
  }, [products, filters]);

  const getCartQuantity = (productId: number) => {
    return cartItems.find((item) => item.id === productId)?.quantity ?? 0;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">

      {/* ✅ Smart sticky filter bar — hides on scroll down, shows on scroll up */}
      <div
        ref={filterBarRef}
        style={{
          position: "sticky",
          top: "68px",
          zIndex: 40,
          transform: filterVisible ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        <FilterBar
          onFiltersChange={setFilters}
          activeFilters={filters}
          categories={categoryOptions}
          vendors={vendorOptions}
          maxPrice={maxPrice}
        />
      </div>

      <div>
        {/* Mobile View Toggle */}
        <div className="lg:hidden px-4 py-3 bg-white border-b border-[#E5E7EB]">
          <div className="flex relative z-0 gap-2">
            <button
              onClick={() => setShowMap(false)}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${!showMap ? "bg-[#16A34A] text-white" : "bg-[#F9FAFB] text-[#374151]"
                }`}
            >
              <Grid3x3 className="w-4 h-4" />
              List View
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${showMap ? "bg-[#16A34A] text-white" : "bg-[#F9FAFB] text-[#374151]"
                }`}
            >
              <Map className="w-4 h-4" />
              Map View
            </button>
          </div>
        </div>

        {/* Centered Map and Product List Stacked Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

          {/* Map View - full width on top */}
          {showMap && (
            <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] relative z-0">
              <MapView
                locations={locations}
                onSelect={handleSelectVendor}
              />
            </div>
          )}

          {/* Results Header */}
          <div ref={resultsRef} className="text-center py-6 border-b border-[#E5E7EB]">
            <h2 className="text-3xl font-extrabold text-[#111827]">
              {filteredProducts.length} Products Found
            </h2>
            <p className="text-sm text-[#6B7280] mt-2">
              Showing results for your search criteria
            </p>
            {selectedVendorId && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
                  {locations.find((l) => l.id === selectedVendorId)?.vendorName}
                </div>
                <button
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                  onClick={() => {
                    setSelectedVendorId(null);
                    setFilters((prev) => ({ ...prev, vendor: "All Vendors" }));
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Product Cards List below */}
          <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <div className="space-y-6">
              {productsLoading ? (
                <div className="text-center py-10 text-[#6B7280]">
                  Loading products...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-10 text-[#6B7280]">
                  No products found.
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id} id={`product-${product.id}`} className="border-b border-[#F3F4F6] last:border-0 pb-6 last:pb-0">
                    <ProductCard
                      product={product}
                      isHighlighted={hoveredProductId === product.id}
                      onMouseEnter={() => setHoveredProductId(product.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                      onAddToCart={onAddToCart}
                      cartQuantity={getCartQuantity(product.id)}
                    />
                  </div>
                ))
              )}

              {/* Load More */}
              <div className="pt-6 text-center">
                <button className="px-8 py-3 border-2 border-[#16A34A] text-[#16A34A] hover:bg-[#16A34A] hover:text-white rounded-lg transition-colors font-bold">
                  Load More Products
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}