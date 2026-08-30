const HeroSceneFallback = ({ theme }) => {
  const isDark = theme === 'dark';

  const nodeColorCore = isDark ? '#22D3EE' : '#0891B2';
  const nodeColorAdmin = isDark ? '#0EA5E9' : '#2563EB';
  const nodeColorTrainer = isDark ? '#8B5CF6' : '#7C3AED';
  const nodeColorTrainee = isDark ? '#34D399' : '#059669';
  const lineColor = isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(8, 145, 178, 0.15)';

  return (
    <div 
      className="lp-hero-scene-fallback"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.6
      }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="coreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={nodeColorCore} stopOpacity="0.4" />
            <stop offset="100%" stopColor={nodeColorAdmin} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Orbit Rings */}
        <circle cx="500" cy="300" r="180" fill="none" stroke={lineColor} strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="500" cy="300" r="280" fill="none" stroke={lineColor} strokeWidth="1" />

        {/* Connecting Line Network */}
        <line x1="500" y1="300" x2="320" y2="180" stroke={lineColor} strokeWidth="1.5" />
        <line x1="500" y1="300" x2="680" y2="180" stroke={lineColor} strokeWidth="1.5" />
        <line x1="500" y1="300" x2="500" y2="460" stroke={lineColor} strokeWidth="1.5" />

        <line x1="320" y1="180" x2="220" y2="120" stroke={lineColor} strokeWidth="1" />
        <line x1="320" y1="180" x2="250" y2="240" stroke={lineColor} strokeWidth="1" />
        <line x1="680" y1="180" x2="780" y2="120" stroke={lineColor} strokeWidth="1" />
        <line x1="680" y1="180" x2="750" y2="240" stroke={lineColor} strokeWidth="1" />
        <line x1="500" y1="460" x2="400" y2="520" stroke={lineColor} strokeWidth="1" />
        <line x1="500" y1="460" x2="600" y2="520" stroke={lineColor} strokeWidth="1" />

        {/* Central Core */}
        <circle cx="500" cy="300" r="24" fill="url(#coreGlow)" stroke={nodeColorCore} strokeWidth="2" />
        <circle cx="500" cy="300" r="8" fill={nodeColorCore} />

        {/* Role Cluster Nodes */}
        {/* Admin Cluster */}
        <g transform="translate(320, 180)">
          <circle cx="0" cy="0" r="18" fill="rgba(14, 165, 233, 0.2)" stroke={nodeColorAdmin} strokeWidth="2" />
          <circle cx="0" cy="0" r="6" fill={nodeColorAdmin} />
          <circle cx="-100" cy="-60" r="4" fill={nodeColorAdmin} opacity="0.7" />
          <circle cx="-70" cy="60" r="4" fill={nodeColorAdmin} opacity="0.7" />
        </g>

        {/* Trainer Cluster */}
        <g transform="translate(680, 180)">
          <circle cx="0" cy="0" r="18" fill="rgba(139, 92, 246, 0.2)" stroke={nodeColorTrainer} strokeWidth="2" />
          <circle cx="0" cy="0" r="6" fill={nodeColorTrainer} />
          <circle cx="100" cy="-60" r="4" fill={nodeColorTrainer} opacity="0.7" />
          <circle cx="70" cy="60" r="4" fill={nodeColorTrainer} opacity="0.7" />
        </g>

        {/* Trainee Cluster */}
        <g transform="translate(500, 460)">
          <circle cx="0" cy="0" r="18" fill="rgba(52, 211, 153, 0.2)" stroke={nodeColorTrainee} strokeWidth="2" />
          <circle cx="0" cy="0" r="6" fill={nodeColorTrainee} />
          <circle cx="-100" cy="60" r="4" fill={nodeColorTrainee} opacity="0.7" />
          <circle cx="100" cy="60" r="4" fill={nodeColorTrainee} opacity="0.7" />
        </g>
      </svg>
    </div>
  );
};

export default HeroSceneFallback;
