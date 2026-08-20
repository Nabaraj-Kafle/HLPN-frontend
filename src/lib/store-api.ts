import axios from "axios";
import type { Product } from "@/app/components/shop/ProductCard";

export interface NewsfeedItem {
  id: number;
  title: string;
  image: string | null;
  content: string;
  created_at: string;
}


const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "https://api.himalayanlocalproductnepal.com.np/api/";
  // "http://127.0.0.1:8000/api/";

const BACKEND_URL = API_BASE_URL.replace("/api/", "");
// Ensure base URL points to the API root. If a user provided a base URL
// without the `/api` prefix, add it so endpoint paths like `/vendors/stores/`
// resolve to `/api/vendors/stores/` on the backend.
const ACCESS_TOKEN_KEY = "auth_access_token";

const storeApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

storeApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("No auth token found in localStorage for key:", ACCESS_TOKEN_KEY);
  }
  return config;
});

// Add response interceptor for debugging
storeApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error("401 Unauthorized - Token may be invalid or expired");
      console.error("Token in storage:", !!localStorage.getItem(ACCESS_TOKEN_KEY));
    }
    return Promise.reject(error);
  }
);

type MaybeRecord = Record<string, unknown> | null | undefined;
type QueryValue = string | number | boolean | undefined;

const asNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const asNullableNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" && value.trim() ? value : fallback;

const firstString = (...values: unknown[]) => {
  for (const value of values) {
    const str = asString(value);
    if (str) return str;
  }
  return "";
};

const toProduct = (raw: MaybeRecord): Product => {
  console.log("PRODUCTION BUILD JUNE 15", raw?.id, raw?.vendor_name);
  const vendor = (raw?.vendor as MaybeRecord) ?? {};
  const category = (raw?.category as MaybeRecord) ?? {};
  const ratingValue = asNumber(raw?.average_rating ?? raw?.rating, 0);
  const reviewsValue = asNumber(raw?.reviews_count ?? raw?.reviews, 0);
  const price = asNumber(raw?.price, 0);
  const originalPrice = asNumber(raw?.original_price ?? raw?.mrp, 0);
  const image = firstString(
    raw?.primary_image,
    raw?.image,
    raw?.image_url,
    raw?.thumbnail,
    raw?.photo,
    "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&w=900&q=80",
  );

  const product: Product = {
    id: asNumber(raw?.id),
    name: firstString(raw?.name, raw?.title, "Unnamed Product"),
    price,
    rating: ratingValue,
    reviews: reviewsValue,
    isFeatured: Boolean(raw?.is_featured),
    image,
    vendor: firstString(raw?.vendor_name, vendor.shop_name, vendor.name, "Local Store"),
    location: firstString(raw?.location, vendor.location, "Nepal"),
    distance: firstString(
      raw?.distance,
      typeof raw?.distance_km === "number" || typeof raw?.distance_km === "string"
        ? `${raw.distance_km} km`
        : undefined,
      "N/A",
    ),
    inStock: Boolean(raw?.in_stock ?? raw?.is_active ?? true),
    latitude: asNullableNumber(raw?.vendor_latitude ?? raw?.latitude ?? vendor?.latitude),
    longitude: asNullableNumber(raw?.vendor_longitude ?? raw?.longitude ?? vendor?.longitude),
  };

  if (originalPrice > price) product.originalPrice = originalPrice;
  if (product.originalPrice && product.originalPrice > product.price) {
    const discount = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    );
    if (discount > 0) product.discount = discount;
  }

  const categoryName = firstString(category.name);
  if (categoryName) {
    product.badge = categoryName;
  }

  return product;
};

const toProductList = (payload: unknown): Product[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => toProduct(item as MaybeRecord));
  }

  if (payload && typeof payload === "object") {
    const data = payload as Record<string, unknown>;
    if (Array.isArray(data.results)) {
      return data.results.map((item) => toProduct(item as MaybeRecord));
    }
    if (Array.isArray(data.data)) {
      return data.data.map((item) => toProduct(item as MaybeRecord));
    }
  }

  return [];
};

export type CartItem = Product & {
  quantity: number;
  cartItemId?: number;
  variantId?: number;
  variantName?: string;
  variant?: ProductVariant | null;
};
export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface VendorItem {
  id: number;
  storeName: string;
  slug: string;
  category: string;
  location: string;
  rating: number;
  productsCount: number;
  banner: string;
  description: string;
  isVerified: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ProductVariant {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  inStock: boolean;
}

export interface ProductDetails extends Product {
  description: string;
  stockQuantity: number;
  images: string[];
  variants: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductReview {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  variantId?: number;
  variantName?: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    zipCode?: string;
  };
  createdAt: string;
  updatedAt?: string;
  estimatedDelivery?: string;
}

const toCartItems = (payload: unknown): CartItem[] => {
  const source = (() => {
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === "object") {
      const data = payload as Record<string, unknown>;
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.results)) return data.results;
      if (Array.isArray(data.data)) return data.data;
    }
    return [];
  })();

  return source.map((item) => {
    const raw = item as Record<string, unknown>;
    const nestedProduct =
      (raw.product as MaybeRecord) ??
      (raw.product_detail as MaybeRecord) ??
      (raw.product_data as MaybeRecord);
    const rawVariant = (raw.variant as MaybeRecord) ?? null;
    const variant: ProductVariant | null = rawVariant ? {
      id: asNumber(rawVariant.id),
      name: firstString(rawVariant.name),
      price: asNumber(rawVariant.price),
      stockQuantity: asNumber(rawVariant.stock_quantity),
      inStock: Boolean(rawVariant.in_stock ?? asNumber(rawVariant.stock_quantity) > 0),
    } : null;

    const base = toProduct(
      nestedProduct ?? {
        id: raw.product_id ?? raw.product,
        name: raw.product_name,
        price: raw.price,
        image: raw.image,
        vendor: raw.vendor,
      },
    );
    const quantity = asNumber(raw.quantity, 1);
    const unitPrice = variant ? variant.price : asNumber(raw.unit_price ?? base.price, base.price);

    return {
      ...base,
      price: unitPrice,
      quantity,
      cartItemId: asNumber(raw.id, 0) || undefined,
      variantId: variant ? variant.id : (asNumber(raw.variant_id) || undefined),
      variantName: variant ? variant.name : firstString(raw.variant_name),
      variant,
    };
  });
};

const toCategory = (raw: MaybeRecord): CategoryItem => ({
  id: asNumber(raw?.id),
  name: firstString(raw?.name, "Category"),
  slug: firstString(raw?.slug),
  image: firstString(
    raw?.image,
    raw?.image_url,
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
  ),
  description: firstString(raw?.description),
});

const toVendor = (raw: MaybeRecord): VendorItem => ({
  id: asNumber(raw?.id),
  storeName: firstString(raw?.store_name, "Store"),
  slug: firstString(raw?.slug),
  category: firstString(raw?.category, "General"),
  location: firstString(raw?.location, "Nepal"),
  rating: asNumber(raw?.rating, 0),
  productsCount: asNumber(raw?.products_count, 0),

  banner:
    typeof raw?.banner === "string" && raw.banner.startsWith("/")
      ? `${BACKEND_URL}${raw.banner}`
      : firstString(
        raw?.banner,
        "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1200&q=80"
      ),

  description: firstString(raw?.description, "Verified local store."),
  isVerified: Boolean(raw?.is_verified),
  latitude: asNullableNumber(raw?.latitude),
  longitude: asNullableNumber(raw?.longitude),
});

const toList = <T>(payload: unknown, mapper: (record: MaybeRecord) => T): T[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => mapper(item as MaybeRecord));
  }
  if (payload && typeof payload === "object") {
    const data = payload as Record<string, unknown>;
    if (Array.isArray(data.results)) {
      return data.results.map((item) => mapper(item as MaybeRecord));
    }
    if (Array.isArray(data.data)) {
      return data.data.map((item) => mapper(item as MaybeRecord));
    }
  }
  return [];
};

const toProductDetails = (payload: unknown): ProductDetails => {
  const raw = (payload ?? {}) as Record<string, unknown>;
  const base = toProduct(raw);
  const imagesRaw = Array.isArray(raw.images) ? raw.images : [];
  const images = imagesRaw
    .map((item) => {
      const imageObj = item as Record<string, unknown>;
      return firstString(imageObj?.image, imageObj?.image_url);
    })
    .filter(Boolean);

  const rawVariants = Array.isArray(raw.variants) ? raw.variants : [];
  const variants: ProductVariant[] = rawVariants.map((v) => {
    const vObj = v as Record<string, unknown>;
    const vPrice = asNumber(vObj.price, base.price);
    const vStock = asNumber(vObj.stock_quantity, 0);
    return {
      id: asNumber(vObj.id),
      name: firstString(vObj.name, "Default"),
      price: vPrice,
      stockQuantity: vStock,
      inStock: Boolean(vObj.in_stock ?? vStock > 0),
    };
  });

  return {
    ...base,
    description: firstString(raw.description),
    stockQuantity: asNumber(raw.stock_quantity, 0),
    images: images.length ? images : [base.image],
    variants,
    createdAt: firstString(raw.created_at) || undefined,
    updatedAt: firstString(raw.updated_at) || undefined,
  };
};

const toReview = (raw: MaybeRecord): ProductReview => ({
  id: asNumber(raw?.id),
  userName: firstString(raw?.user_name, "Customer"),
  rating: asNumber(raw?.rating, 0),
  comment: firstString(raw?.comment),
  verified: Boolean(raw?.is_verified_purchase),
  createdAt: firstString(raw?.created_at) || undefined,
});


const toOrderItem = (raw: MaybeRecord): OrderItem => ({
  id: asNumber(raw?.id),
  productId: asNumber(raw?.product_id ?? raw?.product),
  productName: firstString(raw?.product_name, raw?.name, "Product"),
  productImage: firstString(raw?.product_image, raw?.image),
  variantId: asNumber(raw?.variant_id ?? (raw?.variant as MaybeRecord)?.id) || undefined,
  variantName: firstString(raw?.variant_name, (raw?.variant as MaybeRecord)?.name),
  quantity: asNumber(raw?.quantity, 1),
  price: asNumber(raw?.unit_price ?? raw?.price, 0),
  totalPrice: asNumber(raw?.line_total ?? raw?.total_price ?? asNumber(raw?.price, 0) * asNumber(raw?.quantity, 1), 0),
});

const toOrder = (raw: MaybeRecord): Order => {
  const itemsRaw = Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.order_items)
      ? raw.order_items
      : [];

  const items = itemsRaw.map((item) => toOrderItem(item as MaybeRecord));

  return {
    id: asNumber(raw?.id),

    orderNumber: firstString(
      raw?.order_number,
      raw?.order_id,
      `#${raw?.id}`,
    ),

    status: (raw?.status as Order["status"]) || "pending",

    items,

    subtotal: asNumber(
      raw?.subtotal,
      0,
    ),

    tax: asNumber(
      raw?.tax_amount ?? raw?.tax,
      0,
    ),

    shipping: asNumber(
      raw?.shipping_amount ?? raw?.shipping,
      0,
    ),

    total: asNumber(
      raw?.total_amount ?? raw?.total ?? raw?.total_price,
      0,
    ),

    shippingAddress: {
      name: firstString(
        raw?.shipping_name,
      ),
      phone: firstString(
        raw?.shipping_phone,
      ),
      address: firstString(
        raw?.shipping_address_line,
      ),
      city: firstString(
        raw?.shipping_city,
      ),
      zipCode: "",
    },

    createdAt: firstString(
      raw?.created_at,
      new Date().toISOString(),
    ),

    updatedAt:
      firstString(raw?.updated_at) || undefined,

    estimatedDelivery:
      firstString(raw?.estimated_delivery) || undefined,
  };
};


export const storefrontApi = {
  getProducts: async (params?: Record<string, QueryValue>): Promise<Product[]> => {
    const { data } = await storeApi.get("/catalog/products/", { params });
    return toProductList(data);
  },

  getProductById: async (id: number): Promise<ProductDetails> => {
    const { data } = await storeApi.get(`/catalog/products/${id}/`);
    return toProductDetails(data);
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const { data } = await storeApi.get("/catalog/products/", {
      params: { featured: "true" },
    });
    return toList(data, toProduct);
  },


  getProductReviews: async (productId: number): Promise<ProductReview[]> => {
    const { data } = await storeApi.get("/catalog/reviews/", {
      params: { product: productId },
    });
    return toList(data, toReview);
  },

  getCategories: async (): Promise<CategoryItem[]> => {
    const { data } = await storeApi.get("/catalog/categories/");
    return toList(data, toCategory);
  },

  getVendors: async (params?: Record<string, QueryValue>): Promise<VendorItem[]> => {
    const { data } = await storeApi.get("/vendors/stores/", { params });
    return toList(data, toVendor);
  },

  getVendorById: async (id: number): Promise<VendorItem> => {
    const { data } = await storeApi.get(`/vendors/stores/${id}/`);
    return toVendor(data as Record<string, unknown>);
  },

  getCartItems: async (): Promise<CartItem[]> => {
    const { data } = await storeApi.get("/cart/items/");
    return toCartItems(data);
  },

  addToCart: async (productId: number, quantity = 1, variantId?: number): Promise<void> => {
    const payload: Record<string, unknown> = { product_id: productId, quantity };
    if (variantId) {
      payload.variant_id = variantId;
    }
    await storeApi.post("/cart/items/", payload);
  },

  updateCartItem: async (cartItemId: number, quantity: number): Promise<void> => {
    await storeApi.patch(`/cart/items/${cartItemId}/`, { quantity });
  },

  removeCartItem: async (cartItemId: number): Promise<void> => {
    await storeApi.delete(`/cart/items/${cartItemId}/`);
  },

  clearCart: async (): Promise<void> => {
    await storeApi.delete("/cart/clear/");
  },

  getOrders: async (params?: Record<string, QueryValue>): Promise<Order[]> => {
    const { data } = await storeApi.get("/orders/", { params });
    return toList(data, toOrder);
  },

  getOrderById: async (id: number): Promise<Order> => {
    const { data } = await storeApi.get(`/orders/${id}/`);
    return toOrder(data as Record<string, unknown>);
  },

  createOrder: async (payload: {
    address_id?: number;
    shipping_name?: string;
    shipping_phone?: string;
    shipping_address_line?: string;
    shipping_city?: string;
    shipping_country?: string;
    discount_amount?: number;
    shipping_amount?: number;
    tax_amount?: number;
    notes?: string;
    payment_method?: "cod" | "qr";
  }): Promise<Order> => {
    try {
      // Fix floating point precision errors for Django DecimalField
      const formattedPayload = {
        ...payload,
        discount_amount: payload.discount_amount !== undefined ? Number(payload.discount_amount.toFixed(2)) : undefined,
        shipping_amount: payload.shipping_amount !== undefined ? Number(payload.shipping_amount.toFixed(2)) : undefined,
        tax_amount: payload.tax_amount !== undefined ? Number(payload.tax_amount.toFixed(2)) : undefined,
      };

      console.log("API Request - POST /orders/checkout/ with payload:", JSON.stringify(formattedPayload, null, 2));
      const { data } = await storeApi.post("/orders/checkout/", formattedPayload);
      console.log("API Response - Order created:", data);
      return toOrder(data as Record<string, unknown>);
    } catch (error) {
      console.error("API Error - POST /orders/checkout/:", error);
      if ("response" in (error as any)) {
        const status = (error as any).response?.status;
        const errorData = (error as any).response?.data;
        console.error("Response status:", status);
        console.error("Response data:", errorData);
        console.error("Full error response:", JSON.stringify(errorData, null, 2));

        // Log helpful debugging info
        if (status === 400) {
          console.error("❌ 400 Bad Request - Payload structure error");
          console.error("Sent payload:", JSON.stringify(payload, null, 2));
          console.error("Backend expects: { address_id, notes?, discount_amount?, shipping_amount?, tax_amount? }");
        } else if (status === 401) {
          console.error("❌ 401 Unauthorized - Authentication failed or token expired");
        } else if (status === 403) {
          console.error("❌ 403 Forbidden - Permission denied or invalid address");
        } else if (status === 500) {
          console.error("❌ 500 Server Error - Backend error");
        }
      }
      throw error;
    }
  },

  createAddress: async (payload: {
    name: string;
    phone: string;
    address_line: string;
    city: string;
    country?: string;
    label?: string;
    is_default?: boolean;
  }): Promise<{ id: number;[key: string]: unknown }> => {
    try {
      console.log("API Request - POST /addresses/ with payload:", JSON.stringify(payload, null, 2));
      const { data } = await storeApi.post("/addresses/", payload);
      console.log("API Response - Address created:", data);
      return data as { id: number;[key: string]: unknown };
    } catch (error) {
      console.error("API Error - POST /addresses/:", error);
      throw error;
    }
  },

  getNewsfeeds: async (): Promise<NewsfeedItem[]> => {
    try {
      const { data } = await storeApi.get("/common/newsfeed/");
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        content: item.content,
        created_at: item.created_at,
      }));
    } catch (error) {
      console.error("Failed to fetch newsfeeds:", error);
      return [];
    }
  },
};
