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
      const response = await fetch("http://localhost:5001/predict-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          age: Number(formData.age), 
          weight: Number(formData.weight), 
          sleepHours: Number(formData.sleep), 
          exerciseMinutes: formData.exercise === "Daily" ? 45 : formData.exercise === "3-4 times/week" ? 20 : 5, 
          familyHistory: formData.symptoms ? [formData.symptoms] : [] 
        })
      });

      if (!response.ok) throw new Error("Failed to fetch ML Prediction");

      const data = await response.json();
      const parsedData = JSON.parse(data.result);
      
      // Expected array: [{ disease, percentage, reason, preventive_steps }]
      setResult({
        category: "Personalized Risk Assessment",
        predictions: parsedData
      });
    } catch (err) {
      console.error(err);
      setResult({
        category: "Error",
        predictions: [{ disease: "Connection Error", percentage: 0, reason: "Failed to connect to VedaAI Engine", preventive_steps: "Please check your connection." }]
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
                    {result.category}
                  </div>
                </div>

                <div className="space-y-4">
                  {result.predictions?.map((pred: any, i: number) => (
                    <div key={i} className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-primary">{pred.disease}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${pred.percentage > 50 ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                          {pred.percentage}% Risk
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{pred.reason}</p>
                      
                      <div className="bg-background rounded-lg p-3 border border-border">
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-green-500" /> Preventive Steps
                        </h5>
                        <p className="text-sm text-foreground">{pred.preventive_steps}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
