import { ShoppingCart, Star, StarHalf } from "lucide-react";
import { Link } from "react-router";
import type { Product } from "@/app/components/shop/ProductCard";

interface FeaturedProductsProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

export function FeaturedProducts({
  products,
  isLoading,
  onAddToCart,
}: FeaturedProductsProps) {
  return (
    <section className="py-0 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            Products
          </h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            Handpicked selection of our most popular and highest-rated products
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-[#6B7280]">
            Loading featured products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-[#6B7280]">
            No products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(
              (product, idx) =>
                idx < 4 && (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden border  border-[#E5E7EB]  transition-all hover:shadow-xl hover:-translate-y-1 group"
                  >
                    {/* Product Image */}
                    <Link
                      to={`/product/${product.id}`}
                      className="block relative h-64 overflow-hidden bg-[#F9FAFB]"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      {/* Badge */}
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-[#F59E0B] text-white text-xs px-3 py-1 rounded-full">
                          {product.badge}
                        </span>
                      )}
                      {/* Discount Badge */}
                      {product.discount && (
                        <span className="absolute top-3 right-3 bg-[#16A34A] text-white text-xs px-3 py-1 rounded-full">
                          -{product.discount}%
                        </span>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="p-5">
                      <Link
                        to={`/product/${product.id}`}
                        className="block hover:text-[#16A34A] transition-colors"
                      >
                        <h3 className="font-semibold text-[#111827] mb-2 line-clamp-1 group-hover:text-[#16A34A]">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
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
                            return (
                              <Star
                                key={i}
                                className="w-4 h-4 text-[#E5E7EB]"
                              />
                            );
                          })}
                          <span className="ml-2 text-sm font-medium text-[#111827]">
                            {product.rating}
                          </span>
                        </div>
                        <span className="ml-2 text-sm text-[#6B7280]">
                          ({product.reviews} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center mb-4">
                        <span className="text-2xl font-bold text-[#16A34A]">
                          Rs. {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-[#6B7280] line-through">
                            Rs. {product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => onAddToCart(product)}
                        disabled={!product.inStock}
                        className="w-full bg-[#16A34A] hover:bg-[#22C55E] text-white py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                ),
            )}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-block px-8 py-3 border-2 border-[#16A34A] text-[#16A34A] hover:bg-[#16A34A] hover:text-white rounded-lg transition-colors font-bold"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
