// src/pages/ClientFacture.jsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import StripePayButton from "../components/StripePayButton";
import generatePDF from "../utils/GeneratePDF";
import { motion } from "framer-motion";

export default function ClientFacture() {
  const { uuid } = useParams();
  const [facture, setFacture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacture = async () => {
      const { data, error } = await supabase
        .from("factures")
        .select("*")
        .eq("uuid_public", uuid)
        .single();

      if (error) {
        console.error(error);
      } else {
        setFacture(data);
      }

      setLoading(false);
    };

    fetchFacture();
  }, [uuid]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Chargement de la facture...</p>
    );
  if (!facture)
    return (
      <p className="text-center mt-10 text-red-500">Facture introuvable.</p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl border border-[#E5E7EB]"
    >
      <h1 className="text-3xl font-extrabold text-[#334155] mb-6">
        🧾 Facture n°{facture.id}
      </h1>

      <div className="space-y-3 text-[#334155]">
        <p>
          <span className="font-medium text-gray-500">Client :</span>{" "}
          {facture.client}
        </p>
        <p>
          <span className="font-medium text-gray-500">Email :</span>{" "}
          {facture.email}
        </p>
        <p>
          <span className="font-medium text-gray-500">Description :</span>{" "}
          {facture.description}
        </p>
        <p>
          <span className="font-medium text-gray-500">Montant HT :</span>{" "}
          {facture.montant_ht} €
        </p>
        <p>
          <span className="font-medium text-gray-500">TVA :</span>{" "}
          {facture.tva} %
        </p>
        <p className="text-lg font-semibold text-[#334155] mt-4">
          Total TTC : {facture.total_ttc} €
        </p>
        <p className="text-sm text-gray-400 pt-2">
          Émise le : {new Date(facture.date).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <StripePayButton invoiceId={facture.id} amount={facture.total_ttc} />

        <button
          onClick={() => generatePDF(facture)}
          className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium text-sm py-2 rounded-lg shadow transition-all"
        >
          📄 Télécharger la facture PDF
        </button>
      </div>
    </motion.div>
  );
}
