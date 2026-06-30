import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // POST ke endpoint resmi Keycloak Farmagitechs
      const response = await api.post('/api/keycloak_auth/login', {
        username: username,
        password: password,
      });

      // Mengambil token sesuai hirarki: data -> token -> access_token
      const token = response.data?.data?.token?.access_token;

      if (token) {
        // Bersihkan token dari double quote jika ada, sesuai ketentuan soal
        const cleanToken = token.replace(/^"(.*)"$/, '$1');
        localStorage.setItem('token', cleanToken);
        
        alert('Login Berhasil!');
        navigate('/list');
      } else {
        setError('Format response sukses, tapi access_token tidak ditemukan.');
      }
    } catch (err) {
      // Menampilkan pesan error asli dari API jika gagal
      setError(err.response?.data?.message || 'Login gagal, periksa akun atau koneksi WiFi FG-Basement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '320px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#333' }}>Farmagitechs Test</h2>
        
        {error && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ width: '100%', padding: '12px', backgroundColor: '#0069d9', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Memuat...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}

export default Login;