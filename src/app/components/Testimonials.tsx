import { Star } from "lucide-react";
export function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Verified Buyer',
      rating: 5,
      comment: 'Absolutely love shopping here! The quality of products is exceptional and the delivery was super fast. Will definitely order again!',
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Verified Buyer',
      rating: 5,
      comment: 'Best online shopping experience I\'ve had. Great customer service, easy returns, and the products always match the description.',
      avatar: 'MC',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Verified Buyer',
      rating: 5,
      comment: 'I\'m impressed with the variety of products and competitive prices. The website is easy to navigate and checkout is seamless.',
      avatar: 'ER',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#F9FAFB] rounded-xl p-6 border border-[#E5E7EB] relative transition-all hover:shadow-lg"
            >
              {/* Rating */}
              <div className="mb-4 mt-2 flex items-center gap-0.5">
  {Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < testimonial.rating
          ? "fill-amber-400 text-amber-400"
          : "fill-slate-200 text-slate-200"
      }`}
    />
  ))}
</div>

              {/* Comment */}
              <p className="text-[#374151] mb-6 leading-relaxed">
                "{testimonial.comment}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#16A34A] flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-[#111827]">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#16A34A] mb-1">50K+</div>
            <div className="text-sm text-[#6B7280]">Happy Customers</div>
          </div>
          <div className="h-12 w-px bg-[#E5E7EB]" />
          <div className="text-center">
            <div className="text-3xl font-bold text-[#16A34A] mb-1">4.8/5</div>
            <div className="text-sm text-[#6B7280]">Average Rating</div>
          </div>
          <div className="h-12 w-px bg-[#E5E7EB]" />
          <div className="text-center">
            <div className="text-3xl font-bold text-[#16A34A] mb-1">15K+</div>
            <div className="text-sm text-[#6B7280]">5-Star Reviews</div>
          </div>
          <div className="h-12 w-px bg-[#E5E7EB]" />
          <div className="text-center">
            <div className="text-3xl font-bold text-[#16A34A] mb-1">99%</div>
            <div className="text-sm text-[#6B7280]">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
