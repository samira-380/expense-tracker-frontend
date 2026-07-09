import { useState, useEffect } from 'react';

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
     const response = await fetch('http://localhost:3000/api/transactions');

        if (!response.ok) {
          throw new Error('Veri çekilemedi');
        }

        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

     getData();
  }, []);

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (error) {
    return <p>Hata: {error}</p>;
  }

  if (transactions.length === 0) {
    return <p>Henüz hiç işlem yok.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Tutar</th>
          <th>Tip</th>
          <th>Kategori</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t._id}>
            <td>{t.amount}</td>
            <td>{t.type}</td>
            <td>{t.category?.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;