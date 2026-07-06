"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, ShieldCheck } from "lucide-react";

export default function ForecastPage() {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    sleep: "",
    water: "",
    exercise: "",
    stress: "Medium",
    symptoms: ""
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const prompt = `Please forecast my disease risks based on these biomarkers: Age ${formData.age}, Weight ${formData.weight}kg, Sleep ${formData.sleep}hrs, Water ${formData.water}L, Exercise ${formData.exercise}, Stress ${formData.stress}, Symptoms: ${formData.symptoms}. Provide percentages and actionable steps.`;
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, history: [] })
      });

      const data = await response.json();
      
      setResult({
        riskPercentage: "AI Generated",
        category: "Personalized Risk Assessment",
        conditions: ["See AI details below"],
        preventiveMeasures: [data.reply || data.response || "Failed to fetch ML Prediction. Please try again."]
      });
    } catch (err) {
      console.error(err);
      setResult({
        riskPercentage: "?",
        category: "Error",
        conditions: ["Failed to connect to VedaAI Engine"],
        preventiveMeasures: ["Please check your connection and try again."]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Activity className="w-10 h-10 text-primary" /> Disease Forecasting
          </h1>
          <p className="text-xl text-muted-foreground">
            Enter your current lifestyle habits and symptoms to predict potential health risks and receive preventive Ayurvedic measures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-2xl shadow-lg border border-border p-6"
          >
            <h3 className="text-xl font-semibold mb-6 border-b border-border pb-2">Lifestyle Inputs</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full rounded-md border border-input px-3 py-2 bg-background focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full rounded-md border border-input px-3 py-2 bg-background focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sleep (hrs/night)</label>
                  <input type="number" value={formData.sleep} onChange={e => setFormData({...formData, sleep: e.target.value})} className="w-full rounded-md border border-input px-3 py-2 bg-background focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Water (L/day)</label>
                  <input type="number" step="0.1" value={formData.water} onChange={e => setFormData({...formData, water: e.target.value})} className="w-full rounded-md border border-input px-3 py-2 bg-background focus:ring-primary focus:border-primary" required />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Exercise frequency</label>
                  <select value={formData.exercise} onChange={e => setFormData({...formData, exercise: e.target.value})} className="w-full rounded-md border border-input px-3 py-2 bg-background focus:ring-primary focus:border-primary">
                    <option value="">Select...</option>
                    <option value="Rarely">Rarely</option>
                    <option value="1-2 times/week">1-2 times/week</option>
                    <option value="3-4 times/week">3-4 times/week</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stress Level</label>
                  <select value={formData.stress} onChange={e => setFormData({...formData, stress: e.target.value})} className="w-full rounded-md border border-input px-3 py-2 bg-background focus:ring-primary focus:border-primary">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Symptoms (if any)</label>
                <textarea rows={3} value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} className="w-full rounded-md border border-input px-3 py-2 bg-background focus:ring-primary focus:border-primary" placeholder="e.g., occasional headache, acidity"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-all flex justify-center items-center gap-2"
              >
                {loading ? "Analyzing..." : "Generate Forecast"}
              </button>
            </form>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-card rounded-2xl shadow-lg border border-border p-6 flex flex-col ${!result && !loading ? 'items-center justify-center opacity-50' : ''}`}
          >
            {!result && !loading ? (
              <div className="text-center">
                <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Results will appear here</p>
              </div>
            ) : loading ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-primary font-medium animate-pulse">Running Multi-Agent Analysis...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center pb-6 border-b border-border">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Analysis Complete</h3>
                  <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full font-semibold">
                    <AlertTriangle className="w-5 h-5 text-secondary" />
                    {result.category} ({result.riskPercentage}%)
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-destructive" /> Potential Risks
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {result.conditions.map((c: string, i: number) => <li key={i}>{c}</li>)}
                  </ul>
                </div>

                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <h4 className="font-semibold flex items-center gap-2 mb-3 text-primary">
                    <ShieldCheck className="w-5 h-5" /> Preventive Measures
                  </h4>
                  <ul className="space-y-2">
                    {result.preventiveMeasures.map((m: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
