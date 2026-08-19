import { ShieldCheck, Eye, Lock, Database, Bell, UserCheck, Shield } from "lucide-react";
import { ValueProposition } from "@/app/components/ValueProposition";

/* ─── Data ─────────────────────────────────────────── */

const privacyPoints = [
  {
    title: "Information We Collect",
    description: "We collect information you provide directly to us (name, email, shipping address) when you create an account, make a purchase, or communicate with us.",
    icon: Database,
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    title: "How We Use Your Data",
    description: "Your data helps us process orders, improve our services, and send relevant updates. We never sell your personal information to third parties.",
    icon: UserCheck,
    color: "#0EA5E9",
    bg: "#F0F9FF",
  },
  {
    title: "Data Protection",
    description: "We implement industry-standard security measures to safeguard your information, including SSL encryption and secure database management.",
    icon: Lock,
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    title: "Cookies & Tracking",
    description: "Himalayan Local Product Nepal uses cookies to enhance your browsing experience and analyze site traffic. You can manage your cookie preferences in your browser settings.",
    icon: Eye,
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
];

/* ─── Component ─────────────────────────────────────── */

export function PrivacyPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up { animation: fadeUp 0.6s ease-out forwards; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        
        .privacy-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }
      `}</style>

      <div className="privacy-root min-h-screen bg-white">
        {/* ══ HERO SECTION ══════════════════════════════ */}
        <section className="relative pt-24 pb-16 px-4 overflow-hidden border-b border-gray-50">
          <div className="absolute inset-0 -z-10">
            <div className="absolute bottom-0 right-1/2 w-[500px] h-[500px] bg-[#F0F9FF] rounded-full blur-[120px] opacity-50 translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <div className="anim-fade-up w-16 h-16 bg-[#F0FDF4] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-[#16A34A]" />
            </div>
            <h1 className="anim-fade-up delay-1 text-4xl md:text-6xl font-bold text-[#111827] mb-6">
              Privacy <em>Policy</em>
            </h1>
            <p className="anim-fade-up delay-2 text-lg text-[#6B7280] leading-relaxed max-w-2xl mx-auto">
              Your privacy is our priority. This policy outlines how we handle your
              personal data and ensures your rights as a BOL user are protected.
            </p>
          </div>
        </section>

        {/* ══ TOP POINTS ═══════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {privacyPoints.map((point, i) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className="privacy-card anim-fade-up p-8 rounded-3xl border border-gray-100 bg-white transition-all duration-300"
                    style={{ animationDelay: `${0.1 * i}s` }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                      style={{ background: point.bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: point.color }} />
                    </div>
                    <h3 className="text-xl font-bold text-[#111827] mb-3">{point.title}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{point.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ DETAILED TEXT ════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F9FAFB]">
          <div className="max-w-3xl mx-auto prose prose-green">
            <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-[#111827] mb-6">Detailed Overview</h2>

              <div className="space-y-10 text-[#475569]">
                <div>
                  <h3 className="text-xl font-bold text-[#111827] mb-3 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#16A34A]" /> Communication Preferences
                  </h3>
                  <p className="leading-relaxed">
                    You can opt-out of marketing communications at any time by clicking the 'unsubscribe'
                    link in our emails or through your account settings. We will still send essential
                    service-related notifications (e.g., order confirmations).
                  </p>
                </div>

                <div className="h-px bg-gray-100" />

                <div>
                  <h3 className="text-xl font-bold text-[#111827] mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#16A34A]" /> Data Subject Rights
                  </h3>
                  <p className="leading-relaxed mb-4">
                    Depending on your location, you may have rights under GDPR or CCPA, including:
                  </p>
                  <ul className="space-y-2 list-disc pl-5 text-sm">
                    <li>The right to access your personal data</li>
                    <li>The right to rectify inaccurate information</li>
                    <li>The right to request data deletion</li>
                    <li>The right to object to data processing</li>
                  </ul>
                </div>

                <div className="h-px bg-gray-100" />

                <div>
                  <h3 className="text-xl font-bold text-[#111827] mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#16A34A]" /> Third-Party Services
                  </h3>
                  <p className="leading-relaxed">
                    We use trusted third-party providers for services like payment processing and shipping.
                    These providers only have access to information necessary to perform their roles and
                    are obligated to protect your data.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-gray-100">
                <p className="text-xs text-center text-gray-400">
                  Last Updated: April 26, 2026. For privacy concerns, email <a href="mailto:privacy@bol.com" className="text-[#16A34A] font-bold">privacy@bol.com</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <ValueProposition />
      </div>
    </>
  );
}
