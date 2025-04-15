// src/pages/NewDevis.jsx

import { useState } from 'react';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NewDevis() {
  const [client, setClient] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [montantHT, setMontantHT] = useState('');
  const [tva, setTva] = useState(20);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const totalTTC =
    montantHT && tva
      ? (parseFloat(montantHT) * (1 + tva / 100)).toFixed(2)
      : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { error } = await supabase.from('devis').insert({
      user_id: session.user.id,
      client,
      date,
      description,
      montant_ht: montantHT,
      tva,
      total_ttc: totalTTC,
    });

    if (error) {
      setMessage('❌ Erreur : ' + error.message);
    } else {
      setMessage('✅ Devis enregistré avec succès !');
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-[#E5E7EB]"
    >
      <h2 className="text-3xl font-extrabold text-center text-[#334155] mb-6">
        📝 Nouveau Devis
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nom du client"
          className="w-full border border-[#E5E7EB] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          required
        />
        <input
          type="date"
          className="w-full border border-[#E5E7EB] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <textarea
          placeholder="Description du service"
          className="w-full border border-[#E5E7EB] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Montant HT (€)"
          className="w-full border border-[#E5E7EB] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          value={montantHT}
          onChange={(e) => setMontantHT(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="TVA (%)"
          className="w-full border border-[#E5E7EB] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          value={tva}
          onChange={(e) => setTva(e.target.value)}
        />

        <div className="bg-[#F1F5F9] text-right text-[#334155] font-semibold px-4 py-2 rounded-lg">
          Total TTC : {totalTTC ? `${totalTTC} €` : '—'}
        </div>

        <button
          type="submit"
          className="w-full bg-[#3B82F6] hover:bg-[#6366F1] text-white py-2 rounded-lg font-medium shadow-md transition-all"
        >
          💾 Enregistrer le devis
        </button>
      </form>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center text-sm text-gray-600"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}
