import { useState } from 'react';
import { 
  Map, 
  Award, 
  CheckCircle, 
  Plus, 
  UserCheck, 
  Sparkles, 
  Search, 
  X, 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Check, 
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';

// Initial Mock Subjects for Capacity Connect (SIH26075 Standard)
const initialSubjects = [
  {
    id: 'subj_radar',
    title: 'Radar Systems & Severe Weather Detection',
    category: 'Meteorology & Sensing',
    requiredSkills: ['Doppler Radar Systems', 'Signal Processing', 'Reflectivity Analysis', 'Severe Storm Warning'],
    minExperience: 5,
    minQualification: "Master's / Ph.D.",
    targetTrainees: 64,
    description: 'Advanced operation of weather radar networks, Doppler velocity interpretation, and severe convection early warnings.'
  },
  {
    id: 'subj_met',
    title: 'Meteorology & Atmospheric Dynamics',
    category: 'Atmospheric Sciences',
    requiredSkills: ['Atmospheric Dynamics', 'Numerical Weather Prediction', 'Synoptic Analysis', 'Climate Modeling'],
    minExperience: 4,
    minQualification: "Master's Degree",
    targetTrainees: 52,
    description: 'Core thermodynamic principles, synoptic scale forecasting models, and atmospheric circulation dynamics.'
  },
  {
    id: 'subj_gis',
    title: 'GIS & Geospatial Analysis',
    category: 'Geospatial Technology',
    requiredSkills: ['QGIS / ArcGIS', 'Spatial Analysis', 'Remote Sensing', 'Coordinate Systems'],
    minExperience: 3,
    minQualification: 'Bachelor / Master Degree',
    targetTrainees: 88,
    description: 'Spatial data modeling, vector/raster analysis, satellite imagery overlay, and thematic cartographic mapping.'
  },
  {
    id: 'subj_python',
    title: 'Python Programming & Climate Analytics',
    category: 'Data & Analytics',
    requiredSkills: ['Python', 'Pandas & NumPy', 'NetCDF Climate Data', 'Data Visualization'],
    minExperience: 3,
    minQualification: 'Bachelor Degree',
    targetTrainees: 76,
    description: 'Handling multi-dimensional climate arrays (NetCDF/GRIB), automated time-series computation, and scientific plotting.'
  },
  {
    id: 'subj_ocean',
    title: 'Oceanography & Marine Observation',
    category: 'Marine Sciences',
    requiredSkills: ['Oceanographic Sensors', 'Wave Dynamics', 'Bathymetry', 'Sea Surface Temperature'],
    minExperience: 5,
    minQualification: "Master's / Ph.D.",
    targetTrainees: 34,
    description: 'Ocean acoustic profiling, satellite altimetry, coastal surge modeling, and marine sensor calibration.'
  },
  {
    id: 'subj_disaster',
    title: 'Disaster Risk Reduction & Emergency Management',
    category: 'Emergency Response',
    requiredSkills: ['Hazard Mapping', 'Vulnerability Assessment', 'Early Warning Systems', 'Crisis Communication'],
    minExperience: 4,
    minQualification: 'Master Degree',
    targetTrainees: 45,
    description: 'Community risk reduction frameworks, multi-hazard early warning dissemination, and emergency protocol deployment.'
  }
];

// Initial Mock Trainers with Competency Datasets
const initialTrainers = [
  {
    id: 'tnr_1',
    name: 'Dr. Rajesh Kumar',
    title: 'Senior Radar Specialist & Research Fellow',
    organization: 'IMD - India Meteorological Department',
    qualification: 'Ph.D. in Atmospheric Radar Systems (IIT Delhi)',
    experienceYears: 14,
    primaryDomains: ['Radar Systems & Severe Weather Detection', 'Meteorology & Atmospheric Dynamics'],
    skills: ['Doppler Radar Systems', 'Signal Processing', 'Reflectivity Analysis', 'Severe Storm Warning', 'Numerical Weather Prediction', 'Python'],
    rating: 4.9,
    coursesDelivered: 16,
    email: 'rajesh.kumar@imd.gov.in',
    phone: '+91 98112 34567'
  },
  {
    id: 'tnr_2',
    name: 'Dr. Meera Nair',
    title: 'Lead Remote Sensing & GIS Scientist',
    organization: 'NCMRWF / MoES',
    qualification: 'Ph.D. in Remote Sensing & Geospatial Tech',
    experienceYears: 10,
    primaryDomains: ['GIS & Geospatial Analysis', 'Radar Systems & Severe Weather Detection'],
    skills: ['Remote Sensing', 'QGIS / ArcGIS', 'Spatial Analysis', 'Reflectivity Analysis', 'Coordinate Systems', 'Satellite Imaging'],
    rating: 4.8,
    coursesDelivered: 12,
    email: 'meera.nair@moes.gov.in',
    phone: '+91 98711 87654'
  },
  {
    id: 'tnr_3',
    name: 'Rahul Verma',
    title: 'Senior Data Scientist & Climate Analyst',
    organization: 'Capacity Connect Training Division',
    qualification: 'M.Tech in Computational Data Science',
    experienceYears: 8,
    primaryDomains: ['Python Programming & Climate Analytics', 'GIS & Geospatial Analysis'],
    skills: ['Python', 'Pandas & NumPy', 'NetCDF Climate Data', 'Data Visualization', 'Spatial Analysis', 'Signal Processing'],
    rating: 4.7,
    coursesDelivered: 9,
    email: 'rahul.verma@capacityconnect.org',
    phone: '+91 98234 56789'
  },
  {
    id: 'tnr_4',
    name: 'Dr. Ananya Sen',
    title: 'Professor of Atmospheric & Hydro Sciences',
    organization: 'Indian Institute of Tropical Meteorology',
    qualification: 'Ph.D. in Dynamic Meteorology (IISc Bangalore)',
    experienceYears: 16,
    primaryDomains: ['Meteorology & Atmospheric Dynamics', 'Disaster Risk Reduction & Emergency Management'],
    skills: ['Atmospheric Dynamics', 'Numerical Weather Prediction', 'Synoptic Analysis', 'Climate Modeling', 'Hazard Mapping'],
    rating: 4.95,
    coursesDelivered: 22,
    email: 'ananya.sen@iitm.res.in',
    phone: '+91 98450 11223'
  },
  {
    id: 'tnr_5',
    name: 'Capt. Suresh Menon',
    title: 'Oceanographic Survey & Marine Lead',
    organization: 'INCOIS - National Centre for Ocean Information',
    qualification: 'M.Sc. Oceanography & Coastal Engineering',
    experienceYears: 12,
    primaryDomains: ['Oceanography & Marine Observation', 'Disaster Risk Reduction & Emergency Management'],
    skills: ['Oceanographic Sensors', 'Wave Dynamics', 'Bathymetry', 'Sea Surface Temperature', 'Early Warning Systems'],
    rating: 4.85,
    coursesDelivered: 14,
    email: 'suresh.menon@incois.gov.in',
    phone: '+91 98990 44332'
  },
  {
    id: 'tnr_6',
    name: 'Anita Desai',
    title: 'Emergency Preparedness & Risk Specialist',
    organization: 'National Disaster Management Authority',
    qualification: 'M.A. Public Policy & Disaster Mitigation',
    experienceYears: 7,
    primaryDomains: ['Disaster Risk Reduction & Emergency Management'],
    skills: ['Hazard Mapping', 'Vulnerability Assessment', 'Early Warning Systems', 'Crisis Communication', 'Spatial Analysis'],
    rating: 4.6,
    coursesDelivered: 7,
    email: 'anita.desai@ndma.gov.in',
    phone: '+91 98665 77889'
  }
];

const CompetencyMapping = () => {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [trainers, setTrainers] = useState(initialTrainers);
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjects[0].id);
  const [selectedTrainersBySubject, setSelectedTrainersBySubject] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [profileModalTrainer, setProfileModalTrainer] = useState(null);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddTrainerModal, setShowAddTrainerModal] = useState(false);

  // New Subject Form
  const [newSubject, setNewSubject] = useState({
    title: '',
    category: 'Meteorology & Sensing',
    requiredSkills: '',
    minExperience: 3,
    minQualification: "Master's Degree",
    description: ''
  });

  // New Trainer Form
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    title: '',
    organization: '',
    qualification: '',
    experienceYears: 5,
    skills: '',
    primaryDomains: 'Radar Systems & Severe Weather Detection',
    email: ''
  });

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // COMPETENCY MATCH SCORE CALCULATOR (SIH26075 Algorithm)
  const calculateTrainerMatch = (trainer, subject) => {
    const reqSkills = subject.requiredSkills || [];
    const trainerSkills = trainer.skills || [];
    
    // Factor 1: Skill Match (40% Weight)
    const matchedSkills = reqSkills.filter(req => 
      trainerSkills.some(ts => ts.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(ts.toLowerCase()))
    );
    const skillRatio = reqSkills.length > 0 ? (matchedSkills.length / reqSkills.length) : 0;
    const skillScore = skillRatio * 40;

    // Factor 2: Primary Domain Expertise Alignment (30% Weight)
    const isPrimaryDomainMatch = trainer.primaryDomains.some(d => 
      d.toLowerCase().includes(subject.title.toLowerCase()) || subject.title.toLowerCase().includes(d.toLowerCase())
    );
    const domainScore = isPrimaryDomainMatch ? 30 : 15;

    // Factor 3: Domain Experience Match (15% Weight)
    const reqExp = subject.minExperience || 3;
    const trainerExp = trainer.experienceYears || 0;
    let expScore = 0;
    if (trainerExp >= reqExp + 5) expScore = 15;
    else if (trainerExp >= reqExp) expScore = 12;
    else expScore = Math.max(5, (trainerExp / reqExp) * 10);

    // Factor 4: Qualification Alignment (15% Weight)
    const isPhD = (trainer.qualification || '').toLowerCase().includes('ph.d') || (trainer.qualification || '').toLowerCase().includes('phd');
    const isMaster = (trainer.qualification || '').toLowerCase().includes('m.tech') || (trainer.qualification || '').toLowerCase().includes('m.sc') || (trainer.qualification || '').toLowerCase().includes('master');
    let qualScore = 10;
    if (isPhD) qualScore = 15;
    else if (isMaster) qualScore = 12;

    const totalPercentage = Math.min(98, Math.max(45, Math.round(skillScore + domainScore + expScore + qualScore)));

    // Generate Rationale Explanation
    let rationale = '';
    if (matchedSkills.length === reqSkills.length) {
      rationale = `Recommended because this trainer matches all ${matchedSkills.length}/${reqSkills.length} required competencies (${isPhD ? 'Ph.D. Qualified' : 'Master Degree'}, ${trainerExp}+ Yrs Exp).`;
    } else {
      rationale = `Recommended because this trainer matches ${matchedSkills.length}/${reqSkills.length} required competencies (${isPrimaryDomainMatch ? 'Direct Expertise' : 'Related Domain'}, ${trainerExp} Yrs Exp).`;
    }

    return {
      score: totalPercentage,
      matchedSkills,
      unmatchedSkills: reqSkills.filter(s => !matchedSkills.includes(s)),
      rationale,
      breakdown: {
        skillScore: Math.round(skillScore),
        domainScore: Math.round(domainScore),
        expScore: Math.round(expScore),
        qualScore: Math.round(qualScore)
      }
    };
  };

  // Rank Trainers for Currently Selected Subject
  const rankedTrainers = trainers
    .map(trainer => ({
      trainer,
      match: calculateTrainerMatch(trainer, selectedSubject)
    }))
    .filter(item => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.trainer.name.toLowerCase().includes(q) ||
        item.trainer.title.toLowerCase().includes(q) ||
        item.trainer.skills.some(s => s.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => b.match.score - a.match.score);

  const handleSelectTrainer = (subjectId, trainerId) => {
    setSelectedTrainersBySubject(prev => ({
      ...prev,
      [subjectId]: trainerId
    }));
  };

  const handleAddSubjectSubmit = (e) => {
    e.preventDefault();
    if (!newSubject.title.trim() || !newSubject.requiredSkills.trim()) return;

    const skillList = newSubject.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    const created = {
      id: `subj_${Date.now()}`,
      title: newSubject.title.trim(),
      category: newSubject.category,
      requiredSkills: skillList,
      minExperience: Number(newSubject.minExperience) || 3,
      minQualification: newSubject.minQualification,
      targetTrainees: 40,
      description: newSubject.description.trim() || 'Custom organizational training competency domain.'
    };

    setSubjects([created, ...subjects]);
    setSelectedSubjectId(created.id);
    setShowAddSubjectModal(false);
    setNewSubject({
      title: '',
      category: 'Meteorology & Sensing',
      requiredSkills: '',
      minExperience: 3,
      minQualification: "Master's Degree",
      description: ''
    });
  };

  const handleAddTrainerSubmit = (e) => {
    e.preventDefault();
    if (!newTrainer.name.trim() || !newTrainer.skills.trim()) return;

    const skillList = newTrainer.skills.split(',').map(s => s.trim()).filter(Boolean);
    const created = {
      id: `tnr_${Date.now()}`,
      name: newTrainer.name.trim(),
      title: newTrainer.title.trim() || 'Capacity Building Specialist',
      organization: newTrainer.organization.trim() || 'Capacity Connect Workspace',
      qualification: newTrainer.qualification.trim() || 'M.Tech / M.Sc.',
      experienceYears: Number(newTrainer.experienceYears) || 5,
      primaryDomains: [newTrainer.primaryDomains],
      skills: skillList,
      rating: 4.8,
      coursesDelivered: 5,
      email: newTrainer.email.trim() || 'trainer@organization.org'
    };

    setTrainers([created, ...trainers]);
    setShowAddTrainerModal(false);
    setNewTrainer({
      name: '',
      title: '',
      organization: '',
      qualification: '',
      experienceYears: 5,
      skills: '',
      primaryDomains: 'Radar Systems & Severe Weather Detection',
      email: ''
    });
  };

  return (
    <div>
      
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>
              Competency Mapping
            </h1>
            <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
              <Sparkles size={12} /> SIH26075 Standard
            </span>
          </div>
          <p style={{ color: 'var(--text-light)' }}>
            Map training subjects & organizational requirements to qualified trainers ranked by Competency Match Score (%).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowAddTrainerModal(true)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={16} /> Map New Trainer
          </button>
          <button onClick={() => setShowAddSubjectModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add Training Subject
          </button>
        </div>
      </div>

      {/* SEARCH & SUBJECT SELECTION BAR */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', backgroundColor: 'var(--white)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} style={{ color: 'var(--secondary)' }} /> Select Subject / Training Area
          </div>

          <div style={{ position: 'relative', minWidth: '260px', flex: 1, maxWidth: '400px' }}>
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
        </div>

        {/* Subject Pills Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {subjects.map(subject => {
            const isSelected = subject.id === selectedSubjectId;
            return (
              <button
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
                style={{
                  padding: '0.6rem 1rem',
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
                <Map size={14} style={{ color: isSelected ? 'var(--secondary)' : 'var(--text-muted)' }} />
                {subject.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED SUBJECT OVERVIEW CARD */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', borderLeft: '5px solid var(--secondary)', backgroundColor: 'var(--white)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
              {selectedSubject.category}
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
              {selectedSubject.title}
            </h2>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.35rem', maxWidth: '750px' }}>
              {selectedSubject.description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', backgroundColor: '#f8fafc', padding: '0.85rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem' }}>Min. Experience</span>
              <strong style={{ color: 'var(--primary)' }}>{selectedSubject.minExperience}+ Years</strong>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
              <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem' }}>Min. Qualification</span>
              <strong style={{ color: 'var(--primary)' }}>{selectedSubject.minQualification}</strong>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
              <span style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.75rem' }}>Mapped Trainees</span>
              <strong style={{ color: 'var(--secondary-hover)' }}>{selectedSubject.targetTrainees} Active</strong>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
            Required Competencies & Skills Benchmark:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {selectedSubject.requiredSkills.map((skill, index) => (
              <span 
                key={index} 
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
        </div>
      </div>

      {/* RANKED TRAINERS COMPETENCY MATCH SECTION */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} style={{ color: 'var(--secondary)' }} />
          Ranked Trainer Recommendations for {selectedSubject.title}
        </h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
          Showing {rankedTrainers.length} Trainer Profiles
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {rankedTrainers.length > 0 ? (
          rankedTrainers.map(({ trainer, match }, index) => {
            const isTopRank = index === 0;
            const isSelectedForSubject = selectedTrainersBySubject[selectedSubject.id] === trainer.id;
            
            // Match pill color logic
            let matchBg = '#d1fae5';
            let matchColor = '#065f46';
            if (match.score < 75) {
              matchBg = '#ffedd5';
              matchColor = '#c2410c';
            } else if (match.score < 90) {
              matchBg = '#e0f2fe';
              matchColor = '#0369a1';
            }

            return (
              <div 
                key={trainer.id} 
                className="card" 
                style={{ 
                  padding: '1.75rem', 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '1.25rem',
                  borderLeft: isSelectedForSubject ? '6px solid var(--success)' : isTopRank ? '6px solid var(--secondary)' : '1px solid var(--border-color)',
                  boxShadow: isTopRank ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  backgroundColor: isSelectedForSubject ? '#f0fdf4' : 'var(--white)'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: isTopRank ? 'var(--primary)' : 'var(--bg-color-alt)',
                      color: isTopRank ? 'white' : 'var(--text-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      flexShrink: 0,
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {trainer.name.charAt(0)}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                        <span className="badge" style={{ backgroundColor: isTopRank ? 'var(--secondary)' : 'var(--bg-color-alt)', color: isTopRank ? 'white' : 'var(--text-dark)', fontSize: '0.75rem', fontWeight: 700 }}>
                          #{index + 1} {isTopRank ? 'Top Match' : 'Candidate'}
                        </span>
                        {isSelectedForSubject && (
                          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Check size={12} /> Assigned Trainer
                          </span>
                        )}
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                          {trainer.name}
                        </h3>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, margin: '0 0 0.25rem 0' }}>
                        {trainer.title}
                      </p>

                      <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.825rem', color: 'var(--text-light)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Building2 size={14} /> {trainer.organization}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <GraduationCap size={14} /> {trainer.qualification}
                        </span>
                        <span>
                          <strong>{trainer.experienceYears}+ Yrs Experience</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Competency Match Badge */}
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{
                      backgroundColor: matchBg,
                      color: matchColor,
                      padding: '0.5rem 1.25rem',
                      borderRadius: '24px',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <Sparkles size={18} /> {match.score}% Match
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.35rem' }}>
                      Competency Alignment Score
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>Competency Match Breakdown</span>
                    <span style={{ fontWeight: 700, color: matchColor }}>{match.matchedSkills.length} of {selectedSubject.requiredSkills.length} Required Skills Matched</span>
                  </div>
                  <div style={{ backgroundColor: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${match.score}%`, 
                        backgroundColor: match.score >= 90 ? 'var(--success)' : match.score >= 75 ? 'var(--secondary)' : '#f97316', 
                        height: '100%', 
                        transition: 'width 0.4s ease' 
                      }} 
                    />
                  </div>
                </div>

                {/* Rationale Explanation Box (Required SIH26075 Feature) */}
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  padding: '0.85rem 1.25rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  fontSize: '0.875rem'
                }}>
                  <Info size={18} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-dark)', lineHeight: 1.4 }}>
                    <strong>Recommendation Rationale:</strong> {match.rationale}
                  </span>
                </div>

                {/* Skills Match List & Actions Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  
                  {/* Matching Skills Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Matched Skills:</span>
                    {match.matchedSkills.map((skill, idx) => (
                      <span key={idx} style={{ padding: '0.2rem 0.5rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Check size={12} /> {skill}
                      </span>
                    ))}
                    {match.unmatchedSkills.map((skill, idx) => (
                      <span key={idx} style={{ padding: '0.2rem 0.5rem', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '4px', fontSize: '0.75rem', textDecoration: 'line-through' }}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => setProfileModalTrainer({ trainer, match })}
                      className="btn btn-outline" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Info size={15} /> View Profile
                    </button>
                    
                    <button 
                      onClick={() => handleSelectTrainer(selectedSubject.id, trainer.id)}
                      className={`btn ${isSelectedForSubject ? 'btn-success' : 'btn-primary'}`} 
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      {isSelectedForSubject ? (
                        <>
                          <Check size={16} /> Selected Instructor
                        </>
                      ) : (
                        <>
                          <UserCheck size={16} /> Select Trainer
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
            No trainers match the search query "{searchQuery}".
          </div>
        )}
      </div>

      {/* DETAILED TRAINER COMPETENCY PROFILE MODAL */}
      {profileModalTrainer && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '680px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setProfileModalTrainer(null)} 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 800
              }}>
                {profileModalTrainer.trainer.name.charAt(0)}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                  {profileModalTrainer.trainer.name}
                </h2>
                <p style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.9rem', margin: '0.2rem 0' }}>
                  {profileModalTrainer.trainer.title}
                </p>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: 0 }}>
                  {profileModalTrainer.trainer.organization}
                </p>
              </div>
            </div>

            {/* Score Breakdown Grid */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                Competency Match Breakdown ({profileModalTrainer.match.score}%)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Skill Match (40% Weight)</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{profileModalTrainer.match.breakdown.skillScore} / 40 Pts</strong>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Domain Alignment (30% Weight)</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{profileModalTrainer.match.breakdown.domainScore} / 30 Pts</strong>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Experience Alignment (15% Weight)</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{profileModalTrainer.match.breakdown.expScore} / 15 Pts</strong>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Qualification Level (15% Weight)</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{profileModalTrainer.match.breakdown.qualScore} / 15 Pts</strong>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div>
                <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '0.25rem' }}>Academic Qualification:</strong>
                <span style={{ color: 'var(--text-light)' }}>{profileModalTrainer.trainer.qualification}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '0.25rem' }}>Experience & History:</strong>
                <span style={{ color: 'var(--text-light)' }}>{profileModalTrainer.trainer.experienceYears} Years Experience • {profileModalTrainer.trainer.coursesDelivered} Training Programs Delivered • Rating {profileModalTrainer.trainer.rating}/5.0</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-dark)', display: 'block', marginBottom: '0.35rem' }}>Full Skills Inventory:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {profileModalTrainer.trainer.skills.map((s, i) => (
                    <span key={i} style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-color-alt)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setProfileModalTrainer(null)} className="btn btn-outline">Close</button>
              <button 
                onClick={() => {
                  handleSelectTrainer(selectedSubject.id, profileModalTrainer.trainer.id);
                  setProfileModalTrainer(null);
                }} 
                className="btn btn-primary"
              >
                Select This Trainer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD NEW TRAINING SUBJECT MODAL */}
      {showAddSubjectModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>Add New Subject Profile</h2>
              <button onClick={() => setShowAddSubjectModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddSubjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                  value={newSubject.requiredSkills}
                  onChange={(e) => setNewSubject({ ...newSubject, requiredSkills: e.target.value })}
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
                <button type="submit" className="btn btn-primary">Create Subject Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAP NEW TRAINER MODAL */}
      {showAddTrainerModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>Map New Trainer Competency</h2>
              <button onClick={() => setShowAddTrainerModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddTrainerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Trainer Full Name *</label>
                <input 
                  type="text" 
                  value={newTrainer.name}
                  onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                  placeholder="e.g. Dr. Priya Sharma"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Designation / Title</label>
                  <input 
                    type="text" 
                    value={newTrainer.title}
                    onChange={(e) => setNewTrainer({ ...newTrainer, title: e.target.value })}
                    placeholder="e.g. Senior Meteorologist"
                  />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Experience (Years)</label>
                  <input 
                    type="number" 
                    value={newTrainer.experienceYears}
                    onChange={(e) => setNewTrainer({ ...newTrainer, experienceYears: e.target.value })}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Academic Qualification</label>
                <input 
                  type="text" 
                  value={newTrainer.qualification}
                  onChange={(e) => setNewTrainer({ ...newTrainer, qualification: e.target.value })}
                  placeholder="e.g. Ph.D. in Climate Dynamics"
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Skills Inventory (Comma Separated) *</label>
                <input 
                  type="text" 
                  value={newTrainer.skills}
                  onChange={(e) => setNewTrainer({ ...newTrainer, skills: e.target.value })}
                  placeholder="e.g. Doppler Radar Systems, Signal Processing, Python, Reflectivity Analysis"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddTrainerModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Map Trainer Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompetencyMapping;
