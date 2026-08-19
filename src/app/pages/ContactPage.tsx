import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe, ArrowRight } from "lucide-react";
import { ValueProposition } from "@/app/components/ValueProposition";
import { Newsletter } from "@/app/components/Newsletter";
import { useState } from "react";

/* ─── Data ─────────────────────────────────────────── */

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon-Fri from 8am to 6pm.",
    linkText: "984101016554",
    href: "tel:984101016554",
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    icon: MessageCircle,
    title: "Chat with Us",
    description: "Our friendly team is here to help.",
    linkText: "Start a live chat",
    href: "#",
    color: "#0EA5E9",
    bg: "#F0F9FF",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "We'll respond within 24 hours.",
    linkText: "buyourlocalnepal@gmail.com",
    href: "mailto:buyourlocalnepal@gmail.com",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come say hello at our office.",
    linkText: "Naya Thimi, Bhaktapur, Nepal",
    href: "https://www.google.com/maps/search/Naya+Thini+Bhaktapur+Nepal",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
];

const faqs = [
  {
    question: "How do I track my order?",
    answer: "You can track your order by clicking the 'Track Order' link in the footer or through your profile dashboard.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Please visit our Returns & Refunds page for detailed information.",
  },
  {
    question: "How can I become a vendor?",
    answer: "Click on the 'Become a Vendor' link in the footer or navigation to start your application process.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we currently ship to over 30 cities and are expanding to international locations soon.",
  },
];

/* ─── Component ─────────────────────────────────────── */

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .anim-fade-up { animation: fadeUp 0.6s ease-out forwards; }
        .anim-slide-right { animation: slideInRight 0.6s ease-out forwards; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        
        .contact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
        }
        
        .form-input {
          transition: all 0.2s ease;
          border: 1px solid #E5E7EB;
        }
        .form-input:focus {
          border-color: #16A34A;
          box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1);
          outline: none;
        }
      `}</style>

      <div className="contact-root min-h-screen bg-white">
        {/* ══ HERO SECTION ══════════════════════════════ */}
        <section className="relative pt-24 pb-16 px-4 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F0FDF4] rounded-full blur-[120px] opacity-60 -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F0F9FF] rounded-full blur-[120px] opacity-60 translate-y-1/2 -translate-x-1/4" />
          </div>

          <div className="max-w-7xl mx-auto text-center">
            <span className="anim-fade-up inline-block text-[#16A34A] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Get In Touch
            </span>
            <h1 className="anim-fade-up delay-1 text-4xl md:text-6xl font-bold text-[#111827] mb-6">
              Let's start a <em>conversation</em>
            </h1>
            <p className="anim-fade-up delay-2 text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
              Have a question about a product, your order, or interested in becoming a vendor?
              Our team is here to help you every step of the way.
            </p>
          </div>
        </section>

        {/* ══ CONTACT CHANNELS ══════════════════════════ */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <div
                key={info.title}
                className="contact-card anim-fade-up p-6 rounded-2xl border border-[#F3F4F6] bg-white transition-all duration-300"
                style={{ animationDelay: `${0.1 * (i + 1)}s` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: info.bg }}
                >
                  <info.icon className="w-6 h-6" style={{ color: info.color }} />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">{info.title}</h3>
                <p className="text-sm text-[#6B7280] mb-4">{info.description}</p>
                <a
                  href={info.href}
                  className="text-sm font-semibold hover:underline flex items-center gap-2"
                  style={{ color: info.color }}
                >
                  {info.linkText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CONTACT FORM & MAP ════════════════════════ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: Form */}
            <div className="anim-fade-up bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-[#E5E7EB]">
              <h2 className="text-3xl font-bold text-[#111827] mb-2">Send us a message</h2>
              <p className="text-[#6B7280] mb-8">We'll get back to you as soon as possible.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151]">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="form-input w-full px-4 py-3 rounded-xl bg-[#F9FAFB]"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#374151]">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="form-input w-full px-4 py-3 rounded-xl bg-[#F9FAFB]"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#374151]">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="How can we help?"
                    className="form-input w-full px-4 py-3 rounded-xl bg-[#F9FAFB]"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#374151]">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="form-input w-full px-4 py-3 rounded-xl bg-[#F9FAFB] resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isSent
                      ? "bg-[#DCFCE7] text-[#16A34A] cursor-default"
                      : "bg-[#16A34A] text-white hover:bg-[#15803D] active:scale-[0.98] shadow-lg shadow-[#16A34A]/20"
                    }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isSent ? (
                    <>Message Sent Successfully!</>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Info & Map Placeholder */}
            <div className="anim-slide-right delay-2 space-y-10">
              <div>
                <h2 className="text-3xl font-bold text-[#111827] mb-6">Our information</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#16A34A]/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#16A34A]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111827]">Headquarters</h4>
                      <p className="text-[#6B7280] text-sm">Naya Thimi, Bhaktapur, Nepal</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-[#0EA5E9]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111827]">Support Hours</h4>
                      <p className="text-[#6B7280] text-sm">Monday — Friday: 9am - 6pm EST</p>
                      <p className="text-[#6B7280] text-sm">Sat — Sun: 10am - 4pm EST</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111827]">Global Reach</h4>
                      <p className="text-[#6B7280] text-sm">Supporting vendors across 30+ major cities worldwide.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative rounded-3xl overflow-hidden h-[300px] border border-[#E5E7EB] shadow-sm grayscale hover:grayscale-0 transition-all duration-700">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                  alt="Office location map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/40 to-transparent flex items-end p-6">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#16A34A] rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111827]">BOL HQ</p>
                      <p className="text-[10px] text-[#6B7280]">New York City</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FAQ SECTION ═══════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white" id="faq">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-[#111827] mb-4">Frequently Asked Questions</h2>
              <p className="text-[#6B7280]">Can't find the answer you're looking for? Reach out to our support team.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="group p-6 rounded-2xl border border-[#F3F4F6] hover:border-[#BBF7D0] hover:bg-[#F0FDF4]/30 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-[#111827] mb-2 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    {faq.question}
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed pl-4.5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ValueProposition />
        <Newsletter />
      </div>
    </>
  );
}
