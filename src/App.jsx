import { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import TransactionTable from './components/TransactionTable/TransactionTable';
import TransactionForm from './components/TransactionForm/TransactionForm';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div>
      <Navbar />
      <TransactionForm
        categories={categories}
        onTransactionAdded={handleTransactionAdded}
      />
      <TransactionTable
        transactions={transactions}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default App;