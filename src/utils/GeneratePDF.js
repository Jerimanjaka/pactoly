import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// src/utils/uploadPDFToSupabase.js

import supabase from "../supabaseClient";

const generatePDF = async (devis, title = "Devis signé") => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Titre
  doc.setFontSize(18);
  doc.setTextColor(33, 37, 41);
  doc.text(title, pageWidth / 2, y, { align: 'center' });
  y += 10;

  // Infos Client
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text(`Client : ${devis.client || 'Inconnu'}`, 15, y += 10);
  doc.text(`Email : ${devis.email || '-'}`, 15, y += 8);
  doc.text(`Date de création : ${new Date(devis.date).toLocaleDateString()}`, 15, y += 8);
  if (devis.est_signe) {
    doc.text(`✔️ Signé le ${new Date(devis.date_signature).toLocaleDateString()} par ${devis.nom_signataire || devis.client}`, 15, y += 8);
  }

  // Description
  doc.setFontSize(12);
  doc.text('Description :', 15, y += 12);
  doc.setFontSize(10);
  doc.text(devis.description || 'Aucune description fournie.', 15, y += 8);

  // Table des montants
  autoTable(doc, {
    startY: y + 10,
    head: [['Montant HT (€)', 'TVA (%)', 'Total TTC (€)']],
    body: [[
      (devis.montant_ht || 0).toFixed(2),
      (devis.tva || 0).toFixed(2),
      (devis.total_ttc || 0).toFixed(2),
    ]],
    styles: {
      fontSize: 11,
      halign: 'center',
    },
    headStyles: {
      fillColor: [59, 130, 246], // bleu
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  });

  // Ajout de la signature si disponible
  if (devis.signature_url) {
    const img = new Image();
    img.src = devis.signature_url;

    await new Promise((resolve) => {
      img.onload = () => {
        const imgWidth = 80;
        const imgHeight = 30;
        const imgY = doc.lastAutoTable.finalY + 20;
        doc.text("✍️ Signature du client :", 15, imgY);
        doc.addImage(img, 'PNG', 15, imgY + 2, imgWidth, imgHeight);
        resolve();
      };
    });
  }

  // Pied de page
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(`Document généré le ${new Date().toLocaleDateString()}`, 15, footerY);

  doc.save(`Devis-${devis.client || 'client'}.pdf`);

  const blob = doc.output('blob');
  uploadPDFToSupabase(blob, `devis/devis-${devis.id}.pdf`, 'devis', devis.id);

};



/**
 * Upload un fichier PDF dans Supabase Storage
 * @param {Blob} blob - Fichier PDF
 * @param {string} path - Chemin du fichier ex: 'devis/devis-123.pdf'
 * @param {string} table - Nom de la table à mettre à jour
 * @param {string|number} id - ID de la ligne à mettre à jour
 * @returns {string|null} URL sécurisée ou null en cas d’erreur
 */
  async function uploadPDFToSupabase(blob, path, table, id) {
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
    .eq("id", id);

  if (updateError) {
    console.error("❌ Erreur enregistrement dans la table :", updateError);
    return null;
  }

  return signedUrlData.signedUrl;
}

export default generatePDF;
