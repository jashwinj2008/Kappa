'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Star, ShieldCheck, Truck, RefreshCw, X, MessageSquare, Send, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ProductDetailClientProps {
  product: Product;
  allProducts: Product[];
}

interface UserReview {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ProductDetailClient({ product, allProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  // Active Gallery Image
  const [activeImage, setActiveImage] = useState<string>(product.images[0]);

  // Selections
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes.includes("M") ? "M" : product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0].hex);
  const [quantity, setQuantity] = useState<number>(1);

  // Modals & UI States
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [addedMessage, setAddedMessage] = useState<boolean>(false);

  // Reviews State
  const [reviews, setReviews] = useState<UserReview[]>([
    { name: "REYA S.", rating: 5, comment: "ABSOLUTELY IN LOVE WITH THIS CUT! The fabric is heavy and feels super expensive. Neon color is exactly as shown.", date: "Jun 12, 2026" },
    { name: "KABIR D.", rating: 4, comment: "Fits perfectly. Styling details are top tier. Took 2 days to deliver via Skyrocket.", date: "May 28, 2026" }
  ]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Complete the Look: Filter other products (up to 3) in same category/subcategory
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
    .slice(0, 3);

  // Add to Bag
  const handleAddToBag = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor
    }, quantity);

    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  // Buy Now (Adds to cart and goes to checkout immediately)
  const handleBuyNow = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor
    }, quantity);
    router.push('/checkout');
  };

  // Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewName.trim() && reviewComment.trim()) {
      const newReview: UserReview = {
        name: reviewName.toUpperCase(),
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      };
      setReviews([newReview, ...reviews]);
      setReviewName('');
      setReviewComment('');
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
    }
  };

  return (
    <main className="overflow-x-hidden w-full max-w-full min-h-screen flex flex-col bg-[#faf8f5] editorial-grid-bg">
      {/* Top marquee */}
      <Marquee />

      {/* Main navigation */}
      <Navbar />

      {/* Breadcrumb row */}
      <div className="border-b border-stone-200/60 bg-[#f4f2ee]/50 py-3.5 px-4 md:px-8 font-mono text-[9px] tracking-widest text-stone-500">
        <div className="mx-auto max-w-7xl flex gap-2 items-center uppercase">
          <Link href="/" className="hover:text-[#1c1917]">HOME</Link>
          <span className="text-stone-300">/</span>
          <Link href="/products" className="hover:text-[#1c1917]">CATALOG</Link>
          <span className="text-stone-300">/</span>
          <Link href={`/products?gender=${product.category}`} className="hover:text-[#1c1917]">{product.category}</Link>
          <span className="text-stone-300">/</span>
          <span className="text-mustard font-bold">{product.name}</span>
        </div>
      </div>

      {/* Product Details Section */}
      <section className="mx-auto max-w-7xl w-full px-4 md:px-8 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Image Gallery (cols: 7) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            
            {/* Gallery Thumbnails */}
            <div className="flex flex-row md:flex-col gap-2 shrink-0 max-h-[500px] overflow-y-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`h-16 w-12 border bg-white overflow-hidden shrink-0 transition-all ${
                    activeImage === img ? 'border-mustard ring-1 ring-mustard' : 'border-stone-200 hover:border-stone-800'
                  }`}
                >
                  <img src={img} alt={`thumbnail-${idx}`} className="h-full w-full object-cover object-center" />
                </button>
              ))}
            </div>

            {/* Active Main Image */}
            <div className="flex-1 aspect-[4/5] border border-stone-200/50 bg-white overflow-hidden relative shadow-md">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute bottom-3 left-3 bg-[#1c1917]/70 backdrop-blur-sm px-3 py-1 font-mono text-[8px] tracking-wider text-stone-300 border border-stone-850 uppercase">
                ZOOM ACTIVE
              </div>
            </div>
          </div>

          {/* RIGHT: Product specs / Purchase panel (cols: 5) */}
          <div className="lg:col-span-5 border border-stone-200/50 bg-white p-6 md:p-8 shadow-md space-y-6">
            <div className="space-y-2">
              <span className="bg-mustard text-white font-mono font-bold text-[8px] px-2.5 py-1 uppercase tracking-widest">
                {product.subcategory} // {product.category}
              </span>
              
              {/* Title in elegant serif */}
              <h1 className="font-serif font-bold text-xl md:text-2xl text-[#1c1917] uppercase tracking-tight">
                {product.name}
              </h1>

              {/* Review Count and Rating */}
              <div className="flex items-center gap-3 font-mono text-[9px] text-stone-400">
                <div className="flex items-center text-mustard">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-200'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-[#1c1917] font-bold">{product.rating}</span>
                </div>
                <span>&bull;</span>
                <span className="tracking-wider">{reviews.length} VERIFIED REVIEWS</span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="border-y border-stone-100 py-4 flex items-center justify-between">
              <span className="font-mono text-stone-400 text-[10px] tracking-wider uppercase">PRICE</span>
              <span className="font-mono font-bold text-xl text-stone-850">₹{product.price}</span>
            </div>

            {/* Description */}
            <p className="font-mono text-[10px] text-stone-500 leading-relaxed uppercase tracking-wider">
              {product.description}
            </p>

            {/* COLOR SELECTION */}
            <div className="space-y-2">
              <span className="font-mono font-bold text-[10px] uppercase text-stone-400 tracking-wider">SELECT COLOR</span>
              <div className="flex gap-2">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.hex;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.hex)}
                      className={`h-7 w-7 rounded-full border transition-all flex items-center justify-center relative ${
                        isSelected ? 'border-stone-900 scale-110 shadow-sm' : 'border-stone-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isSelected && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            color.hex === '#fafafa' || color.hex === '#ffff00' || color.hex === '#00ff66' ? 'bg-black' : 'bg-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIZE SELECTION & SIZE GUIDE */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-[10px] uppercase text-stone-400 tracking-wider">SELECT SIZE</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="font-mono text-[9px] text-mustard hover:underline uppercase font-bold tracking-wider"
                >
                  SIZE GUIDE
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 w-12 border font-mono text-xs font-bold transition-all flex items-center justify-center ${
                      selectedSize === size
                        ? 'bg-mustard text-white border-mustard shadow-sm scale-[1.02]'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-850'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="space-y-2 border-t border-stone-150 pt-4">
              <span className="font-mono font-bold text-[10px] uppercase text-stone-400 tracking-wider">QUANTITY</span>
              <div className="flex items-center border border-stone-200 w-28 bg-white">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 hover:bg-stone-50 text-stone-500 font-bold"
                >
                  -
                </button>
                <span className="flex-1 text-center font-mono text-xs font-bold border-x border-stone-200 py-1.5">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-1.5 hover:bg-stone-50 text-stone-500 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-150">
              <button
                onClick={handleAddToBag}
                className="editorial-btn-charcoal py-4 text-[10px] font-bold tracking-widest relative overflow-hidden"
              >
                {addedMessage ? (
                  <span className="flex items-center justify-center gap-1.5 text-mustard">
                    <Check className="h-4 w-4" /> ADDED!
                  </span>
                ) : (
                  "ADD TO BAG"
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="editorial-btn-mustard py-4 text-[10px] font-bold tracking-widest"
              >
                BUY NOW
              </button>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-stone-150 pt-4 space-y-2 font-mono text-[9px] text-stone-400 tracking-wider">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-mustard" />
                <span className="uppercase">SKYROCKET LOGISTICS: FREE EXPRESS DISPATCH OVER ₹2999</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-mustard" />
                <span className="uppercase">SECURE GATEWAY: SECURED BY RAZORPAY GATEWAY PAYMENTS</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-mustard" />
                <span className="uppercase">7-DAY SIZE SWAPS ASSURED</span>
              </div>
            </div>

            {/* Specifications Collapsible Panel */}
            <div className="border-t border-stone-150 pt-4 space-y-3 font-mono text-xs tracking-wider">
              <h3 className="font-bold text-[#1c1917] uppercase">PRODUCT DETAILS</h3>
              <div className="grid grid-cols-2 gap-2 text-[9px] text-stone-400 uppercase">
                <div className="border-b border-stone-100 pb-1">MATERIAL:</div>
                <div className="border-b border-stone-100 pb-1 text-stone-700">{product.material}</div>
                
                <div className="border-b border-stone-100 pb-1">FIT:</div>
                <div className="border-b border-stone-100 pb-1 text-stone-700">{product.fit}</div>
                
                <div className="border-b border-stone-100 pb-1">WASH CARE:</div>
                <div className="border-b border-stone-100 pb-1 text-stone-700">{product.washCare}</div>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[9px] text-stone-400 uppercase">
                {product.details.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Complete the Look Section */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-stone-200 py-24 px-4 md:px-8 bg-[#f4f2ee]/30">
          <div className="mx-auto max-w-7xl space-y-12">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-serif font-bold uppercase text-[#1c1917] tracking-tight">
                COMPLETE THE LOOK
              </h2>
              <p className="text-xs md:text-sm font-mono text-stone-400 uppercase tracking-widest">
                ITEMS FREQUENTLY BOUGHT TOGETHER FOR THIS VIBE
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews & Interactive submission Section */}
      <section className="border-t border-stone-200 py-24 px-4 md:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Reviews List (cols: 7) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-serif font-bold uppercase text-[#1c1917] tracking-tight">
                CUSTOMER FEEDBACK
              </h2>
              <p className="text-xs font-mono text-stone-400 uppercase tracking-widest">
                VERIFIED STATEMENTS FROM OWNERS
              </p>
            </div>

            <div className="space-y-4">
              {reviews.map((rev, idx) => (
                <div key={idx} className="border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="flex justify-between items-center font-mono text-[9px] text-stone-400 mb-2">
                    <span className="font-bold text-stone-700 uppercase">{rev.name}</span>
                    <span>{rev.date}</span>
                  </div>
                  <div className="flex text-mustard mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-stone-200'}`} />
                    ))}
                  </div>
                  <p className="font-mono text-[10px] text-stone-600 uppercase leading-relaxed tracking-wider">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Write a review (cols: 5) */}
          <div className="lg:col-span-5 border border-stone-200/50 bg-white p-6 shadow-md h-fit">
            <h3 className="font-mono font-bold text-xs text-[#1c1917] uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-mustard" />
              WRITE A REVIEW
            </h3>

            {reviewSubmitted ? (
              <div className="border border-mustard bg-white p-4 text-center shadow-sm">
                <p className="font-mono text-[10px] text-mustard uppercase font-bold tracking-widest">
                  REVIEW COMPLETED // THANK YOU FOR YOUR TRANSMISSION
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 font-mono text-[10px] tracking-wider">
                <div className="space-y-1">
                  <label className="text-stone-400 uppercase font-bold">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="E.G. ALEX M."
                    className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 uppercase font-bold">RATING</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-white text-stone-700 border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none cursor-pointer shadow-sm"
                  >
                    <option value="5">5 STARS - ABSOLUTE EXCELLENCE</option>
                    <option value="4">4 STARS - STYLISH FIT</option>
                    <option value="3">3 STARS - STANDARD CUT</option>
                    <option value="2">2 STARS - MINOR DEFECT</option>
                    <option value="1">1 STAR - POOR QUALITY</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 uppercase font-bold">TRANSMISSION FEEDBACK</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="DESCRIBE THE TEXTURE, SIZE FIT, AND DETAILS..."
                    className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none resize-none shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full editorial-btn-mustard py-3 text-xs flex items-center justify-center gap-2"
                >
                  <span>SUBMIT REVIEW</span>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Size Guide Drawer Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 z-50 bg-stone-900"
            />
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 z-50 md:w-[600px] border border-stone-250 bg-white p-6 shadow-2xl font-mono text-xs"
            >
              <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-4">
                <h3 className="font-serif font-bold text-lg text-[#1c1917]">SIZE GUIDE CHART</h3>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="p-1 hover:bg-stone-100 text-stone-500 rounded-full"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-stone-500">
                      <th className="p-2 border border-stone-100 uppercase">SIZE</th>
                      <th className="p-2 border border-stone-100 uppercase">CHEST (IN)</th>
                      <th className="p-2 border border-stone-100 uppercase">WAIST (IN)</th>
                      <th className="p-2 border border-stone-100 uppercase">HIPS (IN)</th>
                      <th className="p-2 border border-stone-100 uppercase">LENGTH (IN)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: "XS", chest: "30-32", waist: "24-26", hips: "34-36", len: "42" },
                      { size: "S", chest: "32-34", waist: "26-28", hips: "36-38", len: "43" },
                      { size: "M", chest: "34-36", waist: "28-30", hips: "38-40", len: "44" },
                      { size: "L", chest: "36-38", waist: "30-32", hips: "40-42", len: "45" },
                      { size: "XL", chest: "38-40", waist: "32-34", hips: "42-44", len: "46" },
                    ].map((row) => (
                      <tr key={row.size} className="hover:bg-stone-50 border-b border-stone-100">
                        <td className="p-2 border border-stone-100 font-bold text-mustard">{row.size}</td>
                        <td className="p-2 border border-stone-100">{row.chest}</td>
                        <td className="p-2 border border-stone-100">{row.waist}</td>
                        <td className="p-2 border border-stone-100">{row.hips}</td>
                        <td className="p-2 border border-stone-100">{row.len}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[9px] text-stone-400 uppercase mt-4 tracking-wider leading-relaxed">
                * MEASUREMENT SPECIFICATIONS AND TOLERANCES COMPLY WITH STANDARD EUROPEAN LOOKBOOK SPECS (+/- 0.5INCH).
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </main>
  );
}
