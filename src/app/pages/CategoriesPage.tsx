import { CategoryCard } from "@/app/components/CategoryCard";
import { TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { storefrontApi, type CategoryItem } from "@/lib/store-api";

export function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await storefrontApi.getCategories();
        setCategories(data);
      } finally {
        setLoading(false);
      }
    };

    void loadCategories();
  }, []);

  const featuredCategories = useMemo(() => categories.slice(0, 3), [categories]);
  const regularCategories = useMemo(() => categories.slice(3), [categories]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#F9FAFB] via-white to-[#F9FAFB] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#16A34A]/10 text-[#16A34A] px-4 py-2 rounded-full mb-4">
            {/* <Sparkles className="w-4 h-4" /> */}
            <span className="text-sm font-medium">Explore Our Collections</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
            Browse Categories
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Discover thousands of products across all categories. From electronics to fashion,
            find exactly what you're looking for.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#22C55E]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-3xl" />
      </section>

      {/* Featured Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            
            <h2 className="text-3xl font-bold text-[#111827]">
              Featured Categories
            </h2>
          </div>

          {loading ? (
            <div className="text-[#6B7280]">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                image={category.image}
                name={category.name}
                itemCount={0}
                featured
                linkTo={`/category/${category.slug}`}
              />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* All Categories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#111827] mb-8">
            All Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {regularCategories.map((category) => (
              <CategoryCard
                key={category.id}
                image={category.image}
                name={category.name}
                itemCount={0}
                linkTo={`/category/${category.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#16A34A]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Contact our support team and we'll help you discover the perfect products.
          </p>
          <button className="bg-white text-[#16A34A] px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg">
            Contact Support
          </button>
        </div>
      </section>
    </div>
  );
}
