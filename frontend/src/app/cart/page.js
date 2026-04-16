'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/CartItem';
import OrderSummary from '@/components/OrderSummary';
import { CartSkeleton } from '@/components/Skeleton';

/**
 * Cart Page — Shopping cart with items, quantity controls, and checkout
 */
export default function CartPage() {
  const router = useRouter();
  const { cartItems, cartCount, cartTotal, loading, error } = useCart();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
        <CartSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Cart items */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <span className="text-sm text-gray-500">Price</span>
          </div>
          <hr className="mb-4" />

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Empty cart */}
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-4">Looks like you haven&apos;t added anything to your cart yet.</p>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] rounded-full text-sm font-medium transition-colors shadow-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart item list */}
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}

              {/* Subtotal at bottom of items */}
              <div className="text-right mt-4 pt-2">
                <span className="text-lg text-gray-700">
                  Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}):{' '}
                  <span className="font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Order summary sidebar */}
        {cartItems.length > 0 && (
          <div className="lg:sticky lg:top-[110px] h-fit">
            <OrderSummary
              subtotal={cartTotal}
              itemCount={cartCount}
              onCheckout={handleCheckout}
              checkoutLabel={`Proceed to Checkout (${cartCount} ${cartCount === 1 ? 'item' : 'items'})`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
