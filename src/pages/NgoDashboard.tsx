import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Package, Check, X, Clock, MapPin, Users,
  TrendingUp, Bell, ArrowLeft, Utensils, ChevronRight, Sparkles, Filter
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import StatsCard from "@/components/StatsCard";
import SOSButton from "@/components/SOSButton";

interface Donation {
  id: string;
  title: string;
  description: string | null;
  food_type: string;
  quantity: number;
  status: string;
  pickup_address: string | null;
  created_at: string;
  donor_id: string;
  image_url: string | null;
  expiry_time: string | null;
}

const NgoDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted">("all");
  const [stats, setStats] = useState({ incoming: 0, accepted: 0, delivered: 0, mealsReceived: 0 });

  useEffect(() => {
    if (!user) return;
    loadDonations();

    const channel = supabase
      .channel("ngo-donations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, () => {
        loadDonations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const loadDonations = async () => {
    const { data } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    const allDonations = data || [];
    setDonations(allDonations);
    setStats({
      incoming: allDonations.filter(d => d.status === "pending").length,
      accepted: allDonations.filter(d => d.status === "accepted").length,
      delivered: allDonations.filter(d => d.status === "delivered").length,
      mealsReceived: allDonations.reduce((sum, d) => sum + (d.quantity || 0), 0),
    });
    setLoading(false);
  };

  const handleAccept = async (donationId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("donations")
      .update({ status: "accepted", ngo_id: user.id })
      .eq("id", donationId);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "✅ Donation accepted!" });
      loadDonations();
    }
  };

  const handleReject = async (donationId: string) => {
    toast({ title: "❌ Donation declined" });
    loadDonations();
  };

  const timeAgo = (d: string) => {
    const ms = Date.now() - new Date(d).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const filtered = donations.filter(d => filter === "all" || d.status === filter);

  const filters = [
    { id: "all" as const, label: "All", count: donations.length },
    { id: "pending" as const, label: "Incoming", count: stats.incoming },
    { id: "accepted" as const, label: "Accepted", count: stats.accepted },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-secondary/10 blur-[120px] animate-ambient" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full bg-primary/6 blur-[80px] animate-ambient" style={{ animationDelay: "-5s" }} />
      </div>

      {/* Header */}
      <div className="relative px-6 pt-12 pb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent" />
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/select-role")} className="w-11 h-11 rounded-full glass-card flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <div>
              <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-secondary" /> NGO Dashboard
              </motion.h1>
              <p className="text-xs text-muted-foreground">Receive & distribute food</p>
            </div>
          </div>
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/alerts")} className="w-11 h-11 rounded-full glass-card flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-4 gap-2 mb-6">
          <StatsCard icon={Package} value={String(stats.incoming)} label="Incoming" color="text-secondary" />
          <StatsCard icon={Check} value={String(stats.accepted)} label="Accepted" color="text-primary" />
          <StatsCard icon={TrendingUp} value={String(stats.delivered)} label="Delivered" color="text-accent" />
          <StatsCard icon={Users} value={String(stats.mealsReceived)} label="Meals" color="text-primary" />
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {filters.map(f => (
            <motion.button
              key={f.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.id ? "gradient-warm text-secondary-foreground glow-warm" : "glass-card text-muted-foreground"
              }`}
            >
              {f.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f.id ? "bg-secondary-foreground/20" : "bg-muted"}`}>
                {f.count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Donation list */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 h-28 skeleton-dark" />
            ))
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-muted-foreground font-medium">No donations found</p>
              <p className="text-xs text-muted-foreground mt-1">New donations will appear here in real-time</p>
            </motion.div>
          ) : (
            filtered.map((donation, i) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-4 relative overflow-hidden"
              >
                {donation.status === "pending" && (
                  <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-bl-full" />
                )}
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    donation.food_type === "veg" ? "bg-primary/15" : "bg-secondary/15"
                  }`}>
                    <Utensils className={`w-5 h-5 ${donation.food_type === "veg" ? "text-primary" : "text-secondary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">{donation.title}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        donation.status === "pending" ? "bg-secondary/15 text-secondary" :
                        donation.status === "accepted" ? "bg-primary/15 text-primary" :
                        "bg-accent/15 text-accent"
                      }`}>{donation.status}</span>
                    </div>
                    {donation.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{donation.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {donation.quantity} servings</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(donation.created_at)}</span>
                    </div>
                    {donation.pickup_address && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {donation.pickup_address}
                      </p>
                    )}
                  </div>
                </div>

                {donation.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAccept(donation.id)}
                      className="flex-1 gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 glow-primary"
                    >
                      <Check className="w-4 h-4" /> Accept
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(donation.id)}
                      className="px-4 py-2.5 rounded-xl glass-card text-muted-foreground text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      <SOSButton />
      <BottomNav />
    </div>
  );
};

export default NgoDashboard;
