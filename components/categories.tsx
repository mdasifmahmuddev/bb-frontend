import Link from "next/link"

const categories = [
  { name: "Full Shirt", id: "shirt" },
  { name: "Trouser", id: "trouser" },
  { name: "Jacket/Coat", id: "jacket" },
  { name: "Accessories", id: "accessories" },
]

export default function Categories() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-serif font-bold text-center mb-12">Featured Categories</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="group relative h-64 overflow-hidden bg-gray-200 flex items-center justify-center"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition duration-300"
                style={{
                  backgroundImage: `url(/placeholder.svg?height=400&width=400&query=${category.name}-men-fashion)`,
                }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-300" />
              <h3 className="relative z-10 text-white text-2xl font-serif font-bold">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
