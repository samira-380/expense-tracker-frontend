function TransactionTable({ transactions, loading, error }) {
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