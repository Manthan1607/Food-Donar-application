import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Heart, ArrowRight, Sparkles, Utensils, MapPin, Shield, Users, ChevronDown, Zap, Globe, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import heroVideo from "@/assets/hero-cinematic.mp4";
import heroBanner from "@/assets/hero-banner.jpg";
import communityImg from "@/assets/community-volunteers.jpg";
import impactImg from "@/assets/community-impact.jpg";

const features = [
  { icon: Utensils, title: "Share Food", desc: "Donate surplus meals to those in need", color: "text-primary", bg: "bg-primary/15", delay: 0 },
  { icon: MapPin, title: "GPS Matching", desc: "Auto-connect with nearby NGOs", color: "text-secondary", bg: "bg-secondary/15", delay: 0.1 },
  { icon: Shield, title: "AI Powered", desc: "Smart spoilage detection & suggestions", color: "text-accent", bg: "bg-accent/15", delay: 0.2 },
  { icon: Users, title: "Community", desc: "Join 500+ volunteers making impact", color: "text-primary", bg: "bg-primary/15", delay: 0.3 },
];

const impactNumbers = [
  { icon: Heart, value: "12,450+", label: "Meals Shared", suffix: "" },
  { icon: Users, value: "500+", label: "Active Volunteers", suffix: "" },
  { icon: Globe, value: "85+", label: "Partner NGOs", suffix: "" },
  { icon: TrendingUp, value: "2.4T", label: "CO₂ Reduced (kg)", suffix: "" },
];

const ScrollReveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.85]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative h-[100vh] overflow-hidden">
        {/* Video with parallax zoom */}
        <motion.div style={{ scale: videoScale, opacity: videoOpacity }} className="absolute inset-0">
          <video
            src={heroVideo}
            autoPlay muted loop playsInline
            poster={heroBanner}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>

        {/* Multi-layer gradient overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-transparent" />

        {/* Animated glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -25, 15, 0], y: [0, 15, -25, 0], scale: [1, 0.9, 1.1, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full bg-secondary/15 blur-[80px]"
          />
        </div>

        {/* Hero content */}
        <motion.div
          style={{ y: textY }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-primary text-sm font-medium mb-6 neon-outline"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            {t("app.tagline")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-display font-bold text-foreground text-center mb-4 leading-[1.1] tracking-tight"
          >
            From Excess
            <br />
            <span className="text-gradient-primary">to Everyone</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-muted-foreground text-center mb-8 max-w-sm text-base md:text-lg"
          >
            {t("splash.subtitle")}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px hsl(160 60% 45% / 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(user ? "/select-role" : "/auth")}
            className="gradient-primary text-primary-foreground px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl flex items-center gap-3 glow-primary relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-3">
              {t("splash.getStarted")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ LIVE IMPACT COUNTER ═══ */}
      <section className="px-6 py-10 relative z-10">
        <ScrollReveal>
          <div className="glass-card-strong rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary font-medium uppercase tracking-widest">Live Impact</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {impactNumbers.map((item, i) => (
                <ScrollReveal key={item.label} delay={i * 0.1}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-display font-bold text-foreground">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══ VIDEO SHOWCASE ═══ */}
      <section className="px-6 pb-8 relative z-10">
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
            <motion.video
              src={heroVideo}
              muted autoPlay loop playsInline
              className="w-full h-52 object-cover"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                transition={{ duration: 0.6 }}
                className="h-1 rounded-full gradient-primary mb-3"
              />
              <p className="text-foreground font-display font-semibold text-lg leading-tight">
                "Every meal shared is a life touched"
              </p>
              <p className="text-xs text-muted-foreground mt-1">Watch our mission in action</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="px-6 py-8 relative z-10">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-display font-bold text-foreground">How It Works</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={f.delay}>
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card rounded-2xl p-4 cursor-pointer group relative overflow-hidden h-full"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <p className="text-sm font-semibold text-foreground relative z-10">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-1 relative z-10">{f.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ COMMUNITY SHOWCASE ═══ */}
      <section className="px-6 py-8 pb-16 relative z-10">
        <ScrollReveal>
          <h2 className="text-xl font-display font-bold text-foreground mb-5">Our Community</h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-3">
          {[
            { img: communityImg, title: "Our Volunteers", sub: "Making a difference daily", dir: -1 },
            { img: impactImg, title: "Real Impact", sub: "2,450+ lives touched", dir: 1 },
          ].map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                className="rounded-2xl overflow-hidden h-44 relative group cursor-pointer"
              >
                <motion.img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.7 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-semibold text-foreground">{card.title}</p>
                  <p className="text-xs text-muted-foreground">{card.sub}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ FLOATING CTA ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 left-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(user ? "/select-role" : "/auth")}
          className="w-full gradient-primary text-primary-foreground py-4 rounded-2xl font-semibold text-base shadow-2xl flex items-center justify-center gap-2 glow-primary"
        >
          <Heart className="w-5 h-5" />
          Start Sharing Food
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Index;
