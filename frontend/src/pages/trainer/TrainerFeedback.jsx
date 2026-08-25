import { useState } from 'react';
import { mockTrainerFeedback } from '../../data/mockData';
import { MessageSquare, Star, Search, Filter, Check } from 'lucide-react';

const TrainerFeedback = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFeedback = mockTrainerFeedback.filter(f => {
    const matchesSearch = f.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === '5 Stars') return matchesSearch && f.rating === 5;
    if (activeFilter === '4 Stars') return matchesSearch && f.rating === 4;
    if (activeFilter === '< 4 Stars') return matchesSearch && f.rating < 4;
    return matchesSearch;
  });

  const avgRating = mockTrainerFeedback.length > 0 
    ? (mockTrainerFeedback.reduce((a, b) => a + b.rating, 0) / mockTrainerFeedback.length).toFixed(1)
    : 0;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Trainee Feedback</h1>
        <p style={{ color: 'var(--text-light)' }}>Review feedback submitted by trainees for your courses.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '50%' }}>
            <Star size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{avgRating}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Average Course Rating</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '50%' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{mockTrainerFeedback.length}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Total Responses</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', '5 Stars', '4 Stars', '< 4 Stars'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: `1px solid ${activeFilter === filter ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: activeFilter === filter ? 'var(--primary-light)' : 'var(--white)',
                  color: activeFilter === filter ? 'var(--primary)' : 'var(--text-light)',
                  fontWeight: activeFilter === filter ? 600 : 500,
                  cursor: 'pointer'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="search-bar" style={{ width: '250px' }}>
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search feedback..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} /> Filters
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredFeedback.map(f => (
            <div key={f.id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                <button className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={14} /> Mark Read
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'white', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {f.traineeName === 'Anonymous' ? 'A' : f.traineeName.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{f.traineeName}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{f.date} • {f.courseTitle}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2px', color: '#fbbf24', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ opacity: i < f.rating ? 1 : 0.3, fontSize: '1.2rem' }}>★</span>
                ))}
              </div>

              <p style={{ color: 'var(--text-dark)', lineHeight: 1.6, fontSize: '0.95rem' }}>"{f.comment}"</p>
            </div>
          ))}
          
          {filteredFeedback.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
              <MessageSquare size={40} style={{ color: 'var(--border-color)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-light)' }}>No feedback found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerFeedback;
