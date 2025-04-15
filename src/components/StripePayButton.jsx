import { loadStripe } from '@stripe/stripe-js'
import { useSession } from '@supabase/auth-helpers-react';
import { useState } from "react";

// Clé publique Stripe (test)
const stripePromise = loadStripe('pk_test_51RCmxxQOKF474V5SsGSpTnhr8ur5hlczohhgU4tBSNKNmC4xprzNLWfHaJUYqRjpUnKYN1O8YxSgHYPrbx3XddJc007K6r30uj') // 🔁 Remplace par ta vraie clé publique

export default function StripePayButton({ invoiceId, amount }) {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const handlePay = async () => {
    if (!session) {
        alert('Vous devez être connecté pour payer.');
        return;
      }
    try {
        setLoading(true);
      // Appelle la Supabase Edge Function pour créer une session de paiement
      const res = await fetch('https://ppvbuwkqthjwksakdyvh.supabase.co/functions/v1/create-checkout', 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ invoiceId, amount }),
        }
      );

      const data = await res.json();

      if (!data.id) {
        alert("❌ Erreur lors de la création de la session de paiement.");
        setLoading(false);
        return;
      }

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error("Erreur de paiement Stripe :", error);
      alert("❌ Une erreur est survenue lors du paiement.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          Paiement en cours...
        </>
      ) : (
        <>
          💳 Payer cette facture
        </>
      )}
    </button>
  );
}