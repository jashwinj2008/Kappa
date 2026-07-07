'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-stone-200 bg-[#f4f2ee] mt-auto">
      {/* Top Banner Row */}
      <div className="border-b border-stone-200/60 py-6 px-4 md:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] md:text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-mustard rounded-full animate-pulse" />
            <span className="text-stone-600 font-bold uppercase tracking-wider">LOGISTICS: SKYROCKET EXPRESS LOGISTIX</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[#1c1917] rounded-full" />
            <span className="text-stone-600 font-bold uppercase tracking-wider">PAYMENTS: SECURED VIA RAZORPAY GATEWAY</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-2xl tracking-tight text-[#1c1917]">
              Kappa
            </span>
            <span className="font-mono font-bold text-[10px] tracking-[0.2em] text-mustard uppercase pt-1">
              FASHION STORE
            </span>
          </div>
          <p className="text-xs text-stone-500 max-w-sm uppercase leading-relaxed font-mono tracking-wider">
            REDEFINING URBAN LOOKS AND ELEGANT DRESSES FOR MEN AND WOMEN. BUILT FOR INDIVIDUALS WHO CHERISH COMFORT, MINIMALISM, AND EDITORIAL STYLE.
          </p>
        </div>

        {/* Catalog Categories */}
        <div className="space-y-4 font-mono text-xs tracking-wider">
          <h4 className="text-mustard font-bold uppercase">CATALOG</h4>
          <ul className="space-y-2 text-stone-500">
            <li>
              <Link href="/products?gender=Women" className="hover:text-[#1c1917] transition-colors uppercase">
                WOMEN'S COLLECTION
              </Link>
            </li>
            <li>
              <Link href="/products?gender=Men" className="hover:text-[#1c1917] transition-colors uppercase">
                MEN'S COLLECTION
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-[#1c1917] transition-colors uppercase">
                NEW ARRIVALS
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-[#1c1917] transition-colors uppercase">
                LIMITED DROP
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copy row */}
      <div className="border-t border-stone-200 py-6 px-4 md:px-8 bg-[#ebe9e4]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] text-stone-500 tracking-wider">
          <p className="uppercase">&copy; 2026 KAPPA FASHION STORE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4">
            <span className="uppercase">PRIVACY POLICY</span>
            <span className="text-stone-300">/</span>
            <span className="uppercase">TERMS OF SERVICE</span>
            <span className="text-stone-300">/</span>
            <span className="uppercase">DEVELOPMENT LEDGER</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
