import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  // State Management
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Validasi & Handler Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validasi input wajib diisi
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Username dan password wajib diisi!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://192.168.0.199:9006/api/keycloak_auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMsg('Login berhasil! Mengalihkan halaman...');
        
        // Mengambil token sesuai dengan format data dari Keycloak API di PDF
        const token = result.data?.token?.access_token;
        if (token) {
          // Menyimpan bearer token ke localStorage tanpa double quotes tambahan
          localStorage.setItem('access_token', token);
        }
        
        // Pindah ke halaman List Request setelah 1.5 detik
        setTimeout(() => {
          navigate('/list');
        }, 1500);
      } else {
        setErrorMsg(result.message || 'Login gagal! Silakan periksa kembali akun Anda.');
      }
    } catch (error) {
      setErrorMsg('Terjadi kesalahan koneksi. Pastikan Anda terhubung ke jaringan lokal.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
          <h2 style={styles.title}>Farmagitechs</h2>
          <p style={styles.subtitle}>Portal Integrasi Request Sistem Rumah Sakit</p>
        </div>

        {/* Notifikasi / Alert State */}
        {errorMsg && <div style={styles.alertError}>{errorMsg}</div>}
        {successMsg && <div style={styles.alertSuccess}>{successMsg}</div>}

        {/* Form Login */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Masukkan username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              disabled={isLoading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              backgroundColor: isLoading ? '#a2b9ff' : '#007bff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Sedang Memproses...' : 'Masuk ke Akun'}
          </button>
        </form>

        {/* Footer Card */}
        <div style={styles.footer}>
          <p style={styles.footerText}>Test Magang Frontend Developer • SMK N 1 Sanden</p>
        </div>
      </div>
    </div>
  );
};

// Clean Inline Styles Object
const styles = {
  container: {
    display: 'block',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f4f6f9',
    paddingTop: '10vh',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: '#ffffff',
    maxWidth: '420px',
    margin: '0 auto',
    padding: '35px 30px',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    boxSizing: 'border-box',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    margin: '0 0 5px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#333333',
    letterSpacing: '0.5px',
  },
  subtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#777777',
  },
  form: {
    display: 'block',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    marginTop: '10px',
    transition: 'background-color 0.2s',
  },
  alertError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '20px',
  },
  alertSuccess: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '20px',
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center',
    borderTop: '1px solid #eeeeee',
    paddingTop: '15px',
  },
  footerText: {
    margin: 0,
    fontSize: '11px',
    color: '#aaaaaa',
  },
};

export default Login;