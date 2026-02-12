import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase handles the token exchange automatically via the URL hash
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User clicked the reset link, they can now set a new password
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ variant: "destructive", title: "Password too short", description: "Minimum 6 characters required" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords don't match" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/select-role"), 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
        </div>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center relative z-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-2xl glow-primary">
            <Check className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Password Updated!</h2>
          <p className="text-muted-foreground">Redirecting you now...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-primary/8 blur-[100px] animate-ambient" />
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-xl glow-primary">
          <ShieldCheck className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Set New Password</h1>
        <p className="text-muted-foreground text-sm">Choose a strong password for your account</p>
      </motion.div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 relative z-10">
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required minLength={6} className="w-full glass-card rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" required minLength={6} className="w-full glass-card rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground py-4 rounded-2xl font-semibold text-lg shadow-xl glow-primary flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? "Updating..." : "Update Password"}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ResetPassword;
