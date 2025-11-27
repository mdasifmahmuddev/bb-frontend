import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative h-96 md:h-screen bg-black overflow-hidden flex items-center justify-center">
       <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage: "url(/placeholder.svg?height=1200&width=1600&query=elegant-men-fashion-winter)",
        }}
      />

       <div className="absolute inset-0 bg-black/60" />

       <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 leading-tight">Winter Collection 2024</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">Discover Premium Men's Fashion for Bangladesh's Elite</p>
        <Link
          href="/shop?winter=true"
          className="inline-block px-8 py-4 bg-primary text-white font-medium hover:bg-primary-light transition transform hover:scale-105"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  )
}
