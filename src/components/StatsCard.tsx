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
      whileHover={{ y: -3, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-strong rounded-2xl p-4 text-center relative overflow-hidden group"
    >
      {/* Subtle glow on hover */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, hsl(160 60% 45% / 0.1), transparent 70%)'
        }}
      />
      
      <div className="relative z-10">
        <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
        <motion.p 
          className="text-lg font-display font-bold text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {value}
        </motion.p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
