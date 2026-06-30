import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ListRequest from './pages/ListRequest';
import AddRequest from './pages/AddRequest'; // <-- Tambahkan import ini

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/list" 
          element={isAuthenticated() ? <ListRequest /> : <Navigate to="/login" />} 
        />
        
        {/* Tambahkan Route Baru untuk Tambah Data */}
        <Route 
          path="/add" 
          element={isAuthenticated() ? <AddRequest /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;