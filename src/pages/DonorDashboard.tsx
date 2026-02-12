import { motion } from "framer-motion";
import { Plus, Bell, MapPin, TrendingUp, Clock, Utensils, Award, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import BottomNav from "@/components/BottomNav";
import StatsCard from "@/components/StatsCard";
import VideoSection from "@/components/VideoSection";
import SOSButton from "@/components/SOSButton";

import foodBiryani from "@/assets/food-biryani.jpg";
import foodBread from "@/assets/food-bread.jpg";
import foodDalRice from "@/assets/food-dal-rice.jpg";

const defaultImages = [foodBiryani, foodBread, foodDalRice];

const DonorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [displayName, setDisplayName] = useState("User");
  const [donations, setDonations] = useState<any[]>([]);
  const [stats, setStats] = useState({ meals: 0, foodKg: 0, level: 1 });
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Fetch profile
    supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data?.display_name) setDisplayName(data.display_name); });

    // Fetch donations
    supabase.from("donations").select("*").eq("donor_id", user.id).order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => { if (data) setDonations(data); });

    // Fetch impact
    supabase.from("impact_logs").select("meals_served, food_saved_kg").eq("user_id", user.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const meals = data.reduce((sum, r) => sum + (r.meals_served || 0), 0);
          const kg = data.reduce((sum, r) => sum + Number(r.food_saved_kg || 0), 0);
          setStats({ meals, foodKg: Math.round(kg), level: Math.min(10, Math.floor(meals / 25) + 1) });
        }
      });

    // Fetch unread alerts count
    supabase.from("alerts").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("read", false)
      .then(({ count }) => { setUnreadAlerts(count || 0); });
  }, [user]);

  const getStatusLabel = (status: string) => {
    if (status === "pending") return "Pending";
    if (status === "accepted") return "Picked Up";
    return "Delivered";
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background pb-24 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/8 blur-[100px] animate-ambient" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full bg-secondary/6 blur-[80px] animate-ambient" style={{ animationDelay: "-5s" }} />
      </div>

      {/* Header */}
      <div className="relative px-6 pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-muted-foreground text-sm">{t("dashboard.welcome")}</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-2xl font-display font-bold text-foreground">{displayName}</motion.h1>
          </div>
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/alerts")} className="w-11 h-11 rounded-full glass-card flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-foreground" />
            {unreadAlerts > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary" />}
          </motion.button>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative z-10 flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4 text-primary" /><span>Mumbai, Maharashtra</span>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-3 gap-3">
          <StatsCard icon={Utensils} value={String(stats.meals)} label={t("dashboard.mealsShared")} color="text-primary" />
          <StatsCard icon={TrendingUp} value={`${stats.foodKg}kg`} label={t("dashboard.foodSaved")} color="text-secondary" />
          <StatsCard icon={Award} value={`Level ${stats.level}`} label={t("dashboard.impactScore")} color="text-accent" />
        </motion.div>
      </div>

      {/* Video Section */}
      <div className="px-6 mt-8 relative z-10">
        <VideoSection taglineKey="video.tagline1" />
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-8 relative z-10">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg font-display font-semibold text-foreground mb-4">{t("dashboard.quickActions")}</motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/add-donation")} className="flex-1 gradient-primary text-primary-foreground rounded-2xl p-4 flex items-center gap-3 shadow-lg glow-primary">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center"><Plus className="w-5 h-5" /></div>
            <div className="text-left"><p className="font-semibold text-sm">{t("dashboard.donateFood")}</p><p className="text-xs text-primary-foreground/70">{t("dashboard.addNew")}</p></div>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/impact")} className="flex-1 glass-card-strong rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-secondary" /></div>
            <div className="text-left"><p className="font-semibold text-sm text-foreground">{t("dashboard.myImpact")}</p><p className="text-xs text-muted-foreground">{t("dashboard.viewStats")}</p></div>
          </motion.button>
        </motion.div>
      </div>

      {/* Recent Donations */}
      <div className="px-6 mt-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg font-display font-semibold text-foreground">{t("dashboard.recentDonations")}</motion.h2>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-sm text-primary font-medium">{t("dashboard.viewAll")}</motion.button>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-3">
          {donations.length === 0 ? (
            <div className="glass-card rounded-2xl p-6 text-center">
              <Utensils className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm text-muted-foreground">No donations yet. Start sharing food! 🍽️</p>
            </div>
          ) : (
            donations.map((donation, i) => (
              <motion.div key={donation.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }} whileHover={{ scale: 1.01, x: 4 }} className="glass-card rounded-2xl p-3 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden relative">
                    <img src={defaultImages[i % defaultImages.length]} alt={donation.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{donation.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{donation.quantity} people</span><span>•</span><Clock className="w-3 h-3" /><span>{timeAgo(donation.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${donation.status === "delivered" ? "bg-primary/15 text-primary neon-outline" : "bg-secondary/15 text-secondary neon-outline-warm"}`}>{getStatusLabel(donation.status)}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      <SOSButton />
      <BottomNav />
    </div>
  );
};

export default DonorDashboard;
