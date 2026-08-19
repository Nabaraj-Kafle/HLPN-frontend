import { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Settings,
  Package,
  Heart,
  Bell,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import logo from "../../../public/ecomlogo.jpeg";

interface AuthUser {
  name: string;
  email: string;
  avatar: string;
}

interface NavbarProps {
  cartCount: number;
  user: AuthUser | null;
  onLogout: () => void;
}

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  // { label: "Vendor", to: "/vendor" },
  { label: "Categories", to: "/categories" },
  { label: "Our Story", to: "/about" },
];

export function Navbar({ cartCount, user, onLogout }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSearchQuery("");
      setMobileSearchQuery("");
      setMobileSearchOpen(false);
    }
  };

  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  /* ── Scroll shadow ─────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close mobile menu on route change ─────────── */
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  /* ── Close profile dropdown on outside click ───── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (to: string) =>
    location.pathname === to ||
    (to !== "/" && location.pathname.startsWith(to));

  const handleAccountClick = () => {
    // If already logged in, go to profile; otherwise go to login
    navigate(user ? "/profile" : "/login");
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    onLogout();
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${
        isScrolled
          ? "shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
          : "border-b border-gray-100"
      }`}
    >
      {/* ═══════════════════ MAIN BAR ═══════════════════ */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex items-center h-[68px] gap-8">
          {/* ── Logo ────────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 group"
            aria-label="Himalayan Local Product Nepal home"
          >
            <img
              src={logo}
              alt="Himalayan Local Product Nepal Logo"
              className="w-16 h-16 object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {/* <span className="hidden sm:block text-[1.05rem] font-bold leading-snug text-[#0d7032] max-w-[160px]">
              Himalayan Local Product Nepal
            </span> */}

            <img
              src="/namelogo.png"
              alt="Himalayan Local Product Nepal"
              className="h-10 w-auto object-contain "
            />
          </Link>

          {/* ── Desktop Nav Links ───────────────────────── */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-[0.875rem] font-semibold transition-all duration-150 ${
                  isActive(link.to)
                    ? "text-[#16A34A] bg-[#F0FDF4]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Become a Vendor pill */}
            {/* <Link
              to="/becomevendor"
              className={`whitespace-nowrap ml-2 px-4 py-2 rounded-full text-[0.875rem] font-bold transition-all duration-200 ${isActive("/becomevendor")
                ? "bg-[#15803D] text-white shadow-md shadow-[#16A34A]/30"
                : "bg-[#16A34A] text-white hover:bg-[#15803D] hover:shadow-md hover:shadow-[#16A34A]/25 hover:-translate-y-px active:translate-y-0"
                }`}
            >
              Become a Vendor
            </Link> */}
          </div>

          {/* ── Desktop Right Actions ───────────────────── */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 w-52 xl:w-60 hover:border-gray-300 focus-within:border-[#16A34A] focus-within:ring-2 focus-within:ring-[#16A34A]/10 transition-all">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="search"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(searchQuery)
                }
                className="bg-transparent border-none outline-none text-[0.85rem] text-gray-700 placeholder:text-gray-400 w-full"
              />
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150 ${
                isActive("/cart")
                  ? "text-[#16A34A] bg-[#F0FDF4]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-amber-400 text-white text-[10px] font-extrabold rounded-full leading-none shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* ── Auth: logged out → Account button ─────── */}
            {!user && (
              <button
                id="nav-account-btn"
                onClick={handleAccountClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-[0.875rem] font-bold shadow-md shadow-[#16A34A]/25 hover:bg-[#15803D] hover:shadow-lg hover:shadow-[#16A34A]/30 hover:-translate-y-px active:translate-y-0 transition-all duration-200"
              >
                <User className="w-4 h-4" />
                Account
              </button>
            )}

            {/* ── Auth: logged in → Profile dropdown ──────── */}
            {user && (
              <div className="relative" ref={profileRef}>
                <button
                  id="profile-menu-btn"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-[#16A34A]/30 shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=16A34A&color=fff&bold=true`;
                      }}
                    />
                  </div>
                  <span className="text-[0.875rem] font-semibold text-gray-800 max-w-[90px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown panel */}
                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-2xl shadow-xl shadow-gray-200/70 border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User info */}
                    <div className="px-4 py-3.5 bg-gradient-to-br from-[#F0FDF4] to-white border-b border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[#16A34A]/30 shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=16A34A&color=fff&bold=true`;
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      {[
                        { to: "/profile", icon: User, label: "Dashboard" },
                        // { to: "/profile", icon: Package, label: "My Orders" },
                        // { to: "/profile", icon: Heart, label: "Wishlist" },
                        // { to: "/profile", icon: Bell, label: "Notifications" },
                        // { to: "/profile", icon: Settings, label: "Settings" },
                      ].map(({ to, icon: Icon, label }) => (
                        <Link
                          key={label}
                          to={to}
                          id={`nav-${label.toLowerCase().replace(/\s/g, "-")}`}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
                        >
                          <Icon className="w-4 h-4 text-gray-400" />
                          {label}
                        </Link>
                      ))}

                      <div className="h-px bg-gray-100 my-1" />

                      <button
                        id="nav-logout-btn"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-rose-500 hover:bg-rose-50 font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Mobile Right Block ───────────────────────── */}
          <div className="flex lg:hidden items-center gap-2 ml-auto">
            {/* Mobile search toggle */}
            <button
              aria-label="Search"
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              {mobileSearchOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-amber-400 text-white text-[9px] font-extrabold rounded-full">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Search Bar (collapsible) ─────────────── */}
        {mobileSearchOpen && (
          <div className="lg:hidden pb-3 animate-in slide-in-from-top-1 duration-150">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#16A34A] focus-within:ring-2 focus-within:ring-[#16A34A]/10 transition-all">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                autoFocus
                type="search"
                placeholder="Search products…"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(mobileSearchQuery)
                }
                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════ MOBILE MENU ═══════════════════ */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-4 space-y-1">
            {/* Logged-in user card */}
            {user && (
              <div className="flex items-center gap-3 p-3 mb-2 bg-[#F0FDF4] rounded-2xl border border-[#BBF7D0]">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[#16A34A]/30 shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=16A34A&color=fff&bold=true`;
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center h-11 px-4 rounded-xl text-[0.9rem] font-semibold transition-colors ${
                  isActive(link.to)
                    ? "text-[#16A34A] bg-[#F0FDF4]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Become a vendor */}
            {/* <Link
              to="/becomevendor"
              className="flex items-center justify-center h-11 px-4 rounded-xl text-[0.9rem] font-bold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors mt-1"
            >
              Become a Vendor
            </Link> */}

            <div className="h-px bg-gray-100 my-2" />

            {/* Auth section */}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 h-11 px-4 rounded-xl text-[0.9rem] text-gray-700 font-medium hover:bg-gray-50"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  My Profile
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 h-11 px-4 rounded-xl text-[0.9rem] text-gray-700 font-medium hover:bg-gray-50"
                >
                  <Package className="w-4 h-4 text-gray-400" />
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 h-11 px-4 rounded-xl text-[0.9rem] text-rose-500 font-medium hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                id="mobile-account-btn"
                onClick={() => {
                  setMobileOpen(false);
                  handleAccountClick();
                }}
                className="w-full flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-[0.9rem] font-bold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors"
              >
                <User className="w-4 h-4" />
                Account
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
