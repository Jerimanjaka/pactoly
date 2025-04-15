import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
      ease: 'easeOut',
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans">
      
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-6 py-4 fixed top-0 left-0 z-50 backdrop-blur-md bg-white/70 border-b border-[#E5E7EB] shadow-sm">
        <div className="text-xl font-extrabold text-[#334155] tracking-tight">Doclify</div>
        <Link
          to="/login"
          className="text-sm text-[#334155] hover:text-[#3B82F6] transition font-medium"
        >
          Se connecter
        </Link>
      </nav>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center px-6 pt-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center max-w-3xl space-y-8"
        >
          {/* Badge */}
          <motion.div variants={item}>
            <span className="inline-block text-sm bg-[#C7D2FE] text-[#3B82F6] px-3 py-1 rounded-full shadow-sm">
              🚀 Nouveauté : Paiement en ligne disponible
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={item}
            className="text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#6366F1] animate-pulse-glow"
          >
            Doclify
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-2xl text-[#334155] font-light leading-relaxed"
          >
            Créez, gérez et envoyez vos{" "}
            <span className="font-semibold text-[#3B82F6]">devis</span>,{" "}
            <span className="font-semibold text-[#6366F1]">factures</span> et{" "}
            <span className="font-semibold text-[#6366F1]">contrats</span>{" "}
            en toute simplicité.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
          >
            <Link to="/signup">
              <button className="px-8 py-3 rounded-full bg-[#3B82F6] hover:bg-[#6366F1] text-white font-semibold text-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all">
                Créer un compte
              </button>
            </Link>

            <Link to="/login">
              <button className="px-8 py-3 rounded-full border border-[#E5E7EB] text-[#334155] hover:border-[#3B82F6] hover:text-[#3B82F6] transition font-medium text-lg">
                Se connecter
              </button>
            </Link>
          </motion.div>

          <motion.p variants={item} className="text-sm text-gray-500 pt-4">
            Aucun engagement. Interface professionnelle. 100% en ligne ✨
          </motion.p>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400 border-t border-[#E5E7EB]">
        © {new Date().getFullYear()} Doclify — Tous droits réservés.
      </footer>
    </div>
  );
}
