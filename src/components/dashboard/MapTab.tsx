import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Utensils, Building2, Bike } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MapView from "@/components/MapView";

const legendItems = [
  { type: "donation", label: "Donations", icon: Utensils, color: "bg-primary" },
  { type: "ngo", label: "NGOs", icon: Building2, color: "bg-secondary" },
  { type: "volunteer", label: "Volunteers", icon: Bike, color: "bg-accent" },
];

const MapTab = () => {
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    const loadMarkers = async () => {
      const { data: donations } = await supabase
        .from("donations")
        .select("id, title, quantity, food_type, status, latitude, longitude, pickup_address")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .limit(100);

      const mapMarkers = (donations || []).map(d => ({
        lat: d.latitude!,
        lng: d.longitude!,
        title: d.title,
        type: "donation" as const,
        popup: `${d.quantity} servings · ${d.food_type} · ${d.status}${d.pickup_address ? `<br/>${d.pickup_address}` : ""}`,
      }));

      // Add some sample NGO/volunteer markers around Mumbai for demo
      const sampleMarkers = [
        { lat: 19.076, lng: 72.8777, title: "FoodShare HQ", type: "ngo" as const, popup: "Central distribution hub" },
        { lat: 19.089, lng: 72.868, title: "Hope Foundation", type: "ngo" as const, popup: "Active · 45 meals today" },
        { lat: 19.065, lng: 72.890, title: "Volunteer: Rahul", type: "volunteer" as const, popup: "Available · 2km away" },
        { lat: 19.082, lng: 72.895, title: "Volunteer: Priya", type: "volunteer" as const, popup: "In transit · ETA 10min" },
      ];

      setMarkers([...mapMarkers, ...sampleMarkers]);
    };

    loadMarkers();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-display font-semibold text-foreground">Live Map</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl overflow-hidden border border-border/50"
        style={{ height: "calc(100vh - 200px)", minHeight: 400 }}
      >
        <MapView markers={markers} />
      </motion.div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        {legendItems.map(item => (
          <div key={item.type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapTab;
