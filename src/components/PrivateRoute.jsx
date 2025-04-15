import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

export default function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data?.user);
    };
    checkSession();
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-center mt-10">⏳ Vérification de l'accès...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}
