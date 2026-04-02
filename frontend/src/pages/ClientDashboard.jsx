import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Lock, CheckCircle, Clock, Star } from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Escrow / Booking state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [targetGigId, setTargetGigId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Review state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchOrders();
    // Auto open booking if navigated from Home
    if (location.state?.bookingGigId) {
      setTargetGigId(location.state.bookingGigId);
      setIsBookingModalOpen(true);
    }
  }, [location]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/client/${user.userId}`);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAndPayContext = async () => {
    setActionLoading(true);
    try {
      // 1. Create Order
      const orderRes = await api.post('/orders', {
        clientId: user.userId,
        serviceGigId: targetGigId
      });
      
      const newOrder = orderRes.data.data;
      
      // 2. Mock Escrow Payment
      await api.post('/payments/create', {
        orderId: newOrder.id,
        amount: newOrder.price,
        paymentMethodToken: 'tok_mock123'
      });
      
      setIsBookingModalOpen(false);
      fetchOrders();
      alert("Order booked successfully! Funds are held safely in Escrow.");
    } catch (error) {
      alert("Failed to process order/payment.");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveWork = async (order) => {
    if (!window.confirm("Approve this work and release funds from Escrow to the Vendor?")) return;
    
    try {
      // Update order to APPROVED
      await api.put(`/orders/${order.id}/status`, { status: 'APPROVED' });
      // Release Payment
      await api.post(`/payments/${order.id}/release`);
      fetchOrders();
      alert("Funds released to vendor successfully.");
    } catch (error) {
      alert("Failed to release funds.");
    }
  };

  const handleReviewSubmit = async () => {
    setActionLoading(true);
    try {
      await api.post('/reviews', {
        orderId: reviewOrder.id,
        rating,
        comment
      });
      alert("Review submitted successfully!");
      setIsReviewModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Client Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your orders and escrow payments safely.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary-color)' }}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Bookings</p>
              <h3 style={{ fontSize: '1.5rem' }}>{orders.length}</h3>
            </div>
          </div>
        </Card>
        
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--warning-color)' }}>
              <Lock size={24} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Funds in Escrow</p>
              <h3 style={{ fontSize: '1.5rem' }}>
                ${orders.filter(o => o.status === 'PAID' || o.status === 'IN_PROGRESS' || o.status === 'SUBMITTED').reduce((acc, o) => acc + o.price, 0).toFixed(2)}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Your Orders</h2>
      <Card style={{ padding: '0' }}>
        {loading ? (
           <div style={{ padding: '3rem', textAlign: 'center' }}>Loading orders...</div>
        ) : orders.length === 0 ? (
           <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No orders found. Start exploring gigs!</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Service</th>
                <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Vendor</th>
                <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Price</th>
                <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{order.serviceTitle}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{order.vendorName}</td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>${order.price}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       {order.status === 'COMPLETED' ? <CheckCircle size={16} color="var(--success-color)"/> : <Clock size={16} color="var(--warning-color)"/>}
                       <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{order.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {order.status !== 'COMPLETED' ? (
                      <Button size="sm" onClick={() => handleApproveWork(order)}>
                         Approve & Release Funds
                      </Button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Payment Released</span>
                        <Button size="sm" variant="secondary" onClick={() => { setReviewOrder(order); setIsReviewModalOpen(true); setRating(5); setComment(''); }}>
                           Leave Review
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="Secure Checkout">
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
           <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary-color)', marginBottom: '1rem' }}>
             <Lock size={32} />
           </div>
           <h3>Escrow Payment</h3>
           <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
             Your funds will be held securely in escrow by FreelanceFuze until you approve the work.
           </p>
           
           <Button fullWidth onClick={handleBookAndPayContext} isLoading={actionLoading}>
             Confirm Payment & Hire
           </Button>
           <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Mock integration. No real card charged.</p>
        </div>
      </Modal>

      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title={`Review ${reviewOrder?.vendorName}`}>
        <div style={{ padding: '1rem 0' }}>
           <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
             <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>How was your experience with <strong>{reviewOrder?.serviceTitle}</strong>?</p>
             <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
               {[1, 2, 3, 4, 5].map((star) => (
                 <Star 
                   key={star} 
                   size={32} 
                   fill={star <= rating ? "var(--warning-color)" : "transparent"} 
                   color={star <= rating ? "var(--warning-color)" : "var(--border-color)"}
                   style={{ cursor: 'pointer' }}
                   onClick={() => setRating(star)}
                 />
               ))}
             </div>
           </div>
           
           <div className="input-group">
             <label>Comment (Optional)</label>
             <textarea 
               rows="4" 
               className="input-field" 
               value={comment} 
               onChange={(e) => setComment(e.target.value)} 
               placeholder="Share details about your experience..."
               style={{ width: '100%', resize: 'vertical' }}
             />
           </div>
           
           <div style={{ marginTop: '2rem' }}>
             <Button fullWidth onClick={handleReviewSubmit} isLoading={actionLoading}>
               Submit Review
             </Button>
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientDashboard;
