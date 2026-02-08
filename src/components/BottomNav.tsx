import { useLocation, useNavigate } from "react-router-dom";
import { Home, Plus, BarChart3, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { icon: Home, label: "Home", path: "/donor" },
  { icon: Plus, label: "Donate", path: "/add-donation" },
  { icon: BarChart3, label: "Impact", path: "/impact" },
  { icon: User, label: "Profile", path: "/donor" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-card-strong border-t border-border/50 px-4 py-2 flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const isDonate = tab.label === "Donate";

          if (isDonate) {
            return (
              <motion.button
                key={tab.label}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(tab.path)}
                className="gradient-primary w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg -mt-4"
              >
                <tab.icon className="w-5 h-5 text-primary-foreground" />
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.label}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 py-1 px-3"
            >
              <tab.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
