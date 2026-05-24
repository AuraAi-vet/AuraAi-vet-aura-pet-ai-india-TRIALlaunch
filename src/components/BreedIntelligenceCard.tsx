import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Dna, 
  ShieldAlert, 
  Utensils, 
  Timer, 
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';
import { getBreedInsight, BreedInsight } from '../services/geminiService';
import { cn } from '../lib/utils';

interface BreedIntelligenceCardProps {
  breed: string;
  type: string;
}

export function BreedIntelligenceCard({ breed, type }: BreedIntelligenceCardProps) {
  const [insight, setInsight] = useState<BreedInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && !insight && !loading) {
      loadInsight();
    }
  }, [isOpen]);

  const loadInsight = async () => {
    setLoading(true);
    try {
      const data = await getBreedInsight(breed, type);
      setInsight(data);
    } catch (err) {
      console.error("Failed to load breed insight", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-3xl border border-ruru-navy/10 rounded-[3rem] overflow-hidden transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group/card">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 flex items-center justify-between group"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[1.75rem] bg-gradient-to-br from-emerald-50 to-teal-50 text-ruru-teal flex items-center justify-center shrink-0 border border-emerald-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
            <Dna size={26} />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-brand tracking-tight text-ruru-navy group-hover:text-ruru-teal transition-colors">Breed Intelligence</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ruru-navy/50">Powered by</span>
              <div className="w-1.5 h-1.5 rounded-full bg-ruru-teal-light animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ruru-teal flex items-center gap-1 bg-ruru-teal/10 px-2 py-0.5 rounded-full">
                <Sparkles size={10} className="text-ruru-teal" /> Gemini
              </span>
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.1 : 1 }}
          className="w-10 h-10 rounded-full bg-ruru-navy/5 flex items-center justify-center text-ruru-navy/60 group-hover:bg-ruru-navy/10 group-hover:text-ruru-navy transition-colors"
        >
          <ChevronRight size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 pt-0 space-y-8">
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-6">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-ruru-teal border border-ruru-teal/20 p-4 rounded-full bg-ruru-teal/5"
                  >
                    <Search size={32} />
                  </motion.div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-ruru-navy/50 animate-pulse text-center">Synthesizing Clinical Data<span className="animate-[ping_1.5s_infinite]">...</span></p>
                </div>
              ) : insight ? (
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-[#FDFBF7] to-white rounded-[2.5rem] p-8 border border-ruru-navy/5 relative overflow-hidden shadow-sm">
                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-ruru-teal/5 rounded-full blur-2xl" />
                    <div className="absolute top-4 right-4 opacity-10">
                      <Sparkles size={48} className="text-ruru-teal" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-ruru-teal mb-4 flex items-center gap-2">
                       <Zap size={12} /> Executive Summary
                    </h4>
                    <p className="text-[15px] text-ruru-navy-light leading-relaxed font-light relative z-10 italic">
                      "{insight.summary}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 bg-red-50/30 p-6 rounded-[2rem] border border-red-100/50">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
                        <div className="bg-red-100 p-1.5 rounded-lg"><ShieldAlert size={16} /></div>
                        Genetic Predispositions
                      </h4>
                      <ul className="space-y-3 pt-2">
                        {insight.commonIssues.map((issue, i) => (
                          <li key={i} className="text-sm text-ruru-navy flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
                            <span className="font-light">{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4 bg-emerald-50/30 p-6 rounded-[2rem] border border-emerald-100/50">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-2">
                         <div className="bg-emerald-100 p-1.5 rounded-lg"><Utensils size={16} /></div>
                         Dietary Requirements
                      </h4>
                      <ul className="space-y-3 pt-2">
                        {insight.dietaryNeeds.map((need, i) => (
                          <li key={i} className="text-sm text-ruru-navy flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                            <span className="font-light">{need}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-orange-50/30 p-6 rounded-[2rem] border border-orange-100/50">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 flex items-center gap-2 mb-4">
                      <div className="bg-orange-100 p-1.5 rounded-lg"><TrendingUp size={16} /></div>
                      Exercise Recommendations
                    </h4>
                    <p className="text-sm font-light text-ruru-navy leading-relaxed">
                      {insight.exerciseLevel}
                    </p>
                  </div>

                  {insight.careTips && insight.careTips.length > 0 && (
                    <div className="bg-ruru-teal/5 p-6 rounded-[2rem] border border-ruru-teal/10">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-ruru-teal flex items-center gap-2 mb-4">
                        <div className="bg-ruru-teal/10 p-1.5 rounded-lg"><Sparkles size={16} /></div>
                        Care Recommendations
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insight.careTips.map((tip, i) => (
                          <li key={i} className="text-sm text-ruru-navy flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-ruru-teal mt-2 shrink-0 shadow-[0_0_8px_rgba(52,181,199,0.5)]" />
                            <span className="font-light">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ruru-navy/10 px-2 lg:gap-6">
                    <div className="flex flex-col items-center justify-center p-4 rounded-[2rem] bg-[#FDFBF7] border border-ruru-navy/5 space-y-2">
                      <Timer size={20} className="text-ruru-magenta mb-1" />
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#A8A29E]">Expected Lifespan</p>
                      <p className="text-sm font-brand text-ruru-navy text-center leading-tight">{insight.longevity}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-[2rem] bg-[#FDFBF7] border border-ruru-navy/5 space-y-2">
                      <MapPin size={20} className="text-ruru-blue mb-1" />
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#A8A29E]">Origin</p>
                      <p className="text-sm font-brand text-ruru-navy text-center leading-tight">Global Scan</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded-[1.5rem] text-center">
                  <p className="text-xs text-red-600">Failed to load breed intelligence.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
