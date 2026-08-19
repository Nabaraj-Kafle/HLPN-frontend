import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router";
import { useEffect, useState, type ReactElement } from "react";
import { toast } from "sonner";
import { HomePage } from "@/app/pages/HomePage";
import { ShopPage } from "@/app/pages/ShopPage";
import { CategoriesPage } from "@/app/pages/CategoriesPage";
import { CategoryProductsPage } from "@/app/pages/CategoryProductsPage";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { ScrollToTop } from "@/app/components/ScrollToTop";

import { CartPage } from "@/app/pages/CartPage";
import { VendorPage } from "@/app/pages/VendorPage";
import { VendorStorePage } from "@/app/pages/VendorStorePage";
import { AboutPage } from "@/app/pages/AboutPage";
import NewsfeedPage from "./pages/NewsFeed";
import { BecomeVendorPage } from "@/app/pages/BecomeVendorPage";
import { ProfilePage } from "@/app/pages/ProfilePage";
import { ProductDetailsPage } from "@/app/pages/ProductDetailsPage";
import { LoginPage } from "@/app/pages/LoginPage";
import { LogoutPage } from "@/app/pages/LogoutPage";
import { RegisterPage } from "@/app/pages/RegisterPage";
import { ContactPage } from "@/app/pages/ContactPage";
import { PrivacyPage } from "@/app/pages/PrivacyPage";
import { TermsPage } from "@/app/pages/TermsPage";
import { CheckoutPage } from "@/app/pages/CheckoutPage";
import { OrdersPage } from "@/app/pages/OrdersPage";
import { OrderDetailPage } from "@/app/pages/OrderDetailPage";
import {
  AuthProvider,
  getUserAvatar,
  useAuth,
} from "@/app/context/authcontext";
import type { Product } from "@/app/components/shop/ProductCard";
import {
  storefrontApi,
  type CategoryItem,
  type VendorItem,
  type NewsfeedItem,
} from "@/lib/store-api";

type CartItem = Product & { quantity: number; cartItemId?: number };

interface NavbarUser {
  name: string;
  email: string;
  avatar: string;
}

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("You are not logged in. Please login first.");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-600">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function AppContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [newsfeeds, setNewsfeeds] = useState<NewsfeedItem[]>([]);
  const [newsfeedsLoading, setNewsfeedsLoading] = useState(true);
  const { user, logout } = useAuth();

  const syncCartFromApi = async () => {
    try {
      const apiCartItems = await storefrontApi.getCartItems();
      setCartItems(apiCartItems as CartItem[]);
    } catch {
      // Keep current local state if cart API is unavailable.
    }
  };

  useEffect(() => {
    const loadStoreData = async () => {
      setProductsLoading(true);
      setCategoriesLoading(true);
      setVendorsLoading(true);
      setNewsfeedsLoading(true);
      try {
        const [apiProducts, apiCategories, apiVendors, apiNewsfeeds] =
          await Promise.all([
            storefrontApi.getProducts(),
            storefrontApi.getCategories(),
            storefrontApi.getVendors(),
            storefrontApi.getNewsfeeds(),
          ]);
        setProducts(apiProducts);
        setCategories(apiCategories);
        setVendors(apiVendors);
        setNewsfeeds(apiNewsfeeds);
      } catch {
        toast.error("Unable to load store data from API.");
      } finally {
        setProductsLoading(false);
        setCategoriesLoading(false);
        setVendorsLoading(false);
        setNewsfeedsLoading(false);
      }
    };

    void loadStoreData();
    // Only sync cart from API if user is authenticated
    if (user) {
      void syncCartFromApi();
    }
  }, [user]);

  /* ── Cart Handlers ─────────────────────────── */
  const handleAddToCart = async (
    product: Product,
    quantity: number = 1,
    variant?: ProductVariant | null,
  ) => {
    const isAvailable = variant ? variant.inStock : product.inStock;
    if (!isAvailable) return;

    const unitPrice = variant ? variant.price : product.price;
    const variantId = variant?.id;
    const variantName = variant?.name;

    // Always update local cart first (works for both guests and authenticated users)
    setCartItems((current) => {
      const existing = current.find(
        (i) => i.id === product.id && i.variantId === variantId,
      );
      if (existing) {
        return current.map((i) =>
          i.id === product.id && i.variantId === variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [
        ...current,
        {
          ...product,
          price: unitPrice,
          quantity,
          variantId,
          variantName,
          variant: variant ?? null,
        },
      ];
    });

    // Only sync with API if user is authenticated
    if (!user) {
      toast.success(
        variantName
          ? `Added ${product.name} (${variantName}) to cart`
          : "Added to cart",
      );
      return;
    }

    try {
      await storefrontApi.addToCart(product.id, quantity, variantId);
      await syncCartFromApi();
      toast.success(
        variantName
          ? `Added ${product.name} (${variantName}) to cart`
          : "Added to cart",
      );
    } catch (error) {
      let errorMessage = "Failed to add item to cart. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          errorMessage = "Invalid product or quantity. Please try again.";
        } else if (error.message.includes("500")) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.message;
        }
      }

      console.error("Add to cart error:", error);
      toast.error(errorMessage);
      // Revert the optimistic update if the API call fails
      setCartItems((current) => {
        const existing = current.find(
          (i) => i.id === product.id && i.variantId === variantId,
        );
        if (existing && existing.quantity <= quantity) {
          return current.filter(
            (i) => !(i.id === product.id && i.variantId === variantId),
          );
        }
        if (existing) {
          return current.map((i) =>
            i.id === product.id && i.variantId === variantId
              ? { ...i, quantity: i.quantity - quantity }
              : i,
          );
        }
        return current;
      });
    }
  };

  const handleUpdateCartQuantity = async (
    productId: number,
    quantity: number,
    variantId?: number,
  ) => {
    const targetItem = cartItems.find(
      (item) =>
        item.id === productId &&
        (variantId === undefined || item.variantId === variantId),
    ) as (CartItem & { cartItemId?: number }) | undefined;

    if (!targetItem?.cartItemId) {
      setCartItems((current) => {
        if (quantity <= 0) {
          return current.filter(
            (i) =>
              !(
                i.id === productId &&
                (variantId === undefined || i.variantId === variantId)
              ),
          );
        }
        return current.map((i) =>
          i.id === productId &&
          (variantId === undefined || i.variantId === variantId)
            ? { ...i, quantity }
            : i,
        );
      });
      return;
    }

    const previous = cartItems;
    setCartItems((current) => {
      if (quantity <= 0) {
        return current.filter(
          (i) =>
            !(
              i.id === productId &&
              (variantId === undefined || i.variantId === variantId)
            ),
        );
      }
      return current.map((i) =>
        i.id === productId &&
        (variantId === undefined || i.variantId === variantId)
          ? { ...i, quantity }
          : i,
      );
    });

    try {
      if (quantity <= 0) {
        await storefrontApi.removeCartItem(targetItem.cartItemId);
      } else {
        await storefrontApi.updateCartItem(targetItem.cartItemId, quantity);
      }
      await syncCartFromApi();
    } catch {
      setCartItems(previous);
      toast.error("Could not update cart quantity.");
    }
  };

  const handleRemoveFromCart = async (
    productId: number,
    variantId?: number,
  ) => {
    const targetItem = cartItems.find(
      (item) =>
        item.id === productId &&
        (variantId === undefined || item.variantId === variantId),
    ) as (CartItem & { cartItemId?: number }) | undefined;

    if (!targetItem?.cartItemId) {
      setCartItems((current) =>
        current.filter(
          (i) =>
            !(
              i.id === productId &&
              (variantId === undefined || i.variantId === variantId)
            ),
        ),
      );
      return;
    }

    const previous = cartItems;
    setCartItems((current) =>
      current.filter(
        (i) =>
          !(
            i.id === productId &&
            (variantId === undefined || i.variantId === variantId)
          ),
      ),
    );

    try {
      await storefrontApi.removeCartItem(targetItem.cartItemId);
      await syncCartFromApi();
    } catch {
      setCartItems(previous);
      toast.error("Could not remove item from cart.");
    }
  };

  const handleClearCart = async () => {
    const previous = cartItems;
    setCartItems([]);
    try {
      await storefrontApi.clearCart();
    } catch {
      setCartItems(previous);
      toast.error("Could not clear cart.");
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const authUser: NavbarUser | null = user
    ? {
        name: `${user.first_name} ${user.last_name}`.trim() || user.email,
        email: user.email,
        avatar: getUserAvatar(user),
      }
    : null;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar
        cartCount={cartCount}
        user={authUser}
        onLogout={() => void logout()}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              products={products}
              productsLoading={productsLoading}
              categories={categories}
              categoriesLoading={categoriesLoading}
              vendors={vendors}
              vendorsLoading={vendorsLoading}
              newsfeeds={newsfeeds}
              newsfeedsLoading={newsfeedsLoading}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/shop"
          element={
            <ShopPage
              products={products}
              productsLoading={productsLoading}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={handleClearCart}
            />
          }
        />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route
          path="/category/:categoryName"
          element={
            <CategoryProductsPage
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route path="/vendor" element={<VendorPage />} />
        <Route path="/vendor/:vendorId" element={<VendorStorePage />} />
        <Route path="/becomevendor" element={<BecomeVendorPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage
                cartItems={cartItems}
                onClearCart={handleClearCart}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/newsfeed/:id" element={<NewsfeedPage />} />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/product/:id"
          element={<ProductDetailsPage onAddToCart={handleAddToCart} />}
        />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
