import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, MapPin, Clock, Users, Leaf, ChevronDown, Check } from "lucide-react";

const foodTypes = ["Veg", "Non-Veg", "Vegan"];

const AddDonation = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("Veg");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <Check className="w-12 h-12 text-primary-foreground" />
          </motion.div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Donation Added!</h2>
          <p className="text-muted-foreground mb-8">We'll match you with nearby NGOs soon.</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/donor")}
            className="gradient-primary text-primary-foreground px-8 py-3 rounded-2xl font-semibold shadow-lg"
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <h1 className="text-xl font-display font-bold text-foreground">Add Donation</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Photo Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center min-h-[180px] border-2 border-dashed border-primary/30 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
            <Camera className="w-7 h-7 text-primary" />
          </div>
          <p className="font-medium text-foreground text-sm">Upload Food Photo</p>
          <p className="text-xs text-muted-foreground">Tap to take or select a photo</p>
        </motion.div>

        {/* Food Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="text-sm font-medium text-foreground mb-3 block">Food Type</label>
          <div className="flex gap-3">
            {foodTypes.map((type) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(type)}
                className={`flex-1 py-3 rounded-2xl font-medium text-sm transition-all ${
                  selectedType === type
                    ? "gradient-primary text-primary-foreground shadow-lg"
                    : "glass-card text-foreground"
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
          transition={{ delay: 0.15 }}
        >
          <label className="text-sm font-medium text-foreground mb-3 block">Food Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Biryani, Dal Rice, Bread..."
            className="w-full glass-card rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </motion.div>

        {/* Quantity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="text-sm font-medium text-foreground mb-3 block">Serves (people)</label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Number of people it can serve"
              className="w-full glass-card rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </motion.div>

        {/* Expiry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-2xl p-4 flex items-center gap-3"
        >
          <Clock className="w-5 h-5 text-secondary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Best Before</p>
            <p className="text-xs text-muted-foreground">Food expires in ~4 hours</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-4 flex items-center gap-3"
        >
          <MapPin className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Pickup Location</p>
            <p className="text-xs text-muted-foreground">Auto-detected: Andheri West, Mumbai</p>
          </div>
          <Leaf className="w-4 h-4 text-primary" />
        </motion.div>

        {/* Submit */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSubmitted(true)}
          className="w-full gradient-primary text-primary-foreground py-4 rounded-2xl font-semibold text-lg shadow-xl mb-8"
        >
          Submit Donation 🤝
        </motion.button>
      </div>
    </div>
  );
};

export default AddDonation;
