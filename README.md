# 📄 Doclify – Gestion de devis & factures (SaaS)

**Doclify** est une application SaaS moderne pour gérer facilement les devis, les factures, les paiements et les clients. Conçue pour les freelances, TPE et PME, elle permet de créer, envoyer et suivre les documents professionnels en toute simplicité.

---

## 🚀 Démo en ligne

👉 [https://pactoly.vercel.app](https://pactoly.vercel.app)

---

## 🧰 Stack technique

- ⚛️ **React** + **Vite**
- 🐳 **Docker** + `docker-compose`
- 🛠️ **Supabase** – Authentification & base de données
- 📧 `emailjs` – Envoi d'e-mails
- 📄 `jsPDF` – Génération de PDF
- 📊 `recharts` – Visualisation graphique

---

## 📦 Fonctionnalités

### 🔐 Authentification
- Connexion par e-mail / mot de passe
- Redirection automatique après connexion
- Déconnexion
- Protection des routes avec PrivateRoute

### 🧾 Devis
- Liste des devis
- Création d’un nouveau devis (client, montant HT, TVA, total TTC)
- Export en PDF
- Envoi du devis par email
- Affichage du devis en mode "client"
- Conversion d’un devis en facture

### 📑 Factures
- Liste des factures
- Export PDF
- Envoi par e-mail

### 📊 Dashboard
- KPIs (nombre de devis/factures, total facturé)
- Graphiques mensuels (chiffre d’affaires, évolution)
- Liste des 5 dernières factures

### 💳 Paiement
- Intégration **Stripe** pour les paiements en ligne

---

## 🧪 Lancer l’application en local

1. **Cloner le dépôt :**

```bash
git clone https://github.com/ton-compte/doclify.git
cd doclify
