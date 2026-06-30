import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddRequest = () => {
  const navigate = useNavigate();
  
  // State untuk menyimpan data inputan form
  const [title, setTitle] = useState('');
  const [productId, setProductId] = useState('');
  const [content, setContent] = useState('');
  
  // State untuk data dropdown produk, loading, dan pesan API
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Ambil daftar produk dari Product List API saat halaman dibuka
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch('http://192.168.0.199:9006/api/product/list?page=0', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        if (response.ok) {
          setProducts(result.data || []);
        } else {
          setErrorMsg('Gagal mengambil data produk.');
        }
      } catch (error) {
        setErrorMsg('Koneksi ke API produk bermasalah.');
      }
    };

    fetchProducts();
  }, []);

  // 2. Fungsi untuk menangani submit form (Simpan Request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    // Validasi minimal field wajib diisi (Sesuai Ketentuan PDF)
    if (!title.trim() || !productId || !content.trim()) {
      setErrorMsg('Semua kolom wajib diisi!');
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('access_token');

    const requestBody = {
      request_title: title,
      product_id: parseInt(productId),
      content: content,
      hospital_id: 1 // Data testing sesuai ketentuan PDF
    };

    try {
      const response = await fetch('http://192.168.0.199:9006/api/request/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (response.ok) {
        // Tampilkan pesan sukses dari API
        alert(result.message || 'Permintaan berhasil dikirim.');
        // Redirect kembali ke halaman list request
        navigate('/list');
      } else {
        setErrorMsg(result.message || 'Gagal menambahkan request baru.');
      }
    } catch (error) {
      setErrorMsg('Terjadi kesalahan koneksi server saat mengirim data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '25px', fontWeight: 'bold' }}>Tambah Request Baru</h2>

        {/* State Alert Pesan Sukses / Gagal */}
        {errorMsg && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{errorMsg}</div>}
        {message && <div style={{ color: '#155724', backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{message}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* Input Judul */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Title / Judul</label>
            <input 
              type="text" 
              placeholder="Contoh: Fitur Cetak Resep Otomatis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          {/* Dropdown Pilihan Produk (Dinamis dari API) */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Pilih Product</label>
            <select 
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', boxSizing: 'border-box' }}
            >
              <option value="">-- Pilih Product --</option>
              {products.map((prod) => (
                <option key={prod.product_id} value={prod.product_id}>
                  {prod.product_name}
                </option>
              ))}
            </select>
          </div>

          {/* Input Konten / Deskripsi */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Content / Deskripsi</label>
            <textarea 
              rows="5"
              placeholder="Tulis detail kebutuhan fitur di sini..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>

          {/* Tombol Aksi */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              disabled={isLoading}
              style={{ flex: 1, backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Request'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/list')}
              style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Batal
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddRequest;