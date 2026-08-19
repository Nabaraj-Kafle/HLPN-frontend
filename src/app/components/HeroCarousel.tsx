import Slider from "react-slick";
import { Link } from "react-router";

export function HeroCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    dotsClass: "slick-dots !bottom-6",
    customPaging: () => (
      <div className="w-3 h-3 bg-white/50 rounded-full hover:bg-white transition-all" />
    ),
  };

  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1769257911527-bdfd73b545cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXNoaW9uJTIwc2hvcHBpbmclMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzcwMDA5NTQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "New Collection 2026",
      description: "Discover the latest trends in fashion and lifestyle",
      cta: "Shop Now",
    },
    {
      image:
        "https://images.unsplash.com/photo-1760587162690-95608c8ab2da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwZ2FkZ2V0cyUyMHRlY2glMjBwcm9kdWN0c3xlbnwxfHx8fDE3NzAwMDk1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Tech That Inspires",
      description: "Get up to 40% off on premium electronics",
      cta: "Explore Deals",
    },
    {
      image:
        "https://images.unsplash.com/photo-1611596188649-7c8e9507bdb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZGVjb3IlMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3Njk5Nzk0NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Transform Your Space",
      description: "Beautiful home decor for every style",
      cta: "Shop Collection",
    },
  ];

  return (
    <div className="relative w-full">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <div className="relative h-[500px] md:h-[600px]">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8">
                      {slide.description}
                    </p>
                    <Link to="/shop">
                      <button className="bg-[#16A34A] hover:bg-[#22C55E] text-white px-8 py-3 rounded-lg transition-colors shadow-lg">
                        {slide.cta}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
