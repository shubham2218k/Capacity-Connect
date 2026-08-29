import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { mockTrainerCourses } from '../../data/mockData';
import { api } from '../../services/api';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    shortDescription: '',
    difficulty: 'Beginner',
    duration: '',
    detailedDescription: '',
    thumbnail: null
  });

  const [objectives, setObjectives] = useState(['']);
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const addObjective = () => {
    setObjectives([...objectives, '']);
  };

  const removeObjective = (index) => {
    if (objectives.length > 1) {
      const newObjectives = objectives.filter((_, i) => i !== index);
      setObjectives(newObjectives);
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
      }
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleNext = () => {
    // Basic validation
    if (step === 1 && (!formData.title || !formData.category)) {
      alert("Please fill in the required fields (Title and Category).");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const validObjectives = objectives.filter(o => o.trim() !== '');

    try {
      let response;
      if (formData.thumbnail instanceof File) {
        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('category', formData.category);
        fd.append('shortDescription', formData.shortDescription || '');
        fd.append('description', formData.detailedDescription || '');
        fd.append('difficulty', formData.difficulty || 'Beginner');
        fd.append('estimatedDuration', formData.duration || '');
        validObjectives.forEach(o => fd.append('learningObjectives', o));
        skills.forEach(s => fd.append('skills', s));
        fd.append('thumbnail', formData.thumbnail);

        response = await api.postFormData('/courses', fd);
      } else {
        const payload = {
          title: formData.title,
          category: formData.category,
          shortDescription: formData.shortDescription || '',
          description: formData.detailedDescription || '',
          difficulty: formData.difficulty || 'Beginner',
          estimatedDuration: formData.duration || '',
          learningObjectives: validObjectives,
          skills: skills
        };
        response = await api.post('/courses', payload);
      }

      if (response.success && response.data) {
        const courseId = response.data._id || response.data.id;
        navigate(`/trainer/courses/${courseId}`);
      } else {
        setError(response.message || 'Course creation failed.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to create course.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '900px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/trainer/courses" style={{ color: 'var(--text-light)', display: 'flex' }}>
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>Create New Course</h1>
          <p className="text-light">Build a new training program for capacity building.</p>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '50%', 
            backgroundColor: step >= 1 ? 'var(--secondary)' : 'var(--bg-color-alt)', 
            color: step >= 1 ? 'white' : 'var(--text-muted)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 
          }}>
            {step > 1 ? <CheckCircle size={18} /> : '1'}
          </div>
          <span style={{ fontWeight: step >= 1 ? 600 : 500, color: step >= 1 ? 'var(--text-dark)' : 'var(--text-muted)' }}>
            Basic Information
          </span>
        </div>
        <div style={{ flex: 1, height: '2px', backgroundColor: step > 1 ? 'var(--secondary)' : 'var(--border-color)', margin: '0 1rem' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '50%', 
            backgroundColor: step >= 2 ? 'var(--secondary)' : 'var(--bg-color-alt)', 
            color: step >= 2 ? 'white' : 'var(--text-muted)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 
          }}>
            2
          </div>
          <span style={{ fontWeight: step >= 2 ? 600 : 500, color: step >= 2 ? 'var(--text-dark)' : 'var(--text-muted)' }}>
            Course Details
          </span>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 500 }}>
          {error}
        </div>
      )}

      <div className="card" style={{ padding: '2.5rem' }}>
        
        {step === 1 && (
          <div className="step-1">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Basic Information
            </h2>
            
            <div className="input-group">
              <label>Course Title *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="e.g. Fundamentals of Remote Sensing" 
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="input-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="">Select Category</option>
                  <option value="Earth Sciences">Earth Sciences</option>
                  <option value="Meteorology">Meteorology</option>
                  <option value="Oceanography">Oceanography</option>
                  <option value="Seismology">Seismology</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="GIS & Remote Sensing">GIS & Remote Sensing</option>
                </select>
              </div>
              <div className="input-group">
                <label>Difficulty Level</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Estimated Duration</label>
              <input 
                type="text" 
                name="duration" 
                value={formData.duration} 
                onChange={handleInputChange} 
                placeholder="e.g. 4 Weeks or 12 Hours" 
              />
            </div>

            <div className="input-group">
              <label>Short Description (For course card)</label>
              <textarea 
                name="shortDescription" 
                value={formData.shortDescription} 
                onChange={handleInputChange} 
                placeholder="A brief 1-2 sentence overview of the course..."
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="input-group">
              <label>Course Thumbnail</label>
              {formData.thumbnail ? (
                <div style={{ 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '8px', 
                  padding: '1rem', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--white)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <ImageIcon size={24} style={{ color: 'var(--primary)' }} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0, color: 'var(--text-dark)' }}>{formData.thumbnail.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>
                        {formData.thumbnail.name.split('.').pop().toUpperCase()} • {(formData.thumbnail.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, thumbnail: null})} 
                    className="btn btn-ghost" 
                    style={{ color: 'var(--danger)', fontSize: '0.85rem' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div style={{ 
                  border: '2px dashed var(--border-color)', 
                  borderRadius: '8px', 
                  padding: '2rem', 
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-color-alt)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--secondary)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <input 
                    type="file" 
                    accept="image/*"
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({...formData, thumbnail: e.target.files[0]});
                      }
                    }} 
                  />
                  <ImageIcon size={32} className="text-light" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Click to upload or drag and drop</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>SVG, PNG, JPG or GIF (max. 2MB)</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button type="button" onClick={handleNext} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                Next Step <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-2">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Course Details
            </h2>

            <div className="input-group">
              <label>Detailed Description</label>
              <textarea 
                name="detailedDescription" 
                value={formData.detailedDescription} 
                onChange={handleInputChange} 
                placeholder="Provide a comprehensive description of the course contents, methodology, and target audience..."
                style={{ minHeight: '150px' }}
              />
            </div>

            <div className="input-group">
              <label>Learning Objectives</label>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                What will trainees be able to do after completing this course?
              </p>
              {objectives.map((obj, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <input 
                    type="text" 
                    value={obj} 
                    onChange={(e) => handleObjectiveChange(index, e.target.value)} 
                    placeholder={`Objective ${index + 1}`} 
                    style={{ flex: 1 }}
                  />
                  <button 
                    type="button" 
                    onClick={() => removeObjective(index)}
                    className="btn btn-ghost"
                    style={{ padding: '0.5rem', color: objectives.length > 1 ? 'var(--danger)' : 'var(--text-light)' }}
                    disabled={objectives.length <= 1}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={addObjective}
                className="btn btn-outline"
                style={{ width: 'fit-content', marginTop: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                + Add Objective
              </button>
            </div>

            <div className="input-group" style={{ marginTop: '2rem' }}>
              <label>Skills & Competencies</label>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Type a skill and press Enter to add it as a tag.
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {skills.map(skill => (
                  <span key={skill} className="badge badge-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => removeSkill(skill)} 
                      style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              
              <input 
                type="text" 
                value={currentSkill} 
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="e.g. Data Analysis (Press Enter)" 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <button type="button" onClick={handleBack} className="btn btn-secondary">
                <ArrowLeft size={18} /> Back
              </button>
              <button 
                type="button" 
                onClick={handleSubmit} 
                className="btn btn-primary" 
                style={{ padding: '0.75rem 2.5rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Course...' : 'Save Draft & Build Curriculum'}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CreateCourse;
