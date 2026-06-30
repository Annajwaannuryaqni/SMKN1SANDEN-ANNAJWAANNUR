import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function AddRequest() {
  const [title, setTitle] = useState('');
  const [productId, setProductId] = useState('');
  const [content, setContent] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Ambil daftar produk untuk pilihan dropdown form
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/product/list?page=0');
        setProducts(response.data?.data || []);
      } catch (err) {
        console.error('Gagal memuat produk:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Kirim data sesuai format spesifikasi dokumen halaman 13
      const response = await api.post('/api/request/create', {
        request_title: title,
        product_id: parseInt(productId),
        content: content,
        hospital_id: 1 // Data testing sesuai ketentuan dokumen
      });

      alert(response.data?.message || 'Permintaan berhasil dikirim!');
      navigate('/list'); // Kembali ke halaman dashboard utama
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambahkan request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2>Tambah Request Baru</h2>
      <hr style={{ border: 0, height: '1px', background: '#e0e0e0', margin: '15px 0 25px 0' }} />

      {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title / Judul</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Contoh: Fitur Cetak Resep Otomatis"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Pilih Product</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          >
            <option value="">-- Pilih Product --</option>
            {products.map((prod) => (
              <option key={prod.product_id} value={prod.product_id}>{prod.product_name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Content / Deskripsi</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Tulis detail kebutuhan fitur di sini..."
            rows="5"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Menyimpan...' : 'Simpan Request'}
          </button>
          <button type="button" onClick={() => navigate('/list')} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRequest;