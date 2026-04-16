'use client';

/**
 * OrderSummary — Displays order total breakdown
 * Used in Cart and Checkout pages
 */
export default function OrderSummary({ subtotal, itemCount, onCheckout, checkoutLabel = 'Proceed to Checkout', loading = false }) {
  const shipping = subtotal >= 25 ? 0 : 5.99;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Items ({itemCount}):</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping:</span>
          {shipping === 0 ? (
            <span className="text-green-600 font-medium">FREE</span>
          ) : (
            <span>${shipping.toFixed(2)}</span>
          )}
        </div>

        {shipping === 0 && (
          <p className="text-xs text-green-600">
            ✓ Your order qualifies for FREE Shipping
          </p>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Estimated tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-[#B12704]">Order total:</span>
            <span className="text-lg font-bold text-[#B12704]">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {onCheckout && (
        <button
          onClick={onCheckout}
          disabled={loading || itemCount === 0}
          className="w-full mt-4 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            checkoutLabel
          )}
        </button>
      )}
    </div>
  );
}
