import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Leaf, Users, ArrowRight, Sparkles, Utensils, MapPin, Shield, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import heroVideo from "@/assets/hero-video.mp4";
import heroImage from "@/assets/hero-food-sharing.jpg";
import communityImg from "@/assets/community-volunteers.jpg";
import impactImg from "@/assets/community-impact.jpg";

const features = [
  { icon: Utensils, title: "Share Food", desc: "Donate surplus meals to those in need", color: "text-primary", bg: "bg-primary/15" },
  { icon: MapPin, title: "GPS Matching", desc: "Auto-connect with nearby NGOs", color: "text-secondary", bg: "bg-secondary/15" },
  { icon: Shield, title: "AI Powered", desc: "Smart spoilage detection & suggestions", color: "text-accent", bg: "bg-accent/15" },
  { icon: Users, title: "Community", desc: "Join 500+ volunteers making impact", color: "text-primary", bg: "bg-primary/15" },
];

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-ambient" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-secondary/8 blur-[100px] animate-ambient" style={{ animationDelay: "-5s" }} />
      </div>

      {/* Hero video section */}
      <div className="relative h-[60vh] overflow-hidden">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            {t("app.tagline")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-display font-bold text-foreground text-center mb-3 leading-tight"
          >
            From Excess{" "}
            <span className="text-gradient-primary">to Everyone</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground text-center mb-6 max-w-xs"
          >
            {t("splash.subtitle")}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.03, boxShadow: "0 0 40px hsl(160 60% 45% / 0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(user ? "/select-role" : "/auth")}
            className="gradient-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl flex items-center gap-3 glow-primary"
          >
            {t("splash.getStarted")}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card-strong rounded-3xl p-4 flex justify-around"
        >
          {[
            { value: "12K+", label: t("splash.mealsShared") },
            { value: "500+", label: t("splash.volunteers") },
            { value: "85+", label: t("splash.ngos") },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              className="text-center"
            >
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Features */}
      <div className="px-6 mt-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-lg font-display font-bold text-foreground mb-4"
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -3 }}
              className="glass-card rounded-2xl p-4 cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <p className="text-sm font-semibold text-foreground">{f.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Community images */}
      <div className="px-6 mt-8 pb-12 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
            className="rounded-2xl overflow-hidden h-40 relative group"
          >
            <img src={communityImg} alt="Community" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <p className="text-sm font-semibold text-foreground">Our Volunteers</p>
              <p className="text-xs text-muted-foreground">Making a difference daily</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6 }}
            className="rounded-2xl overflow-hidden h-40 relative group"
          >
            <img src={impactImg} alt="Impact" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <p className="text-sm font-semibold text-foreground">Real Impact</p>
              <p className="text-xs text-muted-foreground">2,450+ lives touched</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
