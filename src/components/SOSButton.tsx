import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, Phone, X, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SOSButton = () => {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const sendSOS = async () => {
    if (!user) return;
    setSending(true);

    let coords = { lat: 0, lng: 0 };
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 5000 }));
      coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch {}

    await supabase.from("alerts").insert({
      user_id: user.id,
      title: "🆘 SOS Emergency Alert",
      message: `Emergency SOS triggered! Location: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}. User requires immediate assistance.`,
      type: "urgent",
    });

    setSending(false);
    setOpen(false);
    toast({ title: "🆘 SOS Alert Sent", description: "Emergency team has been notified with your location." });
  };

  return (
    <>
      {/* SOS trigger */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-destructive flex items-center justify-center shadow-lg"
        style={{ boxShadow: "0 0 20px hsl(0 72% 51% / 0.4)" }}
      >
        <AlertTriangle className="w-5 h-5 text-destructive-foreground" />
      </motion.button>

      {/* Modal */}
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] flex items-center justify-center px-6" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative glass-card-strong rounded-3xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-muted-foreground"><X className="w-5 h-5" /></button>

            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">Emergency SOS</h3>
            <p className="text-sm text-muted-foreground mb-6">This will send an emergency alert with your live location to the admin team.</p>

            <motion.button whileTap={{ scale: 0.97 }} onClick={sendSOS} disabled={sending} className="w-full bg-destructive text-destructive-foreground py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50" style={{ boxShadow: "0 0 30px hsl(0 72% 51% / 0.3)" }}>
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Phone className="w-5 h-5" />}
              {sending ? "Sending Alert..." : "Send SOS Alert"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default SOSButton;
