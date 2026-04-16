'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import OrderSummary from '@/components/OrderSummary';
import { orderAPI } from '@/lib/api';

/**
 * Checkout Page — Shipping address form + order review
 * Features: Address form with validation, order summary, place order
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartCount, cartTotal, fetchCart, showToast } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5,6}(-\d{4})?$/.test(formData.zipCode.trim())) {
      newErrors.zipCode = 'Enter a valid ZIP code (e.g., 10001)';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+().]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!validate()) return;
    if (cartItems.length === 0) {
      setApiError('Your cart is empty. Add items before placing an order.');
      return;
    }

    setPlacing(true);
    setApiError(null);

    try {
      // Build address string
      const address = [
        formData.fullName,
        formData.addressLine1,
        formData.addressLine2,
        `${formData.city}, ${formData.state} ${formData.zipCode}`,
        `Phone: ${formData.phone}`,
      ]
        .filter(Boolean)
        .join('\n');

      const response = await orderAPI.create(address);
      const order = response.data.data;

      // Refresh cart (should be empty now)
      await fetchCart();

      // Show success toast
      showToast('Order placed successfully!', 'success');

      // Navigate to order success
      router.push(`/order-success?orderId=${order.id}`);
    } catch (err) {
      console.error('Failed to place order:', err);
      setApiError(
        err.response?.data?.error?.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setPlacing(false);
    }
  };

  // Redirect if cart is empty (but not while placing)
  if (cartItems.length === 0 && !placing) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-4">Add items to your cart before checking out.</p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] rounded-full text-sm font-medium"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-[#FF9900] focus:border-transparent ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
    }`;

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* API error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm font-medium">{apiError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Shipping address form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Shipping Address</h2>
          <p className="text-sm text-gray-500 mb-5">Enter your delivery address below.</p>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={inputClass('fullName')}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="123 Main Street"
                className={inputClass('addressLine1')}
              />
              {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Apartment, suite, unit, etc. (optional)"
                className={inputClass('addressLine2')}
              />
            </div>

            {/* City + State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className={inputClass('city')}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NY"
                  className={inputClass('state')}
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
            </div>

            {/* ZIP + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className={inputClass('zipCode')}
                />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className={inputClass('phone')}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Order items review */}
          <div className="mt-8">
            <h3 className="text-base font-bold text-gray-900 mb-3">Review Items</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 items-center bg-gray-50 rounded-lg p-3">
                  <img
                    src={item.images?.[0] || '/placeholder.png'}
                    alt={item.title}
                    className="w-16 h-16 object-contain bg-white rounded border"
                    onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23f3f4f6'%3E%3Crect width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 shrink-0">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:sticky lg:top-[110px] h-fit">
          <OrderSummary
            subtotal={cartTotal}
            itemCount={cartCount}
            onCheckout={handlePlaceOrder}
            checkoutLabel="Place Your Order"
            loading={placing}
          />

          <p className="text-xs text-gray-500 mt-3 text-center leading-relaxed">
            By placing your order, you agree to ShopHub&apos;s{' '}
            <span className="text-[#007185] cursor-pointer hover:underline">Terms of Use</span>{' '}
            and{' '}
            <span className="text-[#007185] cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
