import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useSmoothScroll = (prefersReducedMotion) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') {
      return;
    }

    // Lenis should only initialize on desktop devices with fine pointer & hover support
    const isDesktop = window.innerWidth >= 1180;
    const hasFinePointer = window.matchMedia ? window.matchMedia('(pointer: fine)').matches : true;
    const hasHover = window.matchMedia ? window.matchMedia('(hover: hover)').matches : true;

    if (!isDesktop || !hasFinePointer || !hasHover) {
      return;
    }

    // Add temporary Lenis override class to document root
    document.documentElement.classList.add('cc-lenis-active');

    // Initialize Lenis with smooth wheel settings
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0
    });

    lenisRef.current = lenis;

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker with Lenis RAF loop (converting seconds to milliseconds)
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Cleanup on unmount
    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove('cc-lenis-active');
    };
  }, [prefersReducedMotion]);

  const scrollTo = (targetId) => {
    const element = document.getElementById(targetId);
    if (!element) return;

    if (lenisRef.current && !prefersReducedMotion) {
      lenisRef.current.scrollTo(element, { offset: -80 });
    } else {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return { scrollTo };
};
