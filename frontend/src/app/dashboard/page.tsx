"use client";
import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { Activity, Droplets, Moon, Brain, ChevronRight, Download, Watch, RefreshCw, Bell } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DailyPlan, { PlanItem } from "@/components/DailyPlan";
import HealthTimeline from "@/components/HealthTimeline";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from "recharts";

const doshaData = [
  { subject: 'Vata', A: 120, fullMark: 150 },
  { subject: 'Pitta', A: 98, fullMark: 150 },
  { subject: 'Kapha', A: 86, fullMark: 150 },
];

const mockLogs = [
  { date: '2026-07-01', waterIntake: 1.5, sleepHours: 6, stressLevel: 'HIGH', healthScore: 72 },
  { date: '2026-07-02', waterIntake: 2.0, sleepHours: 7, stressLevel: 'MEDIUM', healthScore: 78 },
  { date: '2026-07-03', waterIntake: 2.5, sleepHours: 8, stressLevel: 'LOW', healthScore: 85 },
  { date: '2026-07-04', waterIntake: 2.8, sleepHours: 7.5, stressLevel: 'LOW', healthScore: 88 },
  { date: '2026-07-05', waterIntake: 3.0, sleepHours: 8, stressLevel: 'LOW', healthScore: 92 },
];

const mockPlan: PlanItem[] = [
  { id: '1', time: '07:00 AM', activity: 'Warm Lemon Water', type: 'DIET', reasoning: 'Kickstarts digestion and flushes toxins.' },
  { id: '2', time: '08:00 AM', activity: '30 min Yoga', type: 'EXERCISE', reasoning: 'Calms Vata dosha and improves flexibility.' },
  { id: '3', time: '01:00 PM', activity: 'Warm, Cooked Lunch', type: 'DIET', reasoning: 'Pitta is highest at midday; optimal digestion.' },
  { id: '4', time: '10:00 PM', activity: 'Digital Detox', type: 'SLEEP', reasoning: 'Ensures deep sleep and reduces mental stimulation.' },
];

export default function DashboardPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  const handleEnableNotifications = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsEnabled(true);
      new Notification("VedaAI Notifications Enabled!", {
        body: "You'll now receive daily wellness reminders.",
        icon: "/favicon.ico",
      });
    }
  };
  
  const handleSyncWearable = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("Successfully synced with Apple Health! Vitals updated.");
    }, 2000);
  };
  
  const handleDownloadPdf = async () => {
    const dashboardElement = document.getElementById("dashboard-content");
    if (!dashboardElement) return;

    try {
      const canvas = await html2canvas(dashboardElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('VedaAI_Weekly_Health_Report.pdf');
    } catch (err) {
      console.error("Failed to generate PDF", err);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div id="dashboard-content" className="max-w-7xl mx-auto space-y-8 bg-background p-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, Seeker</h1>
            <p className="text-muted-foreground mt-1">Here is your daily Ayurvedic wellness summary.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-4">
              <div className="bg-card border border-border rounded-lg px-4 py-2 flex flex-col items-center shadow-sm">
                <span className="text-sm text-muted-foreground font-medium">Daily Habit Score</span>
                <span className="text-2xl font-bold text-primary">85/100</span>
              </div>
              <div className="bg-card border border-border rounded-lg px-4 py-2 flex flex-col items-center shadow-sm">
                <span className="text-sm text-muted-foreground font-medium">Risk Score</span>
                <span className="text-2xl font-bold text-secondary">Low</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleEnableNotifications}
                disabled={notificationsEnabled}
                className="flex items-center gap-2 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 px-4 py-2 rounded-lg font-medium transition-colors border border-amber-500/20 disabled:opacity-50"
              >
                <Bell className="w-5 h-5" /> 
                {notificationsEnabled ? "Notifications On" : "Enable Alerts"}
              </button>
              
              <div className="flex gap-2">
                <button 
                  onClick={handleSyncWearable}
                  disabled={isSyncing}
                  className="flex items-center gap-2 bg-secondary/10 text-secondary hover:bg-secondary/20 px-4 py-2 rounded-lg font-medium transition-colors border border-secondary/20 disabled:opacity-50"
                >
                  <Watch className="w-5 h-5" /> 
                  {isSyncing ? "Syncing..." : "Sync Wearable"}
                </button>
                <button 
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg font-medium transition-colors border border-primary/20"
                >
                  <Download className="w-5 h-5" /> Download Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Dosha Radar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-4">Dosha Distribution</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={doshaData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--foreground)", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Dosha" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Wellness Progress Line Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:col-span-2"
          >
            <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
            <div className="flex-1 min-h-[250px]">
              <HealthTimeline logs={mockLogs} />
            </div>
          </motion.div>

        </div>

        {/* Bottom Grid: Daily Habits & AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
          >
            <DailyPlan dosha="Vata" plan={mockPlan} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col"
          >
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Veda Guru Insights</h3>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground">
                  Your Vata is slightly elevated today. Favor warm, grounding foods like oatmeal or cooked root vegetables to maintain balance.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer group flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-foreground">Today's Recommended Herb</h4>
                  <p className="text-sm text-muted-foreground">Ashwagandha for stress management</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/chat'}
              className="mt-4 w-full py-2 bg-secondary/10 text-secondary-foreground font-medium rounded-lg hover:bg-secondary/20 transition-colors"
            >
              Chat with Veda Guru
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
