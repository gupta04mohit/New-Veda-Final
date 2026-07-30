"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Leaf, Activity, Brain, ArrowRight, Sparkles, Heart,
  Shield, Zap, Star, Users, ChevronRight, Watch,
  Stethoscope, BookOpen, Beaker, MessageCircle, Utensils
} from "lucide-react";

const stats = [
  { value: "50+", label: "AI Modules", icon: Brain },
  { value: "12", label: "Specialized Agents", icon: Sparkles },
  { value: "5000+", label: "Years of Wisdom", icon: Leaf },
  { value: "99%", label: "Accuracy Rate", icon: Shield },
];

const features = [
  {
    icon: Brain,
    title: "Digital Ayurvedic Twin",
    desc: "Your personalized AI health model that evolves continuously — tracking Dosha, vitals, stress, and predicting future health states.",
    color: "from-violet-500 to-purple-600",
    href: "/digital-twin",
  },
  {
    icon: Activity,
    title: "Early Disease Detection",
    desc: "AI-powered risk forecasting for Diabetes, Hypertension, Heart Disease, and more — months before symptoms appear.",
    color: "from-primary to-emerald-500",
    href: "/forecast",
  },
  {
    icon: MessageCircle,
    title: "Veda Guru AI Chat",
    desc: "A 12-agent orchestration system routing your health questions to specialized Ayurvedic experts in real-time.",
    color: "from-blue-500 to-cyan-500",
    href: "/chat",
  },
  {
    icon: Utensils,
    title: "Smart Meal Planner",
    desc: "Dosha-specific meal plans, daily recipes, and caloric tracking tailored to your constitution and health goals.",
    color: "from-orange-500 to-amber-500",
    href: "/meal-planner",
  },
  {
    icon: Watch,
    title: "Wearable Intelligence",
    desc: "Sync Apple Health, Fitbit, and Google Fit. AI detects anomalies in your Heart Rate, SpO2, and sleep patterns.",
    color: "from-pink-500 to-rose-500",
    href: "/wearables",
  },
  {
    icon: Stethoscope,
    title: "Doctor Marketplace",
    desc: "AI-matched consultations with top Ayurvedic physicians, nutritionists, and yoga therapists via video calls.",
    color: "from-teal-500 to-green-600",
    href: "/marketplace",
  },
];

const testimonials = [
  { name: "Priya Sharma", role: "Software Engineer, Bangalore", text: "VedaAI completely changed how I understand my body. The Dosha assessment was spot on — I've fixed my chronic digestion issues in 3 weeks!", rating: 5 },
  { name: "Rahul Mehta", role: "Entrepreneur, Mumbai", text: "The Disease Forecast feature warned me about pre-diabetic risks 4 months ago. My doctor confirmed it. This platform literally saved me.", rating: 5 },
  { name: "Anita Patel", role: "Yoga Instructor, Delhi", text: "I use VedaAI's meal planner with my students daily. The Kapha-pacifying plans have been transformational for weight management.", rating: 5 },
];

const doshas = [
  { name: "Vata", element: "Air + Space", color: "from-blue-400 to-indigo-500", traits: ["Creative", "Quick-thinking", "Enthusiastic"], imbalance: "Anxiety, dry skin, insomnia" },
  { name: "Pitta", element: "Fire + Water", color: "from-orange-400 to-red-500", traits: ["Sharp intellect", "Ambitious", "Organized"], imbalance: "Inflammation, irritability, acid reflux" },
  { name: "Kapha", element: "Earth + Water", color: "from-green-400 to-emerald-600", traits: ["Calm", "Compassionate", "Stable"], imbalance: "Weight gain, lethargy, congestion" },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/8" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent/8 rounded-full blur-3xl" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-[8%] w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 blur-sm animate-float" />
        <div className="absolute top-1/3 right-[10%] w-12 h-12 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 blur-sm animate-float-delayed" />
        <div className="absolute bottom-1/3 left-[15%] w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-sm animate-float" style={{ animationDelay: "2s" }} />

        <div className="container mx-auto px-4 lg:px-6 relative z-10 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8">
                <Sparkles className="w-4 h-4" />
                AI-Powered Preventive Healthcare OS
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-[1.08] mb-6 tracking-tight">
                Your Health,{" "}
                <span className="gradient-text">Reimagined</span>{" "}
                by AI
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
                VedaAI merges 5,000 years of Ayurvedic wisdom with cutting-edge Machine Learning to create the world's most personalized preventive healthcare platform.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  href="/assessment"
                  className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 group"
                >
                  Discover Your Dosha
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2.5 border-2 border-border text-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:bg-muted/50 hover:border-primary/40 transition-all group"
                >
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Chat with Veda Guru
                </Link>
              </div>
              <div className="flex items-center gap-6 flex-wrap">
                {[
                  { icon: Shield, text: "Privacy-First AI" },
                  { icon: Leaf, text: "100% Ayurvedic" },
                  { icon: Zap, text: "Real-time Analysis" },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary" /> {text}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right — Health Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative"
            >
              {/* Main card */}
              <div className="relative bg-card border border-border rounded-3xl shadow-2xl p-6 overflow-hidden animate-glow-pulse">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Digital Health Twin</p>
                    <h3 className="text-2xl font-bold text-foreground">Arjun K.</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                    <Leaf className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Health Score Ring */}
                <div className="flex items-center gap-6 mb-6 p-4 bg-gradient-to-r from-primary/8 to-transparent rounded-2xl">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
                      <circle cx="40" cy="40" r="32" fill="none" stroke="url(#healthGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 32 * 0.84} ${2 * Math.PI * 32}`} />
                      <defs>
                        <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="oklch(0.42 0.1 152)" />
                          <stop offset="100%" stopColor="oklch(0.78 0.16 82)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-foreground">84</span>
                      <span className="text-xs text-muted-foreground">Health</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      { label: "Sleep", val: 75, color: "bg-blue-500" },
                      { label: "Stress", val: 40, color: "bg-orange-500" },
                      { label: "Energy", val: 88, color: "bg-primary" },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-muted-foreground">{m.label}</span>
                          <span>{m.val}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dosha Distribution */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { d: "Vata", v: 58, c: "text-blue-500 bg-blue-50 dark:bg-blue-950" },
                    { d: "Pitta", v: 28, c: "text-orange-500 bg-orange-50 dark:bg-orange-950" },
                    { d: "Kapha", v: 14, c: "text-green-600 bg-green-50 dark:bg-green-950" },
                  ].map(({ d, v, c }) => (
                    <div key={d} className={`text-center p-3 rounded-xl ${c}`}>
                      <p className="text-lg font-bold">{v}%</p>
                      <p className="text-xs font-semibold opacity-80">{d}</p>
                    </div>
                  ))}
                </div>

                {/* AI Alert */}
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                    AI Alert: Sleep quality dropped 12% this week. Vata imbalance detected — take Ashwagandha tonight.
                  </p>
                </div>
              </div>

              {/* Floating mini cards */}
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-2xl p-4 shadow-xl animate-float-delayed">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                    <p className="font-bold text-sm">62 bpm</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl p-4 shadow-xl animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">SpO2</p>
                    <p className="font-bold text-sm">98%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats ──────────────────────────────────────────────── */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-1">{value}</div>
                <div className="text-sm font-medium text-muted-foreground">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ───────────────────────────────────────────── */}
      <section className="py-24 px-4 lg:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" /> Core Features
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Everything you need for<br />
              <span className="gradient-text">optimal wellness</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              50+ AI-powered modules that work together to give you the most comprehensive health intelligence platform ever built.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={f.href}
                    className="group block bg-card border border-border rounded-3xl p-8 card-hover h-full"
                  >
                    <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{f.desc}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Dosha Section ──────────────────────────────────────── */}
      <section className="py-24 px-4 lg:px-6 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Understand Your <span className="gradient-text">Dosha</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ayurveda recognizes three fundamental energies that govern all biological, psychological, and physio-pathological functions in the body.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {doshas.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card border border-border rounded-3xl p-8 card-hover text-center"
              >
                <div className={`inline-flex w-20 h-20 rounded-full bg-gradient-to-br ${d.color} items-center justify-center mb-6 shadow-xl`}>
                  <Leaf className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{d.name}</h3>
                <p className="text-sm font-medium text-muted-foreground mb-4">{d.element}</p>
                <div className="space-y-2 mb-6">
                  {d.traits.map((t) => (
                    <span key={t} className="inline-block bg-muted text-foreground px-3 py-1 rounded-full text-xs font-semibold mr-1">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground bg-muted/50 rounded-xl p-3">
                  <span className="font-semibold text-foreground">When imbalanced: </span>{d.imbalance}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:-translate-y-1"
            >
              <Leaf className="w-5 h-5" /> Discover Your Dosha Now
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ───────────────────────────────────────── */}
      <section className="py-24 px-4 lg:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Loved by <span className="gradient-text">Wellness Seekers</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-3xl p-8 card-hover"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 lg:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-emerald-600 p-16 text-center shadow-2xl shadow-primary/30"
          >
            <div className="absolute inset-0 opacity-10 noise" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2 rounded-full text-sm font-bold mb-8">
                <Sparkles className="w-4 h-4" /> Start Your Wellness Journey Today
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Take control of your<br />health with AI + Ayurveda
              </h2>
              <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto">
                Join thousands of users who have transformed their lives with VedaAI's personalized, predictive, and preventive healthcare intelligence.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-white text-primary px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/90 transition-all shadow-xl hover:-translate-y-1 group"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
                >
                  <MessageCircle className="w-5 h-5" /> Talk to Veda Guru
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-muted/30 py-16 px-4 lg:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Veda<span className="text-primary">AI</span></span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Merging 5,000 years of Ayurvedic wisdom with cutting-edge AI for a healthier humanity.
              </p>
            </div>
            {[
              { title: "Health Tools", links: [["Dosha Assessment", "/assessment"], ["Disease Forecast", "/forecast"], ["AI Simulator", "/simulator"], ["Digital Twin", "/digital-twin"]] },
              { title: "AI Features", links: [["Veda Guru Chat", "/chat"], ["AI Scanner", "/scanner"], ["Meal Planner", "/meal-planner"], ["AI Avatar", "/avatar"]] },
              { title: "Platform", links: [["Marketplace", "/marketplace"], ["Telehealth", "/telehealth"], ["Dashboard", "/dashboard"], ["Wearables", "/wearables"]] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-bold text-foreground mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 VedaAI. All rights reserved.</p>
            <p className="flex items-center gap-1">Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> and ancient wisdom</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
