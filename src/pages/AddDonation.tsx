import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, MapPin, Clock, Users, Leaf, ChevronDown, Check, Sparkles, Image } from "lucide-react";

import foodBiryani from "@/assets/food-biryani.jpg";

const foodTypes = ["Veg", "Non-Veg", "Vegan"];

const AddDonation = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("Veg");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 relative">
        {/* Success ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/20 blur-[100px]"
          />
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 15 }}
            className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-2xl glow-primary"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Check className="w-12 h-12 text-primary-foreground" />
            </motion.div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-2xl font-display font-bold text-foreground mb-2"
          >
            Donation Added!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-muted-foreground mb-8"
          >
            We'll match you with nearby NGOs soon.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(160 60% 45% / 0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/donor")}
            className="gradient-primary text-primary-foreground px-8 py-3 rounded-2xl font-semibold shadow-xl glow-primary"
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-primary/6 blur-[100px] animate-ambient" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 rounded-full bg-secondary/5 blur-[80px] animate-ambient" style={{ animationDelay: '-8s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-6 flex items-center gap-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-full glass-card flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl font-display font-bold text-foreground"
        >
          Add Donation
        </motion.h1>
      </div>

      <div className="relative z-10 px-6 space-y-6">
        {/* Photo Upload / Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setHasPhoto(!hasPhoto)}
          className={`rounded-3xl overflow-hidden cursor-pointer group relative ${
            hasPhoto ? 'h-48' : 'glass-card p-6 flex flex-col items-center justify-center min-h-[180px] border-2 border-dashed border-primary/30'
          }`}
        >
          {hasPhoto ? (
            <>
              <img 
                src={foodBiryani} 
                alt="Food preview" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-foreground text-sm font-medium">
                <Image className="w-4 h-4" />
                Tap to change photo
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl glass-light flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-7 h-7 text-primary" />
              </div>
              <p className="font-medium text-foreground text-sm">Upload Food Photo</p>
              <p className="text-xs text-muted-foreground">Tap to take or select a photo</p>
            </>
          )}
        </motion.div>

        {/* Food Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <label className="text-sm font-medium text-foreground mb-3 block">Food Type</label>
          <div className="flex gap-3">
            {foodTypes.map((type) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedType(type)}
                className={`flex-1 py-3 rounded-2xl font-medium text-sm transition-all duration-300 ${
                  selectedType === type
                    ? "gradient-primary text-primary-foreground shadow-lg glow-primary"
                    : "glass-card text-foreground hover:bg-muted/50"
                }`}
              >
                {type === "Veg" && "🥬 "}
                {type === "Non-Veg" && "🍗 "}
                {type === "Vegan" && "🌱 "}
                {type}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <label className="text-sm font-medium text-foreground mb-3 block">Food Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Biryani, Dal Rice, Bread..."
            className="w-full glass-card rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </motion.div>

        {/* Quantity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <label className="text-sm font-medium text-foreground mb-3 block">Serves (people)</label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Number of people it can serve"
              className="w-full glass-card rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        </motion.div>

        {/* Expiry - Glowing capsule style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center">
            <Clock className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex-1 relative z-10">
            <p className="text-sm font-medium text-foreground">Best Before</p>
            <p className="text-xs text-muted-foreground">Food expires in ~4 hours</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-secondary/20 text-secondary text-xs font-semibold neon-outline-warm">
            4:00 hrs
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-2xl p-4 flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Pickup Location</p>
            <p className="text-xs text-muted-foreground">Auto-detected: Andheri West, Mumbai</p>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Sparkles className="w-4 h-4" />
            <Leaf className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Submit */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02, boxShadow: "0 0 50px hsl(160 60% 45% / 0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSubmitted(true)}
          className="w-full gradient-primary text-primary-foreground py-4 rounded-2xl font-semibold text-lg shadow-2xl mb-8 glow-primary relative overflow-hidden group"
        >
          <span className="relative z-10">Submit Donation 🤝</span>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      </div>
    </div>
  );
};

export default AddDonation;
