import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Please enter a valid email").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Include at least one letter")
    .regex(/[0-9]/, "Include at least one number"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const schema = isLogin ? loginSchema : signupSchema;
    const data = isLogin ? { email, password } : { name, email, password };
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate("/select-role");
      } else {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        toast({
          title: "✅ Account created",
          description: "Check your inbox to verify your email. You can sign in now — a banner will remind you to verify.",
        });
        setIsLogin(true);
      }
    } catch (err: any) {
      const msg = err?.message || "Something went wrong";
      const friendly = /Invalid login credentials/i.test(msg)
        ? "Wrong email or password"
        : /already registered/i.test(msg)
        ? "An account with this email already exists"
        : msg;
      toast({ variant: "destructive", title: "Sign-in failed", description: friendly });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative">
      <SEO
        title={isLogin ? "Sign in to FoodDonar" : "Create your FoodDonar account"}
        description={isLogin ? "Sign in to FoodDonar to share surplus food, claim donations, and coordinate volunteers in real time." : "Create a free FoodDonar account as a donor, NGO, or volunteer and start reducing food waste in your community."}
        path="/auth"
      />
      <h1 className="sr-only">{isLogin ? "Sign in to FoodDonar" : "Create your FoodDonar account"}</h1>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-primary/8 blur-[100px] animate-ambient" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-secondary/6 blur-[120px] animate-ambient" style={{ animationDelay: "-7s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          {t("app.tagline")}
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-muted-foreground">{t("app.name")}</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm space-y-4 relative z-10"
      >
        {!isLogin && (
          <div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                className="w-full glass-card rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>
            {errors.name && <p className="text-xs text-secondary mt-1.5 ml-1">{errors.name}</p>}
          </div>
        )}

        <div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              className="w-full glass-card rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
          {errors.email && <p className="text-xs text-secondary mt-1.5 ml-1">{errors.email}</p>}
        </div>

        <div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              className="w-full glass-card rounded-2xl pl-11 pr-12 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-secondary mt-1.5 ml-1">{errors.password}</p>}
          {!isLogin && !errors.password && (
            <p className="text-xs text-muted-foreground mt-1.5 ml-1">At least 8 characters with a letter and a number</p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full gradient-primary text-primary-foreground py-4 rounded-2xl font-semibold text-lg shadow-xl glow-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Please wait…" : isLogin ? "Log in" : "Create account"}
          {!loading && <ArrowRight className="w-5 h-5" />}
        </motion.button>

        {isLogin && (
          <p className="text-center">
            <button type="button" onClick={() => navigate("/forgot-password")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Forgot password?
            </button>
          </p>
        )}

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
            className="text-primary font-medium hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </motion.form>
    </div>
  );
};

export default Auth;
