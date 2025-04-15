// src/pages/FacturesList.jsx

import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import jsPDF from "jspdf";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import generatePDF from '../utils/GeneratePDF';

export default function FacturesList() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchFactures = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return;

      setUser(user);

      const { data, error } = await supabase
        .from("factures")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (!error) setFactures(data);
      setLoading(false);
    };

    fetchFactures();
  }, []);

  
 

  const sendEmail = (facture) => {
    const templateParams = {
      to_email: user.email,
      client: facture.client,
      date: facture.date,
      description: facture.description,
      montant_ht: facture.montant_ht,
      tva: facture.tva,
      total_ttc: facture.total_ttc,
      lien: `http://localhost:5173/client/facture/${facture.uuid_public}`,
    };

    emailjs
      .send(
        "service_vrqsjwh",
        "template_1obx9cr",
        templateParams,
        "JUneIbS-3A1L2n-oR"
      )
      .then(
        () => alert("✉️ Email envoyé avec succès !"),
        () => alert("❌ Échec de l'envoi")
      );
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">Chargement des factures...</p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto mt-10 p-6 space-y-8"
    >
      <h2 className="text-3xl font-extrabold text-[#334155]">💼 Mes Factures</h2>

      {factures.length === 0 ? (
        <p className="text-gray-500">Aucune facture pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {factures.map((f) => (
            <li
              key={f.id}
              className="bg-white border border-[#E5E7EB] p-5 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-lg text-[#334155]">
                  {f.client}
                </span>
                <span className="text-sm text-gray-500">{f.date}</span>
              </div>

              <p className="text-gray-700 text-sm mt-2">{f.description}</p>
              <p className="font-medium text-[#334155] mt-3">
                Total TTC : {f.total_ttc} €
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => generatePDF(f,'Facture')}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm px-4 py-2 rounded-full transition"
                >
                  Télécharger PDF
                </button>

                <button
                  onClick={() => sendEmail(f)}
                  className="bg-[#6366F1] hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-full transition"
                >
                  Envoyer par email
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
