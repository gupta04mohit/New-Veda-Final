"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Droplets, Activity, Coffee, Salad } from 'lucide-react';

export interface PlanItem {
  id: string;
  time: string;
  activity: string;
  type: 'DIET' | 'EXERCISE' | 'MINDFULNESS' | 'SLEEP';
  reasoning: string; // The Ayurvedic / AI explanation
}

interface Props {
  dosha: string;
  plan: PlanItem[];
  weather?: string;
}

export default function DailyPlan({ dosha, plan, weather = "Sunny, 25°C" }: Props) {
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'DIET': return <Salad className="w-5 h-5 text-green-400" />;
      case 'EXERCISE': return <Activity className="w-5 h-5 text-orange-400" />;
      case 'MINDFULNESS': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'SLEEP': return <Moon className="w-5 h-5 text-blue-400" />;
      default: return <Coffee className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
      <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Personalized Daily Plan</h2>
          <p className="text-sm text-gray-300">
            Optimized for <span className="font-semibold text-amber-400 capitalize">{dosha}</span> Dosha
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400 flex items-center justify-end gap-2">
            <Droplets className="w-4 h-4 text-blue-300" />
            {weather}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {plan && plan.length > 0 ? plan.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="p-3 rounded-full bg-black/20 shrink-0">
              {getIcon(item.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-semibold text-amber-300 bg-amber-900/30 px-2 py-0.5 rounded-full">
                  {item.time}
                </span>
                <h4 className="text-lg font-medium text-white">{item.activity}</h4>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {item.reasoning}
              </p>
            </div>
          </motion.div>
        )) : (
          <div className="text-center p-8 text-gray-400">
            No plan generated for today yet. Ask VedaAI to create your daily routine!
          </div>
        )}
      </div>
    </div>
  );
}
