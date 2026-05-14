import { motion } from "framer-motion";
import { Home, User, Bell, PieChart, Plus, LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: NavItemProps) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`relative flex flex-col items-center gap-1 px-3 py-1 transition-all duration-300 ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-xs font-medium">{label}</span>
    {isActive && (
      <motion.div
        layoutId="nav-indicator"
        className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
        transition={{ duration: 0.3 }}
      />
    )}
  </motion.button>
);

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    { icon: Home, label: t("nav.home"), path: "/donor" },
    { icon: PieChart, label: t("nav.impact"), path: "/impact" },
    { icon: Bell, label: t("nav.alerts"), path: "/alerts" },
    { icon: User, label: t("nav.profile"), path: "/profile" },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50"
    >
      {/* Glass background */}
      <div className="mx-4 mb-4 glass-card-strong rounded-2xl px-4 py-3 flex items-center justify-around relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        {navItems.slice(0, 2).map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}

        {/* Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.08, boxShadow: "0 0 30px hsl(160 60% 45% / 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/add-donation")}
          aria-label="Add new donation"
          className="w-14 h-14 -mt-8 gradient-primary rounded-2xl flex items-center justify-center shadow-xl glow-primary relative"
        >
          <Plus className="w-7 h-7 text-primary-foreground" />
          {/* Animated ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-primary/50"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.button>

        {navItems.slice(2).map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BottomNav;
