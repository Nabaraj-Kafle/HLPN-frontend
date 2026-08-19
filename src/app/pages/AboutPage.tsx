import { ValueProposition } from "@/app/components/ValueProposition";
import { Testimonials } from "@/app/components/Testimonials";
import { Newsletter } from "@/app/components/Newsletter";
import {
  Globe,
  HeartHandshake,
  Truck,
  Target,
  Eye,
  Star,
  Compass,
  UserCheck,
  Search,
  ShoppingCart,
  PackageCheck,
  TrendingUp,
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────── */

const stats = [
  { value: "30+", label: "Cities Covered" },
  { value: "12K+", label: "Happy Customers" },
  { value: "800+", label: "Verified Vendors" },
  { value: "98%", label: "Satisfaction Rate" },
];

const pillars = [
  {
    icon: Target,
    accent: "#16A34A",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    tag: "Our Mission",
    title: "Empower Every Transaction",
    body:
      "To create a seamless, trustworthy marketplace where customers discover quality products and vendors unlock real growth — all in one unified platform.",
  },
  {
    icon: Eye,
    accent: "#0EA5E9",
    bg: "#F0F9FF",
    border: "#BAE6FD",
    tag: "Our Vision",
    title: "Commerce Without Barriers",
    body:
      "A world where geography, scale, and complexity never stop a great product from reaching the right customer. Himalayan Local Product Nepal is the bridge.",
  },
  {
    icon: Star,
    accent: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
    tag: "Our Values",
    title: "Trust, Speed & Transparency",
    body:
      "We hold ourselves to radical honesty in every feature, fair pricing for vendors, and zero-compromise quality for shoppers.",
  },
  {
    icon: Compass,
    accent: "#8B5CF6",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    tag: "Core Objective",
    title: "Scale With Integrity",
    body:
      "Growth means nothing without accountability. We expand into new cities and categories only when we can maintain the same service quality our community relies on.",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: Search,
    title: "Discover",
    description:
      "Browse thousands of curated products from verified local and global vendors. Smart filters, real reviews, zero noise.",
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    step: "02",
    icon: UserCheck,
    title: "Verify & Trust",
    description:
      "Every vendor passes our rigorous quality and fulfillment check before going live. Shop with confidence, every time.",
    color: "#0EA5E9",
    bg: "#F0F9FF",
  },
  {
    step: "03",
    icon: ShoppingCart,
    title: "Order Easily",
    description:
      "Add to cart, apply your promo code, and check out in seconds. Secure payments, transparent pricing — no surprises.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    step: "04",
    icon: PackageCheck,
    title: "Fast Delivery",
    description:
      "Real-time tracking from dispatch to doorstep. Most orders arrive within 2–4 business days with live status updates.",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
];

const facts = [
  {
    icon: Globe,
    title: "30+ Cities",
    description: "We connect shoppers with local and global sellers across major cities.",
  },
  {
    icon: HeartHandshake,
    title: "Trusted Marketplace",
    description: "Every vendor is screened for quality, service, and reliable fulfillment.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Most products are delivered quickly with real-time order updates.",
  },
];

const vendorPerks = [
  { icon: TrendingUp, text: "Access to 12,000+ active buyers from day one" },
  { icon: Shield, text: "Seller protection on every verified transaction" },
  { icon: Zap, text: "Instant payouts with transparent fee structure" },
  { icon: Users, text: "Dedicated vendor support & growth coaching" },
];

/* ─── Component ─────────────────────────────────────── */

export function AboutPage() {
  return (
    <>
      <style>{`
        

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .anim-fade-up   { animation: fadeUp   0.65s ease both; }
        .anim-scale-in  { animation: scaleIn  0.55s ease both; }
        .anim-slide-right { animation: slideRight 0.6s ease both; }
        .delay-1 { animation-delay: 0.10s; }
        .delay-2 { animation-delay: 0.20s; }
        .delay-3 { animation-delay: 0.30s; }
        .delay-4 { animation-delay: 0.40s; }
        .delay-5 { animation-delay: 0.50s; }

        .pillar-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.09);
        }
        .step-card:hover .step-icon-wrap {
          transform: scale(1.1) rotate(-4deg);
        }
        .connector-line {
          position: absolute;
          top: 40px;
          left: calc(50% + 60px);
          width: calc(100% - 120px);
          height: 2px;
          background: linear-gradient(90deg, #BBF7D0, #BAE6FD);
          z-index: 0;
        }

        /* Story image collage */
        .story-img-main {
          border-radius: 20px;
          width: 100%;
          height: 340px;
          object-fit: cover;
          box-shadow: 0 16px 48px rgba(0,0,0,0.14);
        }
        .story-img-accent {
          position: absolute;
          bottom: -28px;
          left: -28px;
          width: 160px;
          height: 160px;
          border-radius: 16px;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 8px 24px rgba(0,0,0,0.14);
        }
        .story-badge {
          position: absolute;
          top: -20px;
          right: -20px;
          background: linear-gradient(135deg, #16A34A, #15803D);
          color: white;
          border-radius: 16px;
          padding: 16px 20px;
          text-align: center;
          box-shadow: 0 8px 24px rgba(22,163,74,0.35);
          min-width: 110px;
        }
      `}</style>

      <div className="about-root min-h-screen bg-white">

        {/* ══ HERO ══════════════════════════════════════ */}
        <section className="relative overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          {/* background blobs */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#DCFCE7] rounded-full blur-[120px] opacity-50" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#DBEAFE] rounded-full blur-[120px] opacity-40" />
          </div>

          <div className="max-w-5xl mx-auto text-center">
            {/* <span className="anim-fade-up inline-flex items-center gap-1.5 bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Our Story
            </span> */}
            <h1 className="anim-fade-up delay-1 text-5xl md:text-6xl lg:text-7xl font-bold text-[#111827] leading-[1.08] mb-6">
              Shopping, <em>reimagined</em><br />
              for everyone.
            </h1>
            <p className="anim-fade-up delay-2 text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Himalayan Local Product Nepal was born from a simple belief — great products deserve great reach,
              and every shopper deserves a trustworthy experience.
            </p>
          </div>
        </section>

        {/* ══ OUR STORY ════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Left — text */}
            <div className="anim-slide-right">
              <span className="inline-block text-[#16A34A] text-xs font-bold uppercase tracking-[0.18em] mb-4">
                Where It All Began
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111827] leading-tight mb-6">
                Built from a<br /><em>real problem.</em>
              </h2>
              <div className="space-y-4 text-[#6B7280] text-[17px] leading-relaxed">
                <p>
                  In 2021, our founders watched talented local vendors struggle to get
                  online — not because their products weren't excellent, but because
                  the tools were too complex, the fees too punishing, and the trust
                  too hard to establish.
                </p>
                <p>
                  Himalayan Local Product Nepal was the answer. A marketplace where vendor onboarding takes
                  hours, not weeks. Where shoppers never wonder if their order will
                  arrive. Where every party — buyer, seller, and courier — wins.
                </p>
                <p>
                  Today we operate in <strong className="text-[#0F172A] font-semibold">30+ cities</strong>,
                  serve over <strong className="text-[#0F172A] font-semibold">12,000 customers</strong>,
                  and have helped <strong className="text-[#0F172A] font-semibold">800+ vendors</strong> grow
                  their businesses meaningfully.
                </p>
              </div>

              {/* Stats row */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    className="bg-[#F8FAFC] rounded-2xl p-4 text-center border border-[#E2E8F0]"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <p className="text-3xl font-bold text-[#16A34A]">{s.value}</p>
                    <p className="text-xs text-[#64748B] font-medium mt-1 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — image collage */}
            <div className="anim-scale-in delay-2 relative hidden lg:block">
              <div className="relative" style={{ paddingBottom: "28px", paddingLeft: "28px" }}>
                {/* Decorative grid pattern */}
                <div
                  className="absolute inset-0 -z-10 rounded-2xl opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #16A34A 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80"
                  alt="BOL team at work"
                  className="story-img-main"
                />
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80"
                  alt="Happy customer receiving package"
                  className="story-img-accent"
                />
                <div className="story-badge">
                  <p className="text-3xl leading-none">3+</p>
                  <p className="text-[11px] font-semibold mt-1 opacity-90 leading-tight">Years<br />of Trust</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ MISSION / VISION / VALUES / OBJECTIVE ═══ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto">
            {/* heading */}
            <div className="text-center mb-14">
              <span className="inline-block text-[#16A34A] text-xs font-bold uppercase tracking-[0.18em] mb-3">
                What Drives Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111827] leading-tight">
                Principles we never<br />compromise on.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {pillars.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.tag}
                    className="pillar-card anim-fade-up bg-white rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300 cursor-default"
                    style={{
                      borderColor: p.border,
                      animationDelay: `${i * 90}ms`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: p.bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: p.accent }} />
                    </div>
                    <div>
                      <span
                        className="text-[11px] font-bold uppercase tracking-widest"
                        style={{ color: p.accent }}
                      >
                        {p.tag}
                      </span>
                      <h3 className="text-xl font-bold text-[#111827] mt-1 mb-2 leading-tight">
                        {p.title}
                      </h3>
                      <p className="text-sm text-[#64748B] leading-relaxed">{p.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ═════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* heading */}
            <div className="text-center mb-16">
              <span className="inline-block text-[#16A34A] text-xs font-bold uppercase tracking-[0.18em] mb-3">
                Simple Process
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111827] leading-tight mb-4">
                How Himalayan Local Product Nepal works
              </h2>
              <p className="text-[#64748B] text-lg max-w-xl mx-auto">
                From browse to doorstep in four effortless steps.
              </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* connector line (desktop) */}
              <div className="absolute hidden lg:block top-[52px] left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-[2px]"
                style={{ background: "linear-gradient(90deg, #BBF7D0 0%, #BAE6FD 50%, #DDD6FE 100%)" }}
              />

              {howItWorks.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="step-card anim-fade-up flex flex-col items-center text-center relative z-10"
                    style={{ animationDelay: `${i * 110}ms` }}
                  >
                    {/* Icon circle */}
                    <div
                      className="step-icon-wrap w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 shadow-lg"
                      style={{ background: step.bg, border: `2px solid ${step.color}22` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: step.color }} />
                    </div>

                    {/* Step number */}
                    <span
                      className="text-[11px] font-extrabold tracking-[0.2em] uppercase mb-2"
                      style={{ color: step.color }}
                    >
                      Step {step.step}
                    </span>
                    <h3 className="text-2xl font-bold text-[#111827] mb-3">{step.title}</h3>
                    <p className="text-sm text-[#64748B] leading-relaxed max-w-[220px]">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA strip */}
            <div className="mt-16 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Ready to experience it?
                </h3>
                <p className="text-[#94A3B8] text-sm sm:text-base">
                  Join thousands of satisfied shoppers today. No membership fee required.
                </p>
              </div>
              <a
                href="/shop"
                className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-br from-[#16A34A] to-[#15803D] text-white font-bold text-sm py-3.5 px-7 rounded-xl shadow-[0_4px_20px_rgba(22,163,74,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(22,163,74,0.5)] transition-all no-underline"
              >
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ══ FACTS / HIGHLIGHTS ═══════════════════════ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {facts.map((fact, i) => {
              const Icon = fact.icon;
              return (
                <article
                  key={fact.title}
                  className="anim-fade-up rounded-2xl border border-[#E5E7EB] bg-white p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-11 h-11 bg-[#F0FDF4] rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#16A34A]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#111827] mb-2">{fact.title}</h2>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{fact.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ══ VENDOR CTA ═══════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <span className="inline-block text-[#16A34A] text-xs font-bold uppercase tracking-[0.18em] mb-4">
                For Vendors
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111827] leading-tight mb-6">
                Grow your business<br />on <em>your terms.</em>
              </h2>
              <p className="text-[#475569] text-lg leading-relaxed mb-8">
                Himalayan Local Product Nepal gives independent sellers the platform, audience, and tools of
                enterprise commerce — without the enterprise price tag.
              </p>
              <ul className="space-y-3">
                {vendorPerks.map(({ icon: VIcon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-[#334155]">
                    <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center shrink-0">
                      <VIcon className="w-4 h-4 text-[#16A34A]" />
                    </div>
                    <span className="text-sm font-medium">{text}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/becomevendor"
                className="mt-8 inline-flex items-center gap-2 bg-[#15803D] text-white font-bold text-sm py-3.5 px-7 rounded-xl hover:-translate-y-0.5 hover:bg-[#16A34A] transition-all no-underline"
              >
                Become a Vendor
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Right — visual card stack */}
            <div className="hidden lg:flex flex-col gap-4">
              {[
                { pct: 94, label: "Vendor retention rate", color: "#16A34A" },
                { pct: 87, label: "Orders fulfilled on time", color: "#0EA5E9" },
                { pct: 98, label: "Customer satisfaction", color: "#F59E0B" },
              ].map(({ pct, label, color }) => (
                <div
                  key={label}
                  className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#334155]">{label}</span>
                    <span className="text-sm font-extrabold" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              ))}

              <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#BBF7D0] rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#14532D]">Onboard in under 24 hours</p>
                  <p className="text-xs text-[#16A34A] mt-0.5">No hidden setup fees. Cancel anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ Existing reusable sections ═══════════════ */}
        <ValueProposition />
        <Testimonials />
        <Newsletter />
      </div>
    </>
  );
}