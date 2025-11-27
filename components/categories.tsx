import Link from "next/link"

const categories = [
  { 
    name: "Premium Shirts", 
    id: "shirt",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    count: "120+ Items"
  },
  { 
    name: "Luxury Trousers", 
    id: "trouser",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    count: "85+ Items"
  },
  { 
    name: "Designer Jackets", 
    id: "jacket",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    count: "95+ Items"
  },
  { 
    name: "Exclusive Accessories", 
    id: "accessories",
    image: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=1600&q=80",
    count: "150+ Items"
  },
]

export default function Categories() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F8EEDF] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#8E1616]/10 text-[#8E1616] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full mb-4">
            Explore Collections
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#000000] mb-3">
            Featured Categories
          </h2>
          <p className="text-sm sm:text-base text-[#000000]/70 max-w-2xl mx-auto">
            Discover our curated selection of premium menswear essentials
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="group relative h-80 sm:h-96 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="absolute inset-0">
                <div
                  className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  style={{
                    backgroundImage: `url(${category.image})`,
                  }}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

              <div className="absolute top-4 right-4 z-20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E8C999]/90 backdrop-blur-sm rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#000000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 z-10">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block px-3 py-1 bg-[#8E1616]/80 backdrop-blur-sm text-[#F8EEDF] text-xs font-semibold uppercase tracking-wide rounded-full mb-3">
                    {category.count}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#E8C999] mb-2 transform group-hover:translate-x-1 transition-transform duration-500">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[#F8EEDF] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-sm font-semibold">Shop Now</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#8E1616] to-[#E8C999] group-hover:w-full transition-all duration-700 ease-out"></div>
              </div>

              <div className="absolute inset-0 border-2 border-[#E8C999]/0 group-hover:border-[#E8C999]/30 rounded-2xl transition-all duration-500"></div>
            </Link>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <Link 
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#000000] to-[#8E1616] text-[#E8C999] text-sm sm:text-base font-bold uppercase tracking-wider rounded-full hover:from-[#8E1616] hover:to-[#000000] transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 group"
          >
            <span>View All Collections</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}