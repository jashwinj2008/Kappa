'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import { products, Product } from '@/data/products';
import { Trash2, Plus, Minus, Ticket, ArrowRight, ShoppingBag, Sparkles, PlusCircle } from 'lucide-react';

export default function CartPage() {
  const { cart, cartCount, cartSubtotal, updateQuantity, removeFromCart, addToCart } = useCart();
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<number>(0); // Percentage
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (couponCode.toUpperCase() === 'KAPPA20') {
      setActiveDiscount(20);
      setCouponSuccess('20% DISCOUNT APPLIED!');
    } else {
      setCouponError('INVALID CODE. TRY KAPPA20');
      setActiveDiscount(0);
    }
  };

  // Calculations
  const discountAmount = Math.round((cartSubtotal * activeDiscount) / 100);
  const shippingFee = cartSubtotal > 2999 || cartSubtotal === 0 ? 0 : 150;
  const estimatedTax = Math.round((cartSubtotal - discountAmount) * 0.05); // 5% GST
  const orderTotal = cartSubtotal - discountAmount + shippingFee + estimatedTax;

  // Save discount to sessionStorage for checkout
  useEffect(() => {
    sessionStorage.setItem('kappa_discount_percent', activeDiscount.toString());
  }, [activeDiscount]);

  // Suggested Products: select up to 3 products not in the cart
  const cartItemIds = cart.map(item => item.productId);
  const suggestedProducts = products
    .filter(p => !cartItemIds.includes(p.id))
    .slice(0, 3);

  return (
    <main className="overflow-x-hidden w-full max-w-full min-h-screen flex flex-col bg-[#faf8f5] editorial-grid-bg">
      {/* Top Ticker */}
      <Marquee />

      {/* Navigation */}
      <Navbar />

      {/* Progress Header matching user screenshot */}
      <div className="border-b border-stone-200/60 bg-[#f4f2ee]/40 py-6">
        <div className="flex justify-center items-center gap-4 md:gap-6 font-mono text-[10px] md:text-xs tracking-[0.25em] text-stone-400">
          <span className="text-mustard font-bold border-b-2 border-mustard pb-1">BAG</span>
          <span className="text-stone-300 font-normal">----------------</span>
          <span className="hover:text-[#1c1917] transition-colors">ADDRESS</span>
          <span className="text-stone-300 font-normal">----------------</span>
          <span className="hover:text-[#1c1917] transition-colors">PAYMENT</span>
        </div>
      </div>

      {/* Content Area */}
      <section className="mx-auto max-w-7xl w-full px-4 md:px-8 py-12 flex-1 flex flex-col lg:flex-row gap-8 items-start">
        {cart.length === 0 ? (
          /* Empty Bag State styled closely to the screenshot */
          <div className="w-full bg-white py-24 text-center space-y-6 shadow-sm border border-stone-200/50 max-w-2xl mx-auto my-6">
            <div className="relative inline-block">
              <ShoppingBag className="h-16 w-16 text-mustard mx-auto stroke-[1.25]" />
              <div className="absolute -top-1 -right-1 bg-stone-150 h-5 w-5 rounded-full flex items-center justify-center text-[9px] text-[#1c1917] font-bold">
                0
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#1c1917] uppercase tracking-tight">HEY, IT FEELS SO LIGHT!</h2>
              <p className="font-mono text-[10px] text-stone-400 uppercase tracking-widest">There is nothing in your bag. Let's add some items.</p>
            </div>
            <Link
              href="/products"
              className="editorial-btn-mustard px-8 py-3.5 inline-block text-xs"
            >
              ADD ITEMS TO BAG
            </Link>
          </div>
        ) : (
          <>
            {/* LEFT: Items List & Cross-sell recommendations (cols: 8) */}
            <div className="w-full lg:flex-1 space-y-8">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 border border-stone-200/50 bg-white p-4 relative shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Product Image */}
                    <div className="h-28 w-24 shrink-0 border border-stone-200 bg-stone-100 overflow-hidden mx-auto sm:mx-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0 text-center sm:text-left">
                      <div>
                        <h3 className="font-serif font-bold text-sm md:text-base text-[#1c1917] uppercase truncate tracking-tight">
                          {item.name}
                        </h3>
                        <p className="font-mono text-[9px] text-stone-400 mt-2 uppercase tracking-widest">
                          SIZE: <span className="text-[#cca025]">{item.size}</span> &bull; COLOR: <span className="inline-block w-2.5 h-2.5 rounded-full border border-stone-200 align-middle" style={{ backgroundColor: item.color }} />
                        </p>
                      </div>

                      {/* Quantity Control and Price */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-0">
                        <div className="flex items-center border border-stone-200 bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-stone-50 text-stone-500"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-4 py-1 font-mono text-xs font-bold border-x border-stone-200 text-[#1c1917]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-stone-50 text-stone-500"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="font-mono text-xs uppercase tracking-wider text-stone-700">
                          <span className="text-stone-400 mr-2">EACH: ₹{item.price}</span>
                          <span className="font-bold text-[#1c1917]">TOTAL: ₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-red-650 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Cross-Sell Recommendations Component */}
              {suggestedProducts.length > 0 && (
                <div className="border border-stone-200/50 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                    <Sparkles className="h-4 w-4 text-mustard" />
                    <h3 className="font-mono font-bold text-xs tracking-wider uppercase text-stone-850">
                      WANT TO ADD MORE DRESSES?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {suggestedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="group flex flex-col bg-[#faf8f5] p-3 border border-stone-150 relative transition-all duration-300 hover:border-stone-850"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-stone-100 mb-2 relative">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif font-bold text-[11px] text-stone-850 uppercase line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="font-mono text-[9px] text-[#cca025] font-bold mt-1">₹{product.price}</p>
                          </div>
                          
                          <button
                            onClick={() => addToCart({
                              productId: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.images[0],
                              size: product.sizes[0],
                              color: product.colors[0].hex
                            }, 1)}
                            className="mt-3 w-full bg-[#1c1917] hover:bg-mustard text-white text-[9px] font-mono py-2 flex items-center justify-center gap-1.5 uppercase transition-colors duration-300"
                          >
                            <PlusCircle className="h-3 w-3" />
                            <span>QUICK ADD</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Order Summary & Coupon box (cols: 4) */}
            <div className="w-full lg:w-96 space-y-6">
              {/* Order Summary Card */}
              <div className="border border-stone-200/50 bg-white p-6 shadow-sm space-y-6">
                <h2 className="font-mono font-bold text-xs tracking-wider uppercase border-b border-stone-100 pb-3 text-stone-850">
                  ORDER SUMMARY
                </h2>

                <div className="font-mono text-[10px] tracking-wider space-y-3 uppercase text-stone-600">
                  <div className="flex justify-between">
                    <span>BAG SUB ({cartCount} ITEMS)</span>
                    <span className="text-stone-850">₹{cartSubtotal}</span>
                  </div>

                  {activeDiscount > 0 && (
                    <div className="flex justify-between text-mustard font-bold">
                      <span>DISCOUNT ({activeDiscount}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>DELIVERY SHIPPING</span>
                    <span className="text-stone-850">
                      {shippingFee === 0 ? (
                        <span className="text-mustard font-bold">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (5% TAX)</span>
                    <span className="text-stone-850">₹{estimatedTax}</span>
                  </div>

                  <div className="border-t border-stone-100 pt-4 flex justify-between items-center text-xs font-bold text-[#1c1917]">
                    <span>ORDER TOTAL</span>
                    <span className="text-mustard text-base">₹{orderTotal}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full editorial-btn-charcoal py-3.5 text-xs flex items-center justify-center gap-2 font-bold tracking-widest"
                >
                  <span>PROCEED TO SECURE CHECKOUT</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Coupon Box Card */}
              <div className="border border-stone-200/50 bg-white p-6 shadow-sm space-y-4">
                <h3 className="font-mono font-bold text-[10px] text-stone-800 uppercase tracking-wider flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-mustard" />
                  APPLY PROMO CODE
                </h3>

                <form onSubmit={applyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="ENTER KAPPA20"
                    className="flex-1 bg-white text-[#1c1917] border border-stone-200 px-3 py-2 font-mono text-xs uppercase focus:outline-none focus:border-mustard rounded-none placeholder-stone-300"
                  />
                  <button
                    type="submit"
                    className="editorial-btn-mustard px-4 py-2 text-[10px]"
                  >
                    APPLY
                  </button>
                </form>

                {couponError && (
                  <p className="font-mono text-[9px] text-red-650 font-bold uppercase tracking-wider">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="font-mono text-[9px] text-mustard font-bold uppercase tracking-wider">{couponSuccess}</p>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
