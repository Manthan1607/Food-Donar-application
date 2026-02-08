import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
}

const StatsCard = ({ icon: Icon, value, label, color }: StatsCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card-strong rounded-2xl p-4 text-center"
    >
      <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
      <p className="text-lg font-display font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </motion.div>
  );
};

export default StatsCard;
