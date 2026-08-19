import { ScrollText, ShieldCheck, Scale, FileText, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { ValueProposition } from "@/app/components/ValueProposition";

/* ─── Data ─────────────────────────────────────────── */

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: "Welcome to Himalayan Local Product Nepal. These Terms and Conditions govern your use of our website and services. By accessing or using BOL, you agree to be bound by these terms. If you do not agree with any part of these terms, you may not use our services.",
    icon: FileText,
  },
  {
    id: "user-accounts",
    title: "2. User Accounts",
    content: "To access certain features of our platform, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must be at least 18 years old to create an account.",
    icon: Lock,
  },
  {
    id: "vendor-rules",
    title: "3. Vendor Obligations",
    content: "Vendors must provide accurate product information, maintain inventory levels, and fulfill orders in a timely manner. BOL reserves the right to suspend or terminate vendor accounts that violate our quality standards or fulfillment policies.",
    icon: ShieldCheck,
  },
  {
    id: "payments",
    title: "4. Payments & Refunds",
    content: "All payments are processed securely through our authorized payment gateways. Refunds are subject to our Return & Refund Policy. BOL acts as a facilitator between buyers and vendors; however, we ensure that transaction disputes are handled fairly.",
    icon: Scale,
  },
  {
    id: "prohibited-content",
    title: "5. Prohibited Conduct",
    content: "Users may not use BOL for any illegal purpose or to distribute harmful content. This includes but is not limited to: copyright infringement, fraud, harassment, or the distribution of malware.",
    icon: AlertCircle,
  },
];

/* ─── Component ─────────────────────────────────────── */

export function TermsPage() {
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
        
        .legal-section:hover {
          border-color: #16A34A33;
          background: #F0FDF433;
        }
      `}</style>

      <div className="terms-root min-h-screen bg-white">
        {/* ══ HERO SECTION ══════════════════════════════ */}
        <section className="relative pt-24 pb-16 px-4 overflow-hidden bg-[#F9FAFB]">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-[#DCFCE7] rounded-full blur-[120px] opacity-40 -translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <span className="anim-fade-up inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-6">
              <ScrollText className="w-3 h-3 text-[#16A34A]" /> Update: April 2026
            </span>
            <h1 className="anim-fade-up delay-1 text-4xl md:text-6xl font-bold text-[#111827] mb-6">
              Terms of <em>Service</em>
            </h1>
            <p className="anim-fade-up delay-2 text-lg text-[#6B7280] leading-relaxed">
              Please read these terms carefully before using Himalayan Local Product Nepal. We aim to keep our
              guidelines transparent and fair for all our community members.
            </p>
          </div>
        </section>

        {/* ══ CONTENT SECTION ══════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {sections.map((section, i) => {
                const Icon = section.icon;
                return (
                  <div
                    key={section.id}
                    className="legal-section p-8 rounded-3xl border border-gray-100 transition-all duration-300"
                    style={{ animation: `fadeUp 0.6s ease-out ${0.1 * i}s forwards`, opacity: 0 }}
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-[#16A34A]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#111827] mb-3">{section.title}</h2>
                        <p className="text-[#6B7280] leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-[#111827] to-[#1F2937] text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#16A34A]" /> Questions?
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                If you have any questions regarding our Terms of Service, please contact our
                legal team or reach out through our general support channels.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-white font-bold text-sm hover:text-[#16A34A] transition-colors"
              >
                Go to Contact Page <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        <ValueProposition />
      </div>
    </>
  );
}
