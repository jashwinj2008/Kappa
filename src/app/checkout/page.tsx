'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart, CartItem, Order } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';
import { Truck, CreditCard, CheckCircle, ArrowRight, ArrowLeft, ShieldAlert, Check, ShoppingBag, Download, History, MapPin, X, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, orders, cartSubtotal, placeOrder, clearCart } = useCart();

  // Retrieve discount from session
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  useEffect(() => {
    const savedDiscount = sessionStorage.getItem('kappa_discount_percent');
    if (savedDiscount) {
      setDiscountPercent(Number(savedDiscount));
    }
  }, []);

  // Determine starting step (url param support)
  const stepParam = searchParams.get('step') || 'address';
  const [currentStep, setCurrentStep] = useState<string>(stepParam);

  useEffect(() => {
    setCurrentStep(stepParam);
  }, [stepParam]);

  // Form State
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  // Shipping details state
  const isFreeShippingEligible = cartSubtotal > 2999;
  const [shippingTier, setShippingTier] = useState<'standard' | 'express'>('standard');

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gpay' | 'netbanking'>('card');
  const [paymentError, setPaymentError] = useState('');
  const [cardType, setCardType] = useState<'credit' | 'debit'>('credit');
  
  // Credit Card States
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [creditCardExpiry, setCreditCardExpiry] = useState('');
  const [creditCardCvv, setCreditCardCvv] = useState('');
  const [creditCardName, setCreditCardName] = useState('');

  // Debit Card States
  const [debitCardNumber, setDebitCardNumber] = useState('');
  const [debitCardExpiry, setDebitCardExpiry] = useState('');
  const [debitCardCvv, setDebitCardCvv] = useState('');
  const [debitCardName, setDebitCardName] = useState('');

  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('STATE BANK OF INDIA');

  // Completed Order detail
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Calculations
  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  
  const getShippingCost = () => {
    if (shippingTier === 'standard') return isFreeShippingEligible ? 0 : 150;
    if (shippingTier === 'express') return isFreeShippingEligible ? 250 : 350;
    return 150;
  };

  const shippingCost = getShippingCost();
  const estimatedTax = Math.round((cartSubtotal - discountAmount) * 0.05); // 5% GST
  const grandTotal = cartSubtotal - discountAmount + shippingCost + estimatedTax;

  // Handle Address submission
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/checkout?step=payment');
  };

  // Payment Processing Simulation
  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    // Quick client validations
    if (paymentMethod === 'card') {
      if (cardType === 'credit') {
        if (creditCardNumber.length < 16 || creditCardExpiry.length < 5 || creditCardCvv.length < 3 || !creditCardName.trim()) {
          setPaymentError('PLEASE FILL IN ALL CREDIT CARD FIELDS VALIDLY TO COMPLETE TRANSACTION.');
          return;
        }
      } else {
        if (debitCardNumber.length < 16 || debitCardExpiry.length < 5 || debitCardCvv.length < 3 || !debitCardName.trim()) {
          setPaymentError('PLEASE FILL IN ALL DEBIT CARD FIELDS VALIDLY TO COMPLETE TRANSACTION.');
          return;
        }
      }
    } else if (paymentMethod === 'gpay') {
      if (!upiId.includes('@')) {
        setPaymentError('PLEASE ENTER A VALID UPI VPA ID (E.G. USER@OKAXIS).');
        return;
      }
    }

    // Success simulation
    const orderData = {
      items: cart,
      subtotal: cartSubtotal,
      shipping: shippingCost,
      discount: discountAmount,
      total: grandTotal,
      shippingAddress,
      shippingTier: shippingTier === 'standard' ? 'STANDARD GROUND DELIVERY' : 'PRIORITY SPEEDWAY DELIVERY',
      paymentMethod: paymentMethod === 'card' ? (cardType === 'credit' ? 'CREDIT CARD' : 'DEBIT CARD') : paymentMethod === 'gpay' ? 'UPI / GOOGLE PAY' : 'NET BANKING (' + selectedBank + ')'
    };

    const placed = placeOrder(orderData);
    setCompletedOrder(placed);
    clearCart();
    
    // Clear discount session
    sessionStorage.removeItem('kappa_discount_percent');
    
    router.push('/checkout?step=confirmation');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // Order history page view
  if (currentStep === 'history') {
    return (
      <div className="mx-auto max-w-4xl w-full px-4 md:px-8 py-12 flex-1 space-y-8 font-mono text-xs tracking-wider">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1c1917] uppercase tracking-tight flex items-center gap-2">
              <History className="h-6 w-6 text-mustard" />
              ORDER HISTORY
            </h2>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">VERIFIED COMPLETED LEDGER</p>
          </div>
          <Link href="/products" className="editorial-btn-mustard px-6 py-2.5 text-center shrink-0">
            CONTINUE SHOPPING
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="border border-stone-200 bg-white py-24 text-center space-y-6 shadow-sm">
            <ShoppingBag className="h-12 w-12 text-stone-300 mx-auto" />
            <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">NO PAST ORDERS REGISTERED</p>
            <p className="text-[10px] text-stone-400 uppercase">Place a mock purchase to populate your local ledger</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="border border-stone-200 bg-white p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 pb-3 text-[10px] text-stone-500">
                  <div>
                    <span className="uppercase">ORDER ID: </span>
                    <span className="font-bold text-[#cca025]">{order.orderId}</span>
                  </div>
                  <div>
                    <span className="uppercase">DATE: </span>
                    <span className="text-stone-700 font-bold">{order.date}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 font-serif text-sm">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-stone-850">
                      <div className="min-w-0">
                        <span className="font-bold uppercase truncate block">{item.name}</span>
                        <span className="font-mono text-[9px] text-stone-400 uppercase block tracking-wider">
                          SIZE: {item.size} &bull; QTY: {item.quantity}
                        </span>
                      </div>
                      <span className="text-mustard font-bold shrink-0 ml-4">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Total and Shipping status */}
                <div className="border-t border-stone-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[9px] text-stone-500 tracking-wider">
                  <div className="space-y-1">
                    <div>
                      SHIPPED TO: <span className="text-stone-700 font-bold">{order.shippingAddress.name}</span> ({order.shippingAddress.city})
                    </div>
                    <div>
                      METHOD: <span className="text-mustard font-bold">{order.shippingTier}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-400 uppercase mr-2 text-[9px]">TOTAL PAID</span>
                    <span className="font-bold text-sm text-[#1c1917]">₹{order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Redirect to cart if empty
  if (cart.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="mx-auto max-w-lg w-full px-4 py-24 text-center space-y-6 font-mono text-xs tracking-wider">
        <ShoppingBag className="h-12 w-12 text-stone-300 mx-auto" />
        <h2 className="text-xs font-bold uppercase text-stone-700">NO ITEMS FOR CHECKOUT</h2>
        <Link href="/products" className="editorial-btn-mustard px-8 py-3.5 inline-block">
          GO TO CATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 md:px-8 py-12 flex-1 flex flex-col lg:flex-row gap-8 items-start font-mono text-xs tracking-wider">
      
      {/* LEFT: Checkout Wizard Form (cols: 8) */}
      <div className="w-full lg:flex-1 space-y-8">
        
        {/* Progress Header matching user screenshot */}
        {currentStep !== 'confirmation' && (
          <div className="border border-stone-200/50 bg-white py-6 shadow-sm">
            <div className="flex justify-center items-center gap-4 md:gap-6 font-mono text-[10px] md:text-xs tracking-[0.25em] text-stone-400">
              <Link href="/cart" className="hover:text-[#1c1917] transition-colors">BAG</Link>
              <span className="text-stone-300 font-normal">----------------</span>
              <span className={currentStep === 'address' ? 'text-mustard font-bold border-b-2 border-mustard pb-1' : 'text-stone-450 font-bold'}>ADDRESS</span>
              <span className="text-stone-300 font-normal">----------------</span>
              <span className={currentStep === 'payment' ? 'text-mustard font-bold border-b-2 border-mustard pb-1' : 'text-stone-400'}>PAYMENT</span>
            </div>
          </div>
        )}

        {/* STEP 1: Address Details & Shipping Tiers */}
        {currentStep === 'address' && (
          <form onSubmit={handleAddressSubmit} className="border border-stone-200/50 bg-white p-6 shadow-sm space-y-6">
            <div className="space-y-4">
              <h2 className="font-bold text-xs tracking-widest uppercase border-b border-stone-100 pb-3 text-stone-850">
                1. DELIVERY ADDRESS
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-400 uppercase font-bold text-[9px]">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    placeholder="JOHN DOE"
                    className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 uppercase font-bold text-[9px]">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                    placeholder="JOHN@EMAIL.COM"
                    className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 uppercase font-bold text-[9px]">MOBILE PHONE</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-400 uppercase font-bold text-[9px]">ZIP / POSTAL CODE</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                    placeholder="400001"
                    className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-stone-400 uppercase font-bold text-[9px]">STREET ADDRESS</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    placeholder="FLAT NO, STREET, APARTMENT NAME"
                    className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-stone-400 uppercase font-bold text-[9px]">CITY</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder="MUMBAI"
                    className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Combined Delivery Options inside Step 1 */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="font-bold text-xs tracking-widest uppercase text-stone-850">
                2. SELECT DELIVERY METHOD
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShippingTier('standard')}
                  className={`flex items-center justify-between border p-4 text-left transition-all duration-300 ${
                    shippingTier === 'standard'
                      ? 'border-mustard bg-stone-50/50 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-stone-800'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-[#1c1917] block uppercase">STANDARD DELIVERY</span>
                    <span className="text-[9px] text-stone-400 uppercase block tracking-wider mt-0.5">3-5 business days</span>
                  </div>
                  <span className="font-bold text-xs text-[#cca025]">
                    {isFreeShippingEligible ? 'FREE' : '₹150'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingTier('express')}
                  className={`flex items-center justify-between border p-4 text-left transition-all duration-300 ${
                    shippingTier === 'express'
                      ? 'border-mustard bg-stone-50/50 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-stone-800'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-[#1c1917] block uppercase">EXPRESS SPEEDWAY</span>
                    <span className="text-[9px] text-stone-400 uppercase block tracking-wider mt-0.5">1-2 business days</span>
                  </div>
                  <span className="font-bold text-xs text-stone-800">
                    {isFreeShippingEligible ? '₹250' : '₹350'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                className="editorial-btn-charcoal px-6 py-3 flex items-center gap-2 font-black"
              >
                <span>PROCEED TO PAYMENT</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Embedded Payment Form (Direct page tabs, no external popups) */}
        {currentStep === 'payment' && (
          <form onSubmit={handlePay} className="border border-stone-200/50 bg-white p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="font-bold text-xs tracking-widest uppercase border-b border-stone-100 pb-3 text-stone-850">
                SELECT PAYMENT METHOD
              </h2>
              <p className="text-[9px] text-stone-400 uppercase">Complete order registration using your preferred gateway details.</p>
            </div>

            {/* Error message */}
            {paymentError && (
              <div className="bg-red-50 border border-red-150 p-3.5 flex items-start gap-2 text-[10px] text-red-750 font-bold">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-650" />
                <p className="uppercase leading-normal">{paymentError}</p>
              </div>
            )}

            {/* Direct Payment Tabs */}
            <div className="grid grid-cols-3 border border-stone-200 text-center font-bold text-[10px]">
              <button
                type="button"
                onClick={() => { setPaymentMethod('card'); setPaymentError(''); }}
                className={`py-3.5 uppercase tracking-wider ${paymentMethod === 'card' ? 'bg-[#1c1917] text-white' : 'bg-stone-50/50 hover:bg-stone-100/50 text-stone-600 border-r border-stone-200'}`}
              >
                CARD DETAILS
              </button>
              <button
                type="button"
                onClick={() => { setPaymentMethod('gpay'); setPaymentError(''); }}
                className={`py-3.5 uppercase tracking-wider ${paymentMethod === 'gpay' ? 'bg-[#1c1917] text-white' : 'bg-stone-50/50 hover:bg-stone-100/50 text-stone-600 border-r border-stone-200'}`}
              >
                UPI / GPAY
              </button>
              <button
                type="button"
                onClick={() => { setPaymentMethod('netbanking'); setPaymentError(''); }}
                className={`py-3.5 uppercase tracking-wider ${paymentMethod === 'netbanking' ? 'bg-[#1c1917] text-white' : 'bg-stone-50/50 hover:bg-stone-100/50 text-stone-600'}`}
              >
                NET BANKING
              </button>
            </div>

            {/* Payment Fields Wrapper */}
            <div className="p-4 border border-t-0 border-stone-200 bg-stone-50/30">
              
              {/* CARD DETAILS FORM */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  {/* Credit/Debit Toggle */}
                  <div className="flex gap-2 border-b border-stone-250 pb-3 font-mono text-[9px] font-bold">
                    <button
                      type="button"
                      onClick={() => { setCardType('credit'); setPaymentError(''); }}
                      className={`px-3 py-1.5 border transition-all ${
                        cardType === 'credit'
                          ? 'bg-[#1c1917] text-white border-[#1c1917] font-bold'
                          : 'bg-white text-stone-500 border-stone-200 hover:border-stone-850'
                      }`}
                    >
                      CREDIT CARD
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCardType('debit'); setPaymentError(''); }}
                      className={`px-3 py-1.5 border transition-all ${
                        cardType === 'debit'
                          ? 'bg-[#1c1917] text-white border-[#1c1917] font-bold'
                          : 'bg-white text-stone-500 border-stone-200 hover:border-stone-850'
                      }`}
                    >
                      DEBIT CARD
                    </button>
                  </div>

                  {/* CREDIT CARD FIELDS */}
                  {cardType === 'credit' && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-stone-400 font-bold uppercase text-[9px]">CREDIT CARD NUMBER</label>
                        <input
                          type="text"
                          maxLength={16}
                          value={creditCardNumber}
                          onChange={(e) => setCreditCardNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm placeholder-stone-300 font-mono text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-stone-400 font-bold uppercase text-[9px]">EXPIRY DATE</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={creditCardExpiry}
                            onChange={(e) => setCreditCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm placeholder-stone-300 font-mono text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-stone-400 font-bold uppercase text-[9px]">CVV CODE</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={creditCardCvv}
                            onChange={(e) => setCreditCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm placeholder-stone-300 font-mono text-xs"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-stone-400 font-bold uppercase text-[9px]">CARDHOLDER NAME</label>
                        <input
                          type="text"
                          value={creditCardName}
                          onChange={(e) => setCreditCardName(e.target.value)}
                          placeholder="JOHN DOE"
                          className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm placeholder-stone-300 uppercase text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* DEBIT CARD FIELDS */}
                  {cardType === 'debit' && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-stone-400 font-bold uppercase text-[9px]">DEBIT CARD NUMBER</label>
                        <input
                          type="text"
                          maxLength={16}
                          value={debitCardNumber}
                          onChange={(e) => setDebitCardNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="5111 2222 3333 4444"
                          className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm placeholder-stone-300 font-mono text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-stone-400 font-bold uppercase text-[9px]">EXPIRY DATE</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={debitCardExpiry}
                            onChange={(e) => setDebitCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm placeholder-stone-300 font-mono text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-stone-400 font-bold uppercase text-[9px]">CVV CODE</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={debitCardCvv}
                            onChange={(e) => setDebitCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm placeholder-stone-300 font-mono text-xs"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-stone-400 font-bold uppercase text-[9px]">CARDHOLDER NAME</label>
                        <input
                          type="text"
                          value={debitCardName}
                          onChange={(e) => setDebitCardName(e.target.value)}
                          placeholder="JOHN DOE"
                          className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm placeholder-stone-300 uppercase text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* UPI & GPAY PAYMENTS */}
              {paymentMethod === 'gpay' && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-stone-400 font-bold uppercase text-[9px]">ENTER UPI VPA / ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="E.G. USERNAME@GPAY"
                      className="w-full bg-white text-[#1c1917] border border-stone-200 px-3 py-2 focus:outline-none focus:border-mustard rounded-none shadow-sm placeholder-stone-350"
                    />
                  </div>

                  <div className="border-t border-stone-150 pt-4">
                    <span className="text-stone-400 font-bold uppercase text-[9px] block mb-2">QUICK SCAN SIMULATOR</span>
                    <div className="flex gap-4 items-center">
                      <div className="h-20 w-20 bg-white p-1 border border-stone-200 flex items-center justify-center shrink-0">
                        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-400 via-transparent to-transparent opacity-40" />
                      </div>
                      <p className="text-[9px] text-stone-400 uppercase leading-relaxed tracking-wider">
                        Scan mock QR code above or authorize transaction from your Google Pay, PhonePe, or BHIM Payments app directly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* NET BANKING */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-2">
                  <label className="text-stone-400 font-bold uppercase text-[9px] block">SELECT YOUR BANK</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white text-stone-700 border border-stone-200 px-3 py-2.5 focus:outline-none focus:border-mustard rounded-none cursor-pointer"
                  >
                    <option value="STATE BANK OF INDIA">STATE BANK OF INDIA</option>
                    <option value="HDFC BANK">HDFC BANK</option>
                    <option value="ICICI BANK">ICICI BANK</option>
                    <option value="AXIS BANK">AXIS BANK</option>
                    <option value="KOTAK MAHINDRA BANK">KOTAK MAHINDRA BANK</option>
                  </select>
                </div>
              )}

            </div>

            {/* Info warning */}
            <div className="bg-[#f4f2ee] p-3 text-[9px] text-stone-450 uppercase flex gap-2 items-center">
              <Info className="h-4 w-4 text-mustard shrink-0" />
              <span>Orders placed under mock gateways process instantly using local storage simulation.</span>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-stone-100 flex justify-between">
              <button
                type="button"
                onClick={() => router.push('/checkout?step=address')}
                className="editorial-btn-outline px-5 py-3 text-[10px]"
              >
                <span>BACK</span>
              </button>
              
              <button
                type="submit"
                className="editorial-btn-charcoal px-8 py-3.5 text-xs font-black flex items-center gap-2"
              >
                <span>PLACE ORDER &bull; ₹{grandTotal}</span>
                <Check className="h-4 w-4 text-mustard" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Order Confirmation & Receipt generator */}
        {currentStep === 'confirmation' && completedOrder && (
          <div className="border border-stone-200 bg-white p-6 md:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
            <div className="text-center space-y-3 pb-6 border-b border-stone-100">
              <CheckCircle className="h-12 w-12 text-mustard mx-auto" />
              <h2 className="font-serif font-bold text-xl text-[#1c1917] uppercase tracking-tight">
                TRANSACTION CONFIRMED // SYSTEM DROP REGISTERED
              </h2>
              <p className="text-[9px] text-stone-450 font-bold uppercase tracking-widest">
                THANK YOU FOR SHOPPING AT KAPPA FASHION STORE.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[10px] uppercase tracking-wider text-stone-500">
              <div className="space-y-2">
                <h3 className="font-bold text-[#1c1917] font-serif text-xs normal-case tracking-normal">DELIVERY REGISTRATION</h3>
                <div className="bg-stone-50/50 p-4 border border-stone-100 space-y-1">
                  <p className="text-stone-850 font-bold">{completedOrder.shippingAddress.name}</p>
                  <p>{completedOrder.shippingAddress.address}</p>
                  <p>{completedOrder.shippingAddress.city} - {completedOrder.shippingAddress.zip}</p>
                  <p>PHONE: {completedOrder.shippingAddress.phone}</p>
                  <p className="pt-2 text-[8px] text-stone-400 font-bold border-t border-stone-150 mt-2 tracking-widest">
                    CARRIER DISPATCH COORDINATES ASSIGNED
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-[#1c1917] font-serif text-xs normal-case tracking-normal">BILLING SUMMARY</h3>
                <div className="bg-stone-50/50 p-4 border border-stone-100 space-y-2">
                  <div className="flex justify-between">
                    <span>ORDER ID</span>
                    <span className="text-stone-850 font-bold">{completedOrder.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SHIPPING SPEED</span>
                    <span className="text-stone-850 font-bold">{completedOrder.shippingTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PAYMENT METHOD</span>
                    <span className="text-stone-850 font-bold">{completedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-150 pt-2 font-bold text-stone-850 text-xs">
                    <span>TOTAL PAID</span>
                    <span className="text-mustard">₹{completedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Itemized receipt block */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-xs uppercase text-stone-550">ITEMIZED INVOICE RECEIPT</h3>
              <div className="bg-stone-50/30 border border-stone-150 divide-y divide-stone-100 text-[10px] uppercase tracking-wider text-stone-600">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="p-3.5 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-stone-850 uppercase block font-serif text-xs normal-case tracking-normal">{item.name}</span>
                      <span className="text-[8px] text-stone-450 uppercase block tracking-widest mt-0.5">
                        SIZE: {item.size} &bull; QTY: {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-stone-850 shrink-0 ml-4 font-mono">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Print and Close */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-stone-150 print:hidden">
              <button
                onClick={handlePrintReceipt}
                className="editorial-btn-outline px-6 py-3 flex items-center justify-center gap-2 uppercase text-[10px]"
              >
                <Download className="h-4.5 w-4.5" />
                <span>DOWNLOAD RECEIPT / PRINT</span>
              </button>
              <Link
                href="/products"
                className="editorial-btn-mustard py-3 text-center text-[10px] flex-1 flex items-center justify-center font-bold tracking-widest"
              >
                <span>CONTINUE SHOPPING</span>
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* RIGHT: Order Invoice Sidebar (cols: 4) - only visible in checkout wizard, hidden in confirmation */}
      {currentStep !== 'confirmation' && (
        <div className="w-full lg:w-96 space-y-6">
          <div className="border border-stone-200/50 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-mono font-bold text-xs tracking-wider uppercase border-b border-stone-100 pb-3 text-stone-850">
              BAG PREVIEW
            </h2>

            {/* Cart Preview list */}
            <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-[10px] text-stone-650">
                  <div className="min-w-0">
                    <span className="text-stone-850 font-bold uppercase truncate block font-serif text-xs normal-case tracking-normal">{item.name}</span>
                    <span className="text-[8px] text-stone-400 uppercase block mt-0.5">
                      SIZE: {item.size} &bull; QTY: {item.quantity}
                    </span>
                  </div>
                  <span className="text-stone-850 font-bold ml-3 shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculation summary */}
            <div className="border-t border-stone-100 pt-3 space-y-2 text-[10px] text-stone-500 uppercase">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span>₹{cartSubtotal}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-mustard font-bold">
                  <span>DISCOUNT</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>DELIVERY SHIPPING</span>
                <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
              </div>
              <div className="flex justify-between">
                <span>ESTIMATED GST</span>
                <span>₹{estimatedTax}</span>
              </div>
              <div className="flex justify-between font-bold text-[#1c1917] pt-2 border-t border-stone-100 text-xs">
                <span>EST. TOTAL</span>
                <span className="text-mustard">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="overflow-x-hidden w-full max-w-full min-h-screen flex flex-col bg-[#faf8f5] editorial-grid-bg">
      {/* Ticker marquee */}
      <Marquee />

      {/* Main navigation */}
      <Navbar />

      {/* Hero Header */}
      <section className="bg-[#f4f2ee] border-b border-stone-200 py-12 px-4 md:px-8 print:hidden">
        <div className="mx-auto max-w-7xl space-y-2">
          <h1 className="text-3xl md:text-5xl font-serif font-bold uppercase text-[#1c1917] tracking-tight">
            SECURE CHECKOUT TERMINAL
          </h1>
          <p className="text-xs md:text-sm font-mono text-stone-400 uppercase tracking-widest">
            DELIVERY COORDINATES // SECURED TRANSACTION PAYMENTS
          </p>
        </div>
      </section>

      {/* Content wrapper inside Suspense */}
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center py-32 font-mono text-xs text-zinc-400">
          LOADING SECURE PORTAL TERMINAL...
        </div>
      }>
        <CheckoutContent />
      </Suspense>

      {/* Footer */}
      <Footer />
    </main>
  );
}
