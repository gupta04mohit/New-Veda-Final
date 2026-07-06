"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, ChevronDown, Menu, X, Sparkles, Heart, Brain,
  Activity, Utensils, Watch, Stethoscope, Search, Shield,
  BookOpen, Trophy, Beaker, Video, MessageCircle, Zap, Sun, Moon, FileText
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const navGroups = [
  {
    label: "Health Intelligence",
    icon: Brain,
    items: [
      { label: "Digital Twin", href: "/digital-twin", icon: Zap, desc: "Your live health mirror" },
      { label: "Dosha Assessment", href: "/assessment", icon: Leaf, desc: "Know your body type" },
      { label: "Disease Forecast", href: "/forecast", icon: Activity, desc: "Predict health risks" },
      { label: "AI Simulator", href: "/simulator", icon: Beaker, desc: "What-if health scenarios" },
    ],
  },
  {
    label: "AI Tools",
    icon: Sparkles,
    items: [
      { label: "Veda Guru Chat", href: "/chat", icon: MessageCircle, desc: "AI Ayurvedic doctor" },
      { label: "AI Avatar", href: "/avatar", icon: Heart, desc: "Voice health companion" },
      { label: "AI Scanner", href: "/scanner", icon: Search, desc: "Face · Voice · Food scan" },
      { label: "AI Search", href: "/search", icon: Search, desc: "RAG-powered health search" },
    ],
  },
  {
    label: "Wellness",
    icon: Heart,
    items: [
      { label: "Daily Log", href: "/health-log", icon: Activity, desc: "Track health metrics" },
      { label: "Lab Reports", href: "/reports", icon: FileText, desc: "Upload & analyze reports" },
      { label: "Meal Planner", href: "/meal-planner", icon: Utensils, desc: "Dosha-based diet plans" },
      { label: "Health Journal", href: "/journal", icon: BookOpen, desc: "Track daily wellness" },
    ],
  },
  {
    label: "Care",
    icon: Stethoscope,
    items: [
      { label: "Marketplace", href: "/marketplace", icon: Stethoscope, desc: "Find Ayurvedic experts" },
      { label: "Telehealth", href: "/telehealth", icon: Video, desc: "Video consultations" },
      { label: "Dashboard", href: "/dashboard", icon: Activity, desc: "Health analytics" },
      { label: "Privacy & Security", href: "/privacy", icon: Shield, desc: "Federated AI safety" },
    ],
  },
];

export default function Navbar() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    const storedUser = localStorage.getItem("veda_user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (e) {}
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("veda_token");
    localStorage.removeItem("veda_user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md group-hover:shadow-primary/30 transition-all">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-foreground">Veda<span className="text-primary">AI</span></span>
            <div className="text-[10px] text-muted-foreground leading-none -mt-0.5">Preventive Healthcare OS</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navGroups.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroup === group.label;
            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setOpenGroup(group.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isOpen
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <GroupIcon className="w-4 h-4" />
                  {group.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 pt-2 w-64"
                    >
                      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-2">
                          {group.items.map((item) => {
                            const ItemIcon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpenGroup(null)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/8 hover:text-primary group transition-all"
                              >
                                <div className="w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                                  <ItemIcon className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</div>
                                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Auth Buttons + Theme Toggle */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-xl border border-border bg-muted/50 hover:bg-muted flex items-center justify-center transition-all hover:scale-110"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-5 h-5 text-amber-400" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-5 h-5 text-primary" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          
          {user ? (
            <div className="flex items-center gap-4 ml-2">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors hidden xl:block">
                  {user.name}
                </span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" /> Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Theme + Menu buttons */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl border border-border bg-muted/50 hover:bg-muted flex items-center justify-center transition-all"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-primary" />}
          </button>
          <button
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-6">
              {navGroups.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <div key={group.label}>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                      <GroupIcon className="w-4 h-4" />
                      {group.label}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all"
                          >
                            <ItemIcon className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-sm font-medium">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="text-center py-3 rounded-xl border border-red-500/20 text-red-500 text-sm font-semibold hover:bg-red-500/10 transition-colors"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-center py-3 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors">Sign in</Link>
                    <Link href="/register" className="text-center py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Get Started Free</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
