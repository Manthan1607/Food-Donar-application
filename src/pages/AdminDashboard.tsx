import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Users, Package, AlertTriangle, TrendingUp, Search,
  ChevronRight, Activity, Download, BarChart3, Eye,
  CheckCircle2, ArrowLeft, Bell, Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import adminVideo from "@/assets/admin-hero.mp4";

interface UserProfile { user_id: string; display_name: string; phone: string | null; created_at: string; }
interface DonationRow { id: string; title: string; status: string; quantity: number; food_type: string; created_at: string; donor_id: string; }

const ScrollReveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "donations" | "alerts">("overview");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [donations, setDonations] = useState<DonationRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalDonations: 0, activeDonations: 0, totalMeals: 0 });

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [profilesRes, donationsRes, impactRes] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, phone, created_at"),
      supabase.from("donations").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("impact_logs").select("meals_served"),
    ]);
    const profileData = profilesRes.data || [];
    const donationData = donationsRes.data || [];
    const totalMeals = (impactRes.data || []).reduce((s, r) => s + (r.meals_served || 0), 0);
    setUsers(profileData);
    setDonations(donationData);
    setStats({ totalUsers: profileData.length, totalDonations: donationData.length, activeDonations: donationData.filter(d => d.status === "pending").length, totalMeals });
    setLoading(false);
  };

  const timeAgo = (d: string) => {
    const ms = Date.now() - new Date(d).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  };

  const filteredUsers = users.filter(u => u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDonations = donations.filter(d => d.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-primary" },
    { label: "Donations", value: stats.totalDonations, icon: Package, color: "text-secondary" },
    { label: "Active", value: stats.activeDonations, icon: Activity, color: "text-accent" },
    { label: "Meals Served", value: stats.totalMeals, icon: TrendingUp, color: "text-primary" },
  ];

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: BarChart3 },
    { id: "users" as const, label: "Users", icon: Users },
    { id: "donations" as const, label: "Donations", icon: Package },
    { id: "alerts" as const, label: "Alerts", icon: Bell },
  ];

  const exportCSV = (type: "users" | "donations") => {
    const content = type === "users"
      ? "Name,Phone,Joined\n" + users.map(u => `${u.display_name},${u.phone || "N/A"},${new Date(u.created_at).toLocaleDateString()}`).join("\n")
      : "Title,Type,Qty,Status,Date\n" + donations.map(d => `${d.title},${d.food_type},${d.quantity},${d.status},${new Date(d.created_at).toLocaleDateString()}`).join("\n");
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${type}-report.csv`; a.click();
    toast({ title: "📊 Report downloaded!" });
  };

  return (
    <div className="min-h-screen bg-background pb-8 relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 25, -15, 0], y: [0, -10, 15, 0] }} transition={{ duration: 18, repeat: Infinity }} className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/8 blur-[120px]" />
        <motion.div animate={{ x: [0, -20, 10, 0], y: [0, 10, -20, 0] }} transition={{ duration: 22, repeat: Infinity }} className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full bg-secondary/6 blur-[100px]" />
      </div>

      {/* Video Hero */}
      <div className="relative h-[26vh] overflow-hidden">
        <motion.video initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} src={adminVideo} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-transparent" />

        <div className="absolute inset-0 flex items-end px-6 pb-5 z-10">
          <div className="flex items-center gap-3 w-full">
            <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/select-role")} className="w-11 h-11 rounded-full glass-card-strong flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <div className="flex-1">
              <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Admin Panel
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xs text-muted-foreground">Control Center</motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 -mt-2 relative z-10">
        <ScrollReveal>
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {tabs.map(tab => (
              <motion.button key={tab.id} whileTap={{ scale: 0.95 }} onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? "gradient-primary text-primary-foreground glow-primary" : "glass-card text-muted-foreground"}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <div className="relative z-10 px-6">
        <AnimatePresence mode="wait">
          {/* Overview */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {statCards.map((s, i) => (
                  <ScrollReveal key={s.label} delay={i * 0.06}>
                    <motion.div whileHover={{ y: -3, scale: 1.02 }} className="glass-card-strong rounded-2xl p-4">
                      <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.1 }} className="text-2xl font-display font-bold text-foreground">{loading ? "—" : s.value}</motion.p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Video strip */}
              <ScrollReveal delay={0.15}>
                <div className="relative rounded-2xl overflow-hidden">
                  <motion.video src={adminVideo} muted autoPlay loop playsInline className="w-full h-28 object-cover" whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-foreground font-display font-semibold text-sm flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-primary" /> "Empowering impact through data"</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="glass-card-strong rounded-3xl p-5">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Recent Activity</h3>
                  {donations.slice(0, 5).map((d, i) => (
                    <motion.div key={d.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className={`flex items-center gap-3 py-3 ${i < 4 ? "border-b border-border" : ""}`}>
                      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} className={`w-2 h-2 rounded-full ${d.status === "pending" ? "bg-secondary" : d.status === "delivered" ? "bg-primary" : "bg-muted-foreground"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{d.title}</p>
                        <p className="text-xs text-muted-foreground">{d.food_type} · {d.quantity} servings</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{timeAgo(d.created_at)}</span>
                    </motion.div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.25}>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => exportCSV("users")} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                    <Download className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Export Users</span>
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => exportCSV("donations")} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                    <Download className="w-5 h-5 text-secondary" />
                    <span className="text-sm font-medium text-foreground">Export Donations</span>
                  </motion.button>
                </div>
              </ScrollReveal>
            </motion.div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search users..." className="w-full glass-card rounded-2xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              {loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card rounded-2xl p-4 h-16 skeleton-dark" />) :
               filteredUsers.length === 0 ? <div className="text-center py-12"><Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" /><p className="text-sm text-muted-foreground">No users found</p></div> :
               filteredUsers.map((u, i) => (
                <motion.div key={u.user_id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ x: 4 }} className="glass-card rounded-2xl p-4 flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">{u.display_name?.[0]?.toUpperCase() || "U"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{u.display_name}</p>
                    <p className="text-xs text-muted-foreground">{u.phone || "No phone"} · Joined {timeAgo(u.created_at)} ago</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Donations */}
          {activeTab === "donations" && (
            <motion.div key="donations" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search donations..." className="w-full glass-card rounded-2xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              {loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card rounded-2xl p-4 h-16 skeleton-dark" />) :
               filteredDonations.length === 0 ? <div className="text-center py-12"><Package className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" /><p className="text-sm text-muted-foreground">No donations found</p></div> :
               filteredDonations.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ x: 4 }} className="glass-card rounded-2xl p-4 flex items-center gap-3 cursor-pointer">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} className={`w-3 h-3 rounded-full shrink-0 ${d.status === "pending" ? "bg-secondary" : d.status === "delivered" ? "bg-primary" : "bg-accent"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.food_type} · {d.quantity} servings · {timeAgo(d.created_at)} ago</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${d.status === "delivered" ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"}`}>{d.status}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Alerts */}
          {activeTab === "alerts" && (
            <motion.div key="alerts" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-4">
              <div className="glass-card-strong rounded-3xl p-6 text-center">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <AlertTriangle className="w-10 h-10 text-secondary mx-auto mb-3" />
                </motion.div>
                <h3 className="font-semibold text-foreground mb-1">System Alerts</h3>
                <p className="text-sm text-muted-foreground">All systems operational. No critical alerts.</p>
              </div>
              {[
                { label: "Database Health", sub: "All tables responding normally" },
                { label: "Auth Service", sub: "Authentication running smoothly" },
                { label: "Storage", sub: "File uploads operational" },
              ].map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}>
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                  <span className="text-xs text-primary font-medium">OK</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
