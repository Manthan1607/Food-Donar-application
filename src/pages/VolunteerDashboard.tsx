import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bike, Package, MapPin, Clock, Check, Navigation, Bell,
  ArrowLeft, TrendingUp, Zap, Star, Route, Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import StatsCard from "@/components/StatsCard";
import SOSButton from "@/components/SOSButton";
import volunteerVideo from "@/assets/volunteer-hero.mp4";

interface Delivery { id: string; donation_id: string; volunteer_id: string; status: string; pickup_time: string | null; delivery_time: string | null; created_at: string; }
interface Donation { id: string; title: string; food_type: string; quantity: number; pickup_address: string | null; status: string; created_at: string; }

const ScrollReveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [available, setAvailable] = useState(true);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [pendingDonations, setPendingDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, totalKm: 0, rating: 4.8 });

  useEffect(() => {
    if (!user) return;
    loadData();
    const channel = supabase.channel("volunteer-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "deliveries" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, () => loadData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const [deliveriesRes, donationsRes] = await Promise.all([
      supabase.from("deliveries").select("*").eq("volunteer_id", user.id).order("created_at", { ascending: false }),
      supabase.from("donations").select("*").eq("status", "accepted").order("created_at", { ascending: false }).limit(20),
    ]);
    const myDeliveries = deliveriesRes.data || [];
    setDeliveries(myDeliveries);
    setPendingDonations(donationsRes.data || []);
    setStats({
      completed: myDeliveries.filter(d => d.status === "delivered").length,
      inProgress: myDeliveries.filter(d => d.status === "in_transit").length,
      totalKm: myDeliveries.length * 3,
      rating: 4.8,
    });
    setLoading(false);
  };

  const acceptPickup = async (donationId: string) => {
    if (!user) return;
    const { error } = await supabase.from("deliveries").insert({ donation_id: donationId, volunteer_id: user.id, status: "assigned" });
    if (error) { toast({ variant: "destructive", title: "Error", description: error.message }); }
    else { toast({ title: "🚴 Pickup assigned to you!" }); loadData(); }
  };

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    const updates: any = { status: newStatus };
    if (newStatus === "in_transit") updates.pickup_time = new Date().toISOString();
    if (newStatus === "delivered") updates.delivery_time = new Date().toISOString();
    const { error } = await supabase.from("deliveries").update(updates).eq("id", deliveryId);
    if (error) { toast({ variant: "destructive", title: "Error", description: error.message }); }
    else { toast({ title: newStatus === "delivered" ? "✅ Delivery complete!" : "🚗 On the way!" }); loadData(); }
  };

  const timeAgo = (d: string) => {
    const ms = Date.now() - new Date(d).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 15, -10, 0], y: [0, -20, 10, 0] }} transition={{ duration: 17, repeat: Infinity }} className="absolute top-0 left-0 w-80 h-80 rounded-full bg-accent/10 blur-[120px]" />
        <motion.div animate={{ x: [0, -20, 10, 0], y: [0, 15, -10, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute bottom-1/3 right-0 w-64 h-64 rounded-full bg-primary/8 blur-[100px]" />
      </div>

      {/* Video Hero */}
      <div className="relative h-[28vh] overflow-hidden">
        <motion.video initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} src={volunteerVideo} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
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
                  <Bike className="w-5 h-5 text-accent" /> Volunteer Hub
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xs text-muted-foreground">Pick up & deliver food</motion.p>
              </div>
            </div>
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/alerts")} className="w-11 h-11 rounded-full glass-card-strong flex items-center justify-center">
              <Bell className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Availability toggle */}
      <div className="px-6 -mt-2 relative z-10">
        <ScrollReveal>
          <div className="glass-card-strong rounded-2xl p-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div animate={{ scale: available ? [1, 1.3, 1] : 1 }} transition={{ duration: 1.5, repeat: available ? Infinity : 0 }} className={`w-3 h-3 rounded-full ${available ? "bg-primary" : "bg-muted-foreground"}`} />
              <div>
                <p className="text-sm font-semibold text-foreground">{available ? "Available for Pickup" : "Offline"}</p>
                <p className="text-xs text-muted-foreground">{available ? "You'll receive new tasks" : "Toggle to go online"}</p>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setAvailable(!available)} className={`w-14 h-8 rounded-full relative transition-colors ${available ? "bg-primary" : "bg-muted"}`}>
              <motion.div animate={{ x: available ? 24 : 4 }} className="absolute top-1 w-6 h-6 rounded-full bg-primary-foreground shadow-md" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
            </motion.button>
          </div>
        </ScrollReveal>
      </div>

      {/* Stats */}
      <div className="px-6 relative z-10">
        <ScrollReveal delay={0.05}>
          <div className="grid grid-cols-4 gap-2 mb-5">
            <StatsCard icon={Check} value={String(stats.completed)} label="Done" color="text-primary" />
            <StatsCard icon={Route} value={String(stats.inProgress)} label="Active" color="text-accent" />
            <StatsCard icon={Navigation} value={`${stats.totalKm}km`} label="Distance" color="text-secondary" />
            <StatsCard icon={Star} value={String(stats.rating)} label="Rating" color="text-primary" />
          </div>
        </ScrollReveal>
      </div>

      {/* Video Strip */}
      <div className="px-6 mb-5 relative z-10">
        <ScrollReveal delay={0.1}>
          <div className="relative rounded-2xl overflow-hidden">
            <motion.video src={volunteerVideo} muted autoPlay loop playsInline className="w-full h-28 object-cover" whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-foreground font-display font-semibold text-sm flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-accent" /> "Heroes ride, hunger hides"</p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="px-6 relative z-10">
        {/* Active deliveries */}
        {deliveries.filter(d => d.status !== "delivered").length > 0 && (
          <ScrollReveal delay={0.15}>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-accent" /> Active Deliveries</h3>
            <div className="space-y-3 mb-6">
              <AnimatePresence mode="popLayout">
                {deliveries.filter(d => d.status !== "delivered").map((delivery, i) => (
                  <motion.div key={delivery.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ delay: i * 0.05 }} className="glass-card-strong rounded-2xl p-4 neon-outline">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${delivery.status === "assigned" ? "bg-secondary/15 text-secondary" : "bg-accent/15 text-accent"}`}>
                        {delivery.status === "assigned" ? "Ready for Pickup" : "In Transit"}
                      </span>
                      <span className="text-xs text-muted-foreground">{timeAgo(delivery.created_at)}</span>
                    </div>
                    <div className="flex gap-2">
                      {delivery.status === "assigned" && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => updateDeliveryStatus(delivery.id, "in_transit")} className="flex-1 gradient-warm text-secondary-foreground py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5">
                          <Navigation className="w-4 h-4" /> Start Delivery
                        </motion.button>
                      )}
                      {delivery.status === "in_transit" && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => updateDeliveryStatus(delivery.id, "delivered")} className="flex-1 gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 glow-primary">
                          <Check className="w-4 h-4" /> Mark Delivered
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        )}

        {/* Available pickups */}
        <ScrollReveal delay={0.2}>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Package className="w-4 h-4 text-secondary" /> Available Pickups</h3>
        </ScrollReveal>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card rounded-2xl p-4 h-24 skeleton-dark" />)
          ) : pendingDonations.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm text-muted-foreground">No pickups available right now</p>
              <p className="text-xs text-muted-foreground mt-1">Stay online to get notified</p>
            </motion.div>
          ) : (
            pendingDonations.map((donation, i) => (
              <ScrollReveal key={donation.id} delay={0.05 * i}>
                <motion.div whileHover={{ y: -2 }} className="glass-card rounded-2xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{donation.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{donation.quantity} servings</span><span>•</span><span>{donation.food_type}</span><span>•</span><span>{timeAgo(donation.created_at)}</span>
                      </div>
                      {donation.pickup_address && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {donation.pickup_address}</p>}
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => acceptPickup(donation.id)} className="w-full gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 glow-primary">
                    <Bike className="w-4 h-4" /> Accept Pickup
                  </motion.button>
                </motion.div>
              </ScrollReveal>
            ))
          )}
        </div>
      </div>

      <SOSButton />
      <BottomNav />
    </div>
  );
};

export default VolunteerDashboard;
