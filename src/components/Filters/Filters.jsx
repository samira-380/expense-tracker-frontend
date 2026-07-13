function Filters({ categories, filters, onFilterChange }) {
  const handleChange = (e) => {
    onFilterChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    onFilterChange({ category: '', startDate: '', endDate: '' });
  };

  return (
<div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:items-center mb-4">      <label>Kategori</label>
      <select name="category" value={filters.category} onChange={handleChange}>
        <option value="">Tümü</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <label>Başlangıç Tarihi</label>
      <input
        type="date"
        name="startDate"
        value={filters.startDate}
        onChange={handleChange}
      />

      <label>Bitiş Tarihi</label>
      <input
        type="date"
        name="endDate"
        value={filters.endDate}
        onChange={handleChange}
      />

      <button type="button" onClick={handleReset}>
        Filtreleri Temizle
      </button>
    </div>
  );
}

export default Filters;