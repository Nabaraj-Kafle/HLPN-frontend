import { CategoriesSection } from '@/app/components/CategoriesSection';
import { FeaturedProducts } from '@/app/components/FeaturedProducts';
import { VendorsSection } from '@/app/components/VendorsSection';
import { ValueProposition } from '@/app/components/ValueProposition';
import { Testimonials } from '@/app/components/Testimonials';
import { Newsletter } from '@/app/components/Newsletter';
import { HeroCarousel } from '@/app/components/HeroCarousel';
import type { Product } from '@/app/components/shop/ProductCard';
import { NewsfeedSection } from '@/app/components/NewsfeedSection';
import type { CategoryItem, VendorItem, NewsfeedItem } from '@/lib/store-api';

interface HomePageProps {
  products: Product[];
  productsLoading: boolean;
  categories: CategoryItem[];
  categoriesLoading: boolean;
  vendors: VendorItem[];
  vendorsLoading: boolean;
  newsfeeds: NewsfeedItem[];
  newsfeedsLoading: boolean;
  onAddToCart: (product: Product) => void;
}

export function HomePage({
  products,
  productsLoading,
  categories,
  categoriesLoading,
  vendors,
  vendorsLoading,
  newsfeeds,
  newsfeedsLoading,
  onAddToCart,
}: HomePageProps) {
  return (
    <div className="bg-white">
      <section className="w-full my-6">
        <HeroCarousel />
      </section>
      <CategoriesSection categories={categories} isLoading={categoriesLoading} />
      <FeaturedProducts
        products={products.slice(0, 6)}
        isLoading={productsLoading}
        onAddToCart={onAddToCart}
      />
      <VendorsSection vendors={vendors} isLoading={vendorsLoading} />
      <NewsfeedSection newsfeeds={newsfeeds} isLoading={newsfeedsLoading} />
      <ValueProposition />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
