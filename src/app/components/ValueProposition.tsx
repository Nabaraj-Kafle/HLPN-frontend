import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

export function ValueProposition() {
  const features = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your orders delivered within 2-3 business days',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment with SSL encryption',
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy on all items',
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer support team always ready to help',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <section className="py-16 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            Why Choose Us
          </h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            We're committed to providing the best shopping experience with these guarantees
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center border border-[#E5E7EB] transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="font-semibold text-[#111827] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
