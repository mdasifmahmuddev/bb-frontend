import { Truck, RotateCcw, Award } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Curated selection of the finest materials and craftsmanship",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable shipping across Bangladesh",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free returns within 30 days",
  },
]

export default function WhyChoose() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#8E1616] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/20 to-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8C999]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#000000]/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#E8C999]/20 text-[#E8C999] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full mb-4">
            Our Promise
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F8EEDF] mb-3">
            Why Choose BanglaBaari
          </h2>
          <p className="text-sm sm:text-base text-[#F8EEDF]/70 max-w-2xl mx-auto">
            Experience excellence in every detail
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index} 
                className="group text-center bg-[#F8EEDF]/10 backdrop-blur-sm border-2 border-[#E8C999]/20 rounded-2xl p-8 hover:bg-[#F8EEDF]/15 hover:border-[#E8C999]/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#E8C999] flex items-center justify-center rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <Icon size={32} className="text-[#8E1616]" strokeWidth={2.5} />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 text-[#F8EEDF] group-hover:text-[#E8C999] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-[#F8EEDF]/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}