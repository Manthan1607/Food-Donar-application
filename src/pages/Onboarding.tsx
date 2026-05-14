import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, MapPin, Camera, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-food-sharing.jpg";
import communityImg from "@/assets/community-volunteers.jpg";
import impactImg from "@/assets/community-impact.jpg";
import { SEO } from "@/components/SEO";

const slides = [
  {
    image: heroImage,
    icon: Heart,
    title: "Share Surplus Food",
    subtitle: "Connect excess food with people who need it most. Every meal matters.",
    color: "text-primary",
  },
  {
    image: communityImg,
    icon: MapPin,
    title: "Real-Time Matching",
    subtitle: "GPS-powered matching connects donors with nearby NGOs and volunteers instantly.",
    color: "text-secondary",
  },
  {
    image: impactImg,
    icon: Camera,
    title: "Track Your Impact",
    subtitle: "Capture, share, and measure your contribution to reducing food waste.",
    color: "text-accent",
  },
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      localStorage.setItem("onboarding-complete", "true");
      navigate("/auth");
    } else {
      setCurrentSlide((p) => p + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding-complete", "true");
    navigate("/auth");
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <SEO
        title="Welcome to FoodDonar — getting started"
        description="See how FoodDonar matches surplus food with nearby NGOs and volunteers in real time. A 30-second walkthrough."
        path="/onboarding"
      />
      <h1 className="sr-only">Getting started with FoodDonar</h1>
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div key={currentSlide} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </motion.div>
      </AnimatePresence>

      {/* Skip */}
      <div className="relative z-10 flex justify-end px-6 pt-14">
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleSkip} className="text-sm text-muted-foreground font-medium px-4 py-2 rounded-full glass-card">
          Skip
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-end relative z-10 px-6 pb-12">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card ${slide.color} text-sm font-medium mb-4`}>
              <slide.icon className="w-4 h-4" />
              <span>{currentSlide + 1}/{slides.length}</span>
            </div>

            <h1 className="text-3xl font-display font-bold text-foreground mb-3 leading-tight">{slide.title}</h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">{slide.subtitle}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center gap-3 mb-6">
          {slides.map((_, i) => (
            <motion.div key={i} animate={{ width: i === currentSlide ? 24 : 8 }} className={`h-2 rounded-full transition-colors ${i === currentSlide ? "gradient-primary" : "bg-muted-foreground/30"}`} />
          ))}
        </div>

        {/* CTA */}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleNext} className="w-full gradient-primary text-primary-foreground py-4 rounded-2xl font-semibold text-lg shadow-xl glow-primary flex items-center justify-center gap-2">
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default Onboarding;
