import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Utensils, Leaf, Wind, Award, TrendingUp, Calendar, Sparkles, Users } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import communityVolunteers from "@/assets/community-volunteers.jpg";
import communityImpact from "@/assets/community-impact.jpg";

const badges = [
  { label: "First Meal", earned: true, icon: "🍽️" },
  { label: "100 Meals", earned: true, icon: "🏅" },
  { label: "Green Hero", earned: true, icon: "🌿" },
  { label: "500 Meals", earned: false, icon: "🏆" },
];

const ImpactDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 relative">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-ambient" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full bg-secondary/8 blur-[100px] animate-ambient" style={{ animationDelay: '-6s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-6 flex items-center gap-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-full glass-card flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-display font-bold text-foreground"
        >
          Your Impact
        </motion.h1>
      </div>

      <div className="relative z-10 px-6">
        {/* Hero impact card with community photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden mb-6 shadow-2xl"
        >
          {/* Background image */}
          <img 
            src={communityVolunteers} 
            alt="Community impact" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          
          {/* Content */}
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm text-foreground/80">Total Meals Shared</p>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-display font-bold text-foreground mb-4"
            >
              128
            </motion.p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl">
                <Leaf className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-lg font-bold text-foreground">45 kg</p>
                  <p className="text-xs text-muted-foreground">Food Saved</p>
                </div>
              </div>
              <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl">
                <Wind className="w-4 h-4 text-accent" />
                <div>
                  <p className="text-lg font-bold text-foreground">112 kg</p>
                  <p className="text-xs text-muted-foreground">CO₂ Reduced</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monthly chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-card-strong rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Monthly Activity
            </h3>
            <span className="text-xs text-muted-foreground glass-light px-2 py-1 rounded-full">Jan 2026</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {[40, 65, 30, 80, 55, 90, 45, 70, 60, 85, 50, 75].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${h}%`, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                className={`flex-1 rounded-t-lg transition-all duration-300 ${
                  i === 5 ? "gradient-primary glow-primary" : "bg-primary/20 hover:bg-primary/30"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </motion.div>

        {/* Community impact image card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-3xl overflow-hidden mb-6 h-36 group cursor-pointer"
        >
          <img 
            src={communityImpact} 
            alt="Children receiving food" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
          <div className="absolute inset-0 flex items-center p-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-secondary" />
                <p className="text-xs text-foreground/70">Lives Touched</p>
              </div>
              <p className="text-3xl font-display font-bold text-foreground mb-1">2,450+</p>
              <p className="text-xs text-muted-foreground">Across 15 communities</p>
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-secondary" />
            Badges Earned
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`glass-card rounded-2xl p-3 text-center cursor-pointer transition-all duration-300 ${
                  !badge.earned ? "opacity-40" : "hover:neon-outline"
                }`}
              >
                <span className="text-2xl block mb-1">{badge.icon}</span>
                <p className="text-xs font-medium text-foreground">{badge.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-card-strong rounded-3xl p-6 mt-6"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Leaderboard
          </h3>
          {[
            { rank: 1, name: "Arun Kumar", meals: 128, you: true },
            { rank: 2, name: "Priya Singh", meals: 115, you: false },
            { rank: 3, name: "Raj Patel", meals: 98, you: false },
          ].map((user, i) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`flex items-center gap-3 py-3 ${i !== 2 && "border-b border-border"}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                user.rank === 1 ? "gradient-warm text-primary-foreground glow-warm" : "glass-light text-muted-foreground"
              }`}>
                {user.rank}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${user.you ? "text-primary" : "text-foreground"}`}>
                  {user.name} {user.you && <span className="text-xs text-muted-foreground">(You)</span>}
                </p>
              </div>
              <span className="text-sm font-semibold text-foreground">{user.meals} meals</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ImpactDashboard;
