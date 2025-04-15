// src/pages/SuccessPage.jsx

import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import supabase from "../supabaseClient";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const invoiceId = searchParams.get("invoice");

  useEffect(() => {
    const markInvoiceAsPaid = async () => {
      if (!invoiceId) {
        setStatus("missing");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("factures")
        .update({ is_paid: true })
        .eq("id", invoiceId);

      setStatus(error ? "error" : "success");
      setLoading(false);
    };

    markInvoiceAsPaid();
  }, [invoiceId]);

  const getContent = () => {
    if (loading) {
      return (
        <>
          <div className="text-4xl text-blue-400">⏳</div>
          <p className="text-[#334155]">Validation du paiement en cours...</p>
        </>
      );
    }

    switch (status) {
      case "success":
        return (
          <>
            <div className="text-5xl text-green-500">✅</div>
            <h2 className="text-xl font-bold text-green-600">
              Paiement confirmé !
            </h2>
            <p className="text-[#334155] text-sm">
              Merci pour votre règlement. La facture a été mise à jour.
            </p>
          </>
        );
      case "error":
        return (
          <>
            <div className="text-4xl text-red-500">❌</div>
            <h2 className="text-xl font-bold text-red-600">
              Une erreur est survenue
            </h2>
            <p className="text-[#334155] text-sm">
              Le paiement a été effectué mais la facture n’a pas pu être mise à jour.
            </p>
          </>
        );
      case "missing":
        return (
          <>
            <div className="text-4xl text-yellow-500">⚠️</div>
            <h2 className="text-xl font-bold text-yellow-600">
              Identifiant manquant
            </h2>
            <p className="text-[#334155] text-sm">
              Aucun identifiant de facture trouvé dans l’URL.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-xl border border-[#E5E7EB] text-center space-y-6"
    >
      <h1 className="text-2xl font-extrabold text-[#334155]">
        Confirmation de paiement
      </h1>

      {getContent()}

      <Link
        to="/dashboard"
        className="inline-block mt-6 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2 rounded-full font-medium transition-all shadow-md"
      >
        Retour au tableau de bord
      </Link>
    </motion.div>
  );
}
