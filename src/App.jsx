import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ListRequest from './pages/ListRequest';
import AddRequest from './pages/AddRequest';
// Import EditRequest jika kamu sudah membuatnya
// import EditRequest from './pages/EditRequest'; 

function App() {
  // Gunakan 'access_token' agar sinkron dengan login dan list
  const isAuthenticated = () => {
    return localStorage.getItem('access_token') !== null;
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
        
        <Route 
          path="/add" 
          element={isAuthenticated() ? <AddRequest /> : <Navigate to="/login" />} 
        />

        {/* Route Edit dengan parameter id */}
        <Route 
          path="/edit/:id" 
          element={isAuthenticated() ? <AddRequest /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;