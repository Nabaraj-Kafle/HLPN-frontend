import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Truck,
  Tag,
  ChevronRight,
  Sparkles,
  PackageCheck,
  RotateCcw,
  Heart,
  ChevronUp,
  X,
} from "lucide-react";
import { useAuth } from "@/app/context/authcontext";
import type { CartItem } from "@/lib/store-api";

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number, variantId?: number) => void;
  onRemoveItem: (productId: number, variantId?: number) => void;
  onClearCart: () => void;
}

export function CartPage({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartPageProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [removingKey, setRemovingKey] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 150 ? 0 : subtotal > 0 ? 12.99 : 0;
  const tax = (subtotal - discount) * 0.08;
  const grandTotal = subtotal - discount + shipping + tax;
  const shippingPct = Math.min((subtotal / 150) * 100, 100);

  const handleRemove = (id: number, variantId?: number) => {
    const key = `${id}_${variantId ?? "base"}`;
    setRemovingKey(key);
    setTimeout(() => {
      onRemoveItem(id, variantId);
      setRemovingKey(null);
    }, 350);
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "SAVE10") setCouponApplied(true);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast.error("You are not logged in. Please login first.");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    navigate("/checkout");
  };

  /* ── Shared Summary Block ───────────────────────── */
  const SummaryContent = ({ inDrawer = false }: { inDrawer?: boolean }) => (
    <div className="flex flex-col">
      {/* Coupon */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-2">
          Promo Code
        </label>
        <div
          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border-2 transition-all duration-200 ${couponApplied
              ? "border-[#16A34A] bg-[#F0FDF4]"
              : "border-[#E2E8F0] bg-white focus-within:border-[#16A34A] focus-within:shadow-[0_0_0_3px_rgba(22,163,74,0.12)]"
            }`}
        >
          <Tag className="w-4 h-4 text-[#94A3B8] shrink-0" />
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-sm text-[#0F172A] placeholder:text-[#94A3B8] min-w-0"
            placeholder={
              couponApplied ? "SAVE10 applied ✓" : "Enter promo code"
            }
            value={couponApplied ? "SAVE10" : couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={couponApplied}
          />
          {!couponApplied ? (
            <button
              className="bg-[#0F172A] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#16A34A] active:scale-95 transition-all duration-150 whitespace-nowrap"
              onClick={handleApplyCoupon}
            >
              Apply
            </button>
          ) : (
            <button
              className="flex items-center gap-1 bg-[#DCFCE7] text-[#16A34A] text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-[#BBF7D0] transition-colors"
              onClick={() => {
                setCouponApplied(false);
                setCouponCode("");
              }}
            >
              <RotateCcw className="w-3 h-3" />
              Remove
            </button>
          )}
        </div>
        {!couponApplied && (
          <p className="text-xs text-[#94A3B8] mt-1.5 pl-1">
            Try{" "}
            <code className="bg-[#F1F5F9] px-1.5 py-0.5 rounded text-[11px] font-mono text-[#475569]">
              SAVE10
            </code>{" "}
            for 10% off
          </p>
        )}
      </div>

      {/* Summary Lines */}
      <div className="bg-[#F8FAFC] rounded-xl p-4 flex flex-col gap-3 mb-4">
        <div className="flex justify-between text-sm text-[#64748B]">
          <span>
            Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
          </span>
          <span className="font-semibold text-[#0F172A]">
            Rs. {subtotal.toFixed(2)}
          </span>
        </div>
        {couponApplied && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1.5 text-[#16A34A]">
              <Tag className="w-3.5 h-3.5" /> Discount (10%)
            </span>
            <span className="font-bold text-[#16A34A]">
              −${discount.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm text-[#64748B]">
          <span>Shipping</span>
          <span
            className={
              shipping === 0
                ? "font-bold text-[#16A34A]"
                : "font-semibold text-[#0F172A]"
            }
          >
            {shipping === 0 ? "FREE 🎉" : `Rs. ${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm text-[#64748B]">
          <span>Estimated Tax</span>
          <span className="font-semibold text-[#0F172A]">
            Rs. {tax.toFixed(2)}
          </span>
        </div>
        <div className="h-px bg-[#E2E8F0] my-0.5" />
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#0F172A] text-base">Total</span>
          <div className="text-right">
            <span className="font-extrabold text-[#0F172A] text-xl">
              Rs. {grandTotal.toFixed(2)}
            </span>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">
              USD · incl. all taxes
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        type="button"
        onClick={handleProceedToCheckout}
        className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-br from-[#16A34A] to-[#15803D] text-white font-bold text-sm sm:text-[15px] py-4 px-5 rounded-xl shadow-[0_4px_20px_rgba(22,163,74,0.4)] hover:shadow-[0_6px_28px_rgba(22,163,74,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 no-underline"
      >
        <ShoppingBag className="w-[1.1rem] h-[1.1rem]" />
        Proceed to Checkout
        <ChevronRight className="w-4 h-4 ml-auto opacity-80" />
      </button>

      {/* Continue Shopping */}
      <Link
        to="/shop"
        className="flex items-center justify-center mt-2.5 border-2 border-[#E2E8F0] rounded-xl py-3 px-4 text-sm font-semibold text-[#64748B] no-underline hover:border-[#16A34A] hover:text-[#16A34A] hover:bg-[#F0FDF4] transition-all duration-200"
      >
        Continue Shopping
      </Link>

      {/* Trust Badges */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          {
            icon: <ShieldCheck className="w-4 h-4 text-[#16A34A]" />,
            label: "SSL Secure",
          },
          {
            icon: <Truck className="w-4 h-4 text-[#16A34A]" />,
            label: "Fast Delivery",
          },
          {
            icon: <RotateCcw className="w-4 h-4 text-[#16A34A]" />,
            label: "Easy Returns",
          },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 bg-[#F8FAFC] rounded-xl py-3 px-2 text-center"
          >
            {icon}
            <span className="text-[10px] font-semibold text-[#64748B] leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── Empty State ────────────────────────────────── */
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-12 text-center max-w-md w-full shadow-[0_4px_20px_rgba(22,163,74,0.13),0_1px_4px_rgba(0,0,0,0.06)] animate-[slideIn_0.5s_ease]">
          <div className="relative w-[68px] h-[68px] mx-auto mb-5">
            <ShoppingCart className="w-[68px] h-[68px] text-[#16A34A] relative z-10" />
            <div className="absolute inset-[-10px] bg-[radial-gradient(circle,rgba(22,163,74,0.18)_0%,transparent_70%)] rounded-full animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Your cart is empty
          </h1>
          <p className="mt-2.5 mb-6 text-[#64748B] text-sm sm:text-base leading-relaxed">
            Discover amazing products from vendors near you.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[#16A34A] to-[#15803D] text-white font-bold text-sm sm:text-base py-3 px-7 rounded-xl no-underline shadow-[0_4px_16px_rgba(22,163,74,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,163,74,0.4)] transition-all"
          >
            Explore the Shop
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  /* ── Main Cart ──────────────────────────────────── */
  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawerSlideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .cart-item-anim {
          animation: slideIn 0.4s ease both;
          animation-delay: calc(var(--i, 0) * 55ms);
        }
        .cart-item-anim:hover .cart-item-stripe { opacity: 1; }
        .cart-item-anim:hover .cart-item-img { transform: scale(1.06); }
        .cart-item-removing { opacity: 0; transform: scale(0.97); pointer-events: none; transition: opacity 0.35s, transform 0.35s; }
        .drawer-open { animation: drawerSlideUp 0.38s cubic-bezier(0.32,0.72,0,1) both; }
        .overlay-anim { animation: fadeInOverlay 0.25s ease both; }

        /* ── KEY FIX: ensure the mobile bar always floats above footer ── */
        .mobile-cart-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          /* Sit above everything including footer's stacking context */
          z-index: 9999;
        }
        .mobile-cart-overlay {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(3px);
        }
        .mobile-cart-drawer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: white;
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
          max-height: 90dvh;
          display: flex;
          flex-direction: column;
        }
      `}</style>

      {/*
        CRITICAL FIX:
        - On mobile (< lg): add padding-bottom equal to the fixed bar height (~140px)
          so content is never hidden behind the floating bar AND the footer
          renders BELOW the page content (not behind the bar).
        - On desktop (≥ lg): standard bottom padding.
      */}
      <main className="min-h-screen bg-[#F9FAFB] pb-[148px] lg:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
          {/* ── Header ─────────────────────────────── */}
          <header className="flex items-end justify-between flex-wrap gap-3 mb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight">
                Shopping Cart
              </h1>
              <p className="mt-1 text-sm text-[#64748B]">
                <span className="inline-flex items-center justify-center bg-[#16A34A] text-white text-[11px] font-bold h-5 px-2 rounded-full align-middle mr-1">
                  {cartItems.length}
                </span>
                {cartItems.length === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <button
              onClick={onClearCart}
              className="bg-transparent border-[1.5px] border-[#E2E8F0] rounded-xl px-4 py-1.5 text-sm font-medium text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors whitespace-nowrap cursor-pointer"
            >
              Clear all
            </button>
          </header>

          {/* ── Shipping Banner ────────────────────── */}
          {shipping > 0 ? (
            <div className="flex items-center gap-3 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] rounded-xl px-4 py-3 mb-5 text-sm">
              <Truck className="w-5 h-5 shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <span>
                  Add <strong>Rs. {(150 - subtotal).toFixed(2)}</strong> more for
                  free shipping
                </span>
                <div className="h-1.5 bg-[#FDE68A] rounded-full overflow-hidden max-w-[200px] w-full">
                  <div
                    className="h-full bg-gradient-to-r from-[#F59E0B] to-[#16A34A] rounded-full transition-[width] duration-500"
                    style={{ width: `${shippingPct}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-[#F0FDF4] border border-[#86EFAC] text-[#14532D] rounded-xl px-4 py-3 mb-5 text-sm">
              <PackageCheck className="w-5 h-5 shrink-0" />
              <span>
                You've unlocked <strong>free shipping!</strong> 🎉
              </span>
            </div>
          )}

          {/* ── Two-Column Layout ──────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] 2xl:grid-cols-[1fr_400px] gap-5 lg:gap-6 xl:gap-7 items-start">
            {/* ── Items Column ───────────────────── */}
            <section className="flex flex-col gap-3 sm:gap-3.5">
              {cartItems.map((item, idx) => {
                const itemKey = `${item.id}_${item.variantId ?? "base"}`;
                return (
                  <article
                    key={itemKey}
                    className={`cart-item-anim relative bg-white border border-[#E2E8F0] rounded-2xl p-3.5 sm:p-4 lg:p-5 flex gap-3 sm:gap-4 lg:gap-5 shadow-[0_1px_3px_rgba(0,0,0,0.07),0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(22,163,74,0.13),0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-200 ${removingKey === itemKey ? "cart-item-removing" : ""}`}
                    style={{ "--i": idx } as React.CSSProperties}
                  >
                    <div className="cart-item-stripe absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#16A34A] to-[#86EFAC] rounded-l-2xl opacity-0 transition-opacity duration-200" />
                    {item.discount && (
                      <div className="absolute top-2.5 left-2.5 z-10 bg-[#F59E0B] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                        -{item.discount}%
                      </div>
                    )}
                    <div className="shrink-0 self-start w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden bg-[#F8FAFC]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-img w-full h-full object-cover transition-transform duration-400"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-sm sm:text-base font-semibold text-[#0F172A] truncate">
                            {item.name}
                          </h2>
                          <p className="text-xs text-[#94A3B8] mt-0.5">
                            {item.vendor} · {item.location}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {item.variantName && (
                              <span className="inline-flex items-center gap-1 bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-[11px] font-bold px-2 py-0.5 rounded-md">
                                Option: {item.variantName}
                              </span>
                            )}
                            {item.badge && (
                              <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#14532D] text-[11px] font-bold px-2 py-0.5 rounded-full">
                                <Sparkles className="w-2.5 h-2.5" />
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm sm:text-base font-bold text-[#16A34A]">
                            Rs. {item.price.toFixed(2)}
                          </p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-xs text-[#94A3B8] line-through">
                              Rs. {item.originalPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="inline-flex items-center border-[1.5px] border-[#E2E8F0] rounded-xl overflow-hidden bg-[#F8FAFC]">
                          <button
                            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-transparent border-none cursor-pointer text-[#64748B] hover:bg-[#DCFCE7] hover:text-[#16A34A] transition-colors"
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity - 1, item.variantId)
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="min-w-[2rem] text-center font-bold text-sm text-[#0F172A]">
                            {item.quantity}
                          </span>
                          <button
                            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-transparent border-none cursor-pointer text-[#64748B] hover:bg-[#DCFCE7] hover:text-[#16A34A] transition-colors"
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity + 1, item.variantId)
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <span className="text-sm sm:text-base font-bold text-[#0F172A] mr-1">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            className="flex items-center justify-center w-9 h-9 rounded-lg bg-transparent border-none cursor-pointer text-[#94A3B8] hover:text-[#EC4899] hover:bg-[#FDF2F8] transition-colors"
                            aria-label="Save for later"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                          <button
                            className="flex items-center justify-center w-9 h-9 rounded-lg bg-transparent border-none cursor-pointer text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
                            onClick={() => handleRemove(item.id, item.variantId)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* ── Desktop Sidebar (≥lg) ──────────── */}
            <aside className="hidden lg:block sticky top-24">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 xl:p-6 2xl:p-7 shadow-[0_4px_20px_rgba(22,163,74,0.13),0_1px_4px_rgba(0,0,0,0.06)]">
                <h3 className="text-xl xl:text-2xl font-bold text-[#0F172A] tracking-tight mb-5">
                  Order Summary
                </h3>
                <SummaryContent />
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* ════════════════════════════════════════════
          MOBILE BOTTOM BAR + FULL-SCREEN DRAWER
          Rendered OUTSIDE <main> so it is never
          clipped or stacked beneath the footer.
          Uses z-index: 9999 via .mobile-cart-bar
          ════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* Backdrop overlay */}
        {summaryOpen && (
          <div
            className="mobile-cart-overlay overlay-anim"
            onClick={() => setSummaryOpen(false)}
          />
        )}

        {/* ── Floating Bottom Bar ── always on top ── */}
        <div className="mobile-cart-bar px-3 pb-3 sm:px-4 sm:pb-4">
          <div
            className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
            style={{
              boxShadow:
                "0 -4px 24px rgba(0,0,0,0.10), 0 -1px 6px rgba(0,0,0,0.06), 0 8px 30px rgba(22,163,74,0.10)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Mini summary row — tap to open drawer */}
            <button
              className="w-full flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 bg-transparent border-none cursor-pointer"
              onClick={() => setSummaryOpen(true)}
              aria-label="View order summary"
            >
              {/* Left */}
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#15803D] flex items-center justify-center shadow-[0_2px_8px_rgba(22,163,74,0.4)]">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 bg-[#F59E0B] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center leading-none min-w-[18px] min-h-[18px] px-0.5">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#64748B] leading-none">
                    Order Summary
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-none">
                    Tap to review & checkout
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-base font-extrabold text-[#0F172A] leading-none">
                    Rs. {grandTotal.toFixed(2)}
                  </p>
                  {couponApplied && (
                    <p className="text-[10px] font-semibold text-[#16A34A] mt-0.5 leading-none">
                      10% saved!
                    </p>
                  )}
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] flex items-center justify-center">
                  <ChevronUp
                    className={`w-4 h-4 text-[#16A34A] transition-transform duration-200 ${summaryOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
            </button>

            {/* Checkout CTA — always visible */}
            <div className="px-3 pb-3 sm:px-4 sm:pb-4">
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[#16A34A] to-[#15803D] text-white font-bold text-sm py-3.5 rounded-xl shadow-[0_4px_16px_rgba(22,163,74,0.4)] active:scale-[0.98] transition-all duration-150 no-underline"
              >
                <ShoppingBag className="w-4 h-4" />
                Checkout · Rs. {grandTotal.toFixed(2)}
                <ChevronRight className="w-4 h-4 ml-auto opacity-80" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Full Drawer Sheet ── */}
        {summaryOpen && (
          <div className="mobile-cart-drawer drawer-open">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-[#E2E8F0] rounded-full" />
            </div>

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 pb-4 pt-2 border-b border-[#F1F5F9] shrink-0">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Order Summary
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  {cartItems.reduce((s, i) => s + i.quantity, 0)} items · $
                  {subtotal.toFixed(2)} subtotal
                </p>
              </div>
              <button
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] transition-colors border-none cursor-pointer"
                onClick={() => setSummaryOpen(false)}
                aria-label="Close summary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 px-5 py-5 pb-safe">
              <SummaryContent inDrawer />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
