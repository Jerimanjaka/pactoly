// src/pages/DevisList.jsx

import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';
import generatePDF from '../utils/GeneratePDF';
import { motion } from 'framer-motion';

export default function DevisList() {
  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchDevis = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from('devis')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (!error) setDevis(data);
      setLoading(false);
    };

    fetchDevis();
  }, []);

  const convertirEnFacture = async (devis) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from('factures').insert([
      {
        user_id: user.id,
        devis_id: devis.id,
        client: devis.client,
        email: devis.email,
        date: new Date().toISOString().split('T')[0],
        description: devis.description,
        montant_ht: devis.montant_ht,
        tva: devis.tva,
        total_ttc: devis.total_ttc,
      },
    ]);

    if (error) {
      alert('❌ Erreur lors de la conversion');
      console.error(error);
    } else {
      alert('✅ Devis converti en facture !');
    }
  };

  const sendEmail = async (devis) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const templateParams = {
      to_email: user.email,
      client: devis.client,
      date: devis.date,
      description: devis.description,
      montant_ht: devis.montant_ht,
      tva: devis.tva,
      total_ttc: devis.total_ttc,
      lien: `https://pactoly.vercel.app/client/${devis.lien_client}`,
    };

    console.log(templateParams);

    emailjs
      .send(
        "service_vrqsjwh",
        "template_p65u90g",
        templateParams,
        "JUneIbS-3A1L2n-oR"
      )
      .then(
        () => alert('✉️ Email envoyé avec succès !'),
        (err) => {
          alert("❌ Échec de l'envoi");
          console.error('FAILED...', err);
        }
      );
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Chargement des devis...
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-4xl mx-auto mt-10 p-6 space-y-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-[#334155]">📄 Mes Devis</h2>
        <Link
          to="/devis/new"
          className="bg-[#3B82F6] hover:bg-[#6366F1] text-white px-5 py-2 rounded-full text-sm font-medium shadow transition-all"
        >
          ➕ Nouveau devis
        </Link>
      </div>

      {devis.length === 0 ? (
        <p className="text-gray-500">Aucun devis pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {devis.map((d) => (
            <li
              key={d.id}
              className="bg-white border border-[#E5E7EB] p-5 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-lg text-[#334155]">
                  {d.client}
                </span>
                <span className="text-sm text-gray-500">{d.date}</span>
              </div>

              <p className="text-gray-700 text-sm mt-2">{d.description}</p>
              <p className="font-medium text-[#334155] mt-3">
                Total TTC : {d.total_ttc} €
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => convertirEnFacture(d)}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-full transition"
                >
                  Convertir en facture
                </button>

                <button
                  onClick={() => generatePDF(d,'DEVIS')}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm px-4 py-2 rounded-full transition"
                >
                  Télécharger PDF
                </button>

                <button
                  onClick={() => sendEmail(d)}
                  className="bg-[#6366F1] hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-full transition"
                >
                  Envoyer par email
                </button>

                <Link
                  to={`/client/${d.lien_client}`}
                  target="_blank"
                  className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-full transition"
                >
                  Voir comme client
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
