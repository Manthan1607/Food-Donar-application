import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import SelectRole from "./pages/SelectRole";
import DonorDashboard from "./pages/DonorDashboard";
import AddDonation from "./pages/AddDonation";
import ImpactDashboard from "./pages/ImpactDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="max-w-md mx-auto relative">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/select-role" element={<SelectRole />} />
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/add-donation" element={<AddDonation />} />
            <Route path="/impact" element={<ImpactDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
