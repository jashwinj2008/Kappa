'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Don't trigger link navigation
    e.stopPropagation();
    
    // Quick Add defaults to Size "M" and the first color
    const defaultSize = product.sizes.includes("M") ? "M" : product.sizes[0];
    const defaultColor = product.colors[0];

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: defaultSize,
      color: defaultColor.hex
    }, 1);

    // Show temporary notification feedback
    const btn = e.currentTarget as HTMLButtonElement;
    const originalText = btn.innerHTML;
    btn.innerHTML = "ADDED!";
    btn.classList.add("bg-mustard", "text-white");
    btn.classList.remove("bg-[#1c1917]", "text-white");
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove("bg-mustard", "text-white");
      btn.classList.add("bg-[#1c1917]", "text-white");
    }, 1000);
  };

  return (
    <Link 
      href={`/products/${product.id}`}
      className="group flex flex-col bg-white overflow-hidden editorial-shadow hover:editorial-shadow-lg hover:-translate-y-1 transition-all duration-500 relative"
    >
      {/* Product Image */}
      <div className="aspect-[4/5] w-full overflow-hidden bg-stone-100 relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-[1.2s] ease-out"
        />
        {/* Subcategory Label */}
        <span className="absolute top-3 left-3 bg-[#1c1917] text-white px-2.5 py-1 font-mono text-[8px] uppercase tracking-widest font-bold">
          {product.subcategory}
        </span>
        {/* Gender Tag */}
        <span className="absolute top-3 right-3 bg-mustard text-white px-2.5 py-1 font-mono text-[8px] uppercase tracking-widest font-bold">
          {product.category}
        </span>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <h3 className="font-serif font-bold text-sm text-[#1c1917] group-hover:text-mustard transition-colors duration-300 uppercase tracking-tight line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 font-mono text-[9px] text-stone-400">
            <div className="flex items-center text-mustard">
              <Star className="h-3 w-3 fill-current" />
              <span className="ml-1 text-stone-850 font-bold">{product.rating}</span>
            </div>
            <span>&bull;</span>
            <span className="tracking-wider">{product.reviewsCount} REVIEWS</span>
          </div>
        </div>

        {/* Action / Sizing Row */}
        <div className="flex items-center justify-between border-t border-stone-100 pt-3">
          <span className="font-mono font-bold text-xs text-stone-700">
            ₹{product.price}
          </span>

          <button
            onClick={handleQuickAdd}
            className="editorial-btn-charcoal px-3 py-1.5 text-[9px] font-bold tracking-widest"
            title="Quick Add Size M"
          >
            <span>+ ADD</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
