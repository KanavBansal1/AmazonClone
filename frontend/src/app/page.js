'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/Skeleton';
import { productAPI } from '@/lib/api';

/**
 * HomeContent — Main product listing page content
 * Features: Search, category filtering, sorting, product grid, error handling
 */
function HomeContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('featured');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (searchQuery) {
        response = await productAPI.search(searchQuery);
      } else if (categoryFilter) {
        response = await productAPI.getAll(categoryFilter);
      } else {
        response = await productAPI.getAll();
      }

      setProducts(response.data.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch products:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
        code: err.code,
      });

      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        setError('Cannot connect to the server. Make sure the backend is running on port 5000.');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Check that backend routes are configured correctly.');
      } else if (err.response?.status >= 500) {
        setError(`Server error (${err.response.status}): ${err.response?.data?.error?.message || 'Internal server error'}`);
      } else {
        setError(err.response?.data?.error?.message || `Failed to load products: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sort products client-side (differentiator feature)
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return sorted.sort((a, b) => b.review_count - a.review_count);
      default:
        return sorted;
    }
  }, [products, sortBy]);

  // Page title logic
  const getPageTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    if (categoryFilter) return categoryFilter;
    return 'Featured Products';
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-3">
      {/* Hero Banner — compact, products visible above the fold */}
      {!searchQuery && !categoryFilter && (
        <div className="relative rounded-lg overflow-hidden mb-4 bg-gradient-to-r from-[#0F1B2D] via-[#1A2744] to-[#0F1B2D]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] bg-repeat" />
          </div>
          <div className="relative flex items-center justify-center text-center px-6 py-8 md:py-10">
            <div>
              <h1 className="text-white text-xl md:text-3xl font-bold mb-1.5">
                Welcome to <span className="text-[#FF9900]">ShopHub</span>
              </h1>
              <p className="text-gray-400 text-xs md:text-sm max-w-md mx-auto">
                Discover amazing deals on electronics, books, clothing, and more.
                <span className="text-[#FF9900] font-semibold"> Free delivery</span> on orders over $25.
              </p>
            </div>
          </div>
          <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-t from-[#EAEDED] to-transparent" />
        </div>
      )}

      {/* Category chips */}
      {!searchQuery && (
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          {['All', 'Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports'].map(
            (cat) => {
              const isActive =
                (cat === 'All' && !categoryFilter) || categoryFilter === cat;
              const href = cat === 'All' ? '/' : `/?category=${encodeURIComponent(cat)}`;
              return (
                <a
                  key={cat}
                  href={href}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-[#131921] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
                    }
                  `}
                >
                  {cat}
                </a>
              );
            }
          )}
        </div>
      )}

      {/* Results header + Sort */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{getPageTitle()}</h2>
          {!loading && !error && (
            <p className="text-xs text-gray-500 mt-0.5">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>

        {/* Sort dropdown — differentiator feature */}
        {!loading && !error && products.length > 1 && (
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-gray-500 hidden sm:block">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white shadow-sm focus:ring-2 focus:ring-[#FF9900] focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center my-4">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-red-700 font-medium text-sm">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-3 px-5 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] rounded-full text-sm font-medium transition-colors shadow-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && <ProductGridSkeleton count={10} />}

      {/* Product grid */}
      {!loading && !error && sortedProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No products found</h3>
          <p className="text-gray-500 text-sm">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search.`
              : 'No products available in this category.'}
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] rounded-full text-sm font-medium transition-colors"
          >
            Browse All Products
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Home Page — Wraps HomeContent in Suspense for searchParams
 */
export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <ProductGridSkeleton count={10} />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
