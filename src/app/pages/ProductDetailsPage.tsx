import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Check, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useAuth } from "@/app/context/authcontext";
import type { Product } from "@/app/components/shop/ProductCard";
import { storefrontApi, type ProductDetails, type ProductReview, type ProductVariant } from "@/lib/store-api";

interface ProductDetailsPageProps {
  onAddToCart: (product: Product, quantity: number, variant?: ProductVariant | null) => void;
}

export function ProductDetailsPage({ onAddToCart }: ProductDetailsPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    const productId = Number(id);
    if (!productId) {
      setLoading(false);
      setError("Invalid product ID");
      return;
    }

    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productData, reviewsData] = await Promise.all([
          storefrontApi.getProductById(productId),
          storefrontApi.getProductReviews(productId),
        ]);
        setProduct(productData);
        setReviews(reviewsData);
        setActiveImage(productData.images[0] ?? productData.image);

        if (productData.variants && productData.variants.length > 0) {
          const firstInStock = productData.variants.find((v) => v.inStock) ?? productData.variants[0];
          setSelectedVariant(firstInStock);
        } else {
          setSelectedVariant(null);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load product";
        console.error("Error loading product:", err);
        setError(errorMsg);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const allImages = [...product.images];
    if (product.image && !allImages.includes(product.image)) {
      allImages.unshift(product.image);
    }
    return Array.from(new Set(allImages)).filter(Boolean);
  }, [product]);

  const effectivePrice = selectedVariant ? selectedVariant.price : product?.price ?? 0;
  const effectiveStock = selectedVariant ? selectedVariant.stockQuantity : product?.stockQuantity ?? 0;
  const isAvailable = selectedVariant ? selectedVariant.inStock : product?.inStock ?? true;

  const handleAddToCart = () => {
    if (!product || !isAvailable) return;
    onAddToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("You are not logged in. Please login first.");
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    handleAddToCart();
    navigate("/checkout");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#64748B]">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#111827]">Product not found</h1>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <Link to="/shop" className="mt-4 inline-block text-[#16A34A]">Back to shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery Column */}
          <div>
            <img src={activeImage || product.image} alt={product.name} className="w-full h-[460px] object-cover rounded-2xl border border-[#E5E7EB] shadow-sm" />
            <div className="mt-6">
              <p className="text-sm font-semibold text-[#6B7280] mb-3">Product Images</p>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
                {gallery.map((img) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(img)}
                    className={`rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? "border-[#16A34A] shadow-md ring-2 ring-[#16A34A]/20" : "border-[#E5E7EB] hover:border-[#D1D5DB]"}`}
                    title="Click to view full image"
                  >
                    <img src={img} alt="Product thumbnail" className="w-full h-16 sm:h-20 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Column */}
          <div>
            <p className="text-sm font-medium text-[#16A34A] bg-[#DCFCE7] inline-block px-3 py-1 rounded-full mb-2">
              {product.vendor}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-gray-900">{product.rating}</span>
              <span className="text-[#6B7280]">({product.reviews} customer reviews)</span>
            </div>

            {/* Price section */}
            <div className="mt-6 flex items-baseline gap-3">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#16A34A]">
                Rs. {effectivePrice}
              </p>
              {product.originalPrice && product.originalPrice > effectivePrice && (
                <p className="text-lg text-[#6B7280] line-through">
                  Rs. {product.originalPrice}
                </p>
              )}
              {selectedVariant && (
                <span className="text-xs text-[#4B5563] bg-gray-100 px-2.5 py-1 rounded-lg">
                  Selected: <strong>{selectedVariant.name}</strong>
                </span>
              )}
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-[#111827]">
                    Choose Option / Variant:
                  </label>
                  {selectedVariant && (
                    <span className="text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {selectedVariant.name}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(v);
                          setQuantity(1);
                        }}
                        className={`relative p-3.5 rounded-xl border-2 text-left transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? "border-[#16A34A] bg-[#F0FDF4] shadow-sm ring-2 ring-[#16A34A]/20"
                            : v.inStock
                              ? "border-[#E5E7EB] bg-white hover:border-[#16A34A]/60 hover:bg-[#F9FAFB]"
                              : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-sm font-bold truncate ${isSelected ? "text-[#166534]" : "text-[#111827]"}`}>
                            {v.name}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs mt-1.5 pt-1.5 border-t border-gray-100">
                          <span className={`font-extrabold ${isSelected ? "text-[#16A34A]" : "text-[#374151]"}`}>
                            Rs. {v.price}
                          </span>
                          <span className={v.inStock ? "text-[#166534] text-[11px] font-medium" : "text-red-500 text-[11px] font-medium"}>
                            {v.inStock ? `${v.stockQuantity} left` : "Out of stock"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="mt-6 text-[#374151] leading-relaxed text-sm sm:text-base">
              {product.description || "No description available for this product."}
            </p>

            {/* Quantity Stepper & Stock */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(effectiveStock || 99, q + 1))}
                  disabled={quantity >= effectiveStock}
                  className="p-2.5 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isAvailable ? "bg-[#DCFCE7] text-[#166534]" : "bg-red-50 text-red-600"}`}>
                {isAvailable ? `In stock (${effectiveStock} available)` : "Out of stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className="h-13 py-3.5 rounded-xl bg-[#16A34A] text-white font-bold text-base hover:bg-[#15803D] active:scale-[0.99] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!isAvailable}
                className="h-13 py-3.5 rounded-xl border-2 border-[#111827] text-[#111827] font-bold text-base hover:bg-[#111827] hover:text-white active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <div className="flex items-center gap-2 mb-5">
            <ShoppingBag className="w-5 h-5 text-[#16A34A]" />
            <h2 className="text-2xl font-bold text-[#111827]">Customer Reviews</h2>
          </div>
          {reviews.length === 0 ? (
            <p className="text-[#6B7280]">No reviews yet for this product.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <article key={review.id} className="border border-[#E5E7EB] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{review.userName}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm">{review.rating}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-[#374151]">{review.comment || "No comment provided."}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
