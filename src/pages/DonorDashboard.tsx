import { motion } from "framer-motion";
import { Plus, Bell, MapPin, TrendingUp, Clock, Utensils, Award, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import StatsCard from "@/components/StatsCard";

const recentDonations = [
  { id: 1, name: "Biryani (Veg)", qty: "25 people", time: "2h ago", status: "Picked Up" },
  { id: 2, name: "Bread & Pastries", qty: "40 people", time: "5h ago", status: "Delivered" },
  { id: 3, name: "Dal & Rice", qty: "60 people", time: "1d ago", status: "Delivered" },
];

const DonorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-hero px-6 pt-12 pb-20 rounded-b-[2.5rem]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-foreground/70 text-sm">Welcome back 👋</p>
            <h1 className="text-2xl font-display font-bold text-primary-foreground">Arun Kumar</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center backdrop-blur-lg"
          >
            <Bell className="w-5 h-5 text-primary-foreground" />
          </motion.button>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
          <MapPin className="w-4 h-4" />
          <span>Mumbai, Maharashtra</span>
        </div>
      </div>

      {/* Stats overlapping header */}
      <div className="px-6 -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          <StatsCard icon={Utensils} value="128" label="Meals Shared" color="text-primary" />
          <StatsCard icon={TrendingUp} value="45kg" label="Food Saved" color="text-secondary" />
          <StatsCard icon={Award} value="Level 5" label="Impact Score" color="text-accent" />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/add-donation")}
            className="flex-1 gradient-primary text-primary-foreground rounded-2xl p-4 flex items-center gap-3 shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Donate Food</p>
              <p className="text-xs text-primary-foreground/70">Add new donation</p>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
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
        </div>
      </div>

      {/* Recent Donations */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">Recent Donations</h2>
          <button className="text-sm text-primary font-medium">View All</button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {recentDonations.map((donation, i) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-card rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-primary" />
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
                    ? "bg-primary/10 text-primary" 
                    : "bg-secondary/10 text-secondary"
                }`}>
                  {donation.status}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
