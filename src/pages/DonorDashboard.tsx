import { motion } from "framer-motion";
import { Plus, Bell, MapPin, TrendingUp, Clock, Utensils, Award, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import StatsCard from "@/components/StatsCard";

import foodBiryani from "@/assets/food-biryani.jpg";
import foodBread from "@/assets/food-bread.jpg";
import foodDalRice from "@/assets/food-dal-rice.jpg";

const recentDonations = [
  { id: 1, name: "Biryani (Veg)", qty: "25 people", time: "2h ago", status: "Picked Up", image: foodBiryani },
  { id: 2, name: "Bread & Pastries", qty: "40 people", time: "5h ago", status: "Delivered", image: foodBread },
  { id: 3, name: "Dal & Rice", qty: "60 people", time: "1d ago", status: "Delivered", image: foodDalRice },
];

const DonorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 relative">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/8 blur-[100px] animate-ambient" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full bg-secondary/6 blur-[80px] animate-ambient" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Header with gradient */}
      <div className="relative px-6 pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-muted-foreground text-sm"
            >
              Welcome back 👋
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl font-display font-bold text-foreground"
            >
              Arun Kumar
            </motion.h1>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-full glass-card flex items-center justify-center relative"
          >
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary" />
          </motion.button>
        </div>

        {/* Location */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 flex items-center gap-2 text-muted-foreground text-sm"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span>Mumbai, Maharashtra</span>
        </motion.div>
      </div>

      {/* Stats overlapping header */}
      <div className="px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-3 gap-3"
        >
          <StatsCard icon={Utensils} value="128" label="Meals Shared" color="text-primary" />
          <StatsCard icon={TrendingUp} value="45kg" label="Food Saved" color="text-secondary" />
          <StatsCard icon={Award} value="Level 5" label="Impact Score" color="text-accent" />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-8 relative z-10">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-display font-semibold text-foreground mb-4"
        >
          Quick Actions
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsl(160 60% 45% / 0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/add-donation")}
            className="flex-1 gradient-primary text-primary-foreground rounded-2xl p-4 flex items-center gap-3 shadow-lg glow-primary"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Donate Food</p>
              <p className="text-xs text-primary-foreground/70">Add new donation</p>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px hsl(30 85% 55% / 0.2)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/impact")}
            className="flex-1 glass-card-strong rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">My Impact</p>
              <p className="text-xs text-muted-foreground">View stats</p>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Recent Donations */}
      <div className="px-6 mt-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg font-display font-semibold text-foreground"
          >
            Recent Donations
          </motion.h2>
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-primary font-medium"
          >
            View All
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          {recentDonations.map((donation, i) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.01, x: 4 }}
              className="glass-card rounded-2xl p-3 flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Food image thumbnail */}
                <div className="w-14 h-14 rounded-xl overflow-hidden relative">
                  <img 
                    src={donation.image} 
                    alt={donation.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{donation.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{donation.qty}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{donation.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  donation.status === "Delivered" 
                    ? "bg-primary/15 text-primary neon-outline" 
                    : "bg-secondary/15 text-secondary neon-outline-warm"
                }`}>
                  {donation.status}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DonorDashboard;
