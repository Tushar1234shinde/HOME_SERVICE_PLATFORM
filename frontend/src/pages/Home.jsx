import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { Search, MapPin, Star, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const categories = ['Programming', 'Design', 'Marketing', 'Writing', 'Video', 'Audio'];

  useEffect(() => {
    fetchGigs();
  }, [categoryFilter, page]);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      let endpoint = `/gigs?page=${page}&size=9`;
      if (categoryFilter) endpoint += `&category=${categoryFilter}`;
      if (minPrice) endpoint += `&minPrice=${minPrice}`;
      if (maxPrice) endpoint += `&maxPrice=${maxPrice}`;
      
      const response = await api.get(endpoint);
      if (response.data.success) {
        setGigs(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (err) {
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyPriceFilter = () => {
    setPage(0); // Reset to first page
    fetchGigs();
  };

  const handleBook = (gigId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // In a real flow, navigate to a Gig details/checkout page
    // Here we'll do a quick mock process if it's a client
    if (user?.role === 'CLIENT') {
      navigate('/client/dashboard', { state: { bookingGigId: gigId } });
    } else {
      alert("Only clients can book services!");
    }
  };

  const filteredGigs = gigs.filter(gig => 
    gig.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    gig.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Hero Section */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '5rem 0', borderBottom: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
        <div className="container animate-fade-in" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            Find the perfect <span className="text-primary">freelance</span> services for your business
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '1.5rem auto 2.5rem' }}>
            Work with talented people at the most affordable price to get the most out of your time and cost.
          </p>
          
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-primary)', padding: '0.5rem', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 1rem', position: 'relative' }}>
              <Search size={20} color="var(--text-tertiary)" style={{ position: 'absolute' }} />
              <input 
                type="text" 
                placeholder="What service are you looking for?" 
                style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.75rem 1rem 0.75rem 2.5rem', fontSize: '1rem', outline: 'none' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="lg" style={{ borderRadius: 'var(--radius-full)' }}>Search</Button>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', alignSelf: 'center' }}>Popular:</span>
            {categories.slice(0, 4).map(cat => (
              <button 
                key={cat} 
                className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`} 
                style={{ borderRadius: 'var(--radius-full)' }}
                onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,63,94,0.1) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }}></div>
      </section>

      {/* Services Section */}
      <section className="container" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Explore Services</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Discover the best talent for your next project</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
             <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
               <input 
                 type="number" 
                 placeholder="Min $" 
                 style={{ width: '80px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none' }}
                 value={minPrice}
                 onChange={(e) => setMinPrice(e.target.value)}
               />
               <span style={{ color: 'var(--text-secondary)' }}>-</span>
               <input 
                 type="number" 
                 placeholder="Max $" 
                 style={{ width: '80px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', outline: 'none' }}
                 value={maxPrice}
                 onChange={(e) => setMaxPrice(e.target.value)}
               />
               <Button variant="secondary" onClick={applyPriceFilter}>Filter Price</Button>
             </div>
             
             {(categoryFilter || minPrice || maxPrice) && (
              <Button variant="ghost" onClick={() => {
                 setCategoryFilter('');
                 setMinPrice('');
                 setMaxPrice('');
                 setPage(0);
                 setTimeout(fetchGigs, 0); // Need to wait for states to flush but this might be flakey - it's okay for now since we rely on useEffect for categoryFilter but not min/max yet
              }}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <div className="btn-spinner" style={{ borderTopColor: 'var(--primary-color)', width: '3rem', height: '3rem', borderWidth: '4px' }}></div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--error-color)' }}>{error}</div>
        ) : filteredGigs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-tertiary)' }}>
            <h3>No services found matching your criteria.</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {filteredGigs.map((gig) => (
              <Card key={gig.id} hoverable style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Thumbnail placeholder */}
                <div style={{ height: '180px', backgroundColor: 'var(--bg-tertiary)', position: 'relative' }}>
                   <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600 }}>
                     {gig.category}
                   </div>
                </div>
                
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontWeight: 700 }}>
                      {gig.vendorName.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{gig.vendorName}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', lineHeight: 1.4, cursor: 'pointer' }} className="text-primary hover">
                    {gig.title}
                  </h3>
                  
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {gig.description}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={16} fill="var(--warning-color)" color="var(--warning-color)" />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{gig.vendorRating > 0 ? gig.vendorRating : 'New'}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>STARTING AT</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>${gig.price}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '1rem' }}>
                    <Button fullWidth variant="primary" onClick={() => handleBook(gig.id)}>Book Now</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && filteredGigs.length > 0 && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '3rem' }}>
             <Button 
               variant="secondary" 
               disabled={page === 0}
               onClick={() => setPage(p => Math.max(0, p - 1))}
             >
               Previous
             </Button>
             <span style={{ fontWeight: 600 }}>Page {page + 1} of {totalPages}</span>
             <Button 
               variant="secondary" 
               disabled={page >= totalPages - 1}
               onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
             >
               Next
             </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
