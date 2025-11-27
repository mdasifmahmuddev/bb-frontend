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
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-serif font-bold text-center mb-12">Why Choose BanglaBaari</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-accent flex items-center justify-center rounded-full">
                    <Icon size={32} className="text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
