// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [devis, setDevis] = useState([]);
  const [factures, setFactures] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtrePaiement, setFiltrePaiement] = useState("all");

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: devisData } = await supabase
        .from("devis")
        .select("*")
        .eq("user_id", user.id);

      const { data: facturesData } = await supabase
        .from("factures")
        .select("*")
        .eq("user_id", user.id);

      setDevis(devisData || []);
      setFactures(facturesData || []);
      setLoading(false);
    };

    fetchStats();
  }, []);

  const getMonthlyStats = (data, key) => {
    const grouped = {};
    data.forEach((item) => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!grouped[monthKey]) grouped[monthKey] = 0;
      grouped[monthKey] += parseFloat(item[key]);
    });
    return Object.entries(grouped)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const monthlyCA = getMonthlyStats(factures, "total_ttc");

  const groupByCount = (data, type) => {
    const grouped = {};
    data.forEach((item) => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!grouped[key]) grouped[key] = { month: key, devis: 0, factures: 0 };
      grouped[key][type]++;
    });
    return Object.values(grouped).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  };

  const chartData = groupByCount(devis, "devis").map((item) => {
    const match = groupByCount(factures, "factures").find(
      (x) => x.month === item.month
    );
    return {
      month: item.month,
      devis: item.devis,
      factures: match?.factures || 0,
    };
  });

  const devisThisMonth = devis.filter((d) => {
    const date = new Date(d.date);
    return (
      date.getMonth() + 1 === currentMonth &&
      date.getFullYear() === currentYear
    );
  }).length;

  const totalThisMonth = factures
    .filter((f) => {
      const date = new Date(f.date);
      return (
        date.getMonth() + 1 === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((acc, f) => acc + parseFloat(f.total_ttc), 0);

  const facturesFiltrees = factures.filter((f) => {
    if (filtrePaiement === "paid") return f.is_paid;
    if (filtrePaiement === "unpaid") return !f.is_paid;
    return true;
  });

  const last5 = [...facturesFiltrees]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Chargement du dashboard...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-6xl mx-auto mt-10 p-4 space-y-12"
    >
      <h2 className="text-4xl font-extrabold text-[#334155]">📊 Tableau de bord</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card label="📄 Devis ce mois" value={devisThisMonth} />
        <Card label="💶 Factures ce mois" value={`${totalThisMonth.toFixed(2)} €`} />
        <Card label="🧾 Factures totales" value={factures.length} />
      </div>

      <section>
        <h3 className="text-2xl font-semibold text-[#334155] mb-4">📈 Activité mensuelle</h3>
        <div className="h-80 bg-white rounded-2xl border border-[#E5E7EB] shadow-md p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="devis" fill="#3B82F6" name="Devis" />
              <Bar dataKey="factures" fill="#10B981" name="Factures" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-[#334155] mb-4">💰 Chiffre d'affaires mensuel (€)</h3>
        <div className="h-80 bg-white rounded-2xl border border-[#E5E7EB] shadow-md p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyCA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#F59E0B" name="CA (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-[#334155] mb-4">🧾 Dernières factures</h3>

        <div className="flex gap-3 mb-6">
          {["all", "paid", "unpaid"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltrePaiement(f)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                filtrePaiement === f
                  ? f === "paid"
                    ? "bg-green-600 text-white"
                    : f === "unpaid"
                    ? "bg-red-600 text-white"
                    : "bg-[#3B82F6] text-white"
                  : "bg-[#E5E7EB] text-gray-600 hover:bg-[#D1D5DB]"
              }`}
            >
              {f === "all" ? "Toutes" : f === "paid" ? "Payées" : "Non payées"}
            </button>
          ))}
        </div>

        <ul className="space-y-3">
          {last5.map((f) => (
            <li
              key={f.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E7EB] flex justify-between items-center"
            >
              <span className="font-medium text-[#334155]">{f.client}</span>
              <span>{f.total_ttc} €</span>
              <span className="text-sm text-gray-500">{f.date}</span>
              <span
                className={`text-sm font-semibold ${
                  f.is_paid ? "text-green-600" : "text-red-600"
                }`}
              >
                {f.is_paid ? "Payée" : "Non payée"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </motion.div>
  );
}

// Card component
function Card({ label, value }) {
  return (
    <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-[#334155] mt-2">{value}</p>
    </div>
  );
}
