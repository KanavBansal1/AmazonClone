'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '@/lib/api';

const CartContext = createContext();

/**
 * CartProvider — Manages cart state and syncs with backend
 * Wraps the entire application to provide cart data to all components
 */
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true); // Start true to avoid empty flash
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  // Show toast notification
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  /**
   * Fetch cart data from the backend
   */
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.get();
      const data = response.data.data;
      setCartItems(data.items || []);
      setCartCount(data.total_items || 0);
      setCartTotal(data.subtotal || 0);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add item to cart — calls backend, then refreshes cart state
   */
  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      setError(null);
      const response = await cartAPI.addItem(productId, quantity);
      const data = response.data.data;
      setCartItems(data.items || []);
      setCartCount(data.total_items || 0);
      setCartTotal(data.subtotal || 0);
      showToast('Item added to cart!', 'success');
      return true;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      showToast('Failed to add item to cart.', 'error');
      return false;
    }
  }, [showToast]);

  /**
   * Update quantity of a cart item
   */
  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    try {
      setError(null);
      const response = await cartAPI.updateItem(cartItemId, quantity);
      const data = response.data.data;
      setCartItems(data.items || []);
      setCartCount(data.total_items || 0);
      setCartTotal(data.subtotal || 0);
    } catch (err) {
      console.error('Failed to update cart:', err);
      showToast('Failed to update quantity.', 'error');
    }
  }, [showToast]);

  /**
   * Remove item from cart
   */
  const removeItem = useCallback(async (cartItemId) => {
    try {
      setError(null);
      const response = await cartAPI.removeItem(cartItemId);
      const data = response.data.data;
      setCartItems(data.items || []);
      setCartCount(data.total_items || 0);
      setCartTotal(data.subtotal || 0);
      showToast('Item removed from cart.', 'success');
    } catch (err) {
      console.error('Failed to remove item:', err);
      showToast('Failed to remove item.', 'error');
    }
  }, [showToast]);

  // Fetch cart on initial mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        error,
        toast,
        addToCart,
        updateQuantity,
        removeItem,
        fetchCart,
        showToast,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 animate-slideUp
            ${toast.type === 'success'
              ? 'bg-[#131921] text-white'
              : 'bg-red-600 text-white'
            }
          `}
        >
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 text-[#FF9900] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </CartContext.Provider>
  );
}

/**
 * Custom hook to access cart context
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
