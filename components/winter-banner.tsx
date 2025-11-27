import Link from "next/link"

export default function WinterBanner() {
  return (
    <section
      className="relative h-64 md:h-96 bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url(/placeholder.svg?height=600&width=1600&query=winter-mens-fashion-banner)",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Winter Sale - Up to 30% Off</h2>
        <Link
          href="/shop?winter=true"
          className="inline-block px-8 py-4 bg-primary text-white font-medium hover:bg-primary-light transition transform hover:scale-105"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
