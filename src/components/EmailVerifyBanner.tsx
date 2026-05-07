import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MailCheck, X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EmailVerifyBanner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  if (!user || dismissed) return null;
  // email_confirmed_at is set once the user verifies
  if ((user as any).email_confirmed_at) return null;

  const resend = async () => {
    if (!user.email) return;
    setSending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.email,
      options: { emailRedirectTo: window.location.origin },
    });
    setSending(false);
    if (error) {
      toast({ variant: "destructive", title: "Could not resend", description: error.message });
    } else {
      toast({ title: "Verification email sent", description: `Check ${user.email}` });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="glass-card rounded-2xl px-4 py-3 mb-4 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <MailCheck className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Verify your email</p>
          <p className="text-xs text-muted-foreground truncate">
            We sent a link to <span className="text-foreground">{user.email}</span>. Tap to confirm.
          </p>
        </div>
        <button
          onClick={resend}
          disabled={sending}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/15 text-primary hover:bg-primary/25 transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          {sending && <Loader2 className="w-3 h-3 animate-spin" />}
          {sending ? "Sending…" : "Resend"}
        </button>
        <button onClick={() => setDismissed(true)} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Dismiss">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailVerifyBanner;
