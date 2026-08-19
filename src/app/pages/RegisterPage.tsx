import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Eye, EyeOff, ShoppingCart, Loader2, CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/app/context/authcontext";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  country: string;
  newsletter: boolean;
  terms: boolean;
};

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  password: "",
  confirmPassword: "",
  address: "",
  city: "",
  country: "",
  newsletter: false,
  terms: false,
};

function StrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-slate-200", "bg-rose-400", "bg-amber-400", "bg-blue-400", "bg-[#16A34A]"];

  if (!password) return null;

  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : "bg-slate-200"}`} />
        ))}
      </div>
      <p className={`text-xs font-semibold ${strength <= 1 ? "text-rose-500" : strength === 2 ? "text-amber-500" : strength === 3 ? "text-blue-500" : "text-[#16A34A]"}`}>
        {labels[strength]}
      </p>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState<FormData>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | "general", string>>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) newErrors.email = "Valid email required";
    if (!form.phone.trim() || !/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) newErrors.phone = "Valid phone number required";
    if (!form.password || form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!form.terms) newErrors.terms = "You must accept the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      await register({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        confirm_password: form.confirmPassword,
      });

      setIsSuccess(true);
      toast.success("Account created successfully. Please login.");
      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err instanceof Error ? err.message : "Unable to register. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all";
  const inputError = "border-rose-300 focus:border-rose-400 focus:ring-rose-100";
  const inputOk = "border-slate-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] via-white to-[#ECFDF5] flex items-center justify-center p-4 py-10">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#16A34A]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#16A34A]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#16A34A]/10 border border-white/60 overflow-hidden">
          {/* Accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#4ADE80]" />

          <div className="p-8 sm:p-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <Link to="/" className="flex items-center gap-2.5 mb-5 group">
                <div className="w-10 h-10 bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-xl flex items-center justify-center shadow-lg shadow-[#16A34A]/30 group-hover:scale-105 transition-transform">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-[#111827]">Himalayan Local Product Nepal</span>
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
              <p className="text-sm text-slate-500 mt-1.5 text-center">
                Join thousands of shoppers — it's completely free
              </p>
            </div>

            {/* Success state */}
            {isSuccess && (
              <div className="flex flex-col items-center py-6 gap-3 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-[#16A34A]" />
                </div>
                <p className="font-bold text-slate-900 text-lg">Account created successfully!</p>
                <p className="text-sm text-slate-500">Redirecting to login...</p>
              </div>
            )}

            {!isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {errors.general && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                    {errors.general}
                  </div>
                )}
                {/* ── Personal Info ── */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center shrink-0">1</div>
                    <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Personal Information</h2>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">First Name *</label>
                      <input
                        id="reg-first-name"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={(e) => set("firstName", e.target.value)}
                        placeholder="John"
                        className={`${inputBase} ${errors.firstName ? inputError : inputOk}`}
                      />
                      {errors.firstName && <p className="text-xs text-rose-500 font-medium">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Name *</label>
                      <input
                        id="reg-last-name"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={form.lastName}
                        onChange={(e) => set("lastName", e.target.value)}
                        placeholder="Doe"
                        className={`${inputBase} ${errors.lastName ? inputError : inputOk}`}
                      />
                      {errors.lastName && <p className="text-xs text-rose-500 font-medium">{errors.lastName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address *</label>
                      <input
                        id="reg-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="john@example.com"
                        className={`${inputBase} ${errors.email ? inputError : inputOk}`}
                      />
                      {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number *</label>
                      <input
                        id="reg-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+977 98xxxxxxxx"
                        className={`${inputBase} ${errors.phone ? inputError : inputOk}`}
                      />
                      {errors.phone && <p className="text-xs text-rose-500 font-medium">{errors.phone}</p>}
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
                      <input
                        id="reg-dob"
                        name="dateOfBirth"
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => set("dateOfBirth", e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all"
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gender</label>
                      <select
                        id="reg-gender"
                        name="gender"
                        value={form.gender}
                        onChange={(e) => set("gender", e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all"
                      >
                        <option value="">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* ── Security ── */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center shrink-0">2</div>
                    <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Security</h2>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password *</label>
                      <div className="relative">
                        <input
                          id="reg-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          value={form.password}
                          onChange={(e) => set("password", e.target.value)}
                          placeholder="Min. 8 characters"
                          className={`${inputBase} pr-12 ${errors.password ? inputError : inputOk}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                      <StrengthBar password={form.password} />
                      {errors.password && <p className="text-xs text-rose-500 font-medium">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirm Password *</label>
                      <div className="relative">
                        <input
                          id="reg-confirm-password"
                          name="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          autoComplete="new-password"
                          value={form.confirmPassword}
                          onChange={(e) => set("confirmPassword", e.target.value)}
                          placeholder="Repeat password"
                          className={`${inputBase} pr-12 ${errors.confirmPassword ? inputError : inputOk}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                      {form.confirmPassword && form.password === form.confirmPassword && (
                        <p className="text-xs text-[#16A34A] font-semibold">Passwords match</p>
                      )}
                      {errors.confirmPassword && <p className="text-xs text-rose-500 font-medium">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </section>

                {/* ── Delivery Address ── */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center shrink-0">3</div>
                    <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Delivery Address <span className="text-slate-400 font-normal normal-case tracking-normal">(Optional)</span></h2>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Street */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Street Address</label>
                      <input
                        id="reg-address"
                        name="address"
                        type="text"
                        autoComplete="street-address"
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        placeholder="123 Main Street, Apartment 4B"
                        className={`${inputBase} ${inputOk}`}
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">City</label>
                      <input
                        id="reg-city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                        placeholder="Kathmandu"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all"
                      />
                    </div>

                    {/* Country */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Country</label>
                      <select
                        id="reg-country"
                        name="country"
                        value={form.country}
                        onChange={(e) => set("country", e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all"
                      >
                        <option value="">Select country</option>
                        <option value="NP">Nepal</option>
                        <option value="IN">India</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="CA">Canada</option>
                        <option value="DE">Germany</option>
                        <option value="SG">Singapore</option>
                        <option value="AE">UAE</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* ── Preferences ── */}
                <section className="space-y-3 pt-1">
                  {/* Newsletter */}
                  <label className="flex items-start gap-3 cursor-pointer group select-none" htmlFor="checkbox-newsletter">
                    <button
                      type="button"
                      id="checkbox-newsletter"
                      onClick={() => set("newsletter", !form.newsletter)}
                      className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${form.newsletter ? "bg-[#16A34A] border-[#16A34A]" : "border-slate-300 group-hover:border-[#16A34A]"}`}
                    >
                      {form.newsletter && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors leading-5">
                      <span className="font-semibold text-slate-800">Subscribe to newsletter</span> — Get exclusive deals, new arrivals & special offers
                    </span>
                  </label>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer group select-none" htmlFor="checkbox-terms">
                    <button
                      type="button"
                      id="checkbox-terms"
                      onClick={() => set("terms", !form.terms)}
                      className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${form.terms ? "bg-[#16A34A] border-[#16A34A]" : errors.terms ? "border-rose-400" : "border-slate-300 group-hover:border-[#16A34A]"}`}
                    >
                      {form.terms && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors leading-5">
                      I agree to BOL's{" "}
                      <Link to="#" className="font-bold text-[#16A34A] hover:underline">Terms of Service</Link>
                      {" "}and{" "}
                      <Link to="#" className="font-bold text-[#16A34A] hover:underline">Privacy Policy</Link>
                      {" "}*
                    </span>
                  </label>
                  {errors.terms && <p className="text-xs text-rose-500 font-medium pl-8">{errors.terms}</p>}
                </section>

                {/* Submit */}
                <button
                  id="register-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white font-bold rounded-xl shadow-lg shadow-[#16A34A]/30 hover:shadow-xl hover:shadow-[#16A34A]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
                  ) : (
                    <>Register</>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">or register with</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Social login buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="flex items-center justify-center gap-2.5 py-3 px-4 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                  <button type="button" className="flex items-center justify-center gap-2.5 py-3 px-4 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Phone
                  </button>
                </div>
              </form>
            )}

            {/* Login link */}
            {!isSuccess && (
              <p className="text-center text-sm text-slate-500 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-[#16A34A] hover:text-[#15803D] transition-colors">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Benefits strip */}
        {/* <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: "🛡️", title: "Secure Shopping", desc: "SSL encrypted" },
            { icon: "", title: "Fast Delivery", desc: "Track in real-time" },
            { icon: "↩️", title: "Easy Returns", desc: "30-day policy" },
          ].map((b) => (
            <div key={b.title} className="bg-white/60 backdrop-blur rounded-2xl p-4 text-center border border-white/80 shadow-sm">
              <div className="text-2xl mb-1">{b.icon}</div>
              <p className="text-xs font-bold text-slate-700">{b.title}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{b.desc}</p>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
