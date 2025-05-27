'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import '../globals.css';

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [showAgeModal, setShowAgeModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user || !user.user_metadata?.is_over_21) {
        setShowAgeModal(true);
      }
    };
    fetchUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && !session.user.user_metadata?.is_over_21) {
        setShowAgeModal(true);
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleAgeConfirm = async () => {
    if (user) {
      await supabase.auth.updateUser({ data: { is_over_21: true } });
      setShowAgeModal(false);
    } else {
      setShowAgeModal(false);
    }
  };

  return (
    <html lang="en">
      <body>
        {/* Fixed Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 bg-[#1a1a1a] text-white p-4 shadow-lg z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              🍷 Wine Marketplace
            </Link>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search wines..."
                className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
                disabled
              />
              <Link href="/" className="hover:text-[#800020] transition-colors">
                Home
              </Link>
              <Link href="/catalogue" className="hover:text-[#800020] transition-colors">
                Catalogue
              </Link>
              <Link href="/about" className="hover:text-[#800020] transition-colors">
                About Us
              </Link>
              <Link href="/sell" className="hover:text-[#800020] transition-colors">
                Sell
              </Link>
              {user ? (
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="hover:text-[#800020] transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <Link href="/login" className="hover:text-[#800020] transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Age Verification Modal */}
        {showAgeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white">Age Verification</h2>
              <p className="mb-4 text-gray-300">You must be 21 or older to access this site.</p>
              <button
                onClick={handleAgeConfirm}
                className="bg-[#800020] text-white px-4 py-2 rounded-lg hover:bg-[#a00030] transition-colors"
              >
                I am 21 or older
              </button>
              <button
                onClick={() => window.location.href = 'https://www.google.com'}
                className="ml-4 text-gray-400 underline hover:text-gray-200"
              >
                Leave
              </button>
            </div>
          </div>
        )}

        {/* Page Content with padding to account for fixed nav */}
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
