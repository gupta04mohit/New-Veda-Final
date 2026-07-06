'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('Blood Test');
  const [status, setStatus] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Analyzing report...');
    
    // Simulate upload and extraction
    setTimeout(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/health/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            reportType,
            extractedData: { "hemoglobin": "13.5", "wbc": "6.2", "cholesterol": "180" },
            aiInterpretation: "Your hemoglobin and WBC counts are within the normal range. Your cholesterol is at a healthy level.",
            ayurvedicRec: "Continue your current diet. Since Pitta is balanced, mild cooling herbs can be maintained during summer."
          })
        });

        if (res.ok) {
          setStatus('Report successfully analyzed and saved to your history!');
        } else {
          setStatus('Failed to save report.');
        }
      } catch (err) {
        console.error(err);
        setStatus('Error uploading report.');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700"
      >
        <div className="flex items-center gap-4 mb-6">
          <FileText className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-blue-400">Upload Medical Report</h1>
        </div>
        <p className="text-gray-400 mb-8">VedaAI will extract your data, explain it in simple English, and provide Ayurvedic recommendations.</p>

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option>Blood Test (CBC)</option>
              <option>Thyroid Profile</option>
              <option>Lipid Profile</option>
              <option>Vitamin D & B12</option>
              <option>Liver Function Test (LFT)</option>
              <option>Kidney Function Test (KFT)</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-blue-500 transition cursor-pointer bg-gray-800/50">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 font-medium">Click to upload or drag and drop</p>
            <p className="text-gray-500 text-sm mt-2">PDF, JPG, or PNG (max. 10MB)</p>
          </div>

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
            Upload & Analyze
          </button>
          
          {status && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600 flex items-start gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-gray-200 leading-relaxed">{status}</p>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
