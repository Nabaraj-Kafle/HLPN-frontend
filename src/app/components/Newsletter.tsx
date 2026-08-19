import { Mail } from "lucide-react";
import { useState } from "react";

// const perks = [
//   {
//     title: "Exclusive Deals",
//     description: "Subscriber-only discounts up to 40% off selected products",
//   },
//   {
//     title: "Early Access",
//     description: "Shop new arrivals 48 hours before everyone else",
//   },
//   {
//     title: "Weekly Digest",
//     description: "Curated trends and handpicked tips, every Thursday",
//   },
// ];

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log("Subscribed:", email);
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      <style>{`
        @keyframes nl-float-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nl-badge-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.08); }
        }
        @keyframes nl-checkmark {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .nl-anim-1 { animation: nl-float-up 0.55s 0.05s ease both; }
        .nl-anim-2 { animation: nl-float-up 0.55s 0.15s ease both; }
        .nl-anim-3 { animation: nl-float-up 0.55s 0.25s ease both; }
        .nl-anim-4 { animation: nl-float-up 0.55s 0.35s ease both; }

        .nl-icon-badge { animation: nl-badge-pulse 2.6s ease-in-out infinite; }

        .nl-form-wrap {
          display: flex;
          gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.22);
          border-radius: 18px;
          padding: 6px;
          max-width: 480px;
          margin: 0 auto;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .nl-form-wrap:focus-within {
          border-color: rgba(255,255,255,0.5);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.1);
        }

        .nl-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 14px;
          padding: 0 12px;
          min-width: 0;
        }
        .nl-input::placeholder { color: rgba(255,255,255,0.5); }

        .nl-submit-btn {
          background: #F59E0B;
          color: #fff;
          border: none;
          border-radius: 13px;
          padding: 12px 22px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(245,158,11,0.35);
        }
        .nl-submit-btn:hover {
          background: #D97706;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(245,158,11,0.45);
        }
        .nl-submit-btn:active { transform: scale(0.98); }

        .nl-perk-card {
          background: #fff;
          border: 1.5px solid #E2E8F0;
          border-radius: 18px;
          padding: 22px 18px;
          text-align: center;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .nl-perk-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.09);
        }

        .nl-success {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(255,255,255,0.18);
          border: 1.5px solid rgba(255,255,255,0.35);
          border-radius: 18px;
          padding: 14px 24px;
          max-width: 480px;
          margin: 0 auto;
          animation: nl-checkmark 0.4s ease both;
        }
        .nl-deco-circle {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.1);
          pointer-events: none;
        }
      `}</style>

      <section className="py-0 overflow-hidden">
        {/* Outer gradient border ring */}
        <div
          style={{
            background: "linear-gradient(135deg, #0F172A 0%, #1a2e1a 50%, #14532D 100%)",
            borderRadius: "0",
            padding: "3px 0 0",
          }}
        >
          <div style={{ background: "#fff" }}>

            {/* ── GREEN TOP PANEL ──────────────────────────── */}
            <div
              style={{
                background: "linear-gradient(135deg, #166534 0%, #16A34A 50%, #15803D 100%)",
                padding: "56px 24px 64px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative rings */}
              <div className="nl-deco-circle" style={{ top: -60, left: -60, width: 220, height: 220 }} />
              <div className="nl-deco-circle" style={{ top: -30, left: -30, width: 140, height: 140 }} />
              <div className="nl-deco-circle" style={{ bottom: -70, right: -70, width: 260, height: 260 }} />
              <div className="nl-deco-circle" style={{ bottom: -40, right: -40, width: 170, height: 170 }} />

              {/* ─ Icon badge */}
              <div
                className="nl-anim-1 nl-icon-badge"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 68,
                  height: 68,
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: 20,
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  marginBottom: 20,
                  position: "relative",
                }}
              >
                <Mail className="w-7 h-7 text-white" />
              </div>

              {/* ─ Pill tag */}
              {/* <div className="nl-anim-1" style={{ marginBottom: 18 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 100,
                    padding: "5px 15px",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      background: "#F59E0B",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  />
                  Members-only perks
                </span>
              </div> */}

              {/* ─ Headline */}
              <h2
                className="nl-anim-2"
                style={{
                  color: "#fff",
                  fontSize: "clamp(32px, 5vw, 46px)",
                  lineHeight: 1.1,
                  margin: "0 0 14px",
                }}
              >
                Stay ahead of<br />
                <em>every great deal.</em>
              </h2>

              {/* ─ Sub */}
              <p
                className="nl-anim-2"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 16,
                  lineHeight: 1.65,
                  maxWidth: 420,
                  margin: "0 auto 32px",
                }}
              >
                Join <strong style={{ color: "#fff" }}>12,000+ smart shoppers</strong> getting
                exclusive drops, early access, and curated picks — straight to their inbox.
              </p>

              {/* ─ Form or success */}
              <div className="nl-anim-3">
                {submitted ? (
                  <div className="nl-success">
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: 0 }}>You're in!</p>
                      <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: "2px 0 0" }}>
                        Check your inbox for a welcome gift 🎁
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="nl-form-wrap">
                      <input
                        className="nl-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                      <button className="nl-submit-btn" type="submit">
                        Subscribe
                      </button>
                    </div>
                  </form>
                )}
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginTop: 10 }}>
                  No spam, ever. Unsubscribe with one click.
                </p>
              </div>
            </div>

            {/* ── PERKS STRIP ──────────────────────────────── */}
            {/* <div style={{ background: "#F9FAFB", padding: "32px 24px 36px" }}>
              <div
                className="nl-anim-4"
                style={{
                  maxWidth: 860,
                  margin: "0 auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 14,
                }}
              >
                {perks.map(({ title, description }, i) => (
                  <div
                    key={title}
                    className="nl-perk-card"
                    style={{ animationDelay: `${0.35 + i * 0.08}s` }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", margin: "0 0 5px" }}>
                      {title}
                    </p>
                    <p style={{ fontSize: 12.5, color: "#64748B", margin: 0, lineHeight: 1.55 }}>
                      {description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Social proof */}
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginTop: 24,
              }}
            > */}
            {/* Avatar stack */}
            {/* <div style={{ display: "flex" }}>
                  {avatars.map((av, i) => (
                    <div
                      key={av.initials}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: av.bg,
                        border: "2.5px solid #F9FAFB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: av.color,
                        zIndex: 3 - i,
                        marginLeft: i === 0 ? 0 : -8,
                      }}
                    >
                      {av.initials}
                    </div>
                  ))}
                </div> */}
            {/* <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                  <strong style={{ color: "#0F172A" }}>12,000+</strong> subscribers and growing
                </p> */}
            {/* </div> */}
            {/* </div> */}

          </div>
        </div>
      </section >
    </>
  );
}