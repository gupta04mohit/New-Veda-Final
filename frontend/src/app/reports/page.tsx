'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('Blood Test');
  const [status, setStatus] = useState('');

  const [result, setResult] = useState<any>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Analyzing report with VedaAI...');
    setResult(null);
    
    try {
      // Dummy OCR extraction (replace with Tesseract or similar in prod)
      const mockExtractedText = "Patient hemoglobin is 13.5. WBC is 6.2. Cholesterol is 240 (High). Vitamin D is 12 (Deficient).";
      
      const res = await fetch('http://localhost:5001/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extractedText: mockExtractedText })
      });

      if (res.ok) {
        const data = await res.json();
        const parsedResult = JSON.parse(data.result);
        setResult(parsedResult);
        setStatus('Analysis complete!');
      } else {
        setStatus('Failed to analyze report.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error connecting to AI service.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pt-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-3xl -z-10 rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-border"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Upload Medical Report</h1>
        </div>
        <p className="text-muted-foreground mb-8 text-lg">VedaAI will extract your data, explain it in simple English, and provide Ayurvedic recommendations.</p>

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full bg-background rounded-xl p-3.5 text-foreground border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
              <option>Blood Test (CBC)</option>
              <option>Thyroid Profile</option>
              <option>Lipid Profile</option>
              <option>Vitamin D & B12</option>
              <option>Liver Function Test (LFT)</option>
              <option>Kidney Function Test (KFT)</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center hover:border-primary transition-all cursor-pointer bg-primary/5 group">
            <Upload className="w-12 h-12 text-primary/50 group-hover:text-primary mx-auto mb-4 transition-colors" />
            <p className="text-foreground font-semibold text-lg">Click to upload or drag and drop</p>
            <p className="text-muted-foreground text-sm mt-2">PDF, JPG, or PNG (max. 10MB)</p>
          </div>

          <button type="submit" disabled={status === 'Analyzing report with VedaAI...'} className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold py-4 px-4 rounded-xl transition duration-200 shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
            Upload & Analyze
          </button>
          
          {status && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-start gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-foreground font-medium leading-relaxed">{status}</p>
            </motion.div>
          )}

          {result && (
            <motion.div 
              initial="hidden" 
              animate="show" 
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="mt-8 space-y-4"
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="bg-destructive/10 border border-destructive/20 p-5 rounded-2xl">
                <h4 className="text-destructive font-extrabold mb-3 flex items-center gap-2">Abnormal Values Detected</h4>
                <ul className="list-disc pl-5 text-foreground/90 space-y-1">
                  {result.abnormal_values?.map((val: string, i: number) => <li key={i}>{val}</li>)}
                </ul>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl">
                <h4 className="text-blue-500 font-extrabold mb-3">Possible Clinical Reasons</h4>
                <p className="text-foreground/90 text-sm leading-relaxed">{result.possible_reasons}</p>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl">
                <h4 className="text-green-500 font-extrabold mb-3">Ayurvedic & Lifestyle Advice</h4>
                <p className="text-foreground/90 text-sm leading-relaxed">{result.lifestyle_advice}</p>
              </motion.div>
              {result.doctor_consultation && (
                <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }} className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl text-amber-600 dark:text-amber-400 font-bold text-center flex items-center justify-center gap-2 shadow-sm">
                  ⚠️ VedaAI recommends consulting a doctor regarding these results.
                </motion.div>
              )}
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
