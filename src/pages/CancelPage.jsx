// src/pages/CancelPage.jsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CancelPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-xl border border-[#E5E7EB] text-center space-y-6"
    >
      <div className="text-4xl text-red-500">❌</div>

      <h1 className="text-2xl font-extrabold text-red-600">
        Paiement annulé
      </h1>

      <p className="text-[#334155] text-sm">
        Vous avez annulé le paiement de la facture.<br />
        Aucun montant n’a été débité.
      </p>

      <Link
        to="/dashboard"
        className="inline-block bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2 rounded-full font-medium transition-all shadow-md"
      >
        Retour au tableau de bord
      </Link>
    </motion.div>
  );
}
