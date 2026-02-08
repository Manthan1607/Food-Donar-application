import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Utensils, Leaf, Wind, Award, TrendingUp, Calendar } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const badges = [
  { label: "First Meal", earned: true, icon: "🍽️" },
  { label: "100 Meals", earned: true, icon: "🏅" },
  { label: "Green Hero", earned: true, icon: "🌿" },
  { label: "500 Meals", earned: false, icon: "🏆" },
];

const ImpactDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <h1 className="text-xl font-display font-bold text-foreground">Your Impact</h1>
      </div>

      <div className="px-6">
        {/* Big impact card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gradient-hero rounded-3xl p-6 text-primary-foreground mb-6 shadow-xl"
        >
          <p className="text-sm text-primary-foreground/70 mb-1">Total Meals Shared</p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-display font-bold mb-4"
          >
            128
          </motion.p>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              <div>
                <p className="text-lg font-bold">45 kg</p>
                <p className="text-xs text-primary-foreground/70">Food Saved</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4" />
              <div>
                <p className="text-lg font-bold">112 kg</p>
                <p className="text-xs text-primary-foreground/70">CO₂ Reduced</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monthly chart placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card-strong rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Monthly Activity
            </h3>
            <span className="text-xs text-muted-foreground">Jan 2026</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {[40, 65, 30, 80, 55, 90, 45, 70, 60, 85, 50, 75].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                className={`flex-1 rounded-t-lg ${i === 5 ? "gradient-primary" : "bg-primary/20"}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
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
                transition={{ delay: 0.4 + i * 0.08 }}
                className={`glass-card rounded-2xl p-3 text-center ${!badge.earned && "opacity-40"}`}
              >
                <span className="text-2xl block mb-1">{badge.icon}</span>
                <p className="text-xs font-medium text-foreground">{badge.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
            <div
              key={user.rank}
              className={`flex items-center gap-3 py-3 ${i !== 2 && "border-b border-border"}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                user.rank === 1 ? "gradient-warm text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {user.rank}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${user.you ? "text-primary" : "text-foreground"}`}>
                  {user.name} {user.you && "(You)"}
                </p>
              </div>
              <span className="text-sm font-semibold text-foreground">{user.meals} meals</span>
            </div>
          ))}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ImpactDashboard;
