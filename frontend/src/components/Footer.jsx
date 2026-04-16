'use client';

import Link from 'next/link';

/**
 * Footer — Site-wide footer with links and branding
 */
export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto">
      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-white text-sm py-3 transition-colors"
      >
        Back to top
      </button>

      {/* Footer links */}
      <div className="bg-[#232F3E] text-white">
        <div className="max-w-[1500px] mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-base mb-3">Get to Know Us</h4>
              <ul className="space-y-2 text-sm text-[#DDD]">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Press Releases</a></li>
                <li><a href="#" className="hover:underline">Science</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base mb-3">Connect with Us</h4>
              <ul className="space-y-2 text-sm text-[#DDD]">
                <li><a href="#" className="hover:underline">Facebook</a></li>
                <li><a href="#" className="hover:underline">Twitter</a></li>
                <li><a href="#" className="hover:underline">Instagram</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base mb-3">Make Money with Us</h4>
              <ul className="space-y-2 text-sm text-[#DDD]">
                <li><a href="#" className="hover:underline">Sell on ShopHub</a></li>
                <li><a href="#" className="hover:underline">Become an Affiliate</a></li>
                <li><a href="#" className="hover:underline">Advertise Products</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base mb-3">Let Us Help You</h4>
              <ul className="space-y-2 text-sm text-[#DDD]">
                <li><a href="#" className="hover:underline">Your Account</a></li>
                <li><a href="#" className="hover:underline">Returns Centre</a></li>
                <li><a href="#" className="hover:underline">Help</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#131A22] text-white">
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-white font-bold">Shop</span>
              <span className="text-[#FF9900] font-bold">Hub</span>
            </Link>
            <span className="text-gray-400">
              © {new Date().getFullYear()} ShopHub. All rights reserved. (Demo Project)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
