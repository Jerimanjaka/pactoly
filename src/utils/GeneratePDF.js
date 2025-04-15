import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Tu peux laisser ceci vide ou commenter si tu n'as pas de logo
// const logoBase64 = 'data:image/png;base64,...';

const generatePDF = (devis,title) => {
  const doc = new jsPDF();

  // Si un logo est fourni en base64, on peut l'ajouter ici
  // if (logoBase64) {
  //   doc.addImage(logoBase64, 'PNG', 15, 10, 30, 30);
  // }

  // Titre du document
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text(title, 105, 20, { align: 'center' });

  // Informations client
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Client : ${devis.client || 'Inconnu'}`, 15, 50);
  doc.text(`Date : ${devis.date || new Date().toLocaleDateString()}`, 15, 60);

  // Description
  doc.text('Description :', 15, 80);
  doc.setFontSize(10);
  doc.text(devis.description || 'Aucune description fournie.', 15, 90);

  // Table des montants
  autoTable(doc, {
    startY: 110,
    head: [['Montant HT (€)', 'TVA (%)', 'Total TTC (€)']],
    body: [[
      (devis.montant_ht || 0).toFixed(2),
      (devis.tva || 0).toFixed(2),
      (devis.total_ttc || 0).toFixed(2),
    ]],
    styles: { halign: 'center' },
    headStyles: { fillColor: [22, 160, 133] },
  });

  // Pied de page
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.text(`Date : ${new Date().toLocaleDateString()}`, 15, pageHeight - 30);
  doc.text('Signature :', 15, pageHeight - 20);
  doc.line(40, pageHeight - 20, 100, pageHeight - 20);

  // Enregistrer le PDF
  doc.save(`Devis-${devis.client || 'client'}.pdf`);
};

export default generatePDF;
