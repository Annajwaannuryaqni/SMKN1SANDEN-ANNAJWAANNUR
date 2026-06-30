import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ListRequest = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    fetch('http://192.168.0.199:9006/api/product/list?page=0', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(res => setProducts(res.data || []))
    .catch(() => console.log('Gagal load produk filter'));

    fetchData();
  }, []);

  const fetchData = async (prodId = '') => {
    setIsLoading(true);
    setErrorMsg('');
    const token = localStorage.getItem('access_token');
    
    let url = 'http://192.168.0.199:9006/api/request/list?page=1&request_type=feature';
    if (prodId) url += `&product_id=${prodId}`;

    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setRequests(result.data || []);
      } else {
        setErrorMsg('Gagal mengambil daftar request.');
      }
    } catch (error) {
      setErrorMsg('Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchData(selectedProduct);
  };

  const handleReset = () => {
    setSelectedProduct('');
    fetchData('');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
          <h2 style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>Daftar Request</h2>
          <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Logout
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => navigate('/add')} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Tambah Request
          </button>
          <button onClick={() => fetchData(selectedProduct)} style={{ backgroundColor: '#17a2b8', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            🔄 Refresh Data
          </button>
        </div>

        <form onSubmit={handleFilter} style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#f1f3f5', padding: '15px', borderRadius: '6px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057' }}>Filter Produk:</span>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px', backgroundColor: '#fff' }}>
            <option value="">Semua Product</option>
            {products.map(p => (
              <option key={p.product_id} value={p.product_id}>{p.product_name}</option>
            ))}
          </select>
          <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Filter</button>
          <button type="button" onClick={handleReset} style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Reset</button>
        </form>

        {errorMsg && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{errorMsg}</div>}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#e9ecef', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '12px', width: '50px' }}>No</th>
                <th style={{ padding: '12px' }}>Title</th>
                <th style={{ padding: '12px' }}>Hospital Name</th>
                <th style={{ padding: '12px' }}>Product</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Request Time</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Memuat data...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>Tidak ada data request.</td></tr>
              ) : (
                requests.map((req, index) => (
                  <tr key={req.request_id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{index + 1}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#007bff' }}>{req.request_title}</td>
                    <td style={{ padding: '12px' }}>{req.hospital?.hospital_name || 'RS Farmagi'}</td>
                    <td style={{ padding: '12px' }}>{req.product?.product_name || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ backgroundColor: req.status === 'accepted' ? '#d4edda' : '#fff3cd', color: req.status === 'accepted' ? '#155724' : '#856404', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{new Date(req.request_time).toLocaleDateString('id-ID')}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button onClick={() => navigate(`/edit/${req.request_id}`)} style={{ backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', marginRight: '5px', fontWeight: 'bold' }}>Edit</button>
                      <button style={{ backgroundColor: '#17a2b8', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Lihat</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListRequest;