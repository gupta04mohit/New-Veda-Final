"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Stethoscope, Apple, Dumbbell, Scale, Sparkles, Activity } from 'lucide-react';

export default function MedicalBoardPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleConsultBoard = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5001/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) throw new Error("Failed to consult the board");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("The Medical Board is currently unavailable. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 relative overflow-hidden">
      {/* Decorative ambient background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-3xl -z-10 rounded-full mix-blend-multiply" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-3xl -z-10 rounded-full mix-blend-multiply" />

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-2 text-primary shadow-sm border border-primary/20">
            <Scale className="w-10 h-10" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Multi-Specialist <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Medical Board</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg">
            Submit a complex health query and watch our specialized AI agents debate and synthesize the optimal holistic protocol for you.
          </motion.p>
        </div>

        {/* Input Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-4">
            <textarea
              className="flex-1 bg-background/50 border border-input rounded-2xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-32 md:h-auto min-h-[120px]"
              placeholder="E.g., I've been experiencing chronic fatigue, joint pain in the mornings, and poor digestion despite eating healthy. What should I do?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={handleConsultBoard}
              disabled={isLoading || !query.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl md:w-64 shrink-0"
            >
              {isLoading ? (
                <><Activity className="w-5 h-5 animate-pulse" /> Consulting...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Start Debate</>
              )}
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 text-center space-y-6">
            <div className="flex justify-center gap-4">
              {[Leaf, Stethoscope, Apple, Dumbbell].map((Icon, idx) => (
                <motion.div
                  key={idx}
                  animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                  className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shadow-sm"
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
            <p className="text-muted-foreground font-medium animate-pulse">The board is actively analyzing and debating your case...</p>
          </div>
        )}

        {/* Results Grid */}
        {result && !isLoading && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Ayurvedic Perspective */}
            <motion.div variants={cardVariant} className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-3xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-green-500/20 pb-4">
                <div className="p-3 bg-green-500/20 rounded-xl"><Leaf className="w-6 h-6 text-green-600 dark:text-green-400" /></div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Ayurvedic Specialist</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Dosha & Root Cause</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{result.ayurveda}</p>
            </motion.div>

            {/* Medical Perspective */}
            <motion.div variants={cardVariant} className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 rounded-3xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-blue-500/20 pb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl"><Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Modern Physician</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Clinical & Pathological</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{result.medical}</p>
            </motion.div>

            {/* Nutrition Perspective */}
            <motion.div variants={cardVariant} className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-3xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-orange-500/20 pb-4">
                <div className="p-3 bg-orange-500/20 rounded-xl"><Apple className="w-6 h-6 text-orange-600 dark:text-orange-400" /></div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Clinical Nutritionist</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Dietary Intervention</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{result.nutrition}</p>
            </motion.div>

            {/* Fitness Perspective */}
            <motion.div variants={cardVariant} className="bg-gradient-to-br from-red-500/10 to-rose-500/5 border border-red-500/20 rounded-3xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-red-500/20 pb-4">
                <div className="p-3 bg-red-500/20 rounded-xl"><Dumbbell className="w-6 h-6 text-red-600 dark:text-red-400" /></div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Fitness & Lifestyle</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Movement & Habits</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{result.lifestyle}</p>
            </motion.div>

            {/* Master Judgment */}
            <motion.div variants={cardVariant} className="md:col-span-2 mt-4 bg-card border-2 border-primary/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6 border-b border-border pb-4">
                  <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/30">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-2xl text-foreground">Master Synthesis</h3>
                    <p className="text-sm text-primary font-semibold">Final Unified Protocol</p>
                  </div>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-foreground">
                  <p className="text-base text-foreground/90 whitespace-pre-wrap">{result.finalJudgment}</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        )}

      </div>
    </div>
  );
}
