'use client';

import { useCart } from '@/context/CartContext';

/**
 * CartItem — Individual item in the shopping cart
 * Features: Product image, title, price, quantity selector, remove button
 */
export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
      {/* Product Image */}
      <div className="shrink-0 w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] bg-gray-50 rounded-lg overflow-hidden">
        <img
          src={item.images?.[0] || '/placeholder.png'}
          alt={item.title}
          className="w-full h-full object-contain p-2"
          onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23f3f4f6'%3E%3Crect width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-2 hover:text-[#C7511F] cursor-pointer">
          {item.title}
        </h3>

        {item.stock > 10 ? (
          <p className="text-xs text-green-700 font-medium mt-1">In Stock</p>
        ) : item.stock > 0 ? (
          <p className="text-xs text-orange-600 font-medium mt-1">Only {item.stock} left in stock</p>
        ) : (
          <p className="text-xs text-red-600 font-medium mt-1">Out of stock</p>
        )}

        <p className="text-xs text-gray-500 mt-0.5">
          FREE delivery <span className="font-bold">Tomorrow</span>
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-0.5 mt-2">
          <span className="text-xs text-gray-900">$</span>
          <span className="text-lg font-bold text-gray-900">{Math.floor(item.price)}</span>
          <span className="text-xs text-gray-900">
            {(parseFloat(item.price) % 1).toFixed(2).slice(1)}
          </span>
        </div>

        {/* Quantity controls & actions */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {/* Quantity selector */}
          <div className="flex items-center border border-gray-300 rounded-lg shadow-sm">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-l-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="px-4 py-1.5 text-sm font-medium bg-gray-50 border-x border-gray-300 min-w-[40px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              aria-label="Increase quantity"
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-r-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <span className="text-gray-300">|</span>

          {/* Delete button */}
          <button
            onClick={() => removeItem(item.id)}
            className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Price on the right (desktop) */}
      <div className="hidden sm:block shrink-0 text-right">
        <div className="flex items-baseline gap-0.5">
          <span className="text-xs font-bold text-gray-900">$</span>
          <span className="text-xl font-bold text-gray-900">
            {(parseFloat(item.price) * item.quantity).toFixed(2)}
          </span>
        </div>
        {item.quantity > 1 && (
          <p className="text-xs text-gray-500 mt-1">
            ${parseFloat(item.price).toFixed(2)} each
          </p>
        )}
      </div>
    </div>
  );
}
