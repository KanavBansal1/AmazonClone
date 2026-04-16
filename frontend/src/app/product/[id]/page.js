'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import ImageCarousel from '@/components/ImageCarousel';
import { ProductDetailSkeleton } from '@/components/Skeleton';

/**
 * Product Detail Page — Full product view with image gallery + Related Products
 * Features: Image carousel, specs, Add to Cart, Buy Now, breadcrumbs, related products
 */
export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productAPI.getById(id);
        const prod = response.data.data;
        setProduct(prod);

        // Fetch related products (same category, excluding current)
        try {
          const relatedRes = await productAPI.getAll(prod.category);
          const related = (relatedRes.data.data || [])
            .filter(p => p.id !== prod.id)
            .slice(0, 4);
          setRelatedProducts(related);
        } catch {
          // Related products are non-critical — fail silently
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    const success = await addToCart(product.id, quantity);
    setAdding(false);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    setAdding(true);
    const success = await addToCart(product.id, quantity);
    setAdding(false);
    if (success) {
      router.push('/checkout');
    }
  };

  // Render star ratings
  const renderStars = (rating, uniqueId = 'detail') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    const gradientId = `half-star-${uniqueId}`;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-[#FF9900]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-[#FF9900]" fill="currentColor" viewBox="0 0 20 20">
            <defs><linearGradient id={gradientId}><stop offset="50%" stopColor="#FF9900"/><stop offset="50%" stopColor="#D1D5DB"/></linearGradient></defs>
            <path fill={`url(#${gradientId})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] rounded-full text-sm font-medium transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <a href="/" className="hover:text-[#C7511F] hover:underline">Home</a>
        <span className="mx-2">›</span>
        <a href={`/?category=${encodeURIComponent(product.category)}`} className="hover:text-[#C7511F] hover:underline">
          {product.category}
        </a>
        <span className="mx-2">›</span>
        <span className="text-gray-700 truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left — Image carousel */}
        <div>
          <ImageCarousel images={product.images} title={product.title} />
        </div>

        {/* Right — Product info */}
        <div>
          <h1 className="text-xl md:text-2xl font-medium text-gray-900 leading-tight">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-[#007185] font-medium">{product.rating}</span>
            <div className="flex">{renderStars(product.rating || 0)}</div>
            <span className="text-sm text-[#007185] hover:text-[#C7511F] cursor-pointer">
              {product.review_count?.toLocaleString()} ratings
            </span>
          </div>

          <hr className="my-3 border-gray-200" />

          {/* Price */}
          <div className="mb-3">
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-gray-600">$</span>
              <span className="text-[28px] font-medium text-gray-900">
                {Math.floor(product.price)}
              </span>
              <span className="text-sm text-gray-600">
                {(product.price % 1).toFixed(2).slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              FREE delivery <span className="font-bold text-gray-800">Tomorrow, {new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </p>
          </div>

          <hr className="my-3 border-gray-200" />

          {/* Description */}
          <div className="mb-4">
            <h3 className="font-bold text-base text-gray-900 mb-2">About this item</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <hr className="my-3 border-gray-200" />

          {/* Stock status */}
          <div className="mb-4">
            {product.stock > 10 ? (
              <p className="text-lg text-green-700 font-medium">In Stock</p>
            ) : product.stock > 0 ? (
              <p className="text-lg text-orange-600 font-medium">Only {product.stock} left in stock — order soon</p>
            ) : (
              <p className="text-lg text-red-600 font-medium">Currently Unavailable</p>
            )}
          </div>

          {/* Quantity selector */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-medium text-gray-700">Qty:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-gray-50 shadow-sm focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
              >
                {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          )}

          {/* Action buttons */}
          {product.stock > 0 ? (
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className={`w-full py-3 rounded-full text-sm font-medium transition-all duration-200 shadow-sm
                  ${added
                    ? 'bg-green-500 text-white scale-[0.98]'
                    : 'bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] hover:shadow-md active:scale-[0.98]'
                  }
                `}
              >
                {adding ? 'Adding...' : added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={adding}
                className="w-full py-3 bg-[#FFA41C] hover:bg-[#FA8900] text-[#0F1111] rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                Buy Now
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full py-3 bg-gray-200 text-gray-500 rounded-full text-sm font-medium cursor-not-allowed"
            >
              Currently Unavailable
            </button>
          )}

          {/* Product details table */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Product Details</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-500 font-medium w-1/3">Category</td>
                  <td className="py-2 text-gray-800">{product.category}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-500 font-medium">Availability</td>
                  <td className="py-2 text-gray-800">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-500 font-medium">Rating</td>
                  <td className="py-2 text-gray-800">{product.rating} out of 5</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-500 font-medium">Reviews</td>
                  <td className="py-2 text-gray-800">{product.review_count?.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================
          Related Products — Differentiator Feature
          ========================================= */}
      {relatedProducts.length > 0 && (
        <div className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Related products in {product.category}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                href={`/product/${rp.id}`}
                className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <div className="h-[140px] flex items-center justify-center bg-gray-50 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={rp.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23f3f4f6'%3E%3Crect width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"}
                    alt={rp.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23f3f4f6'%3E%3Crect width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
                    loading="lazy"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-[#C7511F] transition-colors leading-snug">
                  {rp.title}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-[#FF9900] font-medium">{rp.rating}</span>
                  <svg className="w-3 h-3 text-[#FF9900]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs text-gray-400">({rp.review_count?.toLocaleString()})</span>
                </div>
                <div className="flex items-baseline gap-0.5 mt-1">
                  <span className="text-xs text-gray-800">$</span>
                  <span className="text-base font-medium text-gray-900">{Math.floor(rp.price)}</span>
                  <span className="text-xs text-gray-800">{(rp.price % 1).toFixed(2).slice(1)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
