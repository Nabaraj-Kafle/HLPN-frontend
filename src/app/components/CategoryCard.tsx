import { Link } from "react-router";

interface CategoryCardProps {
  image: string;
  name: string;
  itemCount: number;
  featured?: boolean;
  linkTo?: string;
}

export function CategoryCard({ image, name, itemCount, featured = false, linkTo }: CategoryCardProps) {
  const className = `group relative overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
    featured ? 'hover:scale-[1.02]' : 'hover:scale-105'
  }`;

  const CardContent = (
    <>
      {/* Image Container */}
      <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[#111827] mb-1">{name}</h3>
        <p className="text-sm text-[#6B7280]">
          {itemCount > 0 ? `${itemCount} items` : "Browse products"}
        </p>
      </div>

      {/* Hover Arrow Indicator */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-[#16A34A] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className={className}>
        {CardContent}
      </Link>
    );
  }

  return (
    <div className={className}>
      {CardContent}
    </div>
  );
}
