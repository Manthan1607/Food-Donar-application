import { motion } from "framer-motion";
import { Menu, Bell, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardNavbarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
  displayName: string;
}

const DashboardNavbar = ({ onMenuClick, sidebarCollapsed, displayName }: DashboardNavbarProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("alerts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false)
      .then(({ count }) => setUnreadAlerts(count || 0));
  }, [user]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 glass-card-strong border-b border-border/50"
    >
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onMenuClick}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted/50 transition-colors md:hidden"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="hidden md:flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Welcome, <span className="text-primary">{displayName}</span>
            </span>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground truncate max-w-[140px]">{displayName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/alerts")}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted/50 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadAlerts > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-secondary"
              />
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold"
          >
            {displayName?.[0]?.toUpperCase() || "U"}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardNavbar;
