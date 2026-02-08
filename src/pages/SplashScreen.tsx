import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Leaf, Users, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-food-sharing.jpg";

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl translate-x-1/3 translate-y-1/3" />

        {/* Floating icons */}
        <motion.div
          className="absolute top-20 right-12 glass-card rounded-2xl p-3"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-6 h-6 text-destructive" />
        </motion.div>
        <motion.div
          className="absolute top-40 left-8 glass-card rounded-2xl p-3"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Leaf className="w-6 h-6 text-primary" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 right-16 glass-card rounded-2xl p-3"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Users className="w-6 h-6 text-secondary" />
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-md"
        >
          {/* Hero image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-64 h-48 mx-auto mb-8 rounded-3xl overflow-hidden shadow-xl"
          >
            <img src={heroImage} alt="Food sharing community" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            🌱 Reduce Waste. Feed Lives.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight"
          >
            From Excess{" "}
            <span className="text-gradient-primary">to Everyone</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground text-lg mb-8 leading-relaxed"
          >
            Connect surplus food with those who need it most. Every meal matters.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/select-role")}
            className="gradient-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg flex items-center gap-3 mx-auto pulse-glow"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="relative z-10 flex gap-6 mt-12"
        >
          {[
            { value: "12K+", label: "Meals Shared" },
            { value: "500+", label: "Volunteers" },
            { value: "85+", label: "NGOs" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
