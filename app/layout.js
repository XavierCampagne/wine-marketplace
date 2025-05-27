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
      setShowAgeModal(false); // Allow browsing without login for now
    }
  };

  return (
    <html lang="en">
      <body>
        {/* Navigation Bar */}
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Wine Marketplace
            </Link>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/catalogue" className="hover:underline">
                Catalogue
              </Link>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
              <Link href="/sell" className="hover:underline">
                Sell
              </Link>
              {user ? (
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="hover:underline"
                >
                  Sign Out
                </button>
              ) : (
                <Link href="/login" className="hover:underline">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Age Verification Modal */}
        {showAgeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Age Verification</h2>
              <p className="mb-4">You must be 21 or older to access this site.</p>
              <button
                onClick={handleAgeConfirm}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                I am 21 or older
              </button>
              <button
                onClick={() => window.location.href = 'https://www.google.com'}
                className="ml-4 text-gray-600 underline"
              >
                Leave
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}