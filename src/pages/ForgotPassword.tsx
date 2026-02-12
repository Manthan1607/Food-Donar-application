import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-primary/8 blur-[100px] animate-ambient" />
        </div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center relative z-10 max-w-sm">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-2xl glow-primary">
            <Mail className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Check Your Email</h2>
          <p className="text-muted-foreground mb-6">We've sent a password reset link to <span className="text-foreground font-medium">{email}</span></p>
          <button onClick={() => navigate("/auth")} className="text-primary font-medium hover:underline text-sm">Back to Login</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-primary/8 blur-[100px] animate-ambient" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-secondary/6 blur-[120px] animate-ambient" style={{ animationDelay: "-7s" }} />
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-xl glow-primary">
          <KeyRound className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Forgot Password?</h1>
        <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link</p>
      </motion.div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 relative z-10">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required className="w-full glass-card rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground py-4 rounded-2xl font-semibold text-lg shadow-xl glow-primary flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? "Sending..." : "Send Reset Link"}
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <button type="button" onClick={() => navigate("/auth")} className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </motion.form>
    </div>
  );
};

export default ForgotPassword;
