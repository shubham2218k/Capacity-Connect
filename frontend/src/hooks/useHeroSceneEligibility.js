import { useState, useEffect } from 'react';

const checkEligibility = (prefersReducedMotion) => {
  if (prefersReducedMotion || typeof window === 'undefined') {
    return false;
  }

  // 1. Desktop viewport check (>= 900px)
  const isDesktop = window.innerWidth >= 900;
  
  // 2. Fine pointer check
  const hasFinePointer = window.matchMedia ? window.matchMedia('(pointer: fine)').matches : true;

  // 3. WebGL support check
  let hasWebGL = false;
  try {
    const canvas = document.createElement('canvas');
    hasWebGL = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    // WebGL unsupported or context creation thrown
  }

  return isDesktop && hasFinePointer && hasWebGL;
};

export const useHeroSceneEligibility = (prefersReducedMotion) => {
  const [isEligible, setIsEligible] = useState(() => checkEligibility(prefersReducedMotion));

  useEffect(() => {
    const updateEligibility = () => {
      setIsEligible(checkEligibility(prefersReducedMotion));
    };

    updateEligibility();

    window.addEventListener('resize', updateEligibility);
    return () => window.removeEventListener('resize', updateEligibility);
  }, [prefersReducedMotion]);

  return isEligible;
};
