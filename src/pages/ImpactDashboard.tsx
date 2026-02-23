import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Utensils, Leaf, Wind, Award, TrendingUp, Calendar, Sparkles, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import communityVolunteers from "@/assets/community-volunteers.jpg";
import communityImpact from "@/assets/community-impact.jpg";

const badgeThresholds = [
  { label: "First Meal", threshold: 1, icon: "🍽️" },
  { label: "50 Meals", threshold: 50, icon: "🏅" },
  { label: "Green Hero", threshold: 100, icon: "🌿" },
  { label: "500 Meals", threshold: 500, icon: "🏆" },
];

const ImpactDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ meals: 0, foodKg: 0, co2Kg: 0 });
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const [leaderboard, setLeaderboard] = useState<{ name: string; meals: number; isYou: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadImpactData();
  }, [user]);

  const loadImpactData = async () => {
    if (!user) return;

    // Fetch user's impact logs
    const { data: impactData } = await supabase
      .from("impact_logs")
      .select("meals_served, food_saved_kg, co2_reduced_kg, created_at")
      .eq("user_id", user.id);

    const logs = impactData || [];
    const totalMeals = logs.reduce((s, r) => s + (r.meals_served || 0), 0);
    const totalFoodKg = logs.reduce((s, r) => s + Number(r.food_saved_kg || 0), 0);
    const totalCo2 = logs.reduce((s, r) => s + Number(r.co2_reduced_kg || 0), 0);
    setStats({ meals: totalMeals, foodKg: Math.round(totalFoodKg), co2Kg: Math.round(totalCo2) });

    // Build monthly chart from donations
    const { data: donations } = await supabase
      .from("donations")
      .select("quantity, created_at")
      .eq("donor_id", user.id);

    const monthly = Array(12).fill(0);
    (donations || []).forEach(d => {
      const month = new Date(d.created_at).getMonth();
      monthly[month] += d.quantity || 1;
    });
    const maxVal = Math.max(...monthly, 1);
    setMonthlyData(monthly.map(v => Math.round((v / maxVal) * 100)));

    // Leaderboard from all impact_logs
    const { data: allImpact } = await supabase
      .from("impact_logs")
      .select("user_id, meals_served");

    const userTotals: Record<string, number> = {};
    (allImpact || []).forEach(r => {
      if (r.user_id) {
        userTotals[r.user_id] = (userTotals[r.user_id] || 0) + (r.meals_served || 0);
      }
    });

    // Get profiles for names
    const userIds = Object.keys(userTotals);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .in("user_id", userIds.length > 0 ? userIds : ["none"]);

    const profileMap: Record<string, string> = {};
    (profiles || []).forEach(p => { profileMap[p.user_id] = p.display_name; });

    const lb = Object.entries(userTotals)
      .map(([uid, meals]) => ({
        name: profileMap[uid] || "Unknown",
        meals,
        isYou: uid === user.id,
      }))
      .sort((a, b) => b.meals - a.meals)
      .slice(0, 5);

    setLeaderboard(lb.length > 0 ? lb : [{ name: profileMap[user.id] || "You", meals: totalMeals, isYou: true }]);
    setLoading(false);
  };

  const badges = badgeThresholds.map(b => ({
    ...b,
    earned: stats.meals >= b.threshold,
  }));

  return (
    <div className="min-h-screen bg-background pb-24 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-ambient" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full bg-secondary/8 blur-[100px] animate-ambient" style={{ animationDelay: '-6s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-6 flex items-center gap-4">
        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-11 h-11 rounded-full glass-card flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-display font-bold text-foreground">
          Your Impact
        </motion.h1>
      </div>

      <div className="relative z-10 px-6">
        {/* Hero impact card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative rounded-3xl overflow-hidden mb-6 shadow-2xl">
          <img src={communityVolunteers} alt="Community impact" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm text-foreground/80">Total Meals Shared</p>
            </div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl font-display font-bold text-foreground mb-4">
              {loading ? "—" : stats.meals}
            </motion.p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl">
                <Leaf className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-lg font-bold text-foreground">{loading ? "—" : `${stats.foodKg} kg`}</p>
                  <p className="text-xs text-muted-foreground">Food Saved</p>
                </div>
              </div>
              <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl">
                <Wind className="w-4 h-4 text-accent" />
                <div>
                  <p className="text-lg font-bold text-foreground">{loading ? "—" : `${stats.co2Kg} kg`}</p>
                  <p className="text-xs text-muted-foreground">CO₂ Reduced</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monthly chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-strong rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Monthly Activity
            </h3>
            <span className="text-xs text-muted-foreground glass-light px-2 py-1 rounded-full">2026</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {(monthlyData.length > 0 ? monthlyData : Array(12).fill(5)).map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${Math.max(h, 5)}%`, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
                className={`flex-1 rounded-t-lg transition-all duration-300 ${
                  h === Math.max(...(monthlyData.length > 0 ? monthlyData : [5])) ? "gradient-primary glow-primary" : "bg-primary/20 hover:bg-primary/30"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Jan</span><span>Jun</span><span>Dec</span>
          </div>
        </motion.div>

        {/* Community impact image */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative rounded-3xl overflow-hidden mb-6 h-36 group cursor-pointer">
          <img src={communityImpact} alt="Children receiving food" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-secondary" /> Badges Earned
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card-strong rounded-3xl p-6 mt-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Leaderboard
          </h3>
          {leaderboard.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`flex items-center gap-3 py-3 ${i !== leaderboard.length - 1 && "border-b border-border"}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i === 0 ? "gradient-warm text-primary-foreground glow-warm" : "glass-light text-muted-foreground"
              }`}>
                {i + 1}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${entry.isYou ? "text-primary" : "text-foreground"}`}>
                  {entry.name} {entry.isYou && <span className="text-xs text-muted-foreground">(You)</span>}
                </p>
              </div>
              <span className="text-sm font-semibold text-foreground">{entry.meals} meals</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ImpactDashboard;
