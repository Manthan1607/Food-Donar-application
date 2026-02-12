import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Utensils, Building2, Bike, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const roles = [
  {
    id: "donor",
    label: "Food Donor",
    description: "Restaurants, caterers & individuals with surplus food",
    icon: Utensils,
    gradient: "from-primary to-accent",
    glowColor: "hsl(160 60% 45% / 0.3)",
    route: "/donor",
  },
  {
    id: "ngo",
    label: "NGO / Shelter",
    description: "Receive & distribute food to those in need",
    icon: Building2,
    gradient: "from-secondary to-orange-400",
    glowColor: "hsl(30 85% 55% / 0.3)",
    route: "/donor",
  },
  {
    id: "volunteer",
    label: "Volunteer",
    description: "Help pick up & deliver food donations",
    icon: Bike,
    gradient: "from-accent to-teal-400",
    glowColor: "hsl(175 55% 42% / 0.3)",
    route: "/donor",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Manage & oversee the platform",
    icon: Shield,
    gradient: "from-muted-foreground to-foreground",
    glowColor: "hsl(220 10% 55% / 0.3)",
    route: "/admin",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.12,
      delayChildren: 0.3,
    } 
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut" as const
    } 
  },
};

const SelectRole = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleRoleSelect = async (roleId: string, route: string) => {
    if (!user) return;
    try {
      await supabase.from("user_roles").upsert({ user_id: user.id, role: roleId as any }, { onConflict: "user_id,role" });
      // Create welcome alert
      await supabase.from("alerts").insert({
        user_id: user.id,
        title: "Welcome! 🎉",
        message: `You've joined as a ${roleId}. Start making an impact today!`,
        type: "success",
      });
      navigate(route);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 relative">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-primary/8 blur-[100px] animate-ambient" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-secondary/6 blur-[120px] animate-ambient" style={{ animationDelay: '-7s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10 relative z-10"
      >
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          {t("role.title")}
        </h1>
        <p className="text-muted-foreground">{t("role.subtitle")}</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 w-full max-w-md relative z-10"
      >
        {roles.map((role) => (
          <motion.button
            key={role.id}
            variants={item}
            whileHover={{ 
              scale: 1.04, 
              y: -4,
              boxShadow: `0 0 30px ${role.glowColor}`,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleRoleSelect(role.id, role.route)}
            className="glass-card-strong rounded-3xl p-6 flex flex-col items-center text-center gap-3 group cursor-pointer relative overflow-hidden"
          >
            {/* Hover neon border effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${role.glowColor}, transparent)`,
              }}
            />
            
            <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
              <role.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="relative z-10 font-semibold text-foreground text-sm">{role.label}</h3>
            <p className="relative z-10 text-xs text-muted-foreground leading-relaxed">{role.description}</p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default SelectRole;
