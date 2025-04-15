import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import supabase from './supabaseClient';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <div className="font-sans">
        <App />
      </div>
    </SessionContextProvider>
  </React.StrictMode>
);
