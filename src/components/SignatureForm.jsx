// src/components/SignatureForm.jsx

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import supabase from "../supabaseClient";
import { motion } from "framer-motion";

export default function SignatureForm({ devisId, nomSignataire }) {
  const sigRef = useRef();
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const clearSignature = () => {
    sigRef.current.clear();
    setSignatureUrl(null);
  };

  const saveSignature = async () => {
    if (sigRef.current.isEmpty()) {
      setStatus("empty");
      return;
    }

    const dataUrl = sigRef.current.toDataURL();
    setSignatureUrl(dataUrl);
    setLoading(true);

    const { error } = await supabase
      .from("devis")
      .update({
        est_signe: true,
        date_signature: new Date().toISOString(),
        nom_signataire: nomSignataire,
        signature_url: dataUrl,
      })
      .eq("id", devisId);

    setLoading(false);

    setStatus(error ? "error" : "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-lg mx-auto bg-white border border-[#E5E7EB] rounded-2xl shadow-lg p-6 space-y-5"
    >
      <h2 className="text-xl font-bold text-[#334155]">✍️ Signature électronique</h2>
      <p className="text-sm text-gray-500">
        Merci de signer ce devis ci-dessous. Votre signature est juridiquement valable.
      </p>

      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{
          width: 500,
          height: 150,
          className: "border border-[#E5E7EB] rounded-lg w-full shadow-sm",
        }}
      />

      <div className="flex justify-between mt-2">
        <button
          onClick={clearSignature}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full transition font-medium"
        >
          Effacer
        </button>
        <button
          onClick={saveSignature}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-medium transition shadow"
        >
          {loading ? "Enregistrement..." : "Enregistrer la signature"}
        </button>
      </div>

      {status === "empty" && (
        <p className="text-sm text-red-600 mt-2">⚠️ Veuillez signer avant d’enregistrer.</p>
      )}
      {status === "success" && (
        <p className="text-sm text-green-600 font-medium mt-2">✅ Signature enregistrée avec succès.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 font-medium mt-2">❌ Une erreur est survenue.</p>
      )}

      {signatureUrl && (
        <div className="mt-5">
          <p className="text-sm text-gray-500 mb-1">Aperçu de la signature :</p>
          <img
            src={signatureUrl}
            alt="Signature"
            className="border rounded shadow-md w-60"
          />
        </div>
      )}
    </motion.div>
  );
}
