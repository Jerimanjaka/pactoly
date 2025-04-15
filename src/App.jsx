import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NewDevis from './pages/NewDevis';
import DevisList from './pages/DevisList';
import FacturesList from './pages/FactureList';
import ClientFacture from './pages/ClientFacture';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import PageClient from './pages/PageClient';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Routes protégées */}
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/devis/new" element={
          <PrivateRoute><NewDevis /></PrivateRoute>
        } />
        <Route path="/devis" element={
          <PrivateRoute><DevisList /></PrivateRoute>
        } />
        <Route path="/factures" element={
          <PrivateRoute><FacturesList /></PrivateRoute>
        } />
        <Route path="/client/facture/:uuid" element={<ClientFacture />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/client/:token" element={<PageClient />} />
      </Routes>
    </BrowserRouter>
  );
}
