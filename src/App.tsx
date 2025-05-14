
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import StudentDetails from "./pages/StudentDetails";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogSubmit from "./pages/BlogSubmit";
import CollegeLogos from "./pages/CollegeLogos";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import AdPolicy from "./pages/AdPolicy";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/student/:rollNumber" element={<StudentDetails />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/post/:id" element={<BlogPost />} />
            <Route path="/blog/submit" element={<BlogSubmit />} />
            <Route path="/college-logos" element={<CollegeLogos />} />
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

export default App;
