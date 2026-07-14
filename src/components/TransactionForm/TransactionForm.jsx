import { useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL;
function TransactionForm({ categories, onTransactionAdded }) {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    paymentMethod: 'cash',
    date: '',
    userId: '64f1a2b3c4d5e6f7a8b9c0d1' // GEÇİCİ: login sistemi gelene kadar sabit
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // sayfanın yenilenmesini engeller

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Kayıt eklenemedi');
      }

      const savedTransaction = await response.json();

      onTransactionAdded(savedTransaction); // parent'a (App.jsx) haber ver, listeyi güncelle

      // formu sıfırla
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        paymentMethod: 'cash',
        date: '',
        userId: '64f1a2b3c4d5e6f7a8b9c0d1'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:flex-wrap gap-4 md:items-end">      <div>
        <label>Tutar</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0"
        />
      </div>

      <div>
        <label>Tip</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="expense">Gider</option>
          <option value="income">Gelir</option>
        </select>
      </div>

      <div>
        <label>Kategori</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Seçiniz</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
  <label>Ödeme Yöntemi</label>
  <select
    name="paymentMethod"
    value={formData.paymentMethod}
    onChange={handleChange}
  >
    <option value="cash">Nakit</option>
    <option value="credit_card">Kredi Kartı</option>
    <option value="bank_transfer">Banka Transferi</option>
  </select>
</div>

      <div>
        <label>Tarih</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </div>

      {error && <p style={{ color: 'red' }}>Hata: {error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Ekleniyor...' : 'Ekle'}
      </button>
    </form>
  );
}

export default TransactionForm;