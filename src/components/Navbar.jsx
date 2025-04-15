// src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white shadow-sm border-b border-[#E5E7EB] sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-[#3B82F6] tracking-tight">
          Doclify
        </Link>

        {/* Links */}
        <div className="flex gap-6 text-sm text-[#334155] font-medium">
          {user && (
            <>
              <Link to="/dashboard" className="hover:text-[#3B82F6] transition">
                Dashboard
              </Link>
              <Link to="/devis" className="hover:text-[#3B82F6] transition">
                Devis
              </Link>
              <Link to="/factures" className="hover:text-[#3B82F6] transition">
                Factures
              </Link>
            </>
          )}
        </div>

        {/* Connexion / Déconnexion */}
        <div>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium transition-all shadow"
            >
              Déconnexion
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-1 rounded-full text-sm font-medium transition-all shadow"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
