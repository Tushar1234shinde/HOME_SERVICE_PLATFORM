import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { Plus, Briefcase, Clock, DollarSign, CheckCircle, Package } from 'lucide-react';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGig, setNewGig] = useState({ title: '', description: '', price: '', category: 'Programming' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // We would fetch Vendor's ID first or pass user ID to a custom endpoint, 
      // but assuming the backend has a /gigs/vendor or we just get all and filter
      // Actually we have /api/orders/vendor/{vendorId}. 
      // But we need the vendor ID, not user ID. Our user object from auth gives userId.
      // Wait, let's just use the APIs we built.
      
      const ordersRes = await api.get(`/orders/vendor/${user.userId}`);
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data);
      }
      
      // Let's get gigs 
      const gigsRes = await api.get('/gigs?size=100'); // Fetch more for vendor dashboard or implement explicit endpoint later
      if (gigsRes.data.success) {
        // Filter gigs for current vendor
        setGigs(gigsRes.data.data.content.filter(g => g.vendorName === user.name));
      }
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGig = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      // In a real scenario, we'd need vendorId. 
      // We'll mock it if not available, or assume the backend sets it from token 
      // if it was modified, but our GigRequest requires vendorId.
      // We'll just pass a dummy vendorId or parse from some API
      
      const payload = {
        ...newGig,
        price: parseFloat(newGig.price),
        vendorId: user.userId // Note: Backend mapping required if UserID != VendorID
      };
      
      await api.post('/gigs', payload);
      setIsModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      alert("Error creating gig. Vendor ID mapping check required backend.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Vendor Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, manage your services and orders.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create New Gig
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary-color)' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Active Gigs</p>
              <h3 style={{ fontSize: '1.5rem' }}>{gigs.length}</h3>
            </div>
          </div>
        </Card>
        
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--success-color)' }}>
              <Package size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Orders</p>
              <h3 style={{ fontSize: '1.5rem' }}>{orders.length}</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--warning-color)' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Estimated Earnings</p>
              <h3 style={{ fontSize: '1.5rem' }}>
                ${orders.reduce((acc, order) => acc + (order.status === 'COMPLETED' ? order.price : 0), 0).toFixed(2)}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Orders</h2>
      <Card style={{ padding: '0' }}>
        {loading ? (
           <div style={{ padding: '3rem', textAlign: 'center' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
           <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No orders yet. Start promoting your gigs!</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Service</th>
                <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Client</th>
                <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Price</th>
                <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{order.serviceTitle}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{order.clientName}</td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>${order.price}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      backgroundColor: order.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color: order.status === 'COMPLETED' ? 'var(--success-color)' : 'var(--warning-color)'
                    }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Gig">
        <form onSubmit={handleCreateGig}>
          <Input 
            label="Gig Title" 
            placeholder="I will build a React app..." 
            value={newGig.title}
            onChange={(e) => setNewGig({...newGig, title: e.target.value})}
            required
          />
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Category</label>
            <select 
              value={newGig.category}
              onChange={(e) => setNewGig({...newGig, category: e.target.value})}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
            >
              {['Programming', 'Design', 'Marketing', 'Writing', 'Video', 'Audio'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Input 
            label="Price ($)" 
            type="number" 
            placeholder="99.00" 
            value={newGig.price}
            onChange={(e) => setNewGig({...newGig, price: e.target.value})}
            required
          />
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Description</label>
            <textarea 
               value={newGig.description}
               onChange={(e) => setNewGig({...newGig, description: e.target.value})}
               placeholder="Describe your service in detail..."
               style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical', minHeight: '100px' }}
               required
            ></textarea>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={creating}>Publish Gig</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VendorDashboard;
