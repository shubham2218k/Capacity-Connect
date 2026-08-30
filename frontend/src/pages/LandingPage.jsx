import '../styles/landing.css';

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

const LandingPage = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      <LandingNavbar scrollToSection={scrollToSection} />
      <HeroSection scrollToSection={scrollToSection} />
      <AudienceStrip />
      <CapacityCycleSection />
      <RolePortalsSection />
      <CompetencyMatchSection />
      <FeatureBentoGrid />
      <AdminMonitoringSection />
      <SecurityIsolationSection />
      <FinalCTASection />
      <LandingFooter scrollToSection={scrollToSection} />
    </div>
  );
};

export default LandingPage;
