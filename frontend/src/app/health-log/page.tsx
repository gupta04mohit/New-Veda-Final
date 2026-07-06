'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HealthLogPage() {
  const [formData, setFormData] = useState({
    waterIntake: '',
    sleepHours: '',
    meditationMins: '',
    exerciseMins: '',
    mood: 'Happy',
    stressLevel: 'LOW'
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
      const res = await fetch('/api/health/wellness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // assuming token is stored in localStorage
        },
        body: JSON.stringify({
          waterIntake: parseFloat(formData.waterIntake),
          sleepHours: parseFloat(formData.sleepHours),
          meditationMins: parseInt(formData.meditationMins, 10),
          exerciseMins: parseInt(formData.exerciseMins, 10),
          mood: formData.mood,
          stressLevel: formData.stressLevel
        })
      });

      if (res.ok) {
        setStatus('Saved successfully!');
      } else {
        setStatus('Failed to save.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error saving data.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-green-400">Daily Health Log</h1>
        <p className="text-gray-400 mb-8">Track your habits to help VedaAI understand your body better.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Water Intake (Liters)</label>
              <input type="number" step="0.1" name="waterIntake" value={formData.waterIntake} onChange={handleChange} className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sleep (Hours)</label>
              <input type="number" step="0.5" name="sleepHours" value={formData.sleepHours} onChange={handleChange} className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Meditation (Mins)</label>
              <input type="number" name="meditationMins" value={formData.meditationMins} onChange={handleChange} className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Exercise (Mins)</label>
              <input type="number" name="exerciseMins" value={formData.exerciseMins} onChange={handleChange} className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
              <select name="mood" value={formData.mood} onChange={handleChange} className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500">
                <option>Happy</option>
                <option>Calm</option>
                <option>Anxious</option>
                <option>Sad</option>
                <option>Energetic</option>
                <option>Tired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stress Level</label>
              <select name="stressLevel" value={formData.stressLevel} onChange={handleChange} className="w-full bg-gray-700 rounded-lg p-3 text-white border border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="BURNOUT">Burnout</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg shadow-green-500/20">
            Save Log
          </button>
          
          {status && <p className="text-center mt-4 text-sm text-green-300">{status}</p>}
        </form>
      </motion.div>
    </div>
  );
}
