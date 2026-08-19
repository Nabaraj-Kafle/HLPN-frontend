import { Link } from "react-router";
import { ArrowRight, Box, MapPin, ShieldCheck } from "lucide-react";
import type { VendorItem } from "@/lib/store-api";

interface VendorsSectionProps {
  vendors: VendorItem[];
  isLoading: boolean;
}

export function VendorsSection({ vendors, isLoading }: VendorsSectionProps) {
  // Limit to 6 vendors to make exactly two rows of 3 on desktop
  const displayVendors = vendors.slice(0, 6);
  return <></>;
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            Our Partner Vendors
          </h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            Discover authentic local producers, farmers, and artisans selling
            quality products from Nepal
          </p>
          <div className="absolute top-0 right-0 hidden md:block">
            <Link
              to="/vendor"
              className="inline-flex items-center gap-2 text-[#16A34A] font-bold hover:text-[#15803D] transition-colors mt-2"
            >
              See More Vendors
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-[#6B7280]">
            Loading vendors...
          </div>
        ) : displayVendors.length === 0 ? (
          <div className="text-center py-10 text-[#6B7280]">
            No partner vendors found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVendors.map((vendor) => (
              <article
                key={vendor.id}
                className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={vendor.banner}
                    alt={vendor.storeName}
                  />
                </div>
                <div className="px-5 py-5 flex flex-col flex-grow">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold leading-tight text-[#0F172A] group-hover:text-[#16A34A] transition-colors">
                      {vendor.storeName}
                    </h3>
                    {vendor.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-1 text-xs font-semibold text-[#166534] shrink-0">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="my-2 w-fit rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-semibold text-[#166534]">
                    {vendor.category}
                  </p>
                  <p className="text-sm text-[#6B7280] line-clamp-2 mt-1 mb-4 flex-grow">
                    {vendor.description || "Verified local store in Nepal."}
                  </p>
                  <div className="space-y-2 text-sm text-[#334155] border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#64748B]" />
                      {vendor.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Box className="h-4 w-4 text-[#64748B]" />
                      {vendor.productsCount} products
                    </div>
                  </div>
                  <Link
                    to={`/vendor/${vendor.id}`}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2.5 font-semibold text-white transition-colors hover:bg-[#15803D]"
                  >
                    View Store
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-12 lg:hidden">
          <Link
            to="/vendor"
            className="inline-block px-8 py-3 border-2 border-[#16A34A] text-[#16A34A] hover:bg-[#16A34A] hover:text-white rounded-lg transition-colors font-bold"
          >
            See More Vendors
          </Link>
        </div>
      </div>
    </section>
  );
}
