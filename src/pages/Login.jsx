import { useState } from 'react';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(error ? error.message : "📩 Vérifie ta boîte mail pour confirmer l'inscription !");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setMessage(error ? error.message : '✅ Connecté avec succès !');
      if (!error) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-[#E5E7EB]"
      >
        {/* Titre & sous-titre */}
        <motion.div variants={item} className="text-center mb-6">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#6366F1] text-transparent bg-clip-text">
            {isSignUp ? 'Créer un compte' : 'Connexion'}
          </h1>
          <p className="text-sm text-gray-500 mt-2">Accède à ton espace Doclify</p>
        </motion.div>

        {/* Formulaire */}
        <motion.form variants={item} onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Adresse email"
            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#3B82F6] hover:bg-[#6366F1] text-white font-semibold py-2 rounded-lg shadow-md transition-all"
          >
            {isSignUp ? "S'inscrire" : 'Se connecter'}
          </button>
        </motion.form>

        {/* Message */}
        {message && (
          <motion.p variants={item} className="mt-4 text-center text-sm text-gray-600">
            {message}
          </motion.p>
        )}

        {/* Lien bascule */}
        <motion.div variants={item} className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage('');
            }}
            className="text-sm text-[#3B82F6] hover:underline"
          >
            {isSignUp
              ? 'Déjà un compte ? Se connecter'
              : "Pas encore de compte ? S'inscrire"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
