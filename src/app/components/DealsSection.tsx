import { ShoppingCart, Star, StarHalf } from "lucide-react";
import { Link } from "react-router";

// Mock data for deals section
const dealProducts = [
  {
    id: 301,
    name: "MacBook Pro M2 - 14 inch",
    price: 185000,
    originalPrice: 210000,
    rating: 4.9,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
    discount: 12,
    inStock: true,
    badge: "Flash Sale"
  },
  {
    id: 302,
    name: "Nike Air Max 270",
    price: 12000,
    originalPrice: 18000,
    rating: 4.7,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    discount: 33,
    inStock: true,
    badge: "Spring Sale"
  },
  {
    id: 303,
    name: "Sony WH-1000XM5 Headphones",
    price: 45000,
    originalPrice: 55000,
    rating: 4.8,
    reviews: 84,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
    discount: 18,
    inStock: true,
    badge: "Limited Offer"
  }
];

export function DealsSection() {
  return (
    <section id="deals" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            Special Deals & Offers
          </h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            Don't miss out on our limited-time offers and exclusive deals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden border border-[#E5E7EB] transition-all hover:shadow-xl hover:-translate-y-1 group relative"
            >
              {/* Product Image */}
              <Link to={`/product/${product.id}`} className="block relative h-64 overflow-hidden bg-[#F9FAFB]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#F59E0B] text-white text-xs px-3 py-1 rounded-full font-medium">
                    {product.badge}
                  </span>
                )}
                {/* Discount Badge */}
                {product.discount && (
                  <span className="absolute top-3 right-3 bg-[#16A34A] text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                    -{product.discount}%
                  </span>
                )}
              </Link>

              {/* Product Info */}
              <div className="p-5">
                <Link to={`/product/${product.id}`} className="block hover:text-[#16A34A] transition-colors">
                  <h3 className="font-semibold text-[#111827] mb-2 line-clamp-1 group-hover:text-[#16A34A]">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                      if (i < Math.floor(product.rating)) {
                        return <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />;
                      }
                      if (i === Math.floor(product.rating) && product.rating % 1 !== 0) {
                        return <StarHalf key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />;
                      }
                      return <Star key={i} className="w-4 h-4 text-[#E5E7EB]" />;
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
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-[#6B7280] line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  disabled={!product.inStock}
                  className="w-full bg-[#16A34A] hover:bg-[#22C55E] text-white py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    // Alert logic or cart context can be integrated here later
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/shop" className="inline-block px-8 py-3 border-2 border-[#16A34A] text-[#16A34A] hover:bg-[#16A34A] hover:text-white rounded-lg transition-colors font-bold">
            View All Deals
          </Link>
        </div>
      </div>
    </section>
  );
}
