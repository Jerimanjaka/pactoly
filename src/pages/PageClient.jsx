// src/pages/PageClient.jsx

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import SignatureForm from '../components/SignatureForm';
import { motion } from 'framer-motion';

export default function PageClient() {
  const { token } = useParams();
  const [devis, setDevis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevis = async () => {
      const { data, error } = await supabase
        .from('devis')
        .select('*')
        .eq('lien_client', token)
        .single();

      if (error) {
        console.error('❌ Erreur de récupération du devis :', error);
      } else {
        setDevis(data);
      }

      setLoading(false);
    };

    fetchDevis();
  }, [token]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Chargement du devis...</p>;

  if (!devis)
    return <p className="text-center mt-10 text-red-500">❌ Devis introuvable.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-2xl mx-auto mt-10 p-6 bg-white border border-[#E5E7EB] shadow-xl rounded-2xl space-y-6"
    >
      <h1 className="text-3xl font-extrabold text-[#334155]">
        📄 Devis #{devis.id.toString().slice(0, 6)}
      </h1>

      <div className="text-[#334155] space-y-2">
        <p>
          <span className="text-gray-500 font-medium">Client :</span>{' '}
          {devis.client}
        </p>
        <p>
          <span className="text-gray-500 font-medium">Date :</span>{' '}
          {new Date(devis.date).toLocaleDateString()}
        </p>
        <p>
          <span className="text-gray-500 font-medium">Description :</span>{' '}
          {devis.description}
        </p>
        <p>
          <span className="text-gray-500 font-medium">Montant HT :</span>{' '}
          {devis.montant_ht} €
        </p>
        <p>
          <span className="text-gray-500 font-medium">TVA :</span>{' '}
          {devis.tva} %
        </p>
        <p className="text-lg font-semibold text-[#3B82F6]">
          Total TTC : {devis.total_ttc} €
        </p>
      </div>

      {!devis.est_signe ? (
        <>
          <hr className="my-6" />
          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-md">
            <p className="text-yellow-700 font-medium">
              ✍️ Ce devis est en attente de signature.
            </p>
          </div>

          <SignatureForm devisId={devis.id} nomSignataire={devis.client} />
        </>
      ) : (
        <div className="bg-green-50 border border-green-300 p-4 rounded-md text-center">
          <p className="text-green-700 font-medium">
            ✅ Ce devis a été signé le{' '}
            {new Date(devis.date_signature).toLocaleDateString()} par{' '}
            <strong>{devis.nom_signataire}</strong>
          </p>

          {devis.signature_url && (
            <img
              src={devis.signature_url}
              alt="Signature"
              className="mt-4 border rounded shadow-md mx-auto w-60"
            />
          )}
        </div>
      )}
    </motion.div>
  );
}
