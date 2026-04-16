'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { orderAPI } from '@/lib/api';

/**
 * OrderSuccessContent — Main content for the order confirmation page
 */
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('No order ID provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await orderAPI.getById(orderId);
        setOrder(response.data.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-[#FF9900] rounded-full mx-auto" />
        <p className="mt-4 text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] rounded-full text-sm font-medium"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600">
          Thank you for your order. Your order has been confirmed and will be shipped soon.
        </p>
      </div>

      {/* Order details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono font-bold text-[#FF9900] text-lg">#{order.id}</p>
          </div>
        </div>

        <hr className="mb-4" />

        {/* Status badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-600">Status:</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 uppercase tracking-wide">
            {order.status}
          </span>
        </div>

        {/* Shipping address */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-bold text-gray-700 mb-1">Shipping Address</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{order.address}</p>
        </div>

        {/* Order items */}
        <h3 className="text-sm font-bold text-gray-700 mb-3">Items Ordered</h3>
        <div className="space-y-3 mb-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex gap-3 items-center bg-gray-50 rounded-lg p-3">
              <img
                src={item.images?.[0] || '/placeholder.png'}
                alt={item.title}
                className="w-16 h-16 object-contain bg-white rounded border"
                onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23f3f4f6'%3E%3Crect width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-xs text-gray-500">${parseFloat(item.price).toFixed(2)} each</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <hr className="mb-3" />
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-bold text-gray-900">Order Total:</span>
          <span className="text-xl font-bold text-[#B12704]">${parseFloat(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] rounded-full text-sm font-medium shadow-sm hover:shadow transition-all"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

/**
 * Order Success Page — Wraps content in Suspense for searchParams
 */
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-[#FF9900] rounded-full mx-auto" />
        <p className="mt-4 text-gray-500">Loading order details...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
