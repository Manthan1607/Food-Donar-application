import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Globe, LogOut, ChevronRight, Shield, HelpCircle, Info, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

const languages: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          if (data.language) setLanguage(data.language as Language);
        }
      });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, phone, address, language })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "✅ Profile updated!" });
      setEditing(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const menuItems = [
    { icon: Shield, label: t("profile.settings"), onClick: () => {} },
    { icon: HelpCircle, label: t("profile.helpCenter"), onClick: () => {} },
    { icon: Info, label: t("profile.about"), onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 w-96 h-96 rounded-full bg-primary/8 blur-[100px] animate-ambient" />
      </div>

      <div className="relative z-10 px-6 pt-12 pb-6">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-display font-bold text-foreground">
          {t("profile.title")}
        </motion.h1>
      </div>

      <div className="relative z-10 px-6 space-y-6">
        {/* Avatar & name */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-strong rounded-3xl p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg glow-primary">
            {displayName?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-lg">{displayName || "User"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setEditing(!editing)}
            className="px-3 py-1.5 rounded-full glass-card text-xs text-primary font-medium"
          >
            {editing ? t("common.cancel") : t("profile.editProfile")}
          </motion.button>
        </motion.div>

        {/* Edit form */}
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("profile.displayName")}
                className="w-full glass-card rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("profile.phone")}
                className="w-full glass-card rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t("profile.address")}
                className="w-full glass-card rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={saveProfile}
              disabled={saving}
              className="w-full gradient-primary text-primary-foreground py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 glow-primary disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? t("common.loading") : t("common.save")}
            </motion.button>
          </motion.div>
        )}

        {/* Language selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-strong rounded-3xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground text-sm">{t("profile.language")}</span>
          </div>
          <div className="flex gap-2">
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setLanguage(lang.code);
                  if (user) {
                    supabase.from("profiles").update({ language: lang.code }).eq("user_id", user.id);
                  }
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  language === lang.code
                    ? "gradient-primary text-primary-foreground glow-primary"
                    : "glass-card text-foreground"
                }`}
              >
                {lang.native}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Menu items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-strong rounded-3xl overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm text-foreground hover:bg-muted/30 transition-colors ${
                i < menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full glass-card rounded-2xl py-3.5 text-destructive font-medium text-sm flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {t("common.logout")}
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
