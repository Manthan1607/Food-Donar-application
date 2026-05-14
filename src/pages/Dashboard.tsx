import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardNavbar from "@/components/DashboardNavbar";
import DonorView from "@/components/dashboard/DonorView";
import NgoView from "@/components/dashboard/NgoView";
import VolunteerView from "@/components/dashboard/VolunteerView";
import AdminView from "@/components/dashboard/AdminView";
import MapTab from "@/components/dashboard/MapTab";
import AIChatBot from "@/components/AIChatBot";
import EmailVerifyBanner from "@/components/EmailVerifyBanner";
import { SEO } from "@/components/SEO";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [currentRole, setCurrentRole] = useState<AppRole>("donor");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [displayName, setDisplayName] = useState("User");

  const showMap = searchParams.get("tab") === "map";

  // Load user's role and profile
  useEffect(() => {
    if (!user) return;

    supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data?.display_name) setDisplayName(data.display_name); });

    supabase.from("user_roles").select("role").eq("user_id", user.id).limit(1).maybeSingle()
      .then(({ data }) => { if (data?.role) setCurrentRole(data.role); });
  }, [user]);

  const handleRoleChange = async (role: AppRole) => {
    setCurrentRole(role);
    if (!user) return;
    // Upsert role
    await supabase.from("user_roles").upsert(
      { user_id: user.id, role },
      { onConflict: "user_id,role" }
    );
  };

  const roleViews: Record<AppRole, React.ReactNode> = {
    donor: <DonorView />,
    ngo: <NgoView />,
    volunteer: <VolunteerView />,
    admin: <AdminView />,
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/8 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -15, 10, 0], y: [0, 10, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full bg-secondary/6 blur-[100px]"
        />
      </div>

      {/* Sidebar */}
      <DashboardSidebar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <motion.div
        animate={{ marginLeft: typeof window !== "undefined" && window.innerWidth >= 768 ? (sidebarCollapsed ? 64 : 220) : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* Navbar */}
        <DashboardNavbar
          onMenuClick={() => setMobileOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          displayName={displayName}
        />

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 pb-24 max-w-4xl w-full mx-auto">
          <motion.div
            key={showMap ? "map" : currentRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmailVerifyBanner />
            {showMap ? <MapTab /> : roleViews[currentRole]}
          </motion.div>
        </main>
      </motion.div>

      <AIChatBot />
    </div>
  );
};

export default Dashboard;
