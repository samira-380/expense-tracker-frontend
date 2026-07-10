import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar/Navbar';
import TransactionTable from './components/TransactionTable/TransactionTable';
import TransactionForm from './components/TransactionForm/TransactionForm';
import Filters from './components/Filters/Filters';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });

  const getData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/transactions');
      if (!response.ok) throw new Error('Veri çekilemedi');
      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categories');
      if (!response.ok) throw new Error('Kategoriler çekilemedi');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getData();
    getCategories();
  }, []);

  const handleTransactionAdded = (newTransaction) => {
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu işlemi silmek istediğine emin misin?')) return;

    const previousTransactions = transactions;
    // Optimistic UI: önce ekrandan kaldır
    setTransactions((prev) => prev.filter((t) => t._id !== id));

    try {
      const response = await fetch(`http://localhost:3000/api/transactions/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Silinemedi');
    } catch (err) {
      // Hata olursa eski haline geri dön
      setTransactions(previousTransactions);
      alert('Silme başarısız oldu, tekrar deneyin.');
    }
  };

  // Filtrelenmiş listeyi hesapla — sadece transactions veya filters değişince yeniden hesaplanır
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.category && t.category?._id !== filters.category) {
        return false;
      }
      if (filters.startDate && new Date(t.date) < new Date(filters.startDate)) {
        return false;
      }
      if (filters.endDate && new Date(t.date) > new Date(filters.endDate)) {
        return false;
      }
      return true;
    });
  }, [transactions, filters]);

   return (
    <div className="app">
      <Navbar />
      <div className="dashboard-section">
        <Dashboard transactions={transactions} />
      </div>
      <div className="form-section">
        <TransactionForm
          categories={categories}
          onTransactionAdded={handleTransactionAdded}
        />
      </div>
      <div className="filters-section">
        <Filters
          categories={categories}
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>
      <div className="table-section">
        <TransactionTable
          transactions={filteredTransactions}
          loading={loading}
          error={error}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;