import Link from "next/link"

export default function WinterBanner() {
  return (
    <section
      className="relative h-96 md:h-[500px] lg:h-[600px] bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80)",
      }}
    >
       <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 via-[#000000]/60 to-[#8E1616]/70" />
      
       <div className="absolute top-10 right-10 w-32 h-32 border-4 border-[#E8C999]/30 rounded-full"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 border-4 border-[#E8C999]/20 rounded-full"></div>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
           <span className="inline-block px-4 py-2 bg-[#8E1616] text-[#E8C999] text-xs sm:text-sm font-bold uppercase tracking-widest rounded-full mb-6 animate-pulse">
            Limited Time Offer
          </span>

           <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#F8EEDF] mb-4 leading-tight">
            Winter Sale
          </h2>
          
           <div className="flex items-baseline gap-3 mb-6">
            <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#E8C999]">30%</span>
            <span className="text-2xl sm:text-3xl font-serif text-[#F8EEDF]">OFF</span>
          </div>

           <p className="text-base sm:text-lg md:text-xl text-[#F8EEDF]/90 mb-8 leading-relaxed">
            Elevate your winter wardrobe with our premium collection. Exclusive pieces crafted for the season.
          </p>

           <Link
            href="/shop?winter=true"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#E8C999] text-[#000000] text-sm sm:text-base font-bold uppercase tracking-wider rounded-full hover:bg-[#F8EEDF] transition-all duration-500 shadow-2xl hover:scale-105"
          >
            <span>Shop Winter Collection</span>
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

       <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8E1616] via-[#E8C999] to-[#8E1616]"></div>
    </section>
  )
}