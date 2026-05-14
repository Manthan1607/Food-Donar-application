import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils, Building2, Bike, Shield, Home, PieChart, Bell, User,
  Plus, MapPin, Settings, LogOut, ChevronLeft, ChevronRight, X,
  Menu, Sparkles
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface DashboardSidebarProps {
  currentRole: AppRole;
  onRoleChange: (role: AppRole) => void;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const roles: { id: AppRole; label: string; icon: typeof Utensils; color: string }[] = [
  { id: "donor", label: "Donor", icon: Utensils, color: "text-primary" },
  { id: "ngo", label: "NGO", icon: Building2, color: "text-secondary" },
  { id: "volunteer", label: "Volunteer", icon: Bike, color: "text-accent" },
  { id: "admin", label: "Admin", icon: Shield, color: "text-muted-foreground" },
];

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Plus, label: "Add Donation", path: "/add-donation" },
  { icon: PieChart, label: "Impact", path: "/impact" },
  { icon: MapPin, label: "Map", path: "/dashboard?tab=map" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: User, label: "Profile", path: "/profile" },
];

const DashboardSidebar = ({
  currentRole, onRoleChange, collapsed, onToggle, mobileOpen, onMobileClose,
}: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-foreground text-sm">FoodShare</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors text-muted-foreground hidden md:flex">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        <button onClick={onMobileClose} aria-label="Close menu" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors text-muted-foreground md:hidden">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Role Switcher */}
      <div className="p-3 border-b border-border/50">
        {!collapsed && <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-2">Switch Role</p>}
        <div className={`grid ${collapsed ? "grid-cols-1 gap-1" : "grid-cols-2 gap-1.5"}`}>
          {roles.map((role) => (
            <motion.button
              key={role.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRoleChange(role.id)}
              className={`flex items-center gap-2 rounded-xl transition-all ${collapsed ? "p-2 justify-center" : "px-3 py-2"} ${
                currentRole === role.id
                  ? "glass-card-strong neon-outline"
                  : "hover:bg-muted/30"
              }`}
              title={role.label}
            >
              <role.icon className={`w-4 h-4 ${currentRole === role.id ? role.color : "text-muted-foreground"}`} />
              {!collapsed && (
                <span className={`text-xs font-medium ${currentRole === role.id ? "text-foreground" : "text-muted-foreground"}`}>
                  {role.label}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {!collapsed && <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-2">Navigation</p>}
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path.includes("?") && location.pathname + location.search === item.path);
          return (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                navigate(item.path);
                onMobileClose();
              }}
              className={`w-full flex items-center gap-3 rounded-xl transition-all ${collapsed ? "p-2.5 justify-center" : "px-3 py-2.5"} ${
                isActive ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
              title={item.label}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { navigate("/profile"); onMobileClose(); }}
          className={`w-full flex items-center gap-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all ${collapsed ? "p-2.5 justify-center" : "px-3 py-2.5"}`}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={async () => { await signOut(); navigate("/"); }}
          className={`w-full flex items-center gap-3 rounded-xl text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all ${collapsed ? "p-2.5 justify-center" : "px-3 py-2.5"}`}
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-sidebar border-r border-sidebar-border"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 bottom-0 w-[220px] z-50 bg-sidebar border-r border-sidebar-border md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
