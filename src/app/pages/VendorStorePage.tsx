import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, MapPin, Package, ShieldCheck, Star } from "lucide-react";
import { storefrontApi, type ProductDetails, type VendorItem } from "@/lib/store-api";

export function VendorStorePage() {
  const params = useParams();
  const vendorId = Number(params.vendorId);

  const [vendor, setVendor] = useState<VendorItem | null>(null);
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendorStore = async () => {
      if (!vendorId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const vendorData = await storefrontApi.getVendorById(vendorId);
        setVendor(vendorData);

        const vendorProducts = await storefrontApi.getProducts({
          vendor: vendorData.storeName,
          page_size: 100,
        });
        setProducts(vendorProducts as ProductDetails[]);
      } finally {
        setLoading(false);
      }
    };
    void loadVendorStore();
  }, [vendorId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#64748B]">Loading store...</div>;
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#111827]">Store Not Found</h1>
          <Link to="/vendor" className="mt-4 inline-flex items-center gap-2 text-[#16A34A]">
            <ArrowLeft className="w-4 h-4" />
            Back to vendors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <section className="relative h-[340px] overflow-hidden">
        <img src={vendor.banner} alt={vendor.storeName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl p-6 text-white">
          <Link to="/vendor" className="inline-flex items-center gap-2 text-sm mb-3">
            <ArrowLeft className="w-4 h-4" />
            All Vendors
          </Link>
          <h1 className="text-4xl font-bold">{vendor.storeName}</h1>
          <p className="mt-2 text-white/90">{vendor.description}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{vendor.location}</span>
            <span className="inline-flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" />{vendor.rating}</span>
            <span className="inline-flex items-center gap-1"><Package className="w-4 h-4" />{products.length} products</span>
            {vendor.isVerified && <span className="inline-flex items-center gap-1"><ShieldCheck className="w-4 h-4" />Verified</span>}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-[#111827] mb-6">Products</h2>
        {products.length === 0 ? (
          <p className="text-[#64748B]">No products found for this vendor.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <article key={product.id} className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-[#111827]">{product.name}</h3>
                  <p className="text-sm text-[#6B7280] mt-1">{product.reviews} reviews</p>
                  <p className="text-xl font-bold text-[#16A34A] mt-2">Rs. {product.price}</p>
                  <Link
                    to={`/product/${product.id}`}
                    className="mt-3 inline-flex w-full justify-center rounded-lg bg-[#16A34A] px-4 py-2 text-white font-semibold hover:bg-[#15803D]"
                  >
                    View Product
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
