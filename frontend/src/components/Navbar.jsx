'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

/**
 * Navbar — Amazon-style navigation bar
 * Features: Logo, search bar with debounce, category filter, cart icon with badge
 */
export default function Navbar() {
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const debounceRef = useRef(null);

  // Debounced search — navigates to home with search query after 400ms
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (query.trim()) {
        router.push(`/?search=${encodeURIComponent(query.trim())}`);
      } else {
        router.push('/');
      }
    }, 400);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <nav className="bg-[#131921] sticky top-0 z-50 shadow-lg">
      {/* Top bar */}
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="flex items-center h-[60px] gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1 shrink-0 group mr-2"
            onClick={() => setSearchQuery('')}
          >
            <span className="text-white text-2xl font-bold tracking-tight group-hover:text-[#FF9900] transition-colors">
              Shop
            </span>
            <span className="text-[#FF9900] text-2xl font-bold">Hub</span>
          </Link>

          {/* Deliver to */}
          <div className="hidden lg:flex items-center text-white text-sm shrink-0 cursor-pointer hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1">
            <svg className="w-5 h-5 mr-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <div className="text-[#ccc] text-xs">Deliver to</div>
              <div className="font-bold text-sm leading-tight">India</div>
            </div>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 h-[40px] rounded-md overflow-hidden"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="flex-1 px-4 text-sm text-gray-900 bg-white border-none outline-none min-w-0 focus:ring-2 focus:ring-[#FF9900]"
            />
            <button
              type="submit"
              className="bg-[#FEBD69] hover:bg-[#F3A847] px-4 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-[#131921]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Account */}
          <div className="hidden md:flex flex-col text-white text-sm shrink-0 cursor-pointer hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1">
            <span className="text-xs text-[#ccc]">Hello, John</span>
            <span className="font-bold text-sm leading-tight">Account</span>
          </div>

          {/* Orders */}
          <div className="hidden md:flex flex-col text-white text-sm shrink-0 cursor-pointer hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1">
            <span className="text-xs text-[#ccc]">Returns</span>
            <span className="font-bold text-sm leading-tight">& Orders</span>
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className="flex items-center text-white shrink-0 hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 relative group"
          >
            <div className="relative">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF9900] text-[#131921] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="font-bold text-sm ml-1 hidden sm:block">Cart</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white ml-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Sub-nav bar with categories */}
      <div className="bg-[#232F3E] border-t border-[#3a4553]">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="flex items-center h-[39px] gap-1 overflow-x-auto scrollbar-hide text-sm">
            <Link href="/" className="text-white hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 whitespace-nowrap transition-all font-medium">
              All
            </Link>
            <Link href="/?category=Electronics" className="text-[#ddd] hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 whitespace-nowrap transition-all">
              Electronics
            </Link>
            <Link href="/?category=Books" className="text-[#ddd] hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 whitespace-nowrap transition-all">
              Books
            </Link>
            <Link href="/?category=Clothing" className="text-[#ddd] hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 whitespace-nowrap transition-all">
              Clothing
            </Link>
            <Link href="/?category=Home %26 Kitchen" className="text-[#ddd] hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 whitespace-nowrap transition-all">
              Home & Kitchen
            </Link>
            <Link href="/?category=Sports" className="text-[#ddd] hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1 whitespace-nowrap transition-all">
              Sports
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#232F3E] border-t border-[#3a4553] px-4 py-3 space-y-2">
          <Link href="/" className="block text-white text-sm py-2 hover:text-[#FF9900]" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="/cart" className="block text-white text-sm py-2 hover:text-[#FF9900]" onClick={() => setIsMenuOpen(false)}>
            Cart ({cartCount})
          </Link>
        </div>
      )}
    </nav>
  );
}
