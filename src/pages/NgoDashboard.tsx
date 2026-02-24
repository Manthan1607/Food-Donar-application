import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Package, Check, X, Clock, MapPin, Users,
  TrendingUp, Bell, ArrowLeft, Utensils, Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import StatsCard from "@/components/StatsCard";
import SOSButton from "@/components/SOSButton";
import ngoVideo from "@/assets/ngo-hero.mp4";

interface Donation {
  id: string; title: string; description: string | null; food_type: string;
  quantity: number; status: string; pickup_address: string | null;
  created_at: string; donor_id: string; image_url: string | null; expiry_time: string | null;
}

const ScrollReveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

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
    const channel = supabase.channel("ngo-donations-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, () => loadDonations())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const loadDonations = async () => {
    const { data } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
    const all = data || [];
    setDonations(all);
    setStats({
      incoming: all.filter(d => d.status === "pending").length,
      accepted: all.filter(d => d.status === "accepted").length,
      delivered: all.filter(d => d.status === "delivered").length,
      mealsReceived: all.reduce((sum, d) => sum + (d.quantity || 0), 0),
    });
    setLoading(false);
  };

  const handleAccept = async (donationId: string) => {
    if (!user) return;
    const { error } = await supabase.from("donations").update({ status: "accepted", ngo_id: user.id }).eq("id", donationId);
    if (error) { toast({ variant: "destructive", title: "Error", description: error.message }); }
    else { toast({ title: "✅ Donation accepted!" }); loadDonations(); }
  };

  const handleReject = async (donationId: string) => {
    toast({ title: "❌ Donation declined" }); loadDonations();
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
    <div className="min-h-screen bg-background pb-24 relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }} transition={{ duration: 16, repeat: Infinity }} className="absolute top-0 right-0 w-80 h-80 rounded-full bg-secondary/10 blur-[120px]" />
        <motion.div animate={{ x: [0, -15, 10, 0], y: [0, 10, -15, 0] }} transition={{ duration: 19, repeat: Infinity }} className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full bg-primary/8 blur-[100px]" />
      </div>

      {/* Video Hero */}
      <div className="relative h-[28vh] overflow-hidden">
        <motion.video initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} src={ngoVideo} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-transparent" />

        <div className="absolute inset-0 flex items-end px-6 pb-5 z-10">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/select-role")} className="w-11 h-11 rounded-full glass-card-strong flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </motion.button>
              <div>
                <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-secondary" /> NGO Hub
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xs text-muted-foreground">Receive & distribute food</motion.p>
              </div>
            </div>
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/alerts")} className="w-11 h-11 rounded-full glass-card-strong flex items-center justify-center">
              <Bell className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 -mt-2 relative z-10">
        <ScrollReveal>
          <div className="grid grid-cols-4 gap-2 mb-5">
            <StatsCard icon={Package} value={String(stats.incoming)} label="Incoming" color="text-secondary" />
            <StatsCard icon={Check} value={String(stats.accepted)} label="Accepted" color="text-primary" />
            <StatsCard icon={TrendingUp} value={String(stats.delivered)} label="Delivered" color="text-accent" />
            <StatsCard icon={Users} value={String(stats.mealsReceived)} label="Meals" color="text-primary" />
          </div>
        </ScrollReveal>
      </div>

      {/* Video Strip */}
      <div className="px-6 mb-5 relative z-10">
        <ScrollReveal delay={0.1}>
          <div className="relative rounded-2xl overflow-hidden">
            <motion.video src={ngoVideo} muted autoPlay loop playsInline className="w-full h-28 object-cover" whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-foreground font-display font-semibold text-sm flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-secondary" /> "Bridging generosity with hunger"</p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="px-6 relative z-10">
        {/* Filters */}
        <ScrollReveal delay={0.15}>
          <div className="flex gap-2 mb-4">
            {filters.map(f => (
              <motion.button key={f.id} whileTap={{ scale: 0.95 }} onClick={() => setFilter(f.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.id ? "gradient-warm text-secondary-foreground glow-warm" : "glass-card text-muted-foreground"}`}>
                {f.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f.id ? "bg-secondary-foreground/20" : "bg-muted"}`}>{f.count}</span>
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        {/* Donation list */}
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card rounded-2xl p-4 h-28 skeleton-dark" />)
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-muted-foreground font-medium">No donations found</p>
              <p className="text-xs text-muted-foreground mt-1">New donations will appear here in real-time</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((donation, i) => (
                <motion.div
                  key={donation.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: -50 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="glass-card rounded-2xl p-4 relative overflow-hidden"
                >
                  {donation.status === "pending" && (
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-bl-full" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${donation.food_type === "veg" ? "bg-primary/15" : "bg-secondary/15"}`}>
                      <Utensils className={`w-5 h-5 ${donation.food_type === "veg" ? "text-primary" : "text-secondary"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground truncate">{donation.title}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${donation.status === "pending" ? "bg-secondary/15 text-secondary" : donation.status === "accepted" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>{donation.status}</span>
                      </div>
                      {donation.description && <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{donation.description}</p>}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {donation.quantity} servings</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(donation.created_at)}</span>
                      </div>
                      {donation.pickup_address && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {donation.pickup_address}</p>}
                    </div>
                  </div>
                  {donation.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => handleAccept(donation.id)} className="flex-1 gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 glow-primary">
                        <Check className="w-4 h-4" /> Accept
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleReject(donation.id)} className="px-4 py-2.5 rounded-xl glass-card text-muted-foreground text-sm font-medium">
                        <X className="w-4 h-4" />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <SOSButton />
      <BottomNav />
    </div>
  );
};

export default NgoDashboard;
