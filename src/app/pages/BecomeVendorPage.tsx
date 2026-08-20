import { CheckCircle2, Rocket, ShieldCheck, Store, TrendingUp, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/app/context/authcontext";
import { toast } from "sonner";
import { LocationPicker } from "@/app/components/LocationPicker";

const benefits = [
      {
            icon: TrendingUp,
            title: "Faster Growth",
            description:
                  "Access a high-intent customer base and scale sales with seasonal campaigns.",
      },
      {
            icon: ShieldCheck,
            title: "Trusted Platform",
            description:
                  "Built-in trust badges, secure payments, and transparent seller performance metrics.",
      },
      {
            icon: Rocket,
            title: "Quick Launch",
            description:
                  "Publish your first products quickly with guided onboarding and easy catalog tools.",
      },
];

const steps = [
      "Create your vendor account",
      "Submit business details for verification",
      "Upload products and set pricing",
      "Start receiving orders",
];

const stats = [
      { label: "Active buyers", value: "120K+" },
      { label: "Monthly orders", value: "42K" },
      { label: "Average seller growth", value: "31%" },
      { label: "Onboarding time", value: "< 24 hrs" },
];
//test

export function BecomeVendorPage() {
      const { isAuthenticated, isLoading ,user } = useAuth();

      // const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "https://api.himalayanlocalproductnepal.com.np/api/";
      const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "https://api.himalayanlocalproductnepal.com.np/api/";
      // const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://127.0.0.1:8000/api/";

      const [shopName, setShopName] = useState("");
      const [ownerName, setOwnerName] = useState("");
      const [businessEmail, setBusinessEmail] = useState("");
      const [location, setLocation] = useState("");
      const [productCategory, setProductCategory] = useState("");
      const [panNumber, setPanNumber] = useState("");
      const [citizenshipNumber, setCitizenshipNumber] = useState("");
      const [aboutProducts, setAboutProducts] = useState("");
      const [citizenshipFile, setCitizenshipFile] = useState<File | null>(null);
      const [panFile, setPanFile] = useState<File | null>(null);
      const [latitude, setLatitude] = useState<number | null>(null);
      const [longitude, setLongitude] = useState<number | null>(null);
      const [password, setPassword] = useState("");
      const [submitting, setSubmitting] = useState(false);
      const [successMessage, setSuccessMessage] = useState<string | null>(null);
      const [errorMessage, setErrorMessage] = useState<string | null>(null);

      const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();
            setSuccessMessage(null);
            setErrorMessage(null);

            setSubmitting(true);

            try {
                  const formData = new FormData();
                  formData.append("shop_name", shopName);
                  formData.append("owner_name", ownerName);
                  formData.append("business_email", businessEmail);
                  formData.append("location", location);
                  formData.append("product_category", productCategory);
                  formData.append("pan_number", panNumber);
                  formData.append("citizenship_number", citizenshipNumber);
                  formData.append("about_products", aboutProducts);
                  if (citizenshipFile) formData.append("citizenship_document", citizenshipFile);
                  if (panFile) formData.append("pan_document", panFile);
                  if (latitude !== null) formData.append("latitude", Number(latitude.toFixed(6)).toString());
                  if (longitude !== null) formData.append("longitude", Number(longitude.toFixed(6)).toString());
                  if (!isAuthenticated && password) formData.append("password", password);

                  const endpoint = isAuthenticated ? "vendors/applications/" : "vendors/applications/register/";
                  const token = localStorage.getItem("auth_access_token");

                  const headers: Record<string, string> = {};
                  if (isAuthenticated && token) {
                        headers["Authorization"] = `Bearer ${token}`;
                  }

                  const res = await fetch(`${API_BASE}${endpoint}`, {
                        method: "POST",
                        headers: Object.keys(headers).length > 0 ? headers : undefined,
                        body: formData,
                  });

                  if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        const err = (data && (data.detail || Object.values(data)[0])) || res.statusText;
                        throw new Error(String(err));
                  }

                  setSuccessMessage("Application submitted — we will review your request shortly.");
                  toast.success("Application submitted — we will review your request shortly.");
                  setShopName("");
                  setOwnerName("");
                  setBusinessEmail("");
                  setLocation("");
                  setProductCategory("");
                  setPanNumber("");
                  setCitizenshipNumber("");
                  setAboutProducts("");
                  setCitizenshipFile(null);
                  setPanFile(null);
                  setLatitude(null);
                  setLongitude(null);
                  setPassword("");
            } catch (err: unknown) {
                  setErrorMessage(err instanceof Error ? err.message : "Submission failed. Please try again.");
            } finally {
                  setSubmitting(false);
            }
      };

      return (
            <div className="min-h-screen bg-[#F8FAFC]">
                  <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
                        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-[#16A34A]/15 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#0EA5E9]/15 blur-3xl" />

                        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
                              <div>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-[#DCFCE7] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#166534]">
                                          <Store className="h-4 w-4" />
                                          Partner Program
                                    </span>
                                    <h1 className="mt-5 text-4xl font-black leading-tight text-[#0F172A] md:text-6xl">
                                          Become a Vendor on Himalayan Local Product Nepal
                                    </h1>
                                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#475569]">
                                          Build a standout storefront, reach more customers, and grow your business with tools designed for modern commerce.
                                    </p>

                                    <div className="mt-8 flex flex-wrap gap-3">
                                          <a
                                                href="#vendor-apply"
                                                className="rounded-xl bg-[#16A34A] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#15803D]"
                                          >
                                                Start Application
                                          </a>
                                          <a
                                                href="#how-it-works"
                                                className="rounded-xl border border-[#CBD5E1] bg-white px-6 py-3 text-sm font-bold text-[#0F172A] transition-colors hover:border-[#16A34A] hover:text-[#166534]"
                                          >
                                                How It Works
                                          </a>
                                    </div>
                              </div>

                              <div className="rounded-3xl border border-[#E2E8F0] bg-white/90 p-6 shadow-xl backdrop-blur">
                                    <h2 className="text-xl font-bold text-[#0F172A]">Why sellers choose Himalayan Local Product Nepal</h2>
                                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                          {stats.map((stat) => (
                                                <div key={stat.label} className="rounded-2xl bg-[#F8FAFC] p-4">
                                                      <p className="text-2xl font-black text-[#16A34A]">{stat.value}</p>
                                                      <p className="mt-1 text-sm text-[#475569]">{stat.label}</p>
                                                </div>
                                          ))}
                                    </div>
                                    <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#ECFDF5] p-4 text-[#166534]">
                                          <Users className="mt-0.5 h-5 w-5 shrink-0" />
                                          <p className="text-sm font-medium">
                                                Dedicated account support for every approved vendor.
                                          </p>
                                    </div>
                              </div>
                        </div>
                  </section>

                  <section id="how-it-works" className="px-4 py-14 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                              <h2 className="text-3xl font-black text-[#0F172A]">How onboarding works</h2>
                              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                                    {steps.map((step, index) => (
                                          <article key={step} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                                                <p className="text-sm font-bold text-[#16A34A]">Step {index + 1}</p>
                                                <h3 className="mt-2 text-lg font-semibold text-[#0F172A]">{step}</h3>
                                          </article>
                                    ))}
                              </div>
                        </div>
                  </section>

                  <section className="px-4 pb-16 sm:px-6 lg:px-8">
                        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
                              {benefits.map((benefit) => {
                                    const Icon = benefit.icon;
                                    return (
                                          <article
                                                key={benefit.title}
                                                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                                          >
                                                <div className="inline-flex rounded-xl bg-[#DCFCE7] p-2.5 text-[#166534]">
                                                      <Icon className="h-5 w-5" />
                                                </div>
                                                <h3 className="mt-4 text-xl font-bold text-[#0F172A]">{benefit.title}</h3>
                                                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{benefit.description}</p>
                                          </article>
                                    );
                              })}
                        </div>
                  </section>

                  <section
                        id="vendor-apply"
                        className="border-y border-[#BFDBFE] bg-gradient-to-br from-[#E0F2FE] via-[#ECFEFF] to-[#DCFCE7] px-4 py-16 sm:px-6 lg:px-8"
                  >
                        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
                              <div>
                                    <h2 className="text-3xl font-black text-[#0F172A]">Start your vendor application</h2>
                                    <p className="mt-3 max-w-xl text-[#334155]">
                                          Share a few business details and our onboarding team will review your request.
                                    </p>
                                    <ul className="mt-6 space-y-3">
                                          <li className="flex items-center gap-3 text-sm text-[#334155]">
                                                <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                                                No setup fees for approved vendors
                                          </li>
                                          <li className="flex items-center gap-3 text-sm text-[#334155]">
                                                <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                                                Secure payout and order management
                                          </li>
                                          <li className="flex items-center gap-3 text-sm text-[#334155]">
                                                <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                                                Dedicated support during launch
                                          </li>
                                    </ul>
                              </div>
                                                            {isLoading ? (
                                    <div className="rounded-2xl bg-white p-6 shadow-xl flex items-center justify-center">
                                          <p className="text-[#475569]">Loading...</p>
                                    </div>
                              ) : isAuthenticated && (user?.role === "admin" || user?.role === "staff") ? (
                                    <div className="rounded-2xl bg-white p-6 shadow-xl flex items-center justify-center text-center min-h-[200px]">
                                          <p className="text-[#475569]">
                                                Admin and staff accounts can't submit vendor applications.
                                          </p>
                                    </div>
                              ) : (

                              <form className="rounded-2xl bg-white p-6 shadow-xl" onSubmit={handleSubmit}>
                                    <h3 className="mb-4 text-lg font-bold text-[#0F172A]">Business and KYC details</h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                          <label className="sm:col-span-2">
                                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                                                      Shop Name
                                                </span>
                                                <input
                                                      type="text"
                                                      required
                                                      value={shopName}
                                                      onChange={(e) => setShopName(e.target.value)}
                                                      placeholder="Enter your shop name"
                                                      className="w-full rounded-lg border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
                                                />
                                          </label>

                                          <label>
                                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                                                      Owner Name
                                                </span>
                                                <input
                                                      type="text"
                                                      required
                                                      value={ownerName}
                                                      onChange={(e) => setOwnerName(e.target.value)}
                                                      placeholder="Full legal name"
                                                      className="w-full rounded-lg border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
                                                />
                                          </label>

                                          <label>
                                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                                                      Business Email
                                                </span>
                                                <input
                                                      type="email"
                                                      required
                                                      value={businessEmail}
                                                      onChange={(e) => setBusinessEmail(e.target.value)}
                                                      placeholder="name@business.com"
                                                      autoComplete="off"
                                                      className="w-full rounded-lg border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
                                                />
                                          </label>

                                          {!isAuthenticated && (
                                                <label className="sm:col-span-2">
                                                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                                                            Account Password <span className="text-red-500">*</span>
                                                      </span>
                                                      <p className="text-xs text-[#64748B] mb-2">Create a password to log into your vendor account once approved.</p>
                                                      <input
                                                            type="password"
                                                            required
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            placeholder="Create a strong password"
                                                            autoComplete="new-password"
                                                            className="w-full rounded-lg border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
                                                      />
                                                </label>
                                          )}

                                          <label>
                                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                                                      Location
                                                </span>
                                                <input
                                                      type="text"
                                                      required
                                                      value={location}
                                                      onChange={(e) => setLocation(e.target.value)}
                                                      placeholder="City, district, address"
                                                      className="w-full rounded-lg border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
                                                />
                                          </label>

                                          <div className="sm:col-span-2">
                                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                                                      Shop Location on Map
                                                </span>
                                                <p className="text-xs text-[#64748B] mb-2">Pin your exact shop location so customers can find you easily.</p>
                                                <LocationPicker
                                                      lat={latitude}
                                                      lng={longitude}
                                                      onLocationChange={(lat, lng) => {
                                                            setLatitude(lat);
                                                            setLongitude(lng);
                                                      }}
                                                />
                                          </div>

                                          <label>
                                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                                                      Product Category
                                                </span>
                                                <input
                                                      type="text"
                                                      value={productCategory}
                                                      onChange={(e) => setProductCategory(e.target.value)}
                                                      placeholder="Fashion, Electronics, Grocery..."
                                                      className="w-full rounded-lg border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
                                                />
                                          </label>

                                          <label>
                                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                                                      PAN Number
                                                </span>
                                                <input
                                                      type="text"
                                                      required
                                                      value={panNumber}
                                                      onChange={(e) => setPanNumber(e.target.value)}
                                                      placeholder="Enter PAN number"
                                                      className="w-full rounded-lg border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
                                                />
                                          </label>

                                          <label>
                                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                                                      Citizenship Number
                                                </span>
                                                <input
                                                      type="text"
                                                      required
                                                      value={citizenshipNumber}
                                                      onChange={(e) => setCitizenshipNumber(e.target.value)}
                                                      placeholder="Enter citizenship number"
                                                      className="w-full rounded-lg border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
                                                />
                                          </label>

                                          <label className="sm:col-span-2">
                                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                                                      About Products
                                                </span>
                                                <textarea
                                                      rows={4}
                                                      value={aboutProducts}
                                                      onChange={(e) => setAboutProducts(e.target.value)}
                                                      placeholder="Describe the products you want to sell"
                                                      className="w-full rounded-lg border border-[#CBD5E1] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
                                                />
                                          </label>

                                          <label>
                                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                                                      Citizenship Photo
                                                </span>
                                                <input
                                                      type="file"
                                                      required
                                                      accept="image/*,.pdf"
                                                      onChange={(e) => setCitizenshipFile(e.target.files?.[0] ?? null)}
                                                      className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm text-[#475569] file:mr-3 file:rounded-md file:border-0 file:bg-[#DCFCE7] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#166534]"
                                                />
                                          </label>

                                          <label>
                                                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                                                      PAN Document
                                                </span>
                                                <input
                                                      type="file"
                                                      required
                                                      accept="image/*,.pdf"
                                                      onChange={(e) => setPanFile(e.target.files?.[0] ?? null)}
                                                      className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm text-[#475569] file:mr-3 file:rounded-md file:border-0 file:bg-[#DCFCE7] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#166534]"
                                                />
                                          </label>
                                    </div>
                                    {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
                                    {successMessage && <p className="mt-4 text-sm text-green-700">{successMessage}</p>}

                                    <button
                                          type="submit"
                                          disabled={submitting}
                                          className="mt-5 w-full rounded-lg bg-[#16A34A] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#15803D] disabled:opacity-60"
                                    >
                                          {submitting ? "Submitting..." : "Submit Application"}
                                    </button>
                              </form>
                              )}
                        </div>
                  </section>
            </div>
      );
}
