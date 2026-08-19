import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  MapPin,
  CreditCard,
  Lock,
  Plus,
  ChevronRight,
  ShoppingBag,
  Bell,
  Edit,
  Trash2,
  X,
  Camera,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getUserAvatar, useAuth } from "@/app/context/authcontext";
import { cn } from "@/lib/utils";
import { apiService } from "@/lib/api-service";
import { storefrontApi, type Order } from "@/lib/store-api";

/* ─── Mock Data ─────────────────────────────────────────── */

const stats = [
  {
    label: "Total Orders ",
    value: "12",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  // { label: "Wishlist Items", value: "8", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
  {
    label: "Cart Items",
    value: "3",
    icon: ShoppingBag,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  // { label: "Notifications", value: "5", icon: Bell, color: "text-amber-600", bg: "bg-amber-50" },
];

const initialOrders = [
  {
    id: "#ORD-7721",
    product: "Premium Wireless Headphones",
    price: 299.99,
    date: "Oct 12, 2025",
    status: "Delivered",
    image:
      "https://images.unsplash.com/photo-1578517581165-61ec5ab27a19?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "#ORD-6544",
    product: "Smart Watch Series 8",
    price: 449.99,
    date: "Oct 08, 2025",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "#ORD-2219",
    product: "Ultra Thin Laptop Pro",
    price: 1299.99,
    date: "Sept 24, 2025",
    status: "Cancelled",
    image:
      "https://images.unsplash.com/photo-1677157561132-4f9e282a1684?auto=format&fit=crop&w=150&q=80",
  },
];

const initialWishlist = [
  {
    id: 1,
    name: "Mechanical Gaming Keyboard",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1656711081969-9d16ebc2d210?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1674303324806-7018a739ed11?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    name: "Classic Leather Sneaker",
    price: 119.99,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=300&q=80",
  },
];

/* ─── Types ─────────────────────────────────────────────── */

interface Address {
  id?: number;
  type: string;
  isDefault: boolean;
  name: string;
  phone: string;
  address: string;
}

/* ─── Main Component ────────────────────────────────────── */

export function ProfilePage() {
  const { user: authUser, logout, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && authUser?.role === "admin") {
      window.location.href =
        "https://api.himalayanlocalproductnepal.com.np/dashboard/";
    }
  }, [authLoading, authUser?.role]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const currentUser = useMemo(() => {
    if (!authUser) return null;

    return {
      name:
        `${authUser.first_name} ${authUser.last_name}`.trim() || authUser.email,
      email: authUser.email,
      phone: authUser.phone,
      avatar: getUserAvatar(authUser),
    };
  }, [authUser]);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      type: "Home",
      isDefault: true,
      name: "",
      phone: "",
      address: " Kathmandu, Nepal",
    },
    {
      id: 2,
      type: "Office",
      isDefault: false,
      name: "",
      phone: "",
      address: " Lalitpur, Nepal",
    },
  ]);

  // Modal States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
    }
  }, [currentUser]);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const fetchedOrders = await storefrontApi.getOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load orders";
        console.error("Error fetching orders:", error);
        setOrdersError(errorMessage);
        // Keep using empty array on error
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (authUser?.id) {
      void fetchOrders();
    }
  }, [authUser?.id]);

  /* ─── Handlers ─────────────────────────────────────────── */

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSubmitting(true);
      const res = await apiService.updateAvatar(file);
      if (res.success) {
        setProfile((prev) => ({ ...prev, avatar: res.url }));
      }
      setIsSubmitting(false);
    }
  };

  const onUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };

    setIsSubmitting(true);
    await apiService.updateProfile(data);
    setProfile((prev) => ({ ...prev, ...data }));
    setIsSubmitting(false);
    setIsEditProfileOpen(false);
  };

  const onSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const addressData: Address = {
      id: editingAddress?.id,
      type: formData.get("type") as string,
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      isDefault: formData.get("isDefault") === "on",
    };

    setIsSubmitting(true);
    const res = await apiService.saveAddress(addressData);
    if (res.success) {
      if (editingAddress) {
        setAddresses(
          addresses.map((a) => (a.id === editingAddress.id ? res.data : a)),
        );
      } else {
        setAddresses([...addresses, res.data]);
      }
    }
    setIsSubmitting(false);
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = async (id: number) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await apiService.deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    }
  };

  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    // { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <nav className="flex flex-col gap-2">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-left",
                    activeTab === link.id
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <link.icon
                    className={cn(
                      "w-5 h-5",
                      activeTab === link.id ? "text-white" : "text-slate-400",
                    )}
                  />
                  {link.label}
                  {activeTab === link.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
              <div className="h-px bg-slate-100 my-4" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-medium text-sm"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* User Profile Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500" />
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden ring-2 ring-slate-100 ring-offset-2 relative">
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                {isSubmitting && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full shadow-lg border-2 border-white hover:bg-slate-800 transition-colors"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-slate-900">
                {profile.name}
              </h1>
              <p className="text-slate-500 text-sm mt-1">{profile.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                <span className="bg-slate-900 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                  Pro Member
                </span>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                  Verified
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="md:ml-auto px-6 py-2.5 bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2 border border-slate-200"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => {
                  // Override the value for Total Orders stat with actual count
                  const displayValue =
                    stat.label === "Total Orders" ? orders.length : stat.value;
                  return (
                    <div
                      key={stat.label}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
                          stat.bg,
                        )}
                      >
                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                      </div>
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1">
                        {displayValue}
                      </h3>
                    </div>
                  );
                })}
              </div>

              {/* Grid: Orders & Wishlist */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-500" />
                      Recent Orders
                    </h2>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      View All
                    </button>
                  </div>
                  <div className="p-0 flex-1">
                    {orders.slice(0, 2).length > 0 ? (
                      orders.slice(0, 2).map((order) => (
                        <div
                          key={order.id}
                          className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-center gap-4"
                        >
                          {order.items[0]?.productImage && (
                            <img
                              src={order.items[0].productImage}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {order.items[0]?.productName || "Order"}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {order.orderNumber} •{" "}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">
                              Rs. {order.total.toFixed(2)}
                            </p>
                            <span
                              className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                                order.status === "delivered"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700",
                              )}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-500">
                        <p className="text-sm">No orders yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-500" />
                      Saved Items
                    </h2>
                    <button onClick={() => setActiveTab("wishlist")} className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</button>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-4 flex-1">
                    {initialWishlist.slice(0, 2).map((item) => (
                      <div key={item.id} className="relative group">
                        <div className="rounded-xl overflow-hidden aspect-square">
                          <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="mt-2">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                          <p className="text-xs text-emerald-600 font-bold mt-0.5">Rs. {item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Your Orders
                </h2>
              </div>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
              ) : ordersError ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <p className="text-red-700 font-semibold">{ordersError}</p>
                  <button
                    onClick={() => {
                      setOrdersError(null);
                      setOrdersLoading(true);
                      storefrontApi
                        .getOrders()
                        .then(setOrders)
                        .catch((e) => {
                          setOrdersError(
                            e instanceof Error
                              ? e.message
                              : "Failed to load orders",
                          );
                        })
                        .finally(() => setOrdersLoading(false));
                    }}
                    className="mt-3 text-red-600 hover:text-red-700 font-semibold text-sm"
                  >
                    Try Again
                  </button>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow"
                    >
                      {order.items[0]?.productImage && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-inner">
                          <img
                            src={order.items[0].productImage}
                            alt={order.items[0].productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 text-center md:text-left min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 text-lg truncate">
                            {order.items.length === 1
                              ? order.items[0]?.productName
                              : `${order.items.length} items`}
                          </h3>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase w-fit mx-auto md:mx-0",
                              order.status === "delivered"
                                ? "bg-emerald-100 text-emerald-700"
                                : order.status === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : order.status === "shipped"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "processing"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-rose-100 text-rose-700",
                            )}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">
                          Order ID:{" "}
                          <span className="text-slate-900 font-medium">
                            {order.orderNumber}
                          </span>{" "}
                          • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center md:text-right shrink-0">
                        <p className="text-xl font-bold text-slate-900 mb-2">
                          Rs. {order.total.toFixed(2)}
                        </p>
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto md:ml-auto">
                          Track Package <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-semibold">No orders yet</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Start shopping to create your first order!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-xl font-bold text-slate-900">
                Wishlist ({initialWishlist.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialWishlist.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-rose-500 transition-colors shadow-lg shadow-black/5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-emerald-600 font-bold text-lg mt-1">
                        Rs. {item.price}
                      </p>
                      <button className="w-full mt-4 bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition-colors text-sm flex items-center justify-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Address Book */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                    Address Book
                  </h2>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setIsAddressModalOpen(true);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add New Address
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={cn(
                        "bg-white rounded-2xl border p-5 shadow-sm flex flex-col gap-3 relative transition-all",
                        addr.isDefault
                          ? "border-slate-900"
                          : "border-slate-200 hover:border-slate-300",
                      )}
                    >
                      {addr.isDefault && (
                        <span className="absolute top-4 right-4 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          Default
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide",
                            addr.type === "Home"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-purple-50 text-purple-600",
                          )}
                        >
                          {addr.type}
                        </span>
                        <h3 className="font-bold text-slate-900">
                          {addr.name}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {addr.address}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {addr.phone}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <button
                          onClick={() => {
                            setEditingAddress(addr);
                            setIsAddressModalOpen(true);
                          }}
                          className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          Edit Address
                        </button>
                        <button
                          onClick={() =>
                            addr.id && handleDeleteAddress(addr.id)
                          }
                          className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-500" /> Payment
                    Methods
                  </h2>
                </div>
                <div className="p-6">
                  <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-sm hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Payment Method
                  </button>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* ─── Modals ─────────────────────────────────────── */}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsEditProfileOpen(false)}
          />
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Edit Profile
                </h2>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={onUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                    Full Name
                  </label>
                  <input
                    name="name"
                    defaultValue={profile.name}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={profile.email}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal (Add/Edit) */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsAddressModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingAddress ? "Edit Address" : "Add Address"}
                </h2>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={onSaveAddress} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                      Address Label
                    </label>
                    <select
                      name="type"
                      defaultValue={editingAddress?.type || "Home"}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    >
                      <option>Home</option>
                      <option>Office</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                      Full Name
                    </label>
                    <input
                      name="name"
                      defaultValue={editingAddress?.name}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={editingAddress?.phone}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                    Street Address
                  </label>
                  <textarea
                    name="address"
                    defaultValue={editingAddress?.address}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="isDefault"
                    defaultChecked={editingAddress?.isDefault}
                    className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                    Set as default address
                  </span>
                </label>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {editingAddress ? "Update" : "Add Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
