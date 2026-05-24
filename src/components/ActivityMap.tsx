import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Footprints, Clock, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export function ActivityMap() {
  const activityLogs = useStore(state => state.activityLogs);
  
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-brand text-ruru-navy">Activity Map</h2>
        <p className="text-ruru-navy/60">Track your pet's daily route and schedule</p>
      </div>

      {/* Enhanced Map Placeholder */}
      <div className="h-64 bg-[#F5F5F0] rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden border border-[#E5E5D5]/50 group">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(ruru-navy-light 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
        <MapPin size={48} className="text-ruru-navy-light/20 mb-2 transition-transform duration-500 group-hover:scale-110" />
        <span className="text-xs font-bold text-ruru-navy-light/40 uppercase tracking-widest">Interactive Map View</span>
      </div>

      <div className="space-y-4">
        <h3 className="font-brand text-lg text-ruru-navy">Daily Schedule</h3>
        <div className="grid gap-3">
          {activityLogs.map((log, index) => (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center gap-4 p-5 bg-white/95 backdrop-blur-3xl border border-ruru-navy/10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all active:shadow-sm"
            >
              <div className="w-12 h-12 rounded-[1.5rem] bg-[#F5F5F0] flex items-center justify-center text-ruru-navy-light">
                {log.type === 'walk' ? <Footprints size={20} /> : <Calendar size={20} />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-ruru-navy">{log.name}</h4>
                <p className="text-xs text-ruru-navy/60 flex items-center gap-1 mt-0.5">
                  <MapPin size={12} /> {log.location} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
