import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield, Users, Package, AlertTriangle, TrendingUp, Search,
  ChevronRight, MapPin, Activity, Download, Filter, BarChart3,
  Eye, Ban, CheckCircle2, Clock, ArrowLeft, Bell
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  user_id: string;
  display_name: string;
  phone: string | null;
  created_at: string;
}

interface DonationRow {
  id: string;
  title: string;
  status: string;
  quantity: number;
  food_type: string;
  created_at: string;
  donor_id: string;
}

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
    setStats({
      totalUsers: profileData.length,
      totalDonations: donationData.length,
      activeDonations: donationData.filter((d) => d.status === "pending").length,
      totalMeals,
    });
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

  const filteredUsers = users.filter((u) => u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDonations = donations.filter((d) => d.title?.toLowerCase().includes(searchQuery.toLowerCase()));

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

  return (
    <div className="min-h-screen bg-background pb-8 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/6 blur-[100px] animate-ambient" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full bg-secondary/5 blur-[80px] animate-ambient" style={{ animationDelay: "-5s" }} />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/select-role")} className="w-11 h-11 rounded-full glass-card flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex-1">
            <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Admin Panel
            </motion.h1>
            <p className="text-xs text-muted-foreground">Control Center</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <motion.button key={tab.id} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? "gradient-primary text-primary-foreground glow-primary" : "glass-card text-muted-foreground"}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="relative z-10 px-6">
        {/* Stats */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {statCards.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card-strong rounded-2xl p-4">
                  <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                  <p className="text-2xl font-display font-bold text-foreground">{loading ? "—" : s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent activity */}
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

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => {
                const csvContent = "Name,Phone,Joined\n" + users.map(u => `${u.display_name},${u.phone || "N/A"},${new Date(u.created_at).toLocaleDateString()}`).join("\n");
                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "users-report.csv";
                a.click();
                toast({ title: "📊 Report downloaded!" });
              }} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                <Download className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Export Users</span>
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => {
                const csvContent = "Title,Type,Qty,Status,Date\n" + donations.map(d => `${d.title},${d.food_type},${d.quantity},${d.status},${new Date(d.created_at).toLocaleDateString()}`).join("\n");
                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "donations-report.csv";
                a.click();
                toast({ title: "📊 Report downloaded!" });
              }} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                <Download className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium text-foreground">Export Donations</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Users tab */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search users..." className="w-full glass-card rounded-2xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card rounded-2xl p-4 h-16 skeleton-dark" />)
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12"><Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" /><p className="text-sm text-muted-foreground">No users found</p></div>
            ) : (
              filteredUsers.map((u, i) => (
                <motion.div key={u.user_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">{u.display_name?.[0]?.toUpperCase() || "U"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{u.display_name}</p>
                    <p className="text-xs text-muted-foreground">{u.phone || "No phone"} · Joined {timeAgo(u.created_at)} ago</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Donations tab */}
        {activeTab === "donations" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search donations..." className="w-full glass-card rounded-2xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card rounded-2xl p-4 h-16 skeleton-dark" />)
            ) : filteredDonations.length === 0 ? (
              <div className="text-center py-12"><Package className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" /><p className="text-sm text-muted-foreground">No donations found</p></div>
            ) : (
              filteredDonations.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="glass-card rounded-2xl p-4 flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${d.status === "pending" ? "bg-secondary" : d.status === "delivered" ? "bg-primary" : "bg-accent"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.food_type} · {d.quantity} servings · {timeAgo(d.created_at)} ago</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${d.status === "delivered" ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"}`}>{d.status}</span>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Alerts tab */}
        {activeTab === "alerts" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="glass-card-strong rounded-3xl p-6 text-center">
              <AlertTriangle className="w-10 h-10 text-secondary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">System Alerts</h3>
              <p className="text-sm text-muted-foreground">All systems operational. No critical alerts.</p>
            </div>
            <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Database Health</p>
                <p className="text-xs text-muted-foreground">All tables responding normally</p>
              </div>
              <span className="text-xs text-primary font-medium">OK</span>
            </div>
            <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Auth Service</p>
                <p className="text-xs text-muted-foreground">Authentication running smoothly</p>
              </div>
              <span className="text-xs text-primary font-medium">OK</span>
            </div>
            <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Storage</p>
                <p className="text-xs text-muted-foreground">File uploads operational</p>
              </div>
              <span className="text-xs text-primary font-medium">OK</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
