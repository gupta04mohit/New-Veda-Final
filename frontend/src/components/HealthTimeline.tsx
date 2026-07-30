"use client";

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface WellnessLog {
  date: string;
  waterIntake?: number;
  sleepHours?: number;
  stressLevel?: string;
  healthScore?: number;
}

interface Props {
  logs: WellnessLog[];
}

const mapStressToNumber = (stress?: string) => {
  switch (stress?.toUpperCase()) {
    case 'LOW': return 1;
    case 'MEDIUM': return 2;
    case 'HIGH': return 3;
    case 'BURNOUT': return 4;
    default: return 0;
  }
};

export default function HealthTimeline({ logs }: Props) {
  const chartData = useMemo(() => {
    // Sort logs by date ascending
    const sorted = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return sorted.map(log => ({
      date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sleep: log.sleepHours || 0,
      water: log.waterIntake || 0,
      stress: mapStressToNumber(log.stressLevel),
      score: log.healthScore || 0
    }));
  }, [logs]);

  if (!logs || logs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white/5 rounded-2xl border border-white/10">
        No health data available yet. Start logging to see your AI timeline!
      </div>
    );
  }

  return (
    <div className="w-full h-80 p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
      <h3 className="text-xl font-semibold mb-4 text-white">AI Health Trend Timeline</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
          />
          <Legend />
          <Line type="monotone" dataKey="sleep" name="Sleep (hrs)" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="water" name="Water (L)" stroke="#3b82f6" strokeWidth={3} />
          <Line type="monotone" dataKey="stress" name="Stress (1-4)" stroke="#ef4444" strokeWidth={3} />
          <Line type="monotone" dataKey="score" name="Health Score" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
