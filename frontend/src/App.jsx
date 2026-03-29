import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Placeholder Pages for Router Setup
const Home = () => (
  <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
      Find the perfect <span className="text-primary">freelance</span> services for your business
    </h1>
    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
      Work with talented people at the most affordable price to get the most out of your time and cost.
    </p>
  </div>
);
const Login = () => <div className="container" style={{ padding: '2rem 1.5rem' }}><h2>Login Page</h2></div>;
const Register = () => <div className="container" style={{ padding: '2rem 1.5rem' }}><h2>Register Page</h2></div>;
const VendorDashboard = () => <div className="container" style={{ padding: '2rem 1.5rem' }}><h2>Vendor Dashboard</h2></div>;
const ClientDashboard = () => <div className="container" style={{ padding: '2rem 1.5rem' }}><h2>Client Dashboard</h2></div>;

// Route guards
const ProtectedRoute = ({ children, roleRequired }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/vendor/dashboard" element={
                <ProtectedRoute roleRequired="VENDOR">
                  <VendorDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/client/dashboard" element={
                <ProtectedRoute roleRequired="CLIENT">
                  <ClientDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          
          <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <p>&copy; 2026 FreelanceFuze. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
