import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
           <div>
            <h3 className="text-xl font-serif font-bold mb-4">BanglaBaari</h3>
            <p className="text-gray-400">
              Premium men's fashion for Bangladesh's elite. Elevate your style with our carefully curated collection of
              luxury clothing and accessories.
            </p>
          </div>

           <div>
            <h3 className="text-lg font-serif font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/shop" className="hover:text-white transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/shop?new=true" className="hover:text-white transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

           <div>
            <h3 className="text-lg font-serif font-bold mb-4">Contact Info</h3>
            <p className="text-gray-400 mb-2">Email: hello@banglabaari.com</p>
            <p className="text-gray-400 mb-2">Phone: +880 1700 000 000</p>
            <p className="text-gray-400">Dhaka, Bangladesh</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 BanglaBaari. All rights reserved.</p>
          <div className="flex gap-4">
            <button className="text-gray-400 hover:text-white transition">
              <Facebook size={20} />
            </button>
            <button className="text-gray-400 hover:text-white transition">
              <Instagram size={20} />
            </button>
            <button className="text-gray-400 hover:text-white transition">
              <Twitter size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
