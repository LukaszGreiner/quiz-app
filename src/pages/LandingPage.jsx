import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

// Landing page components
import Header from "../components/LandingPage/Header";
import HeroSection from "../components/LandingPage/HeroSection";
import FeaturesSection from "../components/LandingPage/FeaturesSection";
import HowItWorksSection from "../components/LandingPage/HowItWorksSection";
import FeaturedQuizzes from "../components/LandingPage/FeaturedQuizzes";
import TestimonialsSection from "../components/LandingPage/TestimonialsSection";
import CTASection from "../components/LandingPage/CTASection";
import Footer from "../components/LandingPage/Footer";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Jeśli użytkownik jest zalogowany, przekieruj go do strony głównej
    if (isAuthenticated) navigate("/app", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="bg-background text-text min-h-screen antialiased">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedQuizzes />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
