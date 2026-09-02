/**
 * CapabilityThread: Visual background SVG path & step numeral overlay.
 * Connects illustration field to form workspace with route-specific milestone nodes.
 * Marked aria-hidden="true" and pointer-events: none.
 */
export const CapabilityThread = ({ currentStep = 1, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const activeColor = isDark ? '#22D3EE' : '#0891B2';
  const trackColor = isDark ? 'rgba(226, 232, 240, 0.08)' : 'rgba(15, 43, 73, 0.12)';

  // Format step numeral string (e.g. "01", "02", "03", "04")
  const stepNumeralStr = String(currentStep).padStart(2, '0');

  return (
    <>
      {/* Background Step Numeral Overlay */}
      <div className="cc-bg-numeral" aria-hidden="true">
        {stepNumeralStr}
      </div>

      {/* SVG Connecting Thread */}
      <svg
        className="cc-capability-thread-svg"
        viewBox="0 0 1000 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.65
        }}
      >
        {/* Main Organic Connecting Curve */}
        <path
          d="M 50 200 C 200 120, 350 280, 500 200 C 650 120, 800 280, 950 200"
          stroke={trackColor}
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        {/* Highlighted Active Curve Segment */}
        <path
          d="M 50 200 C 200 120, 350 280, 500 200"
          stroke={activeColor}
          strokeWidth="2.5"
          strokeDasharray="4 4"
          style={{
            opacity: currentStep >= 2 ? 0.9 : 0.3,
            transition: 'opacity 0.3s ease, stroke-dashoffset 0.5s ease'
          }}
        />

        {/* Milestone Nodes */}
        <circle cx="200" cy="160" r="5" fill={currentStep >= 1 ? activeColor : trackColor} />
        <circle cx="500" cy="200" r="5" fill={currentStep >= 2 ? activeColor : trackColor} />
        <circle cx="800" cy="240" r="5" fill={currentStep >= 3 ? activeColor : trackColor} />
      </svg>
    </>
  );
};
