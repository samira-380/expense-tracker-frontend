function TransactionTable({ transactions, loading, error, onDelete }) {
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
          <th>İşlem</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t._id}>
            <td>{t.amount}</td>
            <td>{t.type}</td>
            <td>{t.category?.name}</td>
            <td>
              <button onClick={() => onDelete(t._id)}>Sil</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionTable;