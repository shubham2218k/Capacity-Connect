import { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle, 
  UserCheck, 
  Sparkles, 
  Search, 
  BookOpen, 
  Check, 
  Info,
  Building2,
  GraduationCap,
  AlertCircle,
  RefreshCw,
  X,
  Plus,
  Layers,
  Database
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const idOf = (item) => item?._id || item?.id;

// ── Rich Demo Dataset (For Presentation / Demonstration) ──────────────────────
const DEMO_SUBJECTS = [
  {
    id: 'demo_subj_1',
    title: 'Radar Systems & Severe Weather Detection',
    category: 'Meteorology & Sensing',
    skills: ['Doppler Radar Systems', 'Signal Processing', 'Reflectivity Analysis', 'Severe Storm Warning'],
    minExperience: 5,
    minQualification: "Master's / Ph.D.",
    targetTrainees: 64,
    description: 'Advanced operation of weather radar networks, Doppler velocity interpretation, and severe convection early warnings.'
  },
  {
    id: 'demo_subj_2',
    title: 'Meteorology & Atmospheric Dynamics',
    category: 'Atmospheric Sciences',
    skills: ['Atmospheric Dynamics', 'Numerical Weather Prediction', 'Synoptic Analysis', 'Climate Modeling'],
    minExperience: 4,
    minQualification: "Master's Degree",
    targetTrainees: 52,
    description: 'Core thermodynamic principles, synoptic scale forecasting models, and atmospheric circulation dynamics.'
  },
  {
    id: 'demo_subj_3',
    title: 'GIS & Geospatial Analysis',
    category: 'Geospatial Technology',
    skills: ['QGIS / ArcGIS', 'Spatial Analysis', 'Remote Sensing', 'Coordinate Systems'],
    minExperience: 3,
    minQualification: 'Bachelor / Master Degree',
    targetTrainees: 88,
    description: 'Spatial data modeling, vector/raster analysis, satellite imagery overlay, and thematic cartographic mapping.'
  },
  {
    id: 'demo_subj_4',
    title: 'Python Programming & Climate Analytics',
    category: 'Data & Analytics',
    skills: ['Python', 'Pandas & NumPy', 'NetCDF Climate Data', 'Data Visualization'],
    minExperience: 3,
    minQualification: 'Bachelor Degree',
    targetTrainees: 76,
    description: 'Handling multi-dimensional climate arrays (NetCDF/GRIB), automated time-series computation, and scientific plotting.'
  },
  {
    id: 'demo_subj_5',
    title: 'Oceanography & Marine Observation',
    category: 'Marine Sciences',
    skills: ['Oceanographic Sensors', 'Wave Dynamics', 'Bathymetry', 'Sea Surface Temperature'],
    minExperience: 5,
    minQualification: "Master's / Ph.D.",
    targetTrainees: 34,
    description: 'Ocean acoustic profiling, satellite altimetry, coastal surge modeling, and marine sensor calibration.'
  },
  {
    id: 'demo_subj_6',
    title: 'Disaster Risk Reduction & Emergency Management',
    category: 'Emergency Response',
    skills: ['Hazard Mapping', 'Vulnerability Assessment', 'Early Warning Systems', 'Crisis Communication'],
    minExperience: 4,
    minQualification: 'Master Degree',
    targetTrainees: 45,
    description: 'Community risk reduction frameworks, multi-hazard early warning dissemination, and emergency protocol deployment.'
  }
];

const DEMO_TRAINERS = [
  {
    id: 'demo_tnr_1',
    name: 'Dr. Rajesh Kumar',
    designation: 'Senior Radar Specialist & Research Fellow',
    organizationName: 'IMD - India Meteorological Department',
    qualification: 'Ph.D. in Atmospheric Radar Systems (IIT Delhi)',
    experience: 14,
    primaryDomains: ['Radar Systems & Severe Weather Detection', 'Meteorology & Atmospheric Dynamics'],
    expertise: ['Doppler Radar Systems', 'Signal Processing', 'Reflectivity Analysis', 'Severe Storm Warning', 'Numerical Weather Prediction', 'Python'],
    rating: 4.9,
    coursesDelivered: 16,
    email: 'rajesh.kumar@imd.gov.in'
  },
  {
    id: 'demo_tnr_2',
    name: 'Dr. Meera Nair',
    designation: 'Lead Remote Sensing & GIS Scientist',
    organizationName: 'NCMRWF / MoES',
    qualification: 'Ph.D. in Remote Sensing & Geospatial Tech',
    experience: 10,
    primaryDomains: ['GIS & Geospatial Analysis', 'Radar Systems & Severe Weather Detection'],
    expertise: ['Remote Sensing', 'QGIS / ArcGIS', 'Spatial Analysis', 'Reflectivity Analysis', 'Coordinate Systems', 'Satellite Imaging'],
    rating: 4.8,
    coursesDelivered: 12,
    email: 'meera.nair@moes.gov.in'
  },
  {
    id: 'demo_tnr_3',
    name: 'Rahul Verma',
    designation: 'Senior Data Scientist & Climate Analyst',
    organizationName: 'Capacity Connect Training Division',
    qualification: 'M.Tech in Computational Data Science',
    experience: 8,
    primaryDomains: ['Python Programming & Climate Analytics', 'GIS & Geospatial Analysis'],
    expertise: ['Python', 'Pandas & NumPy', 'NetCDF Climate Data', 'Data Visualization', 'Spatial Analysis', 'Signal Processing'],
    rating: 4.7,
    coursesDelivered: 9,
    email: 'rahul.verma@capacityconnect.org'
  },
  {
    id: 'demo_tnr_4',
    name: 'Dr. Ananya Sen',
    designation: 'Professor of Atmospheric & Hydro Sciences',
    organizationName: 'Indian Institute of Tropical Meteorology',
    qualification: 'Ph.D. in Dynamic Meteorology (IISc Bangalore)',
    experience: 16,
    primaryDomains: ['Meteorology & Atmospheric Dynamics', 'Disaster Risk Reduction & Emergency Management'],
    expertise: ['Atmospheric Dynamics', 'Numerical Weather Prediction', 'Synoptic Analysis', 'Climate Modeling', 'Hazard Mapping'],
    rating: 4.95,
    coursesDelivered: 22,
    email: 'ananya.sen@iitm.res.in'
  },
  {
    id: 'demo_tnr_5',
    name: 'Capt. Suresh Menon',
    designation: 'Oceanographic Survey & Marine Lead',
    organizationName: 'INCOIS - National Centre for Ocean Information',
    qualification: 'M.Sc. Oceanography & Coastal Engineering',
    experience: 12,
    primaryDomains: ['Oceanography & Marine Observation', 'Disaster Risk Reduction & Emergency Management'],
    expertise: ['Oceanographic Sensors', 'Wave Dynamics', 'Bathymetry', 'Sea Surface Temperature', 'Early Warning Systems'],
    rating: 4.85,
    coursesDelivered: 14,
    email: 'suresh.menon@incois.gov.in'
  },
  {
    id: 'demo_tnr_6',
    name: 'Anita Desai',
    designation: 'Emergency Preparedness & Risk Specialist',
    organizationName: 'National Disaster Management Authority',
    qualification: 'M.A. Public Policy & Disaster Mitigation',
    experience: 7,
    primaryDomains: ['Disaster Risk Reduction & Emergency Management'],
    expertise: ['Hazard Mapping', 'Vulnerability Assessment', 'Early Warning Systems', 'Crisis Communication', 'Spatial Analysis'],
    rating: 4.6,
    coursesDelivered: 7,
    email: 'anita.desai@ndma.gov.in'
  }
];

const CompetencyMapping = () => {
  const { user } = useAuth();
  
  // Real data state
  const [realCourses, setRealCourses] = useState([]);
  const [realTrainers, setRealTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mode: 'real' | 'demo'
  const [dataMode, setDataMode] = useState('real');

  // Demo interactive state
  const [demoSubjects, setDemoSubjects] = useState(DEMO_SUBJECTS);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedTrainersBySubject, setSelectedTrainersBySubject] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [profileModalTrainer, setProfileModalTrainer] = useState(null);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // New Demo Subject Form
  const [newSubject, setNewSubject] = useState({
    title: '',
    category: 'Meteorology & Sensing',
    skills: '',
    minExperience: 3,
    minQualification: "Master's Degree",
    description: ''
  });

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [courseRes, userRes] = await Promise.all([
        api.get('/courses').catch(() => ({ data: [] })),
        api.get('/admin/users').catch(() => ({ data: [] }))
      ]);

      const allCourses = Array.isArray(courseRes?.data) ? courseRes.data : [];
      const allUsers = Array.isArray(userRes?.data) ? userRes.data : [];

      const activeTrainers = allUsers.filter(u => u.role === 'Trainer' && u.status === 'active');

      setRealCourses(allCourses);
      setRealTrainers(activeTrainers);

      // Auto-select Demo Mode if real organization has insufficient competency items
      if (allCourses.length === 0 || activeTrainers.length === 0) {
        setDataMode('demo');
        setSelectedItemId(DEMO_SUBJECTS[0].id);
      } else {
        setSelectedItemId(idOf(allCourses[0]));
      }
    } catch (err) {
      console.error('Error loading real competency data:', err);
      setError(err.message || 'Failed to load real competency data.');
      setDataMode('demo');
      setSelectedItemId(DEMO_SUBJECTS[0].id);
    } finally {
      setLoading(false);
    }
  };

  // Determine active subjects/courses & trainers based on selected mode
  const activeItems = dataMode === 'demo' ? demoSubjects : realCourses;
  const activeTrainers = dataMode === 'demo' ? DEMO_TRAINERS : realTrainers;

  // Selected course or demo subject profile
  const selectedItem = activeItems.find(item => idOf(item) === selectedItemId) || activeItems[0] || null;

  // Helper to extract skills list for an item
  const getItemSkills = (item) => {
    if (!item) return [];
    if (Array.isArray(item.skills)) return item.skills.filter(Boolean);
    return [];
  };

  // Helper to extract trainer skills
  const getTrainerSkillsInfo = (trainer) => {
    if (dataMode === 'demo') {
      return { skills: trainer.expertise || [], isVerified: true };
    }
    const verified = trainer.verifiedExpertise || trainer.trainerReview?.verifiedExpertise;
    if (Array.isArray(verified) && verified.length > 0) {
      return { skills: verified, isVerified: true };
    }
    return { skills: Array.isArray(trainer.expertise) ? trainer.expertise : [], isVerified: false };
  };

  // Deterministic Skill Match Calculator
  const calculateMatch = (trainer, item) => {
    if (!item) return { score: 0, matchedSkills: [], missingSkills: [], hasDefinedSkills: false, isVerified: false, rationale: '' };

    const reqSkills = getItemSkills(item);
    const { skills: availableSkills, isVerified } = getTrainerSkillsInfo(trainer);

    if (reqSkills.length === 0) {
      return {
        score: 0,
        matchedSkills: [],
        missingSkills: [],
        hasDefinedSkills: false,
        isVerified,
        rationale: 'No skills defined for this course.'
      };
    }

    const matchedSkills = reqSkills.filter(req =>
      availableSkills.some(s => s.toLowerCase().trim() === req.toLowerCase().trim() ||
                                s.toLowerCase().includes(req.toLowerCase()) ||
                                req.toLowerCase().includes(s.toLowerCase()))
    );

    const missingSkills = reqSkills.filter(req => !matchedSkills.includes(req));
    
    let score = Math.round((matchedSkills.length / reqSkills.length) * 100);

    // Give slight experience bonus in demo mode calculation for realistic ranking
    if (dataMode === 'demo') {
      const exp = trainer.experience || 0;
      if (exp >= 10 && score > 0) score = Math.min(98, score + 10);
    }

    let rationale = '';
    if (matchedSkills.length === reqSkills.length) {
      rationale = `Matches all ${matchedSkills.length}/${reqSkills.length} required skills. Excellent instructor candidate.`;
    } else if (matchedSkills.length > 0) {
      rationale = `Matches ${matchedSkills.length}/${reqSkills.length} required skills. Partial domain coverage (${missingSkills.length} missing).`;
    } else {
      rationale = `No direct skill match found for this training area.`;
    }

    return {
      score,
      matchedSkills,
      missingSkills,
      hasDefinedSkills: true,
      isVerified,
      rationale
    };
  };

  // Ranked trainers
  const rankedTrainers = activeTrainers
    .map(trainer => ({
      trainer,
      match: calculateMatch(trainer, selectedItem)
    }))
    .filter(res => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = res.trainer.name.toLowerCase();
      const dept = (res.trainer.department || res.trainer.designation || res.trainer.organizationName || '').toLowerCase();
      const { skills } = getTrainerSkillsInfo(res.trainer);
      const skillMatch = skills.some(s => s.toLowerCase().includes(q));
      return name.includes(q) || dept.includes(q) || skillMatch;
    })
    .sort((a, b) => b.match.score - a.match.score);

  const handleSelectTrainer = (subjectId, trainerId) => {
    setSelectedTrainersBySubject(prev => ({ ...prev, [subjectId]: trainerId }));
  };

  const handleAddDemoSubject = (e) => {
    e.preventDefault();
    if (!newSubject.title.trim() || !newSubject.skills.trim()) return;

    const skillList = newSubject.skills.split(',').map(s => s.trim()).filter(Boolean);
    const created = {
      id: `demo_subj_${Date.now()}`,
      title: newSubject.title.trim(),
      category: newSubject.category,
      skills: skillList,
      minExperience: Number(newSubject.minExperience) || 3,
      minQualification: newSubject.minQualification,
      targetTrainees: 40,
      description: newSubject.description.trim() || 'Custom training area requirement.'
    };

    setDemoSubjects([created, ...demoSubjects]);
    setSelectedItemId(created.id);
    setShowAddSubjectModal(false);
    setNewSubject({ title: '', category: 'Meteorology & Sensing', skills: '', minExperience: 3, minQualification: "Master's Degree", description: '' });
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
      
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
              Competency & Skill Mapping
            </h1>

            {dataMode === 'demo' ? (
              <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}>
                <Sparkles size={13} /> Demo Competency Dataset
              </span>
            ) : (
              <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}>
                <Database size={13} /> Real Organization Data
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.9rem' }}>
            Map training requirements to qualified trainers ranked by Competency Match Score (%).
          </p>
        </div>

        {/* MODE TOGGLE SWITCH (REAL VS DEMO) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--white)', padding: '0.35rem 0.5rem', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <button
            onClick={() => {
              setDataMode('real');
              if (realCourses.length > 0) setSelectedItemId(idOf(realCourses[0]));
            }}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: dataMode === 'real' ? 'var(--primary)' : 'transparent',
              color: dataMode === 'real' ? 'white' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Database size={14} /> Real Organization Data
          </button>

          <button
            onClick={() => {
              setDataMode('demo');
              if (demoSubjects.length > 0) setSelectedItemId(demoSubjects[0].id);
            }}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: dataMode === 'demo' ? 'var(--secondary)' : 'transparent',
              color: dataMode === 'demo' ? 'white' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={14} /> Demo Data
          </button>
        </div>
      </div>

      {/* DEMO DATA INFORMATIONAL BANNER */}
      {dataMode === 'demo' && (
        <div style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', padding: '0.75rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: '#0369a1' }}>
          <Sparkles size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Demo Competency Dataset:</strong> Sample data used to demonstrate competency mapping and trainer matching.
          </div>
        </div>
      )}

      {error && dataMode === 'real' && (
        <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {loading && dataMode === 'real' ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-light)' }}>
          Loading real organization competency data...
        </div>
      ) : activeItems.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--text-light)' }}>
          <AlertCircle size={44} style={{ color: 'var(--secondary)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>
            No Competency Requirements Available
          </h3>
          <p style={{ maxWidth: '540px', margin: '0 auto 1.5rem', color: 'var(--text-muted)' }}>
            No competency requirements found for your organization. Switch to <strong>Demo Data</strong> to preview the competency mapping experience.
          </p>
          <button onClick={() => { setDataMode('demo'); setSelectedItemId(demoSubjects[0].id); }} className="btn btn-primary">
            Switch to Demo Data
          </button>
        </div>
      ) : (
        <>
          {/* SEARCH & SUBJECT SELECTION BAR */}
          <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', backgroundColor: 'var(--white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} style={{ color: 'var(--secondary)' }} /> Select Learning Requirement / Subject
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '500px', justifyContent: 'flex-end' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search trainer name or skill..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.85rem 0.5rem 2.4rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                {dataMode === 'demo' && (
                  <button onClick={() => setShowAddSubjectModal(true)} className="btn btn-outline" style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Plus size={14} /> Add Subject
                  </button>
                )}
              </div>
            </div>

            {/* Horizontal Selector (Safe scroll wrapper) */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', width: '100%', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
              {activeItems.map(item => {
                const itemId = idOf(item);
                const isSelected = itemId === selectedItemId;
                return (
                  <button
                    key={itemId}
                    onClick={() => setSelectedItemId(itemId)}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '20px',
                      border: isSelected ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'var(--secondary-bg)' : 'var(--white)',
                      color: isSelected ? 'var(--secondary-hover)' : 'var(--text-dark)',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <BookOpen size={14} style={{ color: isSelected ? 'var(--secondary)' : 'var(--text-muted)' }} />
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELECTED ITEM PROFILE CARD */}
          {selectedItem && (
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', borderLeft: '5px solid var(--secondary)', backgroundColor: 'var(--white)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                    {selectedItem.category || 'General'}
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                    {selectedItem.title}
                  </h2>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.35rem', maxWidth: '750px' }}>
                    {selectedItem.description || selectedItem.shortDescription || 'Organizational training requirement area.'}
                  </p>
                </div>

                {dataMode === 'demo' ? (
                  <div style={{ display: 'flex', gap: '1.5rem', backgroundColor: '#f8fafc', padding: '0.85rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem' }}>Min. Experience</span>
                      <strong style={{ color: 'var(--primary)' }}>{selectedItem.minExperience || 3}+ Years</strong>
                    </div>
                    <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                      <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem' }}>Target Trainees</span>
                      <strong style={{ color: 'var(--secondary-hover)' }}>{selectedItem.targetTrainees || 40} Active</strong>
                    </div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem' }}>Course Status</span>
                    <strong style={{ color: selectedItem.status === 'published' ? '#166534' : '#b45309', textTransform: 'capitalize' }}>
                      {selectedItem.status || 'Active'}
                    </strong>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                  Required Competency Skills:
                </p>
                {getItemSkills(selectedItem).length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {getItemSkills(selectedItem).map((skill, idx) => (
                      <span 
                        key={idx} 
                        style={{ 
                          padding: '0.35rem 0.75rem', 
                          backgroundColor: '#e0f2fe', 
                          color: '#0369a1', 
                          border: '1px solid #bae6fd', 
                          borderRadius: '6px', 
                          fontSize: '0.825rem', 
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <CheckCircle size={14} /> {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    Skills not defined.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* RANKED TRAINERS COMPETENCY MATCH SECTION */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} style={{ color: 'var(--secondary)' }} />
              Ranked Trainer Recommendations for {selectedItem?.title}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
              Showing {rankedTrainers.length} Trainer Profiles
            </span>
          </div>

          {rankedTrainers.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
              No trainers available for competency matching.
            </div>
          ) : (
            /* WIDE TABLE WRAPPER — SAFE SCROLL CONTAINER PREVENTS APP OVERFLOW */
            <div style={{ width: '100%', maxWidth: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)' }}>
              <table style={{ width: '100%', minWidth: '740px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Trainer Profile</th>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Expertise Level</th>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Matched Skills</th>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Missing / Capacity Gap</th>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Competency Match</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedTrainers.map(({ trainer, match }, index) => {
                    const tid = idOf(trainer);
                    const isSelectedForSubject = selectedTrainersBySubject[idOf(selectedItem)] === tid;

                    return (
                      <tr key={tid} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: isSelectedForSubject ? '#f0fdf4' : 'transparent', transition: 'background-color 0.15s' }}>
                        
                        {/* Trainer Profile */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: index === 0 ? 'var(--primary)' : 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem', flexShrink: 0 }}>
                              {(trainer.name || 'T').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.95rem' }}>
                                {trainer.name}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                {trainer.title || trainer.designation || trainer.organizationName || 'Trainer'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Expertise Level / Source */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span className={`badge ${match.isVerified ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.75rem' }}>
                            {dataMode === 'demo' ? `${trainer.experience || 5}+ Yrs Exp` : match.isVerified ? 'Verified Expertise' : 'Declared Expertise'}
                          </span>
                        </td>

                        {/* Matched Skills */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          {match.matchedSkills.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                              {match.matchedSkills.map((sk, idx) => (
                                <span key={idx} style={{ padding: '0.2rem 0.5rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Check size={11} /> {sk}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>None</span>
                          )}
                        </td>

                        {/* Missing Skills / Capacity Gap */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          {match.missingSkills.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                              {match.missingSkills.map((sk, idx) => (
                                <span key={idx} style={{ padding: '0.2rem 0.5rem', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>
                                  {sk}
                                </span>
                              ))}
                            </div>
                          ) : match.hasDefinedSkills ? (
                            <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>Fully Covered</span>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>-</span>
                          )}
                        </td>

                        {/* Competency Match % & Selection */}
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            {match.hasDefinedSkills ? (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: match.score >= 70 ? '#dcfce7' : match.score > 0 ? '#fffbe8' : '#f3f4f6', color: match.score >= 70 ? '#15803d' : match.score > 0 ? '#b45309' : '#4b5563', padding: '0.35rem 0.65rem', borderRadius: '16px', fontWeight: 700, fontSize: '0.85rem' }}>
                                <Sparkles size={13} /> {match.score}% Match
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 500 }}>
                                Skills not defined
                              </span>
                            )}

                            <button
                              onClick={() => setProfileModalTrainer({ trainer, match })}
                              className="btn btn-outline"
                              style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                            >
                              Details
                            </button>

                            <button
                              onClick={() => handleSelectTrainer(idOf(selectedItem), tid)}
                              className={`btn ${isSelectedForSubject ? 'btn-success' : 'btn-primary'}`}
                              style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                            >
                              {isSelectedForSubject ? 'Selected' : 'Select'}
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* DETAILED TRAINER COMPETENCY PROFILE MODAL */}
      {profileModalTrainer && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '640px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setProfileModalTrainer(null)} 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 800
              }}>
                {(profileModalTrainer.trainer.name || 'T').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                  {profileModalTrainer.trainer.name}
                </h2>
                <p style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.9rem', margin: '0.2rem 0' }}>
                  {profileModalTrainer.trainer.title || profileModalTrainer.trainer.designation || 'Trainer'}
                </p>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: 0 }}>
                  {profileModalTrainer.trainer.organizationName || profileModalTrainer.trainer.organization || 'Organization'}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>Competency Match Score</span>
                <span className="badge badge-success" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{profileModalTrainer.match.score}% Match</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                {profileModalTrainer.match.rationale}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              <div>
                <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '0.25rem' }}>Qualification & Experience:</strong>
                <span style={{ color: 'var(--text-light)' }}>
                  {profileModalTrainer.trainer.qualification || 'Higher Education Degree'} • {profileModalTrainer.trainer.experience || profileModalTrainer.trainer.experienceYears || 5}+ Years Experience
                </span>
              </div>

              <div>
                <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '0.35rem' }}>Full Skills Inventory:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {getTrainerSkillsInfo(profileModalTrainer.trainer).skills.map((s, i) => (
                    <span key={i} style={{ padding: '0.25rem 0.55rem', backgroundColor: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
              <button onClick={() => setProfileModalTrainer(null)} className="btn btn-outline">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW DEMO SUBJECT MODAL */}
      {showAddSubjectModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '580px', padding: '2rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>Add Demo Subject Profile</h2>
              <button onClick={() => setShowAddSubjectModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddDemoSubject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Subject / Training Area Name *</label>
                <input 
                  type="text" 
                  value={newSubject.title}
                  onChange={(e) => setNewSubject({ ...newSubject, title: e.target.value })}
                  placeholder="e.g. Hydro-meteorological Modeling"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Domain Category</label>
                  <select 
                    value={newSubject.category}
                    onChange={(e) => setNewSubject({ ...newSubject, category: e.target.value })}
                  >
                    <option value="Meteorology & Sensing">Meteorology & Sensing</option>
                    <option value="Atmospheric Sciences">Atmospheric Sciences</option>
                    <option value="Geospatial Technology">Geospatial Technology</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Marine Sciences">Marine Sciences</option>
                    <option value="Emergency Management">Emergency Management</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Min Experience (Years)</label>
                  <input 
                    type="number" 
                    value={newSubject.minExperience}
                    onChange={(e) => setNewSubject({ ...newSubject, minExperience: e.target.value })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Required Competency Skills (Comma Separated) *</label>
                <input 
                  type="text" 
                  value={newSubject.skills}
                  onChange={(e) => setNewSubject({ ...newSubject, skills: e.target.value })}
                  placeholder="e.g. Hydrology, Runoff Modeling, Flood Warning, GIS"
                  required
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Description</label>
                <textarea 
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                  placeholder="Brief summary of domain objectives..."
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddSubjectModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Demo Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompetencyMapping;
