import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useHeroPointerDepth = (containerRef, prefersReducedMotion) => {
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') {
      return;
    }

    const container = containerRef?.current;
    if (!container) return;

    // Check fine pointer support
    const hasFinePointer = window.matchMedia ? window.matchMedia('(pointer: fine)').matches : true;
    if (!hasFinePointer) return;

    const cardElement = container.querySelector('[data-hero-layer="card"]');
    const items = container.querySelectorAll('[data-hero-layer^="item-"]');

    if (!cardElement) return;

    // Create fast GSAP quickTo setters
    const xTo = gsap.quickTo(cardElement, 'rotateY', { duration: 0.5, ease: 'power2.out' });
    const yTo = gsap.quickTo(cardElement, 'rotateX', { duration: 0.5, ease: 'power2.out' });

    const itemSetters = Array.from(items).map((item, index) => {
      const offsetFactor = (index + 1) * 3;
      return {
        x: gsap.quickTo(item, 'x', { duration: 0.4, ease: 'power2.out' }),
        y: gsap.quickTo(item, 'y', { duration: 0.4, ease: 'power2.out' }),
        offsetFactor
      };
    });

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

      pointerRef.current = { x, y };

      // Inner card tilt
      xTo(x * 4.5);
      yTo(-y * 3.5);

      // Layer depth displacement
      itemSetters.forEach((setter) => {
        setter.x(x * setter.offsetFactor);
        setter.y(y * (setter.offsetFactor * 0.5));
      });
    };

    const handleMouseLeave = () => {
      pointerRef.current = { x: 0, y: 0 };
      xTo(0);
      yTo(0);
      itemSetters.forEach((setter) => {
        setter.x(0);
        setter.y(0);
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf([cardElement, ...items]);
    };
  }, [containerRef, prefersReducedMotion]);

  return pointerRef;
};
