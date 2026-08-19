export interface Vendor {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  products: number;
  banner: string;
  description: string;
}

export interface VendorProduct {
  id: number;
  vendorId: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: string;
}

export const vendors: Vendor[] = [
  {
    id: 1,
    name: "TechStore",
    category: "Electronics",
    location: "New York, NY",
    rating: 4.8,
    products: 1240,
    banner:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
    description:
      "Premium electronics and smart devices with reliable support and fast shipping.",
  },
  {
    id: 2,
    name: "FashionHub",
    category: "Fashion",
    location: "Los Angeles, CA",
    rating: 4.7,
    products: 980,
    banner:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
    description:
      "Curated fashion collections with modern styles and seasonal essentials.",
  },
  {
    id: 3,
    name: "HomeDecor",
    category: "Home",
    location: "Chicago, IL",
    rating: 4.6,
    products: 760,
    banner:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
    description:
      "Comfort-focused home goods and decor to upgrade your everyday living.",
  },
  {
    id: 4,
    name: "AudioPro",
    category: "Audio",
    location: "Austin, TX",
    rating: 4.9,
    products: 530,
    banner:
      "https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?auto=format&fit=crop&w=1400&q=80",
    description:
      "Studio-grade audio gear and accessories for creators and music lovers.",
  },
  {
    id: 5,
    name: "SportMax",
    category: "Sports",
    location: "Seattle, WA",
    rating: 4.5,
    products: 610,
    banner:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=80",
    description:
      "Performance-focused sportswear and fitness essentials for active lifestyles.",
  },
  {
    id: 6,
    name: "BeautyNest",
    category: "Beauty",
    location: "Miami, FL",
    rating: 4.7,
    products: 450,
    banner:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80",
    description:
      "Beauty and skincare picks selected for quality, comfort, and results.",
  },
];

export const vendorProducts: VendorProduct[] = [
  {
    id: 101,
    vendorId: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image:
      "https://images.unsplash.com/photo-1578517581165-61ec5ab27a19?auto=format&fit=crop&w=1080&q=80",
    rating: 4.8,
    reviews: 234,
    inStock: true,
    badge: "Best Seller",
  },
  {
    id: 102,
    vendorId: 1,
    name: "Ultra Thin Laptop Pro",
    price: 1299.99,
    image:
      "https://images.unsplash.com/photo-1677157561132-4f9e282a1684?auto=format&fit=crop&w=1080&q=80",
    rating: 4.7,
    reviews: 189,
    inStock: true,
  },
  {
    id: 103,
    vendorId: 1,
    name: "Mechanical Gaming Keyboard",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1656711081969-9d16ebc2d210?auto=format&fit=crop&w=1080&q=80",
    rating: 4.7,
    reviews: 289,
    inStock: true,
  },
  {
    id: 201,
    vendorId: 2,
    name: "Premium Running Shoes",
    price: 129.99,
    originalPrice: 179.99,
    image:
      "https://images.unsplash.com/photo-1695459468644-717c8ae17eed?auto=format&fit=crop&w=1080&q=80",
    rating: 4.6,
    reviews: 423,
    inStock: true,
    badge: "New Arrival",
  },
  {
    id: 202,
    vendorId: 2,
    name: "Urban Streetwear Jacket",
    price: 119.99,
    originalPrice: 159.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1080&q=80",
    rating: 4.5,
    reviews: 312,
    inStock: true,
  },
  {
    id: 203,
    vendorId: 2,
    name: "Classic Leather Sneaker",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1080&q=80",
    rating: 4.6,
    reviews: 197,
    inStock: true,
  },
  {
    id: 301,
    vendorId: 3,
    name: "Travel Backpack Pro",
    price: 89.99,
    originalPrice: 119.99,
    image:
      "https://images.unsplash.com/photo-1673505705687-dffbfd02b613?auto=format&fit=crop&w=1080&q=80",
    rating: 4.5,
    reviews: 312,
    inStock: true,
  },
  {
    id: 302,
    vendorId: 3,
    name: "Minimalist Desk Lamp",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1080&q=80",
    rating: 4.6,
    reviews: 145,
    inStock: true,
  },
  {
    id: 303,
    vendorId: 3,
    name: "Soft Cotton Throw Blanket",
    price: 49.99,
    originalPrice: 69.99,
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1080&q=80",
    rating: 4.7,
    reviews: 204,
    inStock: true,
  },
  {
    id: 401,
    vendorId: 4,
    name: "Smart Watch Series 8",
    price: 449.99,
    originalPrice: 599.99,
    image:
      "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?auto=format&fit=crop&w=1080&q=80",
    rating: 4.9,
    reviews: 567,
    inStock: true,
    badge: "Hot Deal",
  },
  {
    id: 402,
    vendorId: 4,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    image:
      "https://images.unsplash.com/photo-1674303324806-7018a739ed11?auto=format&fit=crop&w=1080&q=80",
    rating: 4.6,
    reviews: 523,
    inStock: true,
  },
  {
    id: 403,
    vendorId: 4,
    name: "Studio Condenser Microphone",
    price: 189.99,
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1080&q=80",
    rating: 4.8,
    reviews: 158,
    inStock: true,
  },
  {
    id: 501,
    vendorId: 5,
    name: "Performance Training Shoes",
    price: 139.99,
    originalPrice: 179.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1080&q=80",
    rating: 4.5,
    reviews: 176,
    inStock: true,
  },
  {
    id: 502,
    vendorId: 5,
    name: "Gym Duffel Bag",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1080&q=80",
    rating: 4.4,
    reviews: 132,
    inStock: true,
  },
  {
    id: 601,
    vendorId: 6,
    name: "Hydrating Skincare Set",
    price: 79.99,
    originalPrice: 109.99,
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1080&q=80",
    rating: 4.7,
    reviews: 286,
    inStock: true,
    badge: "Top Rated",
  },
  {
    id: 602,
    vendorId: 6,
    name: "Essential Makeup Kit",
    price: 54.99,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1080&q=80",
    rating: 4.6,
    reviews: 211,
    inStock: true,
  },
];
