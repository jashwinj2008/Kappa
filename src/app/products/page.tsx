'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products, Product } from '@/data/products';
import { SlidersHorizontal, Check, ArrowUpDown } from 'lucide-react';

function ProductsListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initial states from URL params
  const genderParam = searchParams.get('gender') || 'All';
  const subcategoryParam = searchParams.get('subcategory') || 'All';

  // Filters State
  const [selectedGender, setSelectedGender] = useState<string>(genderParam);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    subcategoryParam !== 'All' ? [subcategoryParam] : []
  );
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [sortBy, setSortBy] = useState<string>('default');

  // Sync state with URL params
  useEffect(() => {
    setSelectedGender(genderParam);
    setSelectedSubcategories(subcategoryParam !== 'All' ? [subcategoryParam] : []);
  }, [genderParam, subcategoryParam]);

  const subcategories = ['Casual', 'Partywear', 'Streetwear', 'Loungewear'];

  // Toggle subcategory selection
  const handleSubcategoryChange = (sub: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((item) => item !== sub) : [...prev, sub]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedGender('All');
    setSelectedSubcategories([]);
    setMaxPrice(6000);
    setSortBy('default');
    router.push('/products');
  };

  // Filter and Sort Logic
  const filteredProducts = products
    .filter((product) => {
      // 1. Gender Filter
      if (selectedGender !== 'All' && product.category !== selectedGender) {
        return false;
      }
      // 2. Subcategory Filter
      if (
        selectedSubcategories.length > 0 &&
        !selectedSubcategories.includes(product.subcategory)
      ) {
        return false;
      }
      // 3. Price Filter
      if (product.price > maxPrice) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0; // Default sorting
    });

  return (
    <div className="mx-auto max-w-7xl w-full px-4 md:px-8 py-12 flex-1 flex flex-col md:flex-row gap-8 items-start">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 border border-stone-200/50 bg-white p-6 editorial-shadow sticky top-28">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-mustard" />
            <h2 className="font-mono font-bold text-xs tracking-wider uppercase text-stone-850">FILTERS</h2>
          </div>
          <button
            onClick={handleClearFilters}
            className="font-mono text-[9px] text-stone-400 hover:text-mustard underline uppercase tracking-wider"
          >
            CLEAR ALL
          </button>
        </div>

        {/* Gender Filter */}
        <div className="space-y-3 mb-6">
          <h3 className="font-mono font-bold text-[10px] tracking-wider uppercase text-stone-400">DEPARTMENT</h3>
          <div className="flex flex-col gap-2">
            {['All', 'Women', 'Men'].map((gender) => (
              <button
                key={gender}
                onClick={() => {
                  setSelectedGender(gender);
                  const params = new URLSearchParams(window.location.search);
                  if (gender === 'All') params.delete('gender');
                  else params.set('gender', gender);
                  router.push(`/products?${params.toString()}`);
                }}
                className={`flex items-center justify-between border px-3 py-2.5 font-mono text-[10px] font-bold uppercase transition-all duration-300 ${
                  selectedGender === gender
                    ? 'bg-mustard text-white border-mustard font-bold'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-800'
                }`}
              >
                <span>{gender === 'All' ? 'ALL DRESSES' : gender}</span>
                {selectedGender === gender && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategories Filter */}
        <div className="space-y-3 mb-6 border-t border-stone-100 pt-6">
          <h3 className="font-mono font-bold text-[10px] tracking-wider uppercase text-stone-400">STYLE CATEGORY</h3>
          <div className="flex flex-col gap-2">
            {subcategories.map((sub) => {
              const isChecked = selectedSubcategories.includes(sub);
              return (
                <button
                  key={sub}
                  onClick={() => handleSubcategoryChange(sub)}
                  className={`flex items-center justify-between border px-3 py-2.5 font-mono text-[10px] uppercase transition-all duration-300 ${
                    isChecked
                      ? 'bg-[#1c1917] text-white border-[#1c1917]'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-800'
                  }`}
                >
                  <span>{sub}</span>
                  {isChecked && <Check className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Slider Filter */}
        <div className="space-y-3 border-t border-stone-100 pt-6">
          <div className="flex justify-between items-center">
            <h3 className="font-mono font-bold text-[10px] tracking-wider uppercase text-stone-400">MAX PRICE</h3>
            <span className="font-mono text-xs font-bold text-[#cca025]">₹{maxPrice}</span>
          </div>
          <input
            type="range"
            min="2500"
            max="6000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-mustard"
          />
          <div className="flex justify-between font-mono text-[9px] text-stone-400 tracking-wider">
            <span>₹2,500</span>
            <span>₹6,000</span>
          </div>
        </div>
      </aside>

      {/* Main Grid Content */}
      <div className="flex-1 w-full space-y-6">
        {/* Sort and Count Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-stone-200/50 bg-white p-4.5 editorial-shadow">
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-stone-500">
            SHOWING <span className="text-[#cca025] font-black">{filteredProducts.length}</span> ITEMS MATCHED
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-mustard" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white text-stone-700 border border-stone-200 px-3 py-2 font-mono text-[10px] uppercase focus:outline-none focus:border-mustard rounded-none cursor-pointer"
            >
              <option value="default">DEFAULT SORT</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
              <option value="rating">TOP RATED</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="border border-dashed border-stone-300 bg-white py-24 text-center space-y-4">
            <p className="font-mono text-stone-400 text-xs uppercase tracking-wider">NO ITEMS MATCHED YOUR ACTIVE FILTERS</p>
            <button
              onClick={handleClearFilters}
              className="editorial-btn-mustard px-6 py-2.5 text-[10px]"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="overflow-x-hidden w-full max-w-full min-h-screen flex flex-col bg-[#faf8f5] editorial-grid-bg">
      {/* Ticker marquee */}
      <Marquee />

      {/* Main Navigation */}
      <Navbar />

      {/* Hero Header */}
      <section className="bg-[#f4f2ee] border-b border-stone-200 py-12 px-4 md:px-8">
        <div className="mx-auto max-w-7xl space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif font-bold uppercase text-[#1c1917] tracking-tight">
            KAPPA FASHION CATALOG
          </h1>
          <p className="text-xs md:text-sm font-mono text-stone-400 uppercase tracking-widest">
            ORGANIC SHAPES // HONEY HIGHLIGHTS // LUXURY STYLE GRIDS
          </p>
        </div>
      </section>

      {/* Product Content Wrapper in Suspense */}
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center py-32 font-mono text-xs text-stone-400">
          LOADING SYSTEM CATALOG...
        </div>
      }>
        <ProductsListContent />
      </Suspense>

      {/* Footer */}
      <Footer />
    </main>
  );
}
