import { useState, useEffect, useMemo } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

function Dashboard({ transactions }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSummary = async () => {
      try {
const response = await fetch(`${API_URL}/api/summary`);
        if (!response.ok) throw new Error('Özet verisi çekilemedi');
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getSummary();
  }, [transactions]);

  // Line chart için: transactions'ı ay bazında grupla
  const monthlyData = useMemo(() => {
    const grouped = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = { income: 0, expense: 0 };
      }

      if (t.type === 'income') {
        grouped[monthKey].income += t.amount;
      } else {
        grouped[monthKey].expense += t.amount;
      }
    });

    const sortedMonths = Object.keys(grouped).sort();

    return {
      labels: sortedMonths,
      income: sortedMonths.map((m) => grouped[m].income),
      expense: sortedMonths.map((m) => grouped[m].expense)
    };
  }, [transactions]);

  if (loading) return <p>Dashboard yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;
  if (!summary) return null;

  const pieData = {
    labels: summary.categoryBreakdown.map((c) => c.categoryName),
    datasets: [
      {
        data: summary.categoryBreakdown.map((c) => c.total),
        backgroundColor: ['#FF5733', '#3498DB', '#4CAF50', '#FFC300', '#9B59B6', '#1ABC9C']
      }
    ]
  };

  const lineData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Gelir',
        data: monthlyData.income,
        borderColor: '#4CAF50',
        backgroundColor: '#4CAF50',
        tension: 0.3
      },
      {
        label: 'Gider',
        data: monthlyData.expense,
        borderColor: '#FF5733',
        backgroundColor: '#FF5733',
        tension: 0.3
      }
    ]
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>Dashboard</h2>

      <div style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
        <strong>Bakiye:</strong> {summary.balance} TRY
        <span style={{ marginLeft: '1rem', color: 'green' }}>
          Gelir: {summary.totalIncome}
        </span>
        <span style={{ marginLeft: '1rem', color: 'red' }}>
          Gider: {summary.totalExpense}
        </span>
      </div>

      {summary.categoryBreakdown.some((c) => c.isOverBudget) && (
        <div style={{ marginBottom: '1rem' }}>
          {summary.categoryBreakdown
            .filter((c) => c.isOverBudget)
            .map((c) => (
              <p key={c.categoryId} style={{ color: '#ff5555', fontWeight: 'bold' }}>
                ⚠️ {c.categoryName} kategorisinde bütçe limiti aşıldı! ({c.total} / {c.monthlyBudgetLimit} TRY)
              </p>
            ))}
        </div>
      )}

   <div className="flex flex-col md:flex-row gap-8">
        <div style={{ width: '300px' }}>
          <h3>Kategori Bazlı Harcama</h3>
          <Pie data={pieData} />
        </div>

        <div style={{ width: '400px' }}>
          <h3>Aylık Gelir/Gider Trendi</h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;