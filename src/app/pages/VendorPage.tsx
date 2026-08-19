import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Box, MapPin, ShieldCheck, Star } from "lucide-react";
import { storefrontApi, type VendorItem } from "@/lib/store-api";

export function VendorPage() {
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const data = await storefrontApi.getVendors();
        setVendors(data);
      } finally {
        setLoading(false);
      }
    };
    void loadVendors();
  }, []);

  const topVendor = useMemo(
    () => [...vendors].sort((a, b) => b.rating - a.rating)[0],
    [vendors],
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="mb-4 text-4xl font-black leading-tight text-[#0F172A] md:text-5xl">
              Discover verified stores
            </h1>
            <p className="max-w-2xl text-lg text-[#475569]">
              Browse real stores from backend data and open each store to see live products.
            </p>
          </div>

          {topVendor && (
            <article className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-lg">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#16A34A]">
                Top Rated Vendor
              </p>
              <h2 className="text-2xl font-bold text-[#0F172A]">{topVendor.storeName}</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                {topVendor.category} • {topVendor.location}
              </p>
              <img className="my-4 aspect-video w-full rounded-2xl object-cover" src={topVendor.banner} alt={topVendor.storeName} />
            </article>
          )}
        </div>
      </section>

      <section id="vendors-grid" className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="text-[#64748B]">Loading vendors...</div>
          ) : vendors.length === 0 ? (
            <div className="text-[#64748B]">No vendors found.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vendors.map((vendor) => (
                <article
                  key={vendor.id}
                  className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <img className="aspect-video w-full object-cover" src={vendor.banner} alt={vendor.storeName} />
                  <div className="px-5 py-5">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h2 className="text-xl font-bold leading-tight text-[#0F172A]">{vendor.storeName}</h2>
                      {vendor.isVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-1 text-xs font-semibold text-[#166534]">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="my-2 w-fit rounded-full bg-[#DCFCE7] px-2.5 py-1 text-xs font-semibold text-[#166534]">
                      {vendor.category}
                    </p>
                    <div className="mt-3 space-y-2.5 text-sm text-[#334155]">
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#64748B]" />{vendor.location}</div>
                      <div className="flex items-center gap-2"><Box className="h-4 w-4 text-[#64748B]" />{vendor.productsCount} products</div>
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
        </div>
      </section>
    </div>
  );
}
