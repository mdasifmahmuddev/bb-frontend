"use client"

import Link from "next/link"
import { Heart, Shield, Sparkles, Users, Package, Award } from "lucide-react"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export default function AboutPage() {
  return (
    <>

     <Navbar/>

      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#8E1616]/5 via-transparent to-[#E8C999]/5 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 pt-8">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E8C999] via-[#8E1616] to-[#E8C999] rounded-2xl flex items-center justify-center shadow-2xl mx-auto transform hover:scale-110 transition-transform duration-300">
                <span className="text-[#000000] font-extrabold text-3xl">B</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-r from-[#E8C999] via-[#F8EEDF] to-[#E8C999] bg-clip-text text-transparent mb-6 animate-gradient bg-size-200">
              About BanglaBaari
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover the story behind our authentic Bengali fashion and craftsmanship
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#E8C999] to-transparent mx-auto mt-6"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-[#E8C999]/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#E8C999] to-[#8E1616] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="text-[#000000]" size={28} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#E8C999] mb-4">Our Story</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                BanglaBaari was founded with a passion for preserving and celebrating Bengali heritage through fashion. 
                We bring you authentic traditional wear with a modern twist, crafted by skilled artisans who pour their 
                heart into every piece.
              </p>
              <p className="text-white/70 leading-relaxed">
                From the vibrant sarees to the elegant salwar kameez, each garment tells a story of tradition, 
                culture, and timeless beauty. We bridge the gap between heritage and contemporary style.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-[#E8C999]/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#E8C999] to-[#8E1616] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="text-[#000000]" size={28} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#E8C999] mb-4">Our Mission</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                We aim to make traditional Bengali fashion accessible to everyone while supporting local artisans 
                and preserving age-old craftsmanship techniques. Each purchase helps sustain our artisan community.
              </p>
              <p className="text-white/70 leading-relaxed">
                Our commitment goes beyond fashion - we're dedicated to empowering craftspeople, promoting sustainable 
                practices, and keeping cultural traditions alive for future generations.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#8E1616]/20 to-[#E8C999]/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[#E8C999]/30 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#E8C999] mb-12">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-[#E8C999] to-[#8E1616] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-[#000000]" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Authentic Quality</h3>
                <p className="text-white/70 leading-relaxed">
                  Handpicked materials and traditional craftsmanship ensuring every piece is authentic and durable
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-[#E8C999] to-[#8E1616] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Award className="text-[#000000]" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Unique Designs</h3>
                <p className="text-white/70 leading-relaxed">
                  Exclusive collections you won't find anywhere else, blending tradition with contemporary aesthetics
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-[#E8C999] to-[#8E1616] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-[#000000]" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Customer Care</h3>
                <p className="text-white/70 leading-relaxed">
                  Dedicated support team and hassle-free returns to ensure your complete satisfaction
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center hover:border-[#E8C999]/30 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-[#E8C999] mb-2">500+</div>
              <p className="text-white/70 text-lg">Happy Customers</p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center hover:border-[#E8C999]/30 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-[#E8C999] mb-2">50+</div>
              <p className="text-white/70 text-lg">Skilled Artisans</p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center hover:border-[#E8C999]/30 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-[#E8C999] mb-2">100+</div>
              <p className="text-white/70 text-lg">Unique Products</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#E8C999]/10 to-[#8E1616]/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[#E8C999]/20 text-center">
            <Package className="text-[#E8C999] mx-auto mb-6" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Commitment</h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed mb-8">
              At BanglaBaari, we believe in sustainable fashion that respects our environment and supports our communities. 
              Every purchase contributes to preserving traditional crafts and providing fair wages to artisans. 
              We're not just selling clothes; we're sharing stories, culture, and heritage.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/shop" className="px-8 py-4 bg-gradient-to-r from-[#8E1616] to-[#E8C999] text-[#000000] text-base font-bold rounded-xl hover:from-[#E8C999] hover:to-[#8E1616] transition-all duration-300 shadow-xl hover:shadow-[#E8C999]/30 hover:scale-105">
                Shop Now
              </Link>
              <Link href="/" className="px-8 py-4 border-2 border-[#E8C999] text-[#E8C999] text-base font-bold rounded-xl hover:bg-[#E8C999] hover:text-[#000000] transition-all duration-300 shadow-lg">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}