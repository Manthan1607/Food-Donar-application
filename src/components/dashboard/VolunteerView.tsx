import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Bike, Package, MapPin, Clock, Check, Navigation, TrendingUp, Zap, Star, Route, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import StatsCard from "@/components/StatsCard";
import volunteerVideo from "@/assets/volunteer-hero.mp4";

interface Delivery { id: string; donation_id: string; volunteer_id: string; status: string; pickup_time: string | null; delivery_time: string | null; created_at: string; }
interface Donation { id: string; title: string; food_type: string; quantity: number; pickup_address: string | null; status: string; created_at: string; }

const VolunteerView = () => {
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
    if (error) toast({ variant: "destructive", title: "Error", description: error.message });
    else { toast({ title: "🚴 Pickup assigned to you!" }); loadData(); }
  };

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    const updates: any = { status: newStatus };
    if (newStatus === "in_transit") updates.pickup_time = new Date().toISOString();
    if (newStatus === "delivered") updates.delivery_time = new Date().toISOString();
    const { error } = await supabase.from("deliveries").update(updates).eq("id", deliveryId);
    if (error) toast({ variant: "destructive", title: "Error", description: error.message });
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
    <div className="space-y-5">
      {/* Video Banner */}
      <div className="relative rounded-2xl overflow-hidden h-32">
        <motion.video src={volunteerVideo} muted autoPlay loop playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-foreground font-display font-semibold text-sm flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-accent" /> "Heroes ride, hunger hides"</p>
        </div>
      </div>

      {/* Availability toggle */}
      <div className="glass-card-strong rounded-2xl p-4 flex items-center justify-between">
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

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <StatsCard icon={Check} value={String(stats.completed)} label="Done" color="text-primary" />
        <StatsCard icon={Route} value={String(stats.inProgress)} label="Active" color="text-accent" />
        <StatsCard icon={Navigation} value={`${stats.totalKm}km`} label="Distance" color="text-secondary" />
        <StatsCard icon={Star} value={String(stats.rating)} label="Rating" color="text-primary" />
      </div>

      {/* Active deliveries */}
      {deliveries.filter(d => d.status !== "delivered").length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Zap className="w-4 h-4 text-accent" /> Active Deliveries</h3>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {deliveries.filter(d => d.status !== "delivered").map((delivery) => (
                <motion.div key={delivery.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 50 }} className="glass-card-strong rounded-2xl p-4 neon-outline">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${delivery.status === "assigned" ? "bg-secondary/15 text-secondary" : "bg-accent/15 text-accent"}`}>
                      {delivery.status === "assigned" ? "Ready for Pickup" : "In Transit"}
                    </span>
                    <span className="text-xs text-muted-foreground">{timeAgo(delivery.created_at)}</span>
                  </div>
                  <div className="flex gap-2">
                    {delivery.status === "assigned" && (
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateDeliveryStatus(delivery.id, "in_transit")} className="flex-1 gradient-warm text-secondary-foreground py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5">
                        <Navigation className="w-4 h-4" /> Start Delivery
                      </motion.button>
                    )}
                    {delivery.status === "in_transit" && (
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateDeliveryStatus(delivery.id, "delivered")} className="flex-1 gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 glow-primary">
                        <Check className="w-4 h-4" /> Mark Delivered
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Available pickups */}
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Package className="w-4 h-4 text-secondary" /> Available Pickups</h3>
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card rounded-2xl p-4 h-24 skeleton-dark" />)
        ) : pendingDonations.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground">No pickups available right now</p>
          </div>
        ) : (
          pendingDonations.map((donation) => (
            <motion.div key={donation.id} whileHover={{ y: -2 }} className="glass-card rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{donation.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{donation.quantity} servings</span><span>•</span><span>{donation.food_type}</span>
                  </div>
                  {donation.pickup_address && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {donation.pickup_address}</p>}
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => acceptPickup(donation.id)} className="w-full gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 glow-primary">
                <Bike className="w-4 h-4" /> Accept Pickup
              </motion.button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default VolunteerView;
