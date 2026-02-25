import { motion, useInView } from "framer-motion";
import { Plus, TrendingUp, Clock, Utensils, Award, ChevronRight, Sparkles, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import StatsCard from "@/components/StatsCard";
import donorVideo from "@/assets/donor-hero.mp4";
import foodBiryani from "@/assets/food-biryani.jpg";
import foodBread from "@/assets/food-bread.jpg";
import foodDalRice from "@/assets/food-dal-rice.jpg";

const defaultImages = [foodBiryani, foodBread, foodDalRice];

const ScrollReveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

const DonorView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [donations, setDonations] = useState<any[]>([]);
  const [stats, setStats] = useState({ meals: 0, foodKg: 0, level: 1 });

  useEffect(() => {
    if (!user) return;
    supabase.from("donations").select("*").eq("donor_id", user.id).order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => { if (data) setDonations(data); });
    supabase.from("impact_logs").select("meals_served, food_saved_kg").eq("user_id", user.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const meals = data.reduce((sum, r) => sum + (r.meals_served || 0), 0);
          const kg = data.reduce((sum, r) => sum + Number(r.food_saved_kg || 0), 0);
          setStats({ meals, foodKg: Math.round(kg), level: Math.min(10, Math.floor(meals / 25) + 1) });
        }
      });
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
    <div className="space-y-6">
      {/* Video Banner */}
      <ScrollReveal>
        <div className="relative rounded-2xl overflow-hidden h-40">
          <motion.video src={donorVideo} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-foreground font-display font-semibold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> "Every plate shared, a story of hope"
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <ScrollReveal delay={0.05}>
        <div className="grid grid-cols-3 gap-3">
          <StatsCard icon={Utensils} value={String(stats.meals)} label={t("dashboard.mealsShared")} color="text-primary" />
          <StatsCard icon={TrendingUp} value={`${stats.foodKg}kg`} label={t("dashboard.foodSaved")} color="text-secondary" />
          <StatsCard icon={Award} value={`Lv ${stats.level}`} label={t("dashboard.impactScore")} color="text-accent" />
        </div>
      </ScrollReveal>

      {/* Quick Actions */}
      <ScrollReveal delay={0.1}>
        <h2 className="text-lg font-display font-semibold text-foreground mb-3">{t("dashboard.quickActions")}</h2>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/add-donation")} className="flex-1 gradient-primary text-primary-foreground rounded-2xl p-4 flex items-center gap-3 shadow-lg glow-primary relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center"><Plus className="w-5 h-5" /></div>
            <div className="text-left"><p className="font-semibold text-sm">{t("dashboard.donateFood")}</p><p className="text-xs text-primary-foreground/70">{t("dashboard.addNew")}</p></div>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/impact")} className="flex-1 glass-card-strong rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-secondary" /></div>
            <div className="text-left"><p className="font-semibold text-sm text-foreground">{t("dashboard.myImpact")}</p><p className="text-xs text-muted-foreground">{t("dashboard.viewStats")}</p></div>
          </motion.button>
        </div>
      </ScrollReveal>

      {/* Recent Donations */}
      <ScrollReveal delay={0.15}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display font-semibold text-foreground">{t("dashboard.recentDonations")}</h2>
          <button className="text-sm text-primary font-medium">{t("dashboard.viewAll")}</button>
        </div>
        <div className="space-y-3">
          {donations.length === 0 ? (
            <div className="glass-card rounded-2xl p-6 text-center">
              <Utensils className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm text-muted-foreground">No donations yet. Start sharing food! 🍽️</p>
            </div>
          ) : (
            donations.map((donation, i) => (
              <motion.div key={donation.id} whileHover={{ scale: 1.01, x: 4 }} className="glass-card rounded-2xl p-3 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden relative">
                    <img src={defaultImages[i % defaultImages.length]} alt={donation.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
        </div>
      </ScrollReveal>
    </div>
  );
};

export default DonorView;
