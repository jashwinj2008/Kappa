'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { ArrowRight, Sparkles, Send } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const textRevealRef = useRef<HTMLParagraphElement>(null);

  // Fetch 4 trending products (2 women, 2 men)
  const trendingProducts = products.filter(p => p.id === 'w-01' || p.id === 'w-03' || p.id === 'm-01' || p.id === 'm-03');

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero entrance animation
      gsap.from('.hero-anim', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // 2. Bento cards scale-in
      gsap.from('.bento-card', {
        scale: 0.95,
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

      // 3. Scrubbing Text Reveal
      const textElement = textRevealRef.current;
      if (textElement) {
        const words = textElement.innerText.split(' ');
        textElement.innerHTML = words.map(w => `<span class="reveal-word opacity-[0.12] inline-block mr-2 text-stone-900">${w}</span>`).join('');
        
        gsap.to('.reveal-word', {
          opacity: 1,
          color: '#1c1917',
          stagger: 0.05,
          scrollTrigger: {
            trigger: textElement,
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: true
          }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <main className="overflow-x-hidden w-full max-w-full min-h-screen flex flex-col bg-[#faf8f5] editorial-grid-bg">
      {/* Promo Bar */}
      <Marquee />

      {/* Navigation */}
      <Navbar />

      {/* Attention: Hero Section (Asymmetric Editorial Grid) */}
      <section 
        ref={heroRef}
        className="relative min-h-[85vh] flex items-center justify-center px-4 md:px-8 py-16 md:py-24 border-b border-stone-200"
      >
        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: Large Editorial Heading & CTAs (cols: 7) */}
          <div className="lg:col-span-7 space-y-8 text-left z-10">
            <div className="hero-anim inline-flex items-center gap-2 border border-stone-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider text-stone-500">
              <Sparkles className="h-3.5 w-3.5 text-must-dark text-mustard" />
              <span>THE HONEY & MUSTARD COLLECTION</span>
            </div>

            {/* H1 (Iron Rule: 2-3 lines max, large width, Inline typography image) */}
            <h1 className="hero-anim text-4xl sm:text-5xl md:text-7xl font-serif font-black tracking-tight leading-[1.05] text-[#1c1917] max-w-3xl uppercase">
              THE NEW <span className="inline-block w-16 sm:w-24 md:w-32 h-8 sm:h-10 md:h-14 rounded-full align-middle bg-cover bg-center border border-stone-200 mx-2" style={{backgroundImage: "url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&auto=format&fit=crop&q=80')"}}></span> SPECTRUM OF DRESSES
            </h1>

            <p className="hero-anim text-xs md:text-sm font-mono text-stone-500 max-w-lg uppercase tracking-wider leading-relaxed">
              Explore custom-crafted garments featuring honey-mustard highlights, organic textures, and fluid shapes designed for the lookbook editorial look.
            </p>

            {/* Hero CTAs: Exactly two high-contrast buttons */}
            <div className="hero-anim flex flex-wrap items-center gap-4 pt-2">
              <Link 
                href="/products?gender=Women" 
                className="editorial-btn-charcoal px-8 py-4 text-xs font-bold tracking-widest flex items-center gap-2"
              >
                <span>SHOP WOMEN</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/products?gender=Men" 
                className="editorial-btn-outline px-8 py-4 text-xs font-bold tracking-widest flex items-center gap-2 bg-white/50"
              >
                <span>SHOP MEN</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Fashion Model portrait (cols: 5) */}
          <div className="lg:col-span-5 relative w-full aspect-[3/4] max-w-md mx-auto lg:mx-0">
            {/* Visual background element */}
            <div className="absolute -inset-4 bg-mustard/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="hero-anim relative w-full h-full border border-stone-200 bg-stone-100 overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80" 
                alt="Model Portrait" 
                className="h-full w-full object-cover object-center"
              />
            </div>
            
            {/* Floating Editorial Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white border border-stone-200 px-4 py-2 font-mono text-[9px] font-bold text-[#1c1917] tracking-widest uppercase">
              LOOKBOOK NO. 12 // 2026
            </div>
          </div>

        </div>
      </section>

      {/* Interest: Bento Grid Collections */}
      <section ref={cardsRef} className="px-4 py-32 md:py-48 max-w-7xl mx-auto w-full border-b border-stone-200">
        <div className="space-y-3 mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1c1917] tracking-tight uppercase">
            SEASONAL DROP CAPSULES
          </h2>
          <p className="text-xs md:text-sm font-mono text-stone-400 uppercase tracking-widest">
            MINIMALIST LOOKBOOKS // DETAILED TEXTURED WEAVES
          </p>
        </div>

        {/* Bento Grid layout with dense filling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 grid-flow-row-dense">
          {/* Card 1 - Double column */}
          <div className="bento-card col-span-1 md:col-span-2 bg-white border border-stone-100 min-h-[350px] relative overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-500">
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-[1.02] transition-transform duration-[1.2s] ease-out opacity-65"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 space-y-3 z-10">
              <span className="bg-mustard text-white font-mono font-bold text-[9px] px-2.5 py-1 uppercase tracking-widest">
                WOMEN'S EDITORIAL
              </span>
              <h3 className="text-xl md:text-3xl font-serif font-bold text-[#1c1917] uppercase">
                HONEY CUTOUT DRESSES
              </h3>
              <p className="text-xs font-mono text-stone-600 uppercase max-w-md">
                ELEGANT STYLING ACCENTS INTEGRATED WITH SOFT DRAPED BIAS SILKS AND RIB KNITS.
              </p>
              <Link 
                href="/products?gender=Women" 
                className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-mustard hover:text-[#1c1917] pt-2 transition-colors uppercase tracking-wider"
              >
                DISCOVER PIECES <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2 - Single column */}
          <div className="bento-card col-span-1 bg-white border border-stone-100 min-h-[350px] relative overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-500">
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-[1.02] transition-transform duration-[1.2s] ease-out opacity-65"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 space-y-3 z-10">
              <span className="bg-[#1c1917] text-white font-mono font-bold text-[9px] px-2.5 py-1 uppercase tracking-widest">
                MEN'S LOOKBOOK
              </span>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1c1917] uppercase">
                Ochre Tailored Coats
              </h3>
              <p className="text-xs font-mono text-stone-600 uppercase">
                MODULAR COTTON WEAVES COMBINED WITH CUSTOM REINFORCED BUTTON DETAILS.
              </p>
              <Link 
                href="/products?gender=Men" 
                className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-mustard hover:text-[#1c1917] pt-2 transition-colors uppercase tracking-wider"
              >
                DISCOVER PIECES <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3 - Triple column (Wide) */}
          <div className="bento-card col-span-1 md:col-span-3 bg-white border border-stone-100 min-h-[260px] relative overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-500">
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-[1.02] transition-transform duration-[1.2s] ease-out opacity-50"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&auto=format&fit=crop&q=80')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/10 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 space-y-2 z-10">
              <span className="bg-stone-100 text-stone-600 font-mono font-bold text-[9px] px-2.5 py-1 uppercase tracking-widest">
                UNISEX EDITORIAL
              </span>
              <h3 className="text-xl md:text-3xl font-serif font-bold text-[#1c1917] uppercase">
                CREAM FLEECE OVERALL SETS
              </h3>
              <p className="text-xs font-mono text-stone-600 uppercase max-w-xl">
                SUPERIOR French loops fabrications designed to maximize look aesthetics and everyday ease.
              </p>
              <Link 
                href="/products" 
                className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#1c1917] hover:text-mustard pt-2 transition-colors uppercase tracking-wider"
              >
                BROWSE PRODUCTS <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Desire: Pinned Scroll Text Reveal (GSAP ScrollTrigger) */}
      <section className="px-4 py-32 md:py-48 max-w-7xl mx-auto w-full border-b border-stone-200 flex flex-col md:flex-row gap-12 items-start relative">
        <div className="md:sticky md:top-32 md:w-1/3 space-y-3">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-mustard uppercase tracking-tight">
            KAPPA EDITORIAL CONCEPT
          </h2>
          <p className="text-xs font-mono text-stone-400 uppercase tracking-widest">
            SCROLL TO DECODE
          </p>
        </div>
        
        <div className="md:w-2/3">
          <p 
            ref={textRevealRef}
            className="font-serif font-bold text-2xl md:text-4xl text-[#1c1917] uppercase leading-relaxed tracking-tight"
          >
            We believe clothing is not merely a cover but an expression of aesthetic individuality. By sourcing high weight textiles, integrating modular accessories like tailored button systems, and deploying rich honey mustard accents, we have engineered lookbook garments that deliver unparalleled lookbook confidence. Secured via modern billing gateways and Skyrocket express shipping carriers.
          </p>
        </div>
      </section>

      {/* Desire: Trending Products Grid */}
      <section className="px-4 py-32 md:py-48 max-w-7xl mx-auto w-full border-b border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-5xl font-serif font-bold uppercase text-[#1c1917] tracking-tight">
              TRENDING EDITORIALS
            </h2>
            <p className="text-xs md:text-sm font-mono text-stone-400 uppercase tracking-widest">
              LATEST ADDITIONS SELECTED FOR TODAY
            </p>
          </div>
          
          <Link 
            href="/products" 
            className="editorial-btn-charcoal px-6 py-3.5 text-[10px] shrink-0"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Action: Massive Newsletter Form */}
      <section className="px-4 py-32 md:py-48 bg-[#f4f2ee] border-b border-stone-200 relative overflow-hidden">
        {/* Subtle grid backing */}
        <div className="absolute inset-0 editorial-grid-bg opacity-20 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-bold uppercase text-[#1c1917] tracking-tight">
            JOIN THE LOOKBOOK CLUB
          </h2>
          <p className="text-xs sm:text-sm font-mono text-stone-500 max-w-md mx-auto uppercase tracking-wider leading-relaxed">
            Subscribe to receive flash drop alerts, limited edition coupon codes, and lookbook updates.
          </p>

          <div className="max-w-md mx-auto">
            {subscribed ? (
              <div className="border border-mustard bg-white p-6 text-center shadow-md">
                <p className="font-mono font-bold text-xs text-mustard uppercase tracking-widest">
                  ACCESS GRANTED // CHECK YOUR INBOX FOR WELCOME DISCOUNTS
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER EMAIL FOR CODES"
                  className="flex-1 bg-white text-[#1c1917] border border-stone-200 px-4 py-3 font-mono text-xs focus:outline-none focus:border-mustard placeholder-stone-400 rounded-none shadow-sm"
                />
                <button
                  type="submit"
                  className="editorial-btn-mustard px-6 py-3.5 text-xs flex items-center justify-center gap-2 shrink-0"
                >
                  <span>SUBSCRIBE</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
