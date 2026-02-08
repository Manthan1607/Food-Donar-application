import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Utensils, Building2, Bike, Shield } from "lucide-react";

const roles = [
  {
    id: "donor",
    label: "Food Donor",
    description: "Restaurants, caterers & individuals with surplus food",
    icon: Utensils,
    gradient: "from-primary to-accent",
    route: "/donor",
  },
  {
    id: "ngo",
    label: "NGO / Shelter",
    description: "Receive & distribute food to those in need",
    icon: Building2,
    gradient: "from-secondary to-orange-400",
    route: "/donor",
  },
  {
    id: "volunteer",
    label: "Volunteer",
    description: "Help pick up & deliver food donations",
    icon: Bike,
    gradient: "from-accent to-teal-400",
    route: "/donor",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Manage & oversee the platform",
    icon: Shield,
    gradient: "from-muted-foreground to-foreground",
    route: "/donor",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SelectRole = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Choose Your Role
        </h1>
        <p className="text-muted-foreground">How would you like to contribute?</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 w-full max-w-md"
      >
        {roles.map((role) => (
          <motion.button
            key={role.id}
            variants={item}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(role.route)}
            className="glass-card-strong rounded-3xl p-6 flex flex-col items-center text-center gap-3 group cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
              <role.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground text-sm">{role.label}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{role.description}</p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default SelectRole;
