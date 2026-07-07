'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // Composite key: `${productId}-${size}-${color}`
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
  };
  shippingTier: string;
  paymentMethod: string;
}

interface CartContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'id'>, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  placeOrder: (orderInfo: Omit<Order, 'orderId' | 'date'>) => Order;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('kappa_cart');
    const savedOrders = localStorage.getItem('kappa_orders');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kappa_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kappa_orders', JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, 'quantity' | 'id'>, qty = 1) => {
    const compositeId = `${newItem.productId}-${newItem.size}-${newItem.color.replace('#', '')}`;
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === compositeId);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += qty;
        return updatedCart;
      }
      return [...prevCart, { ...newItem, id: compositeId, quantity: qty }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (orderInfo: Omit<Order, 'orderId' | 'date'>) => {
    const newOrder: Order = {
      ...orderInfo,
      orderId: `KPA-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
    return newOrder;
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
