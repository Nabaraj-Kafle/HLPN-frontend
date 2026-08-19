import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  ArrowLeft, ShieldCheck, Truck, CreditCard,
  MapPin, Phone, Mail, User, CheckCircle2,
  QrCode, Wallet, Info, ChevronRight, ShoppingBag
} from "lucide-react";
import { getUserAvatar, useAuth } from "@/app/context/authcontext";
import { storefrontApi, type Order } from "@/lib/store-api";
import type { Product } from "@/app/components/shop/ProductCard";

type CartItem = Product & { quantity: number };

interface CheckoutPageProps {
  cartItems: CartItem[];
  onClearCart: () => void;
}

export function CheckoutPage({ cartItems, onClearCart }: CheckoutPageProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "qr">("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: user ? `${user.first_name} ${user.last_name}`.trim() : "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: "",
    city: "",
    zipCode: "",
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 12.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted!", { formData, cartItems, paymentMethod });

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim()) {
      console.warn("Validation failed - missing required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    if (cartItems.length === 0) {
      console.warn("No items in cart");
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create temporary address
      console.log("Step 1: Creating temporary address...");
      const addressPayload = {
        name: formData.fullName,
        phone: formData.phone,
        address_line: formData.address,
        city: formData.city || "Unknown",
        country: "Nepal",
        label: "Checkout Address",
        is_default: false,
      };

      const createdAddress = await storefrontApi.createAddress(addressPayload);
      console.log("Address created:", createdAddress);

      // Step 2: Create order using address_id
      console.log("Step 2: Creating order with address_id:", createdAddress.id);

      const orderPayload = {
        address_id: createdAddress.id,
        shipping_amount: shipping,
        tax_amount: tax,
        discount_amount: 0,
        notes: `Payment Method: ${paymentMethod === "cod" ? "Cash on Delivery" : "QR Payment"}`,
      };

      console.log("Order payload:", JSON.stringify(orderPayload, null, 2));

      const order = await storefrontApi.createOrder(orderPayload);
      console.log("Order created successfully:", order);

      setCreatedOrder(order);
      setIsSuccess(true);
      onClearCart();
      toast.success("Order placed successfully!");
    } catch (error) {
      let errorMsg = "Failed to place order";

      // Check if it's an axios error with response
      if (error instanceof Error) {
        console.error("Full error object:", error);

        // Check for axios error response
        if ("response" in error) {
          const axiosError = error as any;
          console.error("Axios error status:", axiosError.response?.status);
          console.error("Axios error data:", axiosError.response?.data);

          if (axiosError.response?.status === 400) {
            const errorData = axiosError.response?.data;
            if (typeof errorData === "object") {
              const errorDetails = Object.entries(errorData)
                .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                .join(", ");
              errorMsg = `Error: ${errorDetails}`;
            } else {
              errorMsg = `Invalid data: ${JSON.stringify(errorData)}`;
            }
          } else if (axiosError.response?.status === 401) {
            errorMsg = "Authentication failed. Please login again.";
          } else if (axiosError.response?.status === 403) {
            errorMsg = "Permission denied. Invalid address.";
          } else if (axiosError.response?.status === 500) {
            errorMsg = "Server error. Please try again later.";
          }
        }

        if (errorMsg === "Failed to place order") {
          errorMsg = error.message;
        }
      }

      console.error("Order creation error:", errorMsg, error);
      toast.error(errorMsg);
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No items to checkout</h2>
        <p className="text-gray-500 mb-6">Your cart is currently empty.</p>
        <Link to="/shop" className="bg-[#16A34A] text-white font-bold py-3 px-8 rounded-xl ring-offset-2 hover:ring-2 ring-[#16A34A]/30 transition-all">
          Go to Shop
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <style>{`
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #16A34A;
            top: -10px;
            z-index: 0;
            animation: confetti 3s ease-in infinite;
          }
        `}</style>
        <div className="relative flex flex-col items-center text-center max-w-md">
          {user && (
            <img
              src={getUserAvatar(user)}
              alt={formData.fullName || user.email}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-[#16A34A]/10 mb-4"
            />
          )}
          <div className="w-20 h-20 bg-[#F0FDF4] rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-[#16A34A]" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Order Placed!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase! We've sent a confirmation email and will notify you when your order is on its way.
          </p>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl w-full mb-8 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Order Number</span>
              <span className="text-sm font-bold text-gray-900">{createdOrder?.orderNumber || "#0000"}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Total Amount</span>
              <span className="text-sm font-bold text-[#16A34A]">Rs. {createdOrder?.total.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span className="text-sm font-bold text-gray-900 capitalize">{createdOrder?.status || "pending"}</span>
            </div>
          </div>
          <Link to="/orders" className="w-full bg-[#16A34A] text-white font-bold py-4 rounded-xl hover:bg-[#15803D] transition-all shadow-lg shadow-[#16A34A]/20 flex items-center justify-center no-underline mb-3">
            View Your Orders
          </Link>
          <Link to="/" className="w-full border-2 border-[#16A34A] text-[#16A34A] font-bold py-4 rounded-xl hover:bg-[#F0FDF4] transition-all flex items-center justify-center no-underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#16A34A] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

          {/* Main Form */}
          <form onSubmit={handlePlaceOrder} className="space-y-6">

            {/* Shipping Details */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#16A34A]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Shipping Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/5 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/5 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Shipping Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Shopping Lane, New York, NY 10001" className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/5 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (234) 567-890" className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/5 outline-none transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#F0F9FF] rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#0EA5E9]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Option</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${paymentMethod === "cod"
                    ? "border-[#16A34A] bg-[#F0FDF4]"
                    : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${paymentMethod === "cod" ? "border-[#16A34A]" : "border-gray-200"
                    }`}>
                    {paymentMethod === "cod" && <div className="w-3 h-3 bg-[#16A34A] rounded-full" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Cash on Delivery</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Pay when your order arrives at your doorstep. Simple and secure.</p>
                    <Wallet className="w-10 h-10 text-[#16A34A]/10 absolute bottom-4 right-4" />
                  </div>
                </button>

                {/* QR */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("qr")}
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${paymentMethod === "qr"
                    ? "border-[#16A34A] bg-[#F0FDF4]"
                    : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${paymentMethod === "qr" ? "border-[#16A34A]" : "border-gray-200"
                    }`}>
                    {paymentMethod === "qr" && <div className="w-3 h-3 bg-[#16A34A] rounded-full" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">QR Payment</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Scan our official QR code with any payment app to pay instantly.</p>
                    <QrCode className="w-10 h-10 text-[#16A34A]/10 absolute bottom-4 right-4" />
                  </div>
                </button>
              </div>

              {/* QR Display Area */}
              {paymentMethod === "qr" && (
                <div className="mt-8 p-6 bg-gray-50 rounded-2xl flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                    {/* QR Placeholder */}
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center relative">
                      <QrCode className="w-16 h-16 text-gray-400 opacity-20" />
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BOL-ORDER-PAYMENT"
                        alt="Order QR Code"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Scan to Pay Rs. {total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Scan using any UPI or Mobile Banking app</p>
                  <div className="mt-4 flex items-center gap-2 bg-[#DCFCE7] text-[#16A34A] px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Secure BOL Gateway</span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                {/* Product List */}
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={`${item.id}_${item.variantId ?? "base"}`} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                        {item.variantName && (
                          <p className="text-[11px] font-semibold text-[#16A34A] truncate">
                            Option: {item.variantName}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-100 my-6" />

                {/* Totals */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-gray-900">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className={`font-bold ${shipping === 0 ? "text-[#16A34A]" : "text-gray-900"}`}>
                      {shipping === 0 ? "FREE" : `Rs. ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service Tax (8%)</span>
                    <span className="font-bold text-gray-900">Rs. {tax.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-gray-100 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-gray-900">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#16A34A]">Rs. {total.toFixed(2)}</span>
                      <p className="text-[10px] text-gray-400">Incl. all taxes</p>
                    </div>
                  </div>
                </div>

                {/* Extra Info */}
                <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-2xl mb-8 flex gap-3">
                  <Info className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#92400E] leading-relaxed">
                    Orders placed now will be delivered within <strong>2-4 business days</strong> to your preferred address.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#16A34A] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#15803D] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-[#16A34A]/20"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Confirm & Place Order
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 opacity-40">
                  <ShieldCheck className="w-8 h-8" />
                  <div className="text-[10px] font-bold uppercase tracking-widest text-center">
                    Secure Checkout<br />Encrypted Tunnel
                  </div>
                </div>
              </div>
            </aside>
          </form>
        </div>
      </div>
    </div>
  );
}
