import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HeroSection from '../components/sections/HeroSection';
import StatsSection from '../components/sections/StatsSection';
import AboutSection from '../components/sections/AboutSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import FeedbackSection from '../components/sections/FeedbackSection';
import FAQSection from '../components/sections/FAQSection';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <FeaturesSection />
      <WhyChooseUs />
      <FeedbackSection />
      <FAQSection />
    </div>
  );
}
