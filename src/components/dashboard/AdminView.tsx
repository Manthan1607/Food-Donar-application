import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Shield, Users, Package, AlertTriangle, TrendingUp, Search,
  ChevronRight, Activity, Download, BarChart3, Bell, CheckCircle2, Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import adminVideo from "@/assets/admin-hero.mp4";

interface UserProfile { user_id: string; display_name: string; phone: string | null; created_at: string; }
interface DonationRow { id: string; title: string; status: string; quantity: number; food_type: string; created_at: string; donor_id: string; }

const AdminView = () => {
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
    <div className="space-y-5">
      {/* Video Banner */}
      <div className="relative rounded-2xl overflow-hidden h-32">
        <motion.video src={adminVideo} muted autoPlay loop playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-foreground font-display font-semibold text-sm flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-primary" /> "Empowering impact through data"</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map(tab => (
          <motion.button key={tab.id} whileTap={{ scale: 0.95 }} onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? "gradient-primary text-primary-foreground glow-primary" : "glass-card text-muted-foreground"}`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {statCards.map((s) => (
                <motion.div key={s.label} whileHover={{ y: -3 }} className="glass-card-strong rounded-2xl p-4">
                  <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                  <p className="text-2xl font-display font-bold text-foreground">{loading ? "—" : s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="glass-card-strong rounded-3xl p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Recent Activity</h3>
              {donations.slice(0, 5).map((d, i) => (
                <div key={d.id} className={`flex items-center gap-3 py-3 ${i < 4 ? "border-b border-border" : ""}`}>
                  <div className={`w-2 h-2 rounded-full ${d.status === "pending" ? "bg-secondary" : d.status === "delivered" ? "bg-primary" : "bg-muted-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.food_type} · {d.quantity} servings</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{timeAgo(d.created_at)}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => exportCSV("users")} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                <Download className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Export Users</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => exportCSV("donations")} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                <Download className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium text-foreground">Export Donations</span>
              </motion.button>
            </div>
          </motion.div>
        )}
        {activeTab === "users" && (
          <motion.div key="users" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search users..." className="w-full glass-card rounded-2xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            {filteredUsers.map((u, i) => (
              <motion.div key={u.user_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">{u.display_name?.[0]?.toUpperCase() || "U"}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{u.display_name}</p>
                  <p className="text-xs text-muted-foreground">{u.phone || "No phone"}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            ))}
          </motion.div>
        )}
        {activeTab === "donations" && (
          <motion.div key="donations" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search donations..." className="w-full glass-card rounded-2xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            {filteredDonations.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full shrink-0 ${d.status === "pending" ? "bg-secondary" : d.status === "delivered" ? "bg-primary" : "bg-accent"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.food_type} · {d.quantity} servings</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${d.status === "delivered" ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"}`}>{d.status}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
        {activeTab === "alerts" && (
          <motion.div key="alerts" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <div className="glass-card-strong rounded-3xl p-6 text-center">
              <AlertTriangle className="w-10 h-10 text-secondary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">System Alerts</h3>
              <p className="text-sm text-muted-foreground">All systems operational.</p>
            </div>
            {["Database Health", "Auth Service", "Storage"].map((item) => (
              <div key={item} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item}</p>
                  <p className="text-xs text-muted-foreground">Running smoothly</p>
                </div>
                <span className="text-xs text-primary font-medium">OK</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminView;
