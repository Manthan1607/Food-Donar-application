import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bell, Check, AlertTriangle, Info, Gift, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import BottomNav from "@/components/BottomNav";

interface Alert {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

const typeIcons: Record<string, any> = {
  info: Info,
  success: Gift,
  warning: AlertTriangle,
  urgent: AlertTriangle,
};

const typeColors: Record<string, string> = {
  info: "text-primary",
  success: "text-primary",
  warning: "text-secondary",
  urgent: "text-destructive",
};

const Alerts = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchAlerts();

    const channel = supabase
      .channel("alerts-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts", filter: `user_id=eq.${user.id}` }, (payload) => {
        setAlerts((prev) => [payload.new as Alert, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchAlerts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setAlerts(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("alerts").update({ read: true }).eq("id", id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
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
      </div>

      <div className="relative z-10 px-6 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full glass-card flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-display font-bold text-foreground">{t("alerts.title")}</h1>
          {alerts.filter((a) => !a.read).length > 0 && (
            <span className="ml-auto px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              {alerts.filter((a) => !a.read).length}
            </span>
          )}
        </motion.div>
      </div>

      <div className="relative z-10 px-6 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 h-20 skeleton-dark" />
          ))
        ) : alerts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-muted-foreground">{t("alerts.empty")}</p>
          </motion.div>
        ) : (
          alerts.map((alert, i) => {
            const Icon = typeIcons[alert.type] || Info;
            const color = typeColors[alert.type] || "text-primary";
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card rounded-2xl p-4 flex items-start gap-3 group cursor-pointer transition-all ${
                  !alert.read ? "neon-outline" : "opacity-70"
                }`}
                onClick={() => !alert.read && markAsRead(alert.id)}
              >
                <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{timeAgo(alert.created_at)}</span>
                  </div>
                </div>
                {!alert.read && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </motion.div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Alerts;
