import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import supabase from "../supabaseClient";
import { motion } from "framer-motion";
import generatePDF from '../utils/GeneratePDF'; // ✅ Import de la fonction PDF

export default function SignatureForm({ devisId, nomSignataire, onSigned }) {
  const sigRef = useRef();
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const clearSignature = () => {
    sigRef.current.clear();
    setSignatureUrl(null);
    setStatus(null);
  };

  const saveSignature = async () => {
    if (sigRef.current.isEmpty()) {
      setStatus("empty");
      return;
    }

    setLoading(true);
    setStatus(null);

    const dataUrl = sigRef.current.toDataURL();
    setSignatureUrl(dataUrl);
    const dateNow = new Date().toISOString();

    // Étape 1 : Mettre à jour le devis signé
    const { error: updateError } = await supabase
      .from("devis")
      .update({
        est_signe: true,
        date_signature: dateNow,
        nom_signataire: nomSignataire,
        signature_url: dataUrl,
        status: "signe"

      })
      .eq("id", devisId);

    if (updateError) {
      console.error("Erreur lors de l'enregistrement du devis signé :", updateError);
      setStatus("error");
      setLoading(false);
      return;
    }

    // Étape 2 : Récupérer le devis signé pour créer la facture
    const { data: devis, error: fetchError } = await supabase
      .from("devis")
      .select("*")
      .eq("id", devisId)
      .single();
      

    if (fetchError || !devis) {
      console.error("Erreur récupération devis :", fetchError);
      setStatus("error");
      setLoading(false);
      return;
    }

    convertirEnFacture(devis)

    // Étape 3 : Créer la facture
    /*
    const { error: factureError } = await supabase.from("factures").insert({
      devis_id: devis.id,
      client: devis.client,
      email: devis.email,
      description: devis.description,
      montant_ht: devis.montant_ht,
      tva: devis.tva,
      total_ttc: devis.total_ttc,
      date: new Date(),
    });

    if (factureError) {
      console.error("Erreur création facture :", factureError);
      setStatus("error");
    } else {
      setStatus("success");
      if (onSigned) onSigned(); // callback pour recharger ou notifier
    }
    */

    setLoading(false);
  };

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
      generatePDF(devis, "Devis signé")
      window.location.reload()
    }

    const { error: updateError } = await supabase
      .from("devis")
      .update({
        status: "facture"
      })
      .eq("id", devisId);

    if (updateError) {
      console.error("Erreur lors de l'enregistrement du devis signé :", updateError);
      setStatus("error");
      setLoading(false);
      return;
    }

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
          {loading ? "Enregistrement..." : "Valider la signature"}
        </button>
      </div>

      {status === "empty" && (
        <p className="text-sm text-red-600 mt-2">⚠️ Veuillez signer avant d’enregistrer.</p>
      )}
      {status === "success" && (
        <p className="text-sm text-green-600 font-medium mt-2">✅ Signature enregistrée & facture créée !</p>
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
