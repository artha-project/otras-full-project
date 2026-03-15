import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Opportunities from "../components/Opportunities";
import AISection from "../components/AISection";
import Benefits from "../components/Benefits";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import "../index.css";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Opportunities />
      <AISection />
      <Benefits />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}