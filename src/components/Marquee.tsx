'use client';

import React from 'react';

interface MarqueeProps {
  text?: string;
  bgColor?: string;
  textColor?: string;
}

export default function Marquee({
  text = "KAPPA20 FOR 20% OFF // FREE SHIPPING ON ORDERS OVER ₹2999 // DESIGNED FOR THE WARM EDITORIAL HEATS // KAPPA FASHION STORE // RAZORPAY INTEGRATED // SKYROCKET DELIVERIES",
  bgColor = "bg-mustard",
  textColor = "text-[#1c1917]"
}: MarqueeProps) {
  return (
    <div className={`w-full overflow-hidden border-b border-stone-200 py-3 ${bgColor} ${textColor} font-mono font-bold text-xs uppercase select-none tracking-widest relative z-30`}>
      <div className="flex w-max animate-marquee">
        <span className="px-4">{text} &bull;&nbsp;</span>
        <span className="px-4">{text} &bull;&nbsp;</span>
        <span className="px-4">{text} &bull;&nbsp;</span>
        <span className="px-4">{text} &bull;&nbsp;</span>
      </div>
    </div>
  );
}
