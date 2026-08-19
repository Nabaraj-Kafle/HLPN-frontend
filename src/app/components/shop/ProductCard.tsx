import { Star, ShoppingCart, MapPin, Eye, StarHalf } from "lucide-react";
import { Link } from "react-router";
import { MiniMap } from "./MiniMap";
import { storefrontApi } from "@/lib/store-api";
import { useEffect, useState } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  vendor: string;
  location: string;
  distance: string;
  discount?: number;
  inStock: boolean;
  badge?: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface ProductCardProps {
  product: Product;
  isHighlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onAddToCart: (product: Product) => void;
  cartQuantity: number;
  variant?: "horizontal" | "vertical";
}

export function ProductCard({
  product,
  isHighlighted = false,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  onAddToCart,
  cartQuantity,
  variant = "horizontal",
}: ProductCardProps) {
  if (variant === "vertical") {
    return (
      <div
        className={`bg-white rounded-xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group ${
          isHighlighted
            ? "border-[#F59E0B] shadow-xl scale-[1.02]"
            : "border-[#E5E7EB] hover:border-[#16A34A] hover:shadow-xl hover:-translate-y-1"
        }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Product Image */}
        <Link
          to={`/product/${product.id}`}
          className="block relative h-52 overflow-hidden bg-[#F9FAFB]"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-[#F59E0B] text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
              {product.badge}
            </span>
          )}
          {product.discount && (
            <span className="absolute top-3 right-3 bg-[#16A34A] text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
              -{product.discount}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-[#111827] px-4 py-2 rounded-lg font-semibold text-xs shadow-md">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="p-5 flex flex-col flex-grow justify-between">
          <div>
            <Link to={`/product/${product.id}`} className="block">
              <h3 className="font-semibold text-base text-[#111827] mb-2 line-clamp-1 group-hover:text-[#16A34A] transition-colors">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-3">
              <span className="font-medium text-[#374151]">
                {product.vendor}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#16A34A]" />
                <span>{product.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? "fill-[#F59E0B] text-[#F59E0B]"
                        : "text-[#E5E7EB]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#111827]">
                {product.rating}
              </span>
              <span className="text-xs text-[#6B7280]">
                ({product.reviews})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6] mt-auto">
            <div>
              <div className="text-lg font-bold text-[#16A34A]">
                Rs. {product.price}
              </div>
              {product.originalPrice && (
                <div className="text-xs text-[#6B7280] line-through">
                  Rs. {product.originalPrice}
                </div>
              )}
            </div>

            <button
              disabled={!product.inStock}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="px-3.5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add {cartQuantity > 0 ? `(${cartQuantity})` : ""}
            </button>
          </div>
        </div>
      </div>
    );
  }
  const [vendorId, setVendorId] = useState<string | undefined>();

  useEffect(() => {
    const getVendorId = async () => {
      try {
        const data = await storefrontApi.getVendors();

        const vendor = data.find((x) => x?.storeName === product?.vendor);

        setVendorId(vendor?.id?.toString());
      } catch (e) {
        console.error(e);
      }
    };

    getVendorId();
  }, [product?.vendor]);
  return (
    <div
      className={`bg-white rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
        isHighlighted
          ? "border-[#F59E0B] shadow-xl scale-[1.02]"
          : "border-[#E5E7EB] hover:border-[#22C55E] hover:shadow-lg"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Product Image + Info */}
        <Link
          to={`/product/${product.id}`}
          className="flex flex-col sm:flex-row flex-1 group"
        >
          {/* Product Image */}
          <div className="relative sm:w-72 h-48 flex-shrink-0 bg-[#F9FAFB] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Badge */}
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#F59E0B] text-white text-xs px-3 py-1 rounded-full font-medium">
                {product.badge}
              </span>
            )}

            {/* Discount */}
            {product.discount && (
              <span className="absolute top-3 right-3 bg-[#16A34A] text-white text-xs px-3 py-1 rounded-full font-medium">
                -{product.discount}%
              </span>
            )}

            {/* Out of stock */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-[#111827] px-4 py-2 rounded-lg font-semibold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              {/* Name */}
              <h3 className="text-xl font-semibold text-[#111827] mb-3 group-hover:text-[#16A34A] transition-colors line-clamp-1">
                {product.name}
              </h3>

              {/* Vendor + Location */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-[#6B7280] mb-3">
                <Link to={"/vendor/" + vendorId}>
                  <span className="font-medium  hover:text-yellow-500">
                    {product.vendor}
                  </span>
                </Link>

                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{product.location}</span>
                </div>

                <span className="text-[#16A34A]">{product.distance}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => {
                    if (i < Math.floor(product.rating)) {
                      return (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"
                        />
                      );
                    }

                    if (
                      i === Math.floor(product.rating) &&
                      product.rating % 1 !== 0
                    ) {
                      return (
                        <StarHalf
                          key={i}
                          className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"
                        />
                      );
                    }

                    return <Star key={i} className="w-4 h-4 text-[#E5E7EB]" />;
                  })}
                </div>

                <span className="ml-2 font-medium text-sm">
                  {product.rating}
                </span>

                <span className="ml-2 text-sm text-[#6B7280]">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold text-[#16A34A]">
                Rs. {product.price}
              </span>

              {product.originalPrice && (
                <span className="text-[#6B7280] line-through">
                  Rs. {product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Mini Map Column */}
        {product.latitude != null && product.longitude != null && (
          <div
            className="hidden sm:flex w-[360px] items-center justify-center border-l border-[#E5E7EB] p-4"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <MiniMap
              lat={product.latitude}
              lng={product.longitude}
              label={product.vendor}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex sm:flex-col justify-center items-center gap-3 border-t sm:border-t-0 sm:border-l border-[#E5E7EB] p-4 w-full sm:w-24">
          <Link
            to={`/product/${product.id}`}
            className="w-12 h-12 border border-[#E5E7EB] rounded-lg flex items-center justify-center hover:bg-[#F9FAFB] transition-colors"
          >
            <Eye className="w-5 h-5 text-[#374151]" />
          </Link>

          <button
            disabled={!product.inStock}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-12 h-12 bg-[#16A34A] hover:bg-[#22C55E] rounded-lg flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

          {cartQuantity > 0 && (
            <span className="text-xs font-medium text-[#16A34A]">
              ({cartQuantity})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
