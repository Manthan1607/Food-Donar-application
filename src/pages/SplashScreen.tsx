import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Leaf, Users, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-food-sharing.jpg";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[100px] animate-ambient"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-secondary/8 blur-[80px] animate-ambient"
          style={{ animationDelay: '-5s' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
        <motion.div
          className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-accent/6 blur-[60px] animate-ambient"
          style={{ animationDelay: '-10s' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Floating icons with glow */}
        <motion.div
          className="absolute top-20 right-12 glass-card rounded-2xl p-3 glow-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.5 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Heart className="w-6 h-6 text-destructive" />
        </motion.div>
        <motion.div
          className="absolute top-40 left-8 glass-card rounded-2xl p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.7 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }
          }}
        >
          <Leaf className="w-6 h-6 text-primary" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 right-16 glass-card rounded-2xl p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.9 },
            y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }}
        >
          <Users className="w-6 h-6 text-secondary" />
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-md"
        >
          {/* Hero image with overlay */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-64 h-48 mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl image-overlay relative group"
          >
            <img 
              src={heroImage} 
              alt="Food sharing community" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            {t("app.tagline")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight"
          >
            {t("app.name").split(" ").slice(0, 2).join(" ")}{" "}
            <span className="text-gradient-primary">{t("app.name").split(" ").slice(2).join(" ")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-muted-foreground text-lg mb-8 leading-relaxed"
          >
            {t("splash.subtitle")}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03, boxShadow: "0 0 40px hsl(160 60% 45% / 0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(user ? "/select-role" : "/auth")}
            className="gradient-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl flex items-center gap-3 mx-auto glow-primary"
          >
            {t("splash.getStarted")}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Stats with glow effect on load */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex gap-6 mt-12"
        >
          {[
            { value: "12K+", label: t("splash.mealsShared") },
            { value: "500+", label: t("splash.volunteers") },
            { value: "85+", label: t("splash.ngos") },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label} 
              className="text-center glass-card px-4 py-3 rounded-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.p 
                className="text-2xl font-display font-bold text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 + i * 0.1 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
