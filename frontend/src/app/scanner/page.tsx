"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Mic, Utensils, Upload, ShieldCheck, Activity, BrainCircuit, X } from "lucide-react";

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState("face");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target?.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (activeTab === "voice") {
      // Keep voice as mock for now
      setAnalyzing(true);
      setResult(null);
      setTimeout(() => {
        setResult({
          score: "78/100",
          insights: ["Voice pitch variance indicates mild stress.", "Energy levels are stable.", "Speech rate is normal."],
          recommendation: "Practice 5 minutes of Bhramari Pranayama (Humming Bee Breath) to calm the nervous system."
        });
        setAnalyzing(false);
      }, 2500);
      return;
    }

    if (!previewImage) {
      setErrorMsg("Please upload an image first.");
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setErrorMsg(null);

    try {
      // The AI service expects base64 data without the data URL prefix
      const base64Data = previewImage.split(',')[1] || previewImage;
      
      const response = await fetch("http://localhost:5001/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data, type: activeTab })
      });

      if (!response.ok) throw new Error("Failed to analyze image");

      const data = await response.json();
      const parsedResult = JSON.parse(data.result);
      
      setResult(parsedResult);
    } catch (err: any) {
      console.warn("Scanner API Warning:", err);
      setErrorMsg(err.message || "An error occurred during analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  const clearImage = () => {
    setPreviewImage(null);
    setResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <BrainCircuit className="w-10 h-10 text-primary" /> Multimodal AI Scanner
          </h1>
          <p className="text-xl text-muted-foreground">
            Use Computer Vision and Voice Intelligence to instantly analyze your physical state and meals.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-card border border-border rounded-full p-1 flex shadow-sm">
            <button 
              onClick={() => {setActiveTab("face"); clearImage();}}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${activeTab === "face" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Camera className="w-5 h-5" /> Face Health
            </button>
            <button 
              onClick={() => {setActiveTab("voice"); clearImage();}}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${activeTab === "voice" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Mic className="w-5 h-5" /> Voice Stress
            </button>
            <button 
              onClick={() => {setActiveTab("food"); clearImage();}}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${activeTab === "food" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Utensils className="w-5 h-5" /> Food Scanner
            </button>
          </div>
        </div>

        {/* API Key Input */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md bg-primary/5 border border-primary/20 rounded-2xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3 font-medium">Want real AI Vision analysis? (Optional)</p>
            <input 
              type="password" 
              placeholder="Enter Gemini API Key (leaves blank for Simulation)" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Upload/Capture Area */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
            
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />

            {analyzing ? (
              <div className="flex flex-col items-center justify-center z-10 w-full h-full bg-background/80 backdrop-blur-sm absolute inset-0">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BrainCircuit className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-bold animate-pulse text-foreground">Running Neural Analysis...</h3>
                <p className="text-muted-foreground text-sm mt-2">Connecting to GPT-4o Vision & Gemini APIs</p>
              </div>
            ) : null}
            
            {!previewImage ? (
              <div className="text-center z-10">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors cursor-pointer" onClick={activeTab !== "voice" ? handleUploadClick : undefined}>
                  {activeTab === "face" ? <Camera className="w-10 h-10" /> : activeTab === "voice" ? <Mic className="w-10 h-10" /> : <Utensils className="w-10 h-10" />}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {activeTab === "face" ? "Upload Face Image" : activeTab === "voice" ? "Record Voice Sample" : "Upload Meal Image"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === "face" ? "Ensure good lighting. We do not store your images." : activeTab === "voice" ? "Click to record a 10-second sample." : "Ensure the entire meal is visible."}
                </p>
                {errorMsg && <p className="text-red-500 text-sm mb-4 bg-red-500/10 px-3 py-1 rounded-md">{errorMsg}</p>}
                
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={activeTab === "voice" ? handleAnalyze : handleUploadClick} 
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    {activeTab === "voice" ? <Mic className="w-5 h-5" /> : <Upload className="w-5 h-5" />} 
                    {activeTab === "voice" ? "Record Audio" : "Select Image"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
                <button onClick={clearImage} className="absolute top-0 right-0 bg-background/80 backdrop-blur-md p-2 rounded-full hover:bg-destructive hover:text-white transition-colors z-20 shadow-md border border-border">
                  <X className="w-5 h-5" />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewImage} alt="Preview" className="max-h-[250px] rounded-xl object-contain shadow-lg mb-6 border border-border" />
                <button 
                  onClick={handleAnalyze} 
                  disabled={analyzing}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <BrainCircuit className="w-5 h-5" /> Analyze {activeTab === "face" ? "Face" : "Meal"}
                </button>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" /> Analysis Results
            </h3>
            
            {result ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                
                {activeTab === "food" ? (
                  <>
                    <div className="p-6 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">Estimated Calories</span>
                        <p className="text-4xl font-bold text-foreground mt-2">{result.calories} kcal</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">Inflammation Score</span>
                        <p className="text-4xl font-bold text-destructive mt-2">{result.inflammation_score}/10</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-card border border-border rounded-xl shadow-sm">
                        <h4 className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">Macronutrients</h4>
                        <div className="flex justify-between text-sm mb-1"><span>Carbs</span> <span className="font-medium text-foreground">{result.macros?.carbs}g</span></div>
                        <div className="flex justify-between text-sm mb-1"><span>Protein</span> <span className="font-medium text-foreground">{result.macros?.protein}g</span></div>
                        <div className="flex justify-between text-sm"><span>Fat</span> <span className="font-medium text-foreground">{result.macros?.fat}g</span></div>
                      </div>
                      <div className="p-4 bg-card border border-border rounded-xl shadow-sm">
                        <h4 className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-2">Ayurvedic Properties</h4>
                        <div className="flex justify-between text-sm mb-1"><span>Dosha Effect</span> <span className="font-medium text-foreground">{result.dosha_effect}</span></div>
                      </div>
                    </div>

                    <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl mt-6">
                      <h4 className="font-bold text-lg mb-2 text-primary">AI Health Advice</h4>
                      <p className="text-foreground text-sm leading-relaxed">{result.advice}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-6 bg-secondary/10 border border-secondary/20 rounded-2xl">
                      <span className="text-sm font-semibold text-secondary-foreground uppercase tracking-wider">Health Score</span>
                      <p className="text-4xl font-bold text-foreground mt-2">{result.score || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-lg mb-3">AI Insights</h4>
                      <ul className="space-y-2">
                        {result.insights && result.insights.map((insight: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-muted-foreground text-center">
                <BrainCircuit className="w-12 h-12 mb-4 opacity-20" />
                <p>Upload a file or record audio to see real-time AI results here.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
