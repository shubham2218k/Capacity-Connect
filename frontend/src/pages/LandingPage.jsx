import { useRef } from 'react';
import '../styles/landing.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import { useLandingTheme } from '../hooks/useLandingTheme';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import AudienceStrip from '../components/landing/AudienceStrip';
import CapacityCycleSection from '../components/landing/CapacityCycleSection';
import RolePortalsSection from '../components/landing/RolePortalsSection';
import CompetencyMatchSection from '../components/landing/CompetencyMatchSection';
import FeatureBentoGrid from '../components/landing/FeatureBentoGrid';
import AdminMonitoringSection from '../components/landing/AdminMonitoringSection';
import SecurityIsolationSection from '../components/landing/SecurityIsolationSection';
import FinalCTASection from '../components/landing/FinalCTASection';
import LandingFooter from '../components/landing/LandingFooter';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const landingRef = useRef(null);
  const [theme, toggleTheme] = useLandingTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollTo } = useSmoothScroll(prefersReducedMotion);

  useGSAP(() => {
    if (prefersReducedMotion) return;

    // 1. Scroll Progress Bar Indicator
    gsap.to('#lp-scroll-progress-bar', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: landingRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });

    // 2. Initial Hero Entrance Animation Timeline (Runs once per mount)
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
    
    heroTl
      .fromTo('.lp-navbar', { opacity: 0, y: -20 }, { opacity: 1, y: 0 })
      .fromTo('[data-hero-heading-line]', { opacity: 0, y: 28 }, { opacity: 1, y: 0, stagger: 0.08 }, '-=0.4')
      .fromTo('[data-hero-layer="card"]', { opacity: 0, y: 32, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, '-=0.6')
      .fromTo('[data-hero-layer^="item-"]', { opacity: 0, x: -16 }, { opacity: 1, x: 0, stagger: 0.08 }, '-=0.5');

    // 3. Subtle Non-Pinned Hero Exit Transition on Scroll
    gsap.to('[data-hero-container]', {
      opacity: 0.85,
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '[data-hero-container]',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // 4. Reusable Section Scroll Reveals
    const revealSections = gsap.utils.toArray('[data-section]');
    revealSections.forEach((section) => {
      const header = section.querySelector('.lp-section-header');
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // Batch reveal cards & elements
    const cardSelectors = [
      '[data-audience-pill]',
      '[data-cycle-step]',
      '[data-role-card]',
      '[data-factor-bar]',
      '[data-competency-card]',
      '[data-bento-card]',
      '[data-monitoring-panel]',
      '[data-isolation-box]',
      '[data-cta-card]'
    ];

    cardSelectors.forEach((selector) => {
      const items = gsap.utils.toArray(selector);
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: items[0],
              start: 'top 88%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    });

    // Refresh ScrollTrigger after initial mount layout
    ScrollTrigger.refresh();
  }, { scope: landingRef, dependencies: [prefersReducedMotion] });

  return (
    <div ref={landingRef} className="landing-page" data-theme={theme}>
      <LandingNavbar scrollToSection={scrollTo} theme={theme} toggleTheme={toggleTheme} />
      <HeroSection scrollToSection={scrollTo} theme={theme} prefersReducedMotion={prefersReducedMotion} />
      <AudienceStrip />
      <CapacityCycleSection />
      <RolePortalsSection />
      <CompetencyMatchSection />
      <FeatureBentoGrid />
      <AdminMonitoringSection />
      <SecurityIsolationSection />
      <FinalCTASection />
      <LandingFooter scrollToSection={scrollTo} />
    </div>
  );
};

export default LandingPage;
