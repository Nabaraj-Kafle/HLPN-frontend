import { useState } from "react";
import { Grid3x3, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import type { CategoryItem } from "@/lib/store-api";

interface CategoriesSectionProps {
  categories: CategoryItem[];
  isLoading: boolean;
}

const tileColors = [
  { color: "#3B82F6", bg: "#EFF6FF" },
  { color: "#8B5CF6", bg: "#F5F3FF" },
  { color: "#10B981", bg: "#ECFDF5" },
  { color: "#F59E0B", bg: "#FFFBEB" },
  { color: "#EF4444", bg: "#FEF2F2" },
  { color: "#6366F1", bg: "#EEF2FF" },
];

export function CategoriesSection({
  categories,
  isLoading,
}: CategoriesSectionProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleCategories = expanded ? categories : categories.slice(0, 6);

  return (
    <section
      id="categories"
      style={{
        background: "#FAFAFA",
        padding: "clamp(20px, 4vw, 40px) 0",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 clamp(12px, 3vw, 32px)",
        }}
      >
        {/* Compact header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "clamp(14px, 2.5vw, 24px)",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "linear-gradient(to right, transparent, #E5E7EB)",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontSize: "clamp(15px, 2.2vw, 20px)",
                fontWeight: "700",
                color: "#111827",
                letterSpacing: "-0.02em",
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              Shop by Category
            </h2>
          </div>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "linear-gradient(to left, transparent, #E5E7EB)",
            }}
          />
        </div>

        {/* Category grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "clamp(8px, 1.5vw, 14px)",
          }}
          className="categories-grid"
        >
          {isLoading ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "#6B7280",
                padding: "1.5rem",
              }}
            >
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "#6B7280",
                padding: "1.5rem",
              }}
            >
              No categories found.
            </div>
          ) : (
            visibleCategories.map((cat, i) => {
              const tone = tileColors[i % tileColors.length];
              const linkTo = `/category/${
                cat.slug || cat.name.toLowerCase().replace(/ /g, "-")
              }`;

              return (
                <Link
                  to={linkTo}
                  key={i}
                  className="category-card"
                  style={{
                    background: "#fff",
                    border: "1px solid #EBEBEB",
                    borderRadius: "14px",
                    padding: "clamp(10px, 2vw, 18px) clamp(6px, 1vw, 12px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "translateY(-3px)";
                    el.style.boxShadow = `0 8px 24px ${cat.color}22`;
                    el.style.borderColor = `${cat.color}44`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                    el.style.borderColor = "#EBEBEB";
                  }}
                >
                  {/* Category Image / Fallback Icon */}
<div
  style={{
    width: "clamp(40px, 5vw, 52px)",
    height: "clamp(40px, 5vw, 52px)",
    borderRadius: "50%",
    background: tone.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  }}
>
  {cat.image ? (
    <img
      src={cat.image}
      alt={cat.name}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  ) : (
    <Grid3x3
      style={{
        width: "clamp(18px, 2.2vw, 24px)",
        height: "clamp(18px, 2.2vw, 24px)",
        color: tone.color,
      }}
    />
  )}
</div>

                  {/* Text */}
                  <div style={{ textAlign: "center", lineHeight: 1.3 }}>
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "clamp(11px, 1.1vw, 13px)",
                        color: "#111827",
                        marginBottom: "2px",
                      }}
                    >
                      {cat.name}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(9px, 0.9vw, 11px)",
                        color: "#9CA3AF",
                        fontWeight: "500",
                      }}
                    >
                      Explore
                    </div>
                  </div>

                  {/* Bottom accent bar on hover */}
                  <div
                    className="accent-bar"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: tone.color,
                      transform: "scaleX(0)",
                      transition: "transform 0.2s ease",
                      transformOrigin: "center",
                    }}
                  />
                </Link>
              );
            })
          )}
        </div>

        {!isLoading && categories.length > 6 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "18px",
            }}
          >
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid #E5E7EB",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all .2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F9FAFB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
              }}
            >
              <ChevronDown
                size={18}
                style={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform .25s ease",
                }}
              />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .categories-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 380px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        .category-card:hover .accent-bar {
          transform: scaleX(1) !important;
        }
      `}</style>
    </section>
  );
}