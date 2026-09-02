/**
 * Capacity Connect — Original 2D Character Vector Illustration System
 * Theme-aware flat vector compositions using Capacity Connect landing tokens.
 * Core anchor: Cyan (#22D3EE) / Blue (#3B82F6)
 * Trainer accents: Violet (#8B5CF6)
 * Trainee accents: Emerald (#34D399)
 * All marked aria-hidden="true".
 */
export const AuthIllustration = ({ type = 'admin-register', role = 'Trainee', theme = 'dark' }) => {
  const isDark = theme === 'dark';

  // Dynamic Theme Palette Colors for SVG Elements
  const colors = {
    bgSurface: isDark ? '#0F1E33' : '#EAF1F8',
    bgCard: isDark ? '#0B1728' : '#FFFFFF',
    border: isDark ? 'rgba(226, 232, 240, 0.18)' : 'rgba(15, 43, 73, 0.2)',
    text: isDark ? '#F7FBFF' : '#071321',
    cyan: isDark ? '#22D3EE' : '#0891B2',
    blue: isDark ? '#3B82F6' : '#2563EB',
    violet: isDark ? '#8B5CF6' : '#7C3AED',
    emerald: isDark ? '#34D399' : '#059669',
    amber: isDark ? '#F59E0B' : '#D97706',
    skin: '#F4B9A9',
    hair: isDark ? '#1E293B' : '#0F172A',
  };

  return (
    <div className="cc-auth-illustration-wrapper" aria-hidden="true" style={{ width: '100%', maxWidth: '340px', margin: '0 auto', textAlign: 'center' }}>
      {type === 'login' && renderConnectedAccessLogin(role, colors)}
      {type === 'register' && renderBuildingSkillsTrainee(colors)}
      {type === 'trainer-apply' && renderGuidingCapabilityTrainer(colors)}
      {type === 'admin-register' && renderCoordinatingCapacityAdmin(colors)}
    </div>
  );
};

/* 1. Login — "Connected Access" */
const renderConnectedAccessLogin = (role, c) => {
  const getRoleColor = () => {
    if (role === 'Admin') return c.amber;
    if (role === 'Trainer') return c.violet;
    return c.emerald; // Trainee
  };

  const activeAccent = getRoleColor();

  return (
    <svg viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      {/* Background Arch & Portal Window */}
      <rect x="20" y="20" width="300" height="260" rx="16" fill={c.bgCard} stroke={c.border} strokeWidth="1.5" />
      <path d="M 90 280 V 100 A 80 80 0 0 1 250 100 V 280 Z" fill={c.bgSurface} stroke={c.border} strokeWidth="1.5" />

      {/* Decorative Glow Nodes */}
      <circle cx="50" cy="50" r="12" fill={c.cyan} fillOpacity="0.15" />
      <circle cx="290" cy="230" r="16" fill={c.violet} fillOpacity="0.15" />

      {/* Human Figure Stepping Into Workspace */}
      {/* Legs */}
      <path d="M 155 210 L 145 270" stroke={c.text} strokeWidth="4" strokeLinecap="round" />
      <path d="M 165 210 L 180 265" stroke={c.text} strokeWidth="4" strokeLinecap="round" />
      {/* Torso/Jacket */}
      <path d="M 140 145 L 180 145 L 175 210 L 145 210 Z" fill={activeAccent} stroke={c.text} strokeWidth="1.5" />
      {/* Head & Hair */}
      <circle cx="160" cy="120" r="14" fill={c.skin} stroke={c.text} strokeWidth="1.5" />
      <path d="M 148 116 C 148 105 172 105 172 116 C 172 112 160 102 148 116 Z" fill={c.hair} />

      {/* Raised Arm Holding Access Pass */}
      <path d="M 170 155 L 205 135" stroke={c.text} strokeWidth="3" strokeLinecap="round" />
      <rect x="202" y="118" width="22" height="26" rx="4" fill={c.cyan} stroke={c.text} strokeWidth="1.5" />
      <circle cx="213" cy="128" r="4" fill={c.bgCard} />

      {/* Visual Role Badges */}
      <rect x="35" y="140" width="70" height="26" rx="6" fill={c.bgCard} stroke={c.emerald} strokeWidth="1.5" />
      <text x="70" y="157" textAnchor="middle" fill={c.text} fontSize="10" fontWeight="700">Trainee</text>

      <rect x="235" y="80" width="70" height="26" rx="6" fill={c.bgCard} stroke={c.violet} strokeWidth="1.5" />
      <text x="270" y="97" textAnchor="middle" fill={c.text} fontSize="10" fontWeight="700">Trainer</text>

      <rect x="135" y="38" width="70" height="26" rx="6" fill={c.bgCard} stroke={c.amber} strokeWidth="1.5" />
      <text x="170" y="55" textAnchor="middle" fill={c.text} fontSize="10" fontWeight="700">Admin</text>
    </svg>
  );
};

/* 2. Trainee Registration — "Building Skills" */
const renderBuildingSkillsTrainee = (c) => {
  return (
    <svg viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <rect x="20" y="20" width="300" height="260" rx="16" fill={c.bgCard} stroke={c.border} strokeWidth="1.5" />

      {/* Competency Skill Path Blocks */}
      <rect x="50" y="220" width="60" height="20" rx="4" fill={c.cyan} stroke={c.text} strokeWidth="1.5" />
      <rect x="115" y="175" width="65" height="20" rx="4" fill={c.blue} stroke={c.text} strokeWidth="1.5" />
      <rect x="190" y="130" width="70" height="20" rx="4" fill={c.emerald} stroke={c.text} strokeWidth="1.5" />

      {/* Connecting Pathway */}
      <path d="M 80 220 L 145 175 L 225 130 L 260 70" stroke={c.cyan} strokeWidth="2.5" strokeDasharray="4 4" />

      {/* Achievement Goal Flag */}
      <path d="M 260 50 V 90" stroke={c.text} strokeWidth="3" strokeLinecap="round" />
      <path d="M 260 50 L 295 65 L 260 80 Z" fill={c.emerald} stroke={c.text} strokeWidth="1.5" />

      {/* Learner Figure Placing Module */}
      <path d="M 120 175 L 115 220" stroke={c.text} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 130 175 L 135 220" stroke={c.text} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 110 125 L 140 125 L 135 175 L 115 175 Z" fill={c.blue} stroke={c.text} strokeWidth="1.5" />
      <circle cx="125" cy="105" r="13" fill={c.skin} stroke={c.text} strokeWidth="1.5" />
      <path d="M 115 102 C 115 90 135 90 135 102 Z" fill={c.hair} />

      {/* Arms Holding Skill Module */}
      <path d="M 120 135 L 145 140 M 130 135 L 145 140" stroke={c.text} strokeWidth="2.5" />
      <rect x="145" y="130" width="30" height="22" rx="4" fill={c.emerald} stroke={c.text} strokeWidth="1.5" />
    </svg>
  );
};

/* 3. Trainer Application — "Guiding Capability" */
const renderGuidingCapabilityTrainer = (c) => {
  return (
    <svg viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <rect x="20" y="20" width="300" height="260" rx="16" fill={c.bgCard} stroke={c.border} strokeWidth="1.5" />

      {/* Central Trainer Figure (Violet Accent) */}
      <path d="M 165 190 L 155 255" stroke={c.text} strokeWidth="4" strokeLinecap="round" />
      <path d="M 175 190 L 185 255" stroke={c.text} strokeWidth="4" strokeLinecap="round" />
      <path d="M 150 130 L 190 130 L 185 190 L 155 190 Z" fill={c.violet} stroke={c.text} strokeWidth="1.5" />
      <circle cx="170" cy="110" r="14" fill={c.skin} stroke={c.text} strokeWidth="1.5" />
      <path d="M 158 106 C 158 92 182 92 182 106 Z" fill={c.hair} />

      {/* Outstretched Arms with Assessment & Knowledge Modules */}
      <path d="M 160 145 L 105 160 M 180 145 L 235 160" stroke={c.text} strokeWidth="3" strokeLinecap="round" />

      {/* Two Learners Receiving Guidance */}
      {/* Learner Left */}
      <circle cx="70" cy="180" r="10" fill={c.skin} stroke={c.text} strokeWidth="1.5" />
      <path d="M 55 200 L 85 200 L 80 250 L 60 250 Z" fill={c.cyan} stroke={c.text} strokeWidth="1.5" />

      {/* Learner Right */}
      <circle cx="270" cy="180" r="10" fill={c.skin} stroke={c.text} strokeWidth="1.5" />
      <path d="M 255 200 L 285 200 L 280 250 L 260 250 Z" fill={c.emerald} stroke={c.text} strokeWidth="1.5" />

      {/* Knowledge Documents */}
      <rect x="90" y="145" width="28" height="34" rx="4" fill={c.bgSurface} stroke={c.text} strokeWidth="1.5" />
      <line x1="95" y1="155" x2="110" y2="155" stroke={c.cyan} strokeWidth="2" />
      <line x1="95" y1="163" x2="113" y2="163" stroke={c.text} strokeWidth="1.5" />

      <rect x="220" y="145" width="28" height="34" rx="4" fill={c.bgSurface} stroke={c.text} strokeWidth="1.5" />
      <line x1="225" y1="155" x2="240" y2="155" stroke={c.emerald} strokeWidth="2" />
      <line x1="225" y1="163" x2="243" y2="163" stroke={c.text} strokeWidth="1.5" />

      {/* Verified Badge */}
      <circle cx="170" cy="65" r="22" fill={c.amber} stroke={c.text} strokeWidth="1.5" />
      <path d="M 162 65 L 168 71 L 178 59" stroke={c.bgCard} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* 4. Organization Registration — "Coordinating Capacity" (FLAGSHIP) */
const renderCoordinatingCapacityAdmin = (c) => {
  return (
    <svg viewBox="0 0 360 310" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <rect x="15" y="15" width="330" height="280" rx="18" fill={c.bgCard} stroke={c.border} strokeWidth="1.5" />

      {/* Workshop Desk Surface */}
      <rect x="35" y="210" width="290" height="14" rx="4" fill={c.bgSurface} stroke={c.border} strokeWidth="1.5" />

      {/* Modular Organization Ecosystem Blocks */}
      {/* Central Core */}
      <rect x="145" y="150" width="70" height="60" rx="8" fill={c.cyan} stroke={c.text} strokeWidth="1.5" />
      <text x="180" y="185" textAnchor="middle" fill="#06101D" fontSize="11" fontWeight="800">CC CORE</text>

      {/* Left Trainer Branch Block */}
      <rect x="60" y="170" width="60" height="40" rx="6" fill={c.violet} stroke={c.text} strokeWidth="1.5" />
      <text x="90" y="194" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="700">Trainers</text>
      <path d="M 120 190 L 145 190" stroke={c.cyan} strokeWidth="2" strokeDasharray="3 3" />

      {/* Right Learner Branch Block */}
      <rect x="240" y="170" width="60" height="40" rx="6" fill={c.emerald} stroke={c.text} strokeWidth="1.5" />
      <text x="270" y="194" textAnchor="middle" fill="#06101D" fontSize="9" fontWeight="700">Learners</text>
      <path d="M 215 190 L 240 190" stroke={c.cyan} strokeWidth="2" strokeDasharray="3 3" />

      {/* Top Key Seal Block */}
      <rect x="140" y="80" width="80" height="40" rx="6" fill={c.bgSurface} stroke={c.amber} strokeWidth="1.5" />
      <text x="180" y="104" textAnchor="middle" fill={c.text} fontSize="9" fontWeight="800">KEYS VERIFIED</text>
      <path d="M 180 120 L 180 150" stroke={c.cyan} strokeWidth="2" strokeDasharray="3 3" />

      {/* Administrator Character */}
      <path d="M 50 125 L 42 170" stroke={c.text} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 58 125 L 62 170" stroke={c.text} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 40 75 L 70 75 L 65 125 L 45 125 Z" fill={c.blue} stroke={c.text} strokeWidth="1.5" />
      <circle cx="55" cy="55" r="13" fill={c.skin} stroke={c.text} strokeWidth="1.5" />
      <path d="M 45 52 C 45 40 65 40 65 52 Z" fill={c.hair} />

      {/* Arm pointing toward assembly */}
      <path d="M 60 85 L 90 95" stroke={c.text} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};
