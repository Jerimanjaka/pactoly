// src/utils/uploadPDFToSupabase.js

import supabase from "../supabaseClient";

/**
 * Upload un fichier PDF dans Supabase Storage
 * @param {Blob} blob - Fichier PDF
 * @param {string} path - Chemin du fichier ex: 'devis/devis-123.pdf'
 * @param {string} table - Nom de la table à mettre à jour
 * @param {string|number} id - ID de la ligne à mettre à jour
 * @returns {string|null} URL sécurisée ou null en cas d’erreur
 */
export default async function uploadPDFToSupabase(blob, path, table, token) {
  // 1. Upload vers le bucket "documents"
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(path, blob, {
      cacheControl: "3600",
      upsert: true,
      contentType: "application/pdf",
    });

  if (uploadError) {
    console.error("❌ Erreur d'upload :", uploadError);
    return null;
  }

  // 2. Générer un lien signé (ex. 30 jours)
  const { data: signedUrlData, error: urlError } = await supabase
    .storage
    .from("documents")
    .createSignedUrl(path, 60 * 60 * 24 * 30); // 30 jours

  if (urlError || !signedUrlData) {
    console.error("❌ Erreur URL signée :", urlError);
    return null;
  }

  // 3. Enregistrer ce lien dans ta table (colonne `pdf_url`)
  const { error: updateError } = await supabase
    .from(table)
    .update({ pdf_url: signedUrlData.signedUrl })
    .eq("lien_client", token);

  if (updateError) {
    console.error("❌ Erreur enregistrement dans la table :", updateError);
    return null;
  }

  return signedUrlData.signedUrl;
}