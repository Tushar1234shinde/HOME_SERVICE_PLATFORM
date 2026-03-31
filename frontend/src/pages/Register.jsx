import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { User, Mail, Lock, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CLIENT',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    
    if (result.success) {
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 4.5rem - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
        <Card>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Join FreelanceFuze</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Create an account to hire or work</p>
          </div>
          
          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} />
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div 
                onClick={() => setFormData({ ...formData, role: 'CLIENT' })}
                style={{ flex: 1, padding: '1rem', textAlign: 'center', borderRadius: 'var(--radius-md)', border: formData.role === 'CLIENT' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', cursor: 'pointer', backgroundColor: formData.role === 'CLIENT' ? 'var(--primary-light)' : 'transparent', transition: 'all 0.2s' }}
              >
                <div style={{ fontWeight: '600', color: formData.role === 'CLIENT' ? 'var(--primary-color)' : 'var(--text-primary)' }}>I'm a Client</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hiring talent</div>
              </div>
              <div 
                onClick={() => setFormData({ ...formData, role: 'VENDOR' })}
                style={{ flex: 1, padding: '1rem', textAlign: 'center', borderRadius: 'var(--radius-md)', border: formData.role === 'VENDOR' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', cursor: 'pointer', backgroundColor: formData.role === 'VENDOR' ? 'var(--primary-light)' : 'transparent', transition: 'all 0.2s' }}
              >
                <div style={{ fontWeight: '600', color: formData.role === 'VENDOR' ? 'var(--primary-color)' : 'var(--text-primary)' }}>I'm a Freelancer</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Looking for work</div>
              </div>
            </div>

            <Input
              label="Full Name *"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              leftIcon={<User size={18} />}
            />
            
            <Input
              label="Email Address *"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail size={18} />}
            />
            
            <Input
              label="Password *"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              leftIcon={<Lock size={18} />}
            />

            {formData.role === 'VENDOR' && (
              <div style={{ marginBottom: '1rem' }}>
                 <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>Professional Bio (Optional)</label>
                 <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell clients about your skills..."
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical', minHeight: '80px' }}
                 ></textarea>
              </div>
            )}
            
            <Button 
              type="submit" 
              fullWidth 
              isLoading={loading}
              style={{ marginTop: '0.5rem' }}
            >
              Create Account
            </Button>
          </form>
          
          <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Log in</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
