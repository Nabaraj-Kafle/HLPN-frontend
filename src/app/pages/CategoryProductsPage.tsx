import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import { ProductCard, type Product } from "@/app/components/shop/ProductCard";
import { ArrowLeft, LayoutGrid, Tag } from "lucide-react";
import { storefrontApi } from "@/lib/store-api";

interface CategoryProductsPageProps {
  cartItems: { id: number; quantity: number }[];
  onAddToCart: (product: Product) => void;
}

export function CategoryProductsPage({ cartItems, onAddToCart }: CategoryProductsPageProps) {
  const { categoryName } = useParams();
  const title = categoryName 
    ? categoryName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') 
    : 'Category';

  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadByCategory = async () => {
      if (!categoryName) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await storefrontApi.getProducts({
          category: categoryName,
          page_size: 50,
        });
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };
    void loadByCategory();
  }, [categoryName]);

  const shownProducts = useMemo(() => products, [products]);

  const getCartQuantity = (productId: number) => {
    return cartItems.find((item) => item.id === productId)?.quantity ?? 0;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* ── Category Hero ── */}
      <section className="relative bg-gradient-to-br from-[#16A34A] to-[#15803D] py-16 px-4 pb-24 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-2.5 text-white text-sm font-medium transition-all mb-8 shadow-sm hover:shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mb-6 shadow-xl border border-white/20">
            <LayoutGrid className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">
            {title}
          </h1>
          <p className="text-lg text-green-50 max-w-2xl mx-auto drop-shadow-sm">
            Discover our curated collection of {title.toLowerCase()} products. High quality and finest selection exclusively for you.
          </p>
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            <Tag className="w-5 h-5 text-[#16A34A]" />
            Showing {shownProducts.length} Products in {title}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
           <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#16A34A] focus:border-[#16A34A] block w-full sm:w-auto p-2.5 outline-none transition-colors">
             <option>Sort by Relevance</option>
             <option>Price: Low to High</option>
             <option>Price: High to Low</option>
             <option>Top Rated</option>
           </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shownProducts.map((product) => (
             <ProductCard
               key={product.id}
               product={product}
               variant="vertical"
               isHighlighted={hoveredProductId === product.id}
               onMouseEnter={() => setHoveredProductId(product.id)}
               onMouseLeave={() => setHoveredProductId(null)}
               onAddToCart={onAddToCart}
               cartQuantity={getCartQuantity(product.id)}
             />
          ))}
        </div>
        
        {loading && (
          <div className="text-center py-12 text-gray-500">Loading products...</div>
        )}

        {!loading && shownProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutGrid className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">We couldn't find any products in this category right now.</p>
          </div>
        )}
      </section>
    </div>
  );
}
