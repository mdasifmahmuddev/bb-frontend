'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      image: "https://i.ibb.co.com/Sw9DBq0h/hat-near-summer-wear.jpg",
      title: "Winter Collection",
      subtitle: "Premium Men's Fashion",
      cta: "Shop Now",
      link: "/shop?winter=true"
    },
    {
      image: "https://i.ibb.co.com/MQt0mYB/Adobe-Stock-195232151-Preview.jpg",
      title: "Timeless Style",
      subtitle: "For Modern Gentlemen",
      cta: "Explore",
      link: "/shop?featured=true"
    },
    {
      image: "https://i.ibb.co.com/G3cfxpKT/Adobe-Stock-262243135-Preview.jpg",
      title: "Luxury Refined",
      subtitle: "Exclusive Collection",
      cta: "Discover",
      link: "/shop?luxury=true"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    timeoutRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  // Touch swipe
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      diff > 0 ? goToSlide((currentSlide + 1) % slides.length) : goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }
  };

  return (
    <>
      <section className="relative h-[70vh] sm:h-[75vh] lg:h-screen overflow-hidden bg-black">
        <div
          className="h-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-1500 ease-out ${
                i === currentSlide
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105'
              }`}
            >
              {/* Background Image with subtle zoom */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={i === 0}
                  className={`object-cover transition-transform duration-12000 ease-linear ${
                    i === currentSlide ? 'scale-100' : 'scale-110'
                  }`}
                  sizes="100vw"
                />
              </div>

              {/* Luxury Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

              {/* Content */}
              <div className="absolute inset-0 flex items-end pb-16 sm:pb-20 lg:pb-28">
                <div className="w-full px-6 sm:px-10 lg:px-16">
                  <div className="max-w-5xl mx-auto text-center">
                    {/* Title - Elegant entrance */}
                    <h1 className={`
                      font-bold tracking-tight text-[#E8C999]
                      text-5xl xs:text-6xl 
                      sm:text-7xl 
                      lg:text-8xl 
                      xl:text-9xl 
                      leading-tight
                      drop-shadow-2xl
                      transition-all duration-1000
                      ${i === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                    `}>
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className={`
                      mt-4 sm:mt-6 
                      text-[#F8EEDF]/95 font-light tracking-wide
                      text-lg xs:text-xl 
                      sm:text-2xl 
                      lg:text-3xl 
                      max-w-3xl mx-auto
                      transition-all duration-1000 delay-200
                      ${i === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                    `}>
                      {slide.subtitle}
                    </p>

                    {/* Premium CTA Button */}
                    <div className={`
                      mt-10 sm:mt-12
                      transition-all duration-1000 delay-500
                      ${i === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                    `}>
                      <Link
                        href={slide.link}
                        className="
                          group inline-flex items-center gap-4 
                          px-10 py-5 
                          bg-[#E8C999] text-black 
                          font-bold uppercase tracking-wider text-sm sm:text-base
                          rounded-full
                          shadow-2xl hover:shadow-[#E8C999]/60
                          hover:bg-white
                          transform hover:scale-105 active:scale-95
                          transition-all duration-300
                        "
                      >
                        {slide.cta}
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Elegant Indicator Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all duration-500 ${
                i === currentSlide
                  ? 'w-14 h-2 bg-[#E8C999] rounded-full shadow-lg shadow-[#E8C999]/50'
                  : 'w-10 h-2 bg-white/40 rounded-full hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Optional: Minimal counter */}
        <div className="absolute top-8 right-8 text-white/60 text-sm font-light z-20 hidden sm:block">
          0{currentSlide + 1} / 0{slides.length}
        </div>
      </section>
    </>
  );
}