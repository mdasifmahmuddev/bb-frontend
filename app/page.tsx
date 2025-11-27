import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Categories from "@/components/categories"
import TrendingProducts from "@/components/trending-products"
import WhyChoose from "@/components/why-choose"
import WinterBanner from "@/components/winter-banner"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Categories />
      <TrendingProducts />
      <WhyChoose />
      <WinterBanner />
      <Footer />
    </div>
  )
}
