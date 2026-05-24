import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Brain, Play, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const modules = [
  { id: 1, title: 'Pet Nutrition 101', description: 'Understanding balanced diets.', icon: <BookOpen />, steps: 5 },
  { id: 2, title: 'Positive Reinforcement', description: 'Basics of ethical training.', icon: <Brain />, steps: 3 },
  { id: 3, title: 'Emergency First Aid', description: 'Be prepared for surprises.', icon: <CheckCircle2 />, steps: 6 },
];

export function TrainingModule() {
  const [selectedModule, setSelectedModule] = useState<typeof modules[0] | null>(null);
  const trainingProgress = useStore(state => state.trainingProgress);
  const updateTrainingProgress = useStore(state => state.updateTrainingProgress);

  const handleStartModule = async (moduleId: number) => {
    toast.promise(
      updateTrainingProgress(moduleId, 1),
      {
        loading: 'Unlocking module...',
        success: 'Learning path started! Good luck.',
        error: 'Failed to start module.'
      }
    );
    setSelectedModule(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-brand text-ruru-navy-light">Training & Education</h2>
      
      <div className="space-y-4">
        {modules.map(module => {
           const progress = trainingProgress.find(p => p.moduleId === module.id);
           return (
            <motion.div 
              key={module.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedModule(module)}
              className={cn(
                "bg-white/95 backdrop-blur-3xl border border-ruru-navy/10 p-5 rounded-[2.5rem] cursor-pointer shadow-sm flex items-center gap-4",
                progress?.isCompleted && "border-green-100 bg-green-50/20"
              )}
            >
              <div className="w-12 h-12 rounded-[1.5rem] bg-[#F5F5F0] flex items-center justify-center text-ruru-navy-light transition-colors group-hover:bg-[#EBEBE0]">
                {module.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-ruru-navy">{module.title}</h3>
                <p className="text-sm text-ruru-navy/60">{module.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-ruru-navy/60 uppercase tracking-wider">{module.steps} Steps</span>
                {progress?.isCompleted ? <CheckCircle2 size={20} className="text-green-500" /> : <ChevronRight className="text-[#A8A29E]" size={20} />}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedModule && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="bg-white/95 backdrop-blur-3xl w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedModule(null)}
                className="absolute top-6 right-6 p-2 bg-[#F5F5F0] rounded-full hover:bg-[#EBEBE0] transition-colors"
              >
                <X size={20} className="text-ruru-navy-light" />
              </button>
              <div className="w-16 h-16 rounded-[1.5rem] bg-[#F5F5F0] flex items-center justify-center text-ruru-navy-light mb-6">
                {selectedModule.icon}
              </div>
              <h2 className="text-3xl font-brand mb-2 text-ruru-navy">{selectedModule.title}</h2>
              <p className="text-ruru-navy/60 mb-8">{selectedModule.description}</p>
              
              <div className="flex items-center gap-2 text-sm text-ruru-navy-light font-bold mb-8">
                <CheckCircle2 size={18} />
                <span>{selectedModule.steps} interactive lessons</span>
              </div>

              <button 
                onClick={() => handleStartModule(selectedModule.id)}
                className="w-full bg-ruru-navy-light text-white py-4 rounded-[1.5rem] font-bold hover:bg-[#4A4A35] transition-all active:scale-[0.98] shadow-lg shadow-ruru-navy-light/20 flex items-center justify-center gap-2"
              >
                Start Learning Module
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
