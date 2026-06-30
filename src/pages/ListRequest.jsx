import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function ListRequest() {
  const [dataRequests, setDataRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State Filter sesuai dokumen Farmagitechs
  const [searchTitle, setSearchTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [productId, setProductId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchRequests();
  }, []);

  // Ambil daftar produk untuk dropdown filter
  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/product/list?page=0');
      setProducts(response.data?.data || []);
    } catch (err) {
      console.error('Gagal memuat produk:', err);
    }
  };

  // Ambil daftar request dengan parameter objek Axios yang benar
  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/request/list', {
        params: {
          page: 1,
          request_type: 'feature',
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          product_id: productId || undefined
        }
      });
      
      const result = response.data?.data || [];
      setDataRequests(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil data dari server.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setProductId('');
    setSearchTitle('');
    setTimeout(() => {
      fetchRequests();
    }, 50);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Filter pencarian lokal berdasarkan Title
  const displayedData = dataRequests.filter((item) =>
    (item.request_title || '').toLowerCase().includes(searchTitle.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Request List Dashboard</h2>
        {/* Header Halaman */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Request List Dashboard</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate('/add')} 
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Tambah Request Baru
          </button>
          <button 
            onClick={handleLogout} 
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Logout
          </button>
        </div>
      </div>
        <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>

      {/* Form Filter */}
      <form onSubmit={handleFilter} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', background: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <select 
          value={productId} 
          onChange={(e) => setProductId(e.target.value)} 
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          <option value="">-- Semua Product --</option>
          {products.map((prod) => (
            <option key={prod.product_id} value={prod.product_id}>{prod.product_name}</option>
          ))}
        </select>
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Filter</button>
        <button type="button" onClick={handleReset} style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reset</button>
        
        <input 
          type="text" 
          placeholder="Cari Title..." 
          value={searchTitle} 
          onChange={(e) => setSearchTitle(e.target.value)} 
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginLeft: 'auto', width: '200px' }}
        />
      </form>

      {/* Tabel Data */}
      {loading ? (
        <p>Sedang memuat data dari FG-Basement...</p>
      ) : error ? (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>{error}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#007bff', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>No</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Title</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Hospital Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Product</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Request Time</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.length > 0 ? (
              displayedData.map((item, index) => (
                <tr key={item.request_id || index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{index + 1}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: '500' }}>{item.request_title}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.hospital?.hospital_name || '-'}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.product?.product_name || '-'}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', backgroundColor: item.status === 'done' || item.status === 'accepted' ? '#d4edda' : '#fff3cd', color: item.status === 'done' || item.status === 'accepted' ? '#155724' : '#856404' }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{new Date(item.request_time).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <button style={{ padding: '5px 10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}>Lihat</button>
                    <button style={{ padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#777' }}>Data tidak ditemukan (Empty State)</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListRequest;