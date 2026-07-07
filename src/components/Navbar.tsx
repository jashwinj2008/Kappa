'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Trash2, Plus, Minus, History } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const { cart, cartCount, cartSubtotal, updateQuantity, removeFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/60 bg-[#faf8f5]/95 backdrop-blur-sm px-4 md:px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-serif font-black text-2xl md:text-3xl tracking-tight text-[#1c1917] transition-transform duration-300 group-hover:scale-[1.02]">
              Kappa
            </span>
            <span className="font-mono font-bold text-[10px] md:text-xs tracking-[0.2em] text-[#cca025] uppercase pt-1 hidden sm:inline-block">
              FASHION STORE
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-[0.15em]">
            <Link 
              href="/" 
              className={`hover:text-mustard transition-colors duration-300 ${pathname === '/' ? 'text-mustard font-bold' : 'text-stone-600'}`}
            >
              HOME
            </Link>
            <Link 
              href="/products?gender=Women" 
              className={`hover:text-mustard transition-colors duration-300 ${pathname.includes('gender=Women') ? 'text-mustard font-bold' : 'text-stone-600'}`}
            >
              WOMEN DRESSES
            </Link>
            <Link 
              href="/products?gender=Men" 
              className={`hover:text-mustard transition-colors duration-300 ${pathname.includes('gender=Men') ? 'text-mustard font-bold' : 'text-stone-600'}`}
            >
              MEN DRESSES
            </Link>
            <Link 
              href="/products" 
              className={`hover:text-mustard transition-colors duration-300 ${pathname === '/products' && !pathname.includes('gender') ? 'text-mustard font-bold' : 'text-stone-600'}`}
            >
              ALL ITEMS
            </Link>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Direct Order History Link */}
            <Link 
              href="/checkout?step=history" 
              title="Order History"
              className="p-2.5 rounded-full border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors"
            >
              <History className="h-4.5 w-4.5" />
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 border border-stone-200 bg-white px-3.5 py-2.5 text-[#1c1917] font-mono text-xs tracking-wider hover:border-[#1c1917] transition-all duration-300"
            >
              <ShoppingBag className="h-4 w-4 text-[#cca025]" />
              <span className="font-bold">BAG</span>
              <span className="bg-[#1c1917] text-[#faf8f5] px-2 py-0.5 font-bold text-[10px]">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tickers */}
        <div className="mt-3.5 flex md:hidden items-center justify-center gap-4 font-mono font-bold text-[10px] border-t border-stone-100 pt-2.5">
          <Link href="/products?gender=Women" className="text-stone-500 hover:text-[#1c1917]">WOMEN</Link>
          <span className="text-stone-300">/</span>
          <Link href="/products?gender=Men" className="text-stone-500 hover:text-[#1c1917]">MEN</Link>
          <span className="text-stone-300">/</span>
          <Link href="/products" className="text-stone-500 hover:text-[#1c1917]">ALL ITEMS</Link>
        </div>
      </header>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-stone-900"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-stone-200 bg-white p-6 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-mustard" />
                  <h2 className="font-serif font-bold text-lg text-[#1c1917] tracking-tight">YOUR BAG ({cartCount})</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 hover:bg-stone-100 text-stone-500 transition-colors rounded-full"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <ShoppingBag className="h-12 w-12 text-stone-300 stroke-[1.25]" />
                    <div>
                      <p className="font-serif text-[#1c1917] text-sm font-bold uppercase tracking-tight">YOUR BAG IS EMPTY</p>
                      <p className="text-[11px] text-stone-500 font-mono mt-1 uppercase tracking-wide">ADD PIECES TO START YOUR LOOK</p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="editorial-btn-mustard px-6 py-2.5 text-[10px]"
                    >
                      BROWSE THE SHOP
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-stone-50 border border-stone-100 p-3 relative"
                    >
                      {/* Image */}
                      <div className="h-20 w-16 shrink-0 border border-stone-200 bg-stone-200 overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <h4 className="font-serif font-bold text-xs text-[#1c1917] truncate uppercase tracking-tight">
                            {item.name}
                          </h4>
                          <p className="font-mono text-[9px] text-stone-500 mt-1 uppercase tracking-wide">
                            SIZE: <span className="text-[#cca025]">{item.size}</span> &bull; COLOR: <span className="inline-block w-2.5 h-2.5 rounded-full border border-stone-200 align-middle" style={{ backgroundColor: item.color }} />
                          </p>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-stone-200 bg-white">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-1.5 py-0.5 hover:bg-stone-50 text-stone-600"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 py-0.5 font-mono text-xs text-[#1c1917] border-x border-stone-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-1.5 py-0.5 hover:bg-stone-50 text-stone-600"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="font-mono font-bold text-xs text-stone-850">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-2 right-2 p-1 text-stone-400 hover:text-red-650 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {cart.length > 0 && (
                <div className="border-t border-stone-100 pt-4 mt-6 space-y-4">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-xs text-stone-500 uppercase tracking-wider">BAG SUBTOTAL</span>
                    <span className="font-bold text-base text-[#1c1917]">₹{cartSubtotal}</span>
                  </div>
                  <p className="text-[9px] text-stone-400 uppercase font-mono tracking-wide">
                    * SHIPPING AND TAXES CALCULATED AT CHECKOUT.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="editorial-btn-outline py-3 text-[10px]"
                    >
                      KEEP SHOPPING
                    </button>
                    <Link
                      href="/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="editorial-btn-charcoal py-3 text-center text-[10px] flex items-center justify-center"
                    >
                      CHECKOUT NOW
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
