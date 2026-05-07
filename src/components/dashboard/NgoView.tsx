import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Building2, Package, Check, X, Clock, MapPin, Users, TrendingUp, Utensils, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import StatsCard from "@/components/StatsCard";
import ngoVideo from "@/assets/ngo-hero.mp4";

interface Donation {
  id: string; title: string; description: string | null; food_type: string;
  quantity: number; status: string; pickup_address: string | null;
  created_at: string; donor_id: string; image_url: string | null; expiry_time: string | null;
}

const NgoView = () => {
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
    if (error) toast({ variant: "destructive", title: "Error", description: error.message });
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
    <div className="space-y-5">
      {/* Video Banner */}
      <div className="relative rounded-2xl overflow-hidden h-32">
        <motion.video src={ngoVideo} muted autoPlay loop playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-foreground font-display font-semibold text-sm flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-secondary" /> "Bridging generosity with hunger"</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <StatsCard icon={Package} value={String(stats.incoming)} label="Incoming" color="text-secondary" />
        <StatsCard icon={Check} value={String(stats.accepted)} label="Accepted" color="text-primary" />
        <StatsCard icon={TrendingUp} value={String(stats.delivered)} label="Delivered" color="text-accent" />
        <StatsCard icon={Users} value={String(stats.mealsReceived)} label="Meals" color="text-primary" />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map(f => (
          <motion.button key={f.id} whileTap={{ scale: 0.95 }} onClick={() => setFilter(f.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.id ? "gradient-warm text-secondary-foreground glow-warm" : "glass-card text-muted-foreground"}`}>
            {f.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f.id ? "bg-secondary-foreground/20" : "bg-muted"}`}>{f.count}</span>
          </motion.button>
        ))}
      </div>

      {/* Donation list */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card rounded-2xl p-4 h-28 skeleton-dark" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl">
            <Package className="w-10 h-10 text-primary mx-auto mb-3 opacity-60" />
            <p className="text-sm font-medium text-foreground">No donations yet</p>
            <p className="text-xs text-muted-foreground mt-1">New food donations will appear here as donors post them.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((donation, i) => (
              <motion.div key={donation.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }} className="glass-card rounded-2xl p-4 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${donation.food_type === "veg" ? "bg-primary/15" : "bg-secondary/15"}`}>
                    <Utensils className={`w-5 h-5 ${donation.food_type === "veg" ? "text-primary" : "text-secondary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">{donation.title}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${donation.status === "pending" ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary"}`}>{donation.status}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {donation.quantity} servings</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(donation.created_at)}</span>
                    </div>
                    {donation.pickup_address && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {donation.pickup_address}</p>}
                  </div>
                </div>
                {donation.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAccept(donation.id)} className="flex-1 gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 glow-primary">
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
  );
};

export default NgoView;
