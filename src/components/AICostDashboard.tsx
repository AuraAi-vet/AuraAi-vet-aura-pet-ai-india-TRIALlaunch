import React, { useEffect, useState } from 'react';
import { getUsage } from '../services/geminiService';
import { Sparkles, AlertTriangle } from 'lucide-react';

export const AICostDashboard = () => {
  const [usage, setUsage] = useState(getUsage());

  useEffect(() => {
    const timer = setInterval(() => {
      setUsage(getUsage());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const percentage = Math.min((usage.count / 500) * 100, 100);
  const isNearLimit = percentage > 80;

  return (
    <div className="bg-white/95 backdrop-blur-3xl border border-ruru-navy/10 rounded-[1.5rem] p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <Sparkles className="text-ruru-teal" size={18} />
        <h4 className="text-[10px] font-black text-ruru-navy uppercase tracking-widest">AI Usage</h4>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-ruru-navy/60">Daily Limit Status</p>
        <span className={cn("text-xs font-bold", isNearLimit ? "text-amber-600" : "text-emerald-600")}>
          {usage.count} / 500
        </span>
      </div>
      
      <div className="w-full bg-[#F5F5F0] h-2 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500", isNearLimit ? "bg-amber-500" : "bg-ruru-teal")}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isNearLimit && (
        <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-[1.25rem] border border-amber-100">
          <AlertTriangle size={14} />
          <p className="text-[9px] font-bold uppercase">Approaching Daily Limit</p>
        </div>
      )}
    </div>
  );
};
import { cn } from '../lib/utils';
