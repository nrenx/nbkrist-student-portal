
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeErrorHandler } from "@/utils/errorHandler";

import Index from "./pages/Index";
import StudentDetails from "./pages/StudentDetails";
import StudentNameSearch from "./pages/StudentNameSearch";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogSubmit from "./pages/BlogSubmit";
import CollegeLogo from "./pages/CollegeLogo";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import AdPolicy from "./pages/AdPolicy";
import FlowChart from "./pages/FlowChart";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  // Initialize error handler on mount
  useEffect(() => {
    initializeErrorHandler();
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/student/:rollNumber" element={<StudentDetails />} />
              <Route path="/student-name-search" element={<StudentNameSearch />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/post/:id" element={<BlogPost />} />
              <Route path="/blog/submit" element={<BlogSubmit />} />
              <Route path="/college-logo" element={<CollegeLogo />} />
              <Route path="/how-it-works" element={<FlowChart />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/ad-policy" element={<AdPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
