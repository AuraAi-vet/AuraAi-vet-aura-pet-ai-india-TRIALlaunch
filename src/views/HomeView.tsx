import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PartyPopper, 
  ChevronRight, 
  Plus, 
  Trash2, 
  BookOpen, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Utensils, 
  Droplets, 
  Footprints, 
  Zap, 
  AlertTriangle,
  Heart,
  TrendingUp,
  MessageSquare,
  Bell,
  Users,
  Activity,
  Clock,
  Map,
  Search,
  Phone,
  Stethoscope,
  Building
} from 'lucide-react';
import { Pet, QuickLog, HealthRecord, UserProfile } from '../types';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { translations } from '../lib/translations';

import { HealthGraph } from '../components/HealthGraph';
import { QuickActions } from '../components/QuickActions';
import { PreventiveCare } from '../components/PreventiveCare';
import { ZoolInsights } from '../components/ZoolInsights';
import { RuRuIcon } from '../components/RuRuIcon';
import { BreedIntelligenceCard } from '../components/BreedIntelligenceCard';
import { RegionalAlertsBanner } from '../components/RegionalAlertsBanner';
import { AIReminderSuggestor } from '../components/AIReminderSuggestor';
import { PetHubMarketplace } from '../components/PetHubMarketplace';
import { SuggestedReminder } from '../services/geminiService';

interface HomeViewProps {
  pets: Pet[];
  quickLogs: QuickLog[];
  records: HealthRecord[];
  userProfile: UserProfile | null;
  setActiveTab: (t: any) => void;
  onAddPet: () => void;
  onDeletePet: (pet: Pet) => void;
  onPetClick: (pet: Pet) => void;
  onSOSClick: () => void;
  smartSummary?: string;
  onQuickAction?: (type: string) => void;
  onSearch?: (query: string) => void;
  onAddSuggestedRecord?: (suggestion: SuggestedReminder) => Promise<void>;
}

export function HomeView({ 
  pets, 
  quickLogs, 
  records, 
  userProfile, 
  setActiveTab, 
  onAddPet, 
  onDeletePet, 
  onPetClick, 
  onSOSClick,
  smartSummary,
  onQuickAction,
  onSearch,
  onAddSuggestedRecord
}: HomeViewProps) {
  const { language, role } = useStore();
  const t = translations[language];
  const [selectedPet, setSelectedPet] = React.useState<Pet | null>(pets[0] || null);

  React.useEffect(() => {
    if (!selectedPet && pets.length > 0) {
      setSelectedPet(pets[0]);
    }
  }, [pets]);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return t.home.goodMorning;
    if (hours < 18) return t.home.goodAfternoon;
    return t.home.goodEvening;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="px-6 py-8 pb-32 space-y-10 max-w-5xl mx-auto"
    >
      {/* 1. Refined Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-soft-blue/20 border border-soft-blue/30 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-ruru-teal rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-soft-ink">System Nominal</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-soft-ink/30">
              {new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h2 className="text-6xl font-display font-semibold text-soft-ink tracking-tight leading-[0.9]">
            {getGreeting()}, <br/>
            <span className="text-soft-ink/30">{userProfile?.name?.split(' ')[0] || 'Caregiver'}</span>
          </h2>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('profile')}
          className="relative group shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-soft-blue/20 via-soft-purple/20 to-soft-pink/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
          <div className="relative w-20 h-20 rounded-[2rem] overflow-hidden border-2 border-white shadow-xl shadow-soft-ink/10">
            <img 
              src={userProfile?.image || `https://api.dicebear.com/7.x/open-peeps/svg?seed=${userProfile?.uid}`} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
        </motion.button>
      </section>

      {/* 2. Tactical Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* RuRu Assistant - Large Span */}
        <motion.div 
          onClick={() => setActiveTab('ai')}
          className="md:col-span-4 bg-soft-ink border border-soft-ink/20 p-8 rounded-[3rem] flex flex-col justify-between min-h-[280px] cursor-pointer group relative shadow-md shadow-soft-ink/10"
        >
          <div className="absolute top-0 right-0 p-8">
             <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/30 group-hover:bg-white/20 group-hover:text-white transition-all">
                <ChevronRight size={20} />
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 shrink-0 transition-transform duration-500 group-hover:scale-110">
              <RuRuIcon role={role} size={96} status="idle" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-white/40" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Neural Intelligence</span>
              </div>
              <h3 className="text-4xl font-display font-semibold text-white tracking-tight leading-none">
                {t.home.ruruAssistant}
              </h3>
              <p className="text-white/50 font-medium text-lg">Your empathetic clinical companion.</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/10">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-ruru-teal rounded-full" />
                <p className="text-xs font-semibold text-white/60">Ready to assist with diagnostic inquiries.</p>
             </div>
             <motion.span whileHover={{ x: 3 }} className="text-[10px] font-black uppercase tracking-widest text-white/30">Launch Uplink</motion.span>
          </div>
        </motion.div>

        {/* Health Vault */}
        <motion.div 
          onClick={() => setActiveTab('health')}
          className="md:col-span-2 bg-soft-ink border border-soft-ink/20 p-8 rounded-[3rem] flex flex-col justify-between min-h-[280px] cursor-pointer group shadow-md shadow-soft-ink/10"
        >
          <div className="w-14 h-14 bg-white/10 text-pink-300 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
             <Activity size={28} />
          </div>
          <div className="space-y-1">
             <h3 className="text-2xl font-display font-semibold text-white tracking-tight">{t.home.petHub}</h3>
             <p className="text-sm text-white/50 font-medium">Detailed biometric health analytics.</p>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-pink-400" />
          </div>
        </motion.div>

        {/* Community & Marketplace */}
        <motion.div 
          onClick={() => setActiveTab('services')}
          className="md:col-span-3 bg-soft-ink border border-soft-ink/20 p-8 rounded-[3rem] flex items-center gap-6 cursor-pointer group shadow-md shadow-soft-ink/10"
        >
           <div className="w-16 h-16 bg-white/10 text-sky-300 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
              <MapPin size={32} />
           </div>
           <div>
              <h3 className="text-xl font-display font-semibold text-white leading-tight">{t.home.serviceHub}</h3>
              <p className="text-sm text-white/50 font-medium">Discover top-tier local care experts.</p>
           </div>
        </motion.div>

        <motion.div 
          onClick={() => setActiveTab('community')}
          className="md:col-span-3 bg-soft-ink border border-soft-ink/20 p-8 rounded-[3rem] flex items-center gap-6 cursor-pointer group shadow-md shadow-soft-ink/10"
        >
           <div className="w-16 h-16 bg-white/10 text-purple-300 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
              <Users size={32} />
           </div>
           <div>
              <h3 className="text-xl font-display font-semibold text-white leading-tight">Pet Community</h3>
              <p className="text-sm text-white/50 font-medium">Connect with other caregivers nearby.</p>
           </div>
        </motion.div>
      </section>

      {/* 3. Universal Search */}
      <section className="relative">
        <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
          <Sparkles size={20} className="text-soft-ink/20" />
        </div>
        <input 
          type="text" 
          placeholder={t.home.searchPrompt}
          className="w-full bg-white border border-soft-blue/20 rounded-[1.5rem] pl-16 pr-8 py-6 text-lg font-medium shadow-sm focus:outline-none focus:border-soft-blue transition-all placeholder:text-soft-ink/30"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const query = (e.currentTarget as HTMLInputElement).value;
              if (onSearch) onSearch(query);
              else setActiveTab('ai');
            }
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-soft-ink text-white rounded-[1rem] text-[10px] font-black uppercase tracking-widest hidden md:block">
          Omni Search
        </div>
      </section>

      {/* 4. Profiles Quick Switch */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-soft-ink/30 uppercase tracking-[0.2em]">Active Profiles</h4>
            <button onClick={onAddPet} className="text-[10px] font-black text-soft-ink uppercase tracking-widest hover:text-soft-blue transition-all flex items-center gap-2">
                <Plus size={14} strokeWidth={3} /> Register Pet
            </button>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x pb-4">
          {pets.map((pet) => (
            <motion.div
              key={pet.id}
              whileHover={{ y: -8 }}
              onClick={() => { setSelectedPet(pet); onPetClick(pet); }}
              className={cn(
                "flex-shrink-0 w-44 bg-white border border-soft-blue/20 rounded-[2.5rem] p-6 shadow-sm transition-all cursor-pointer snap-center relative overflow-hidden group",
                selectedPet?.id === pet.id 
                    ? "bg-soft-ink border-soft-ink text-white shadow-xl shadow-soft-ink/10" 
                    : "hover:border-soft-blue/50"
              )}
            >
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md bg-soft-slate group-hover:scale-110 transition-transform duration-500">
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                </div>
                <div className="w-full space-y-0.5">
                  <h6 className={cn("text-xl font-display font-semibold truncate leading-tight", selectedPet?.id === pet.id ? "text-white" : "text-soft-ink")}>
                    {pet.name}
                  </h6>
                  <p className={cn("text-[10px] font-black uppercase tracking-widest opacity-60", selectedPet?.id === pet.id ? "text-white/60" : "text-soft-ink/40")}>
                    {pet.breed || 'Companion'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Insights Widget */}
      {pets.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <ZoolInsights pets={pets} records={records} />
        </section>
      )}

      {/* 5. Routine Protocol */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-soft-ink/30 uppercase tracking-[0.2em]">Daily Protocol</h4>
            <button onClick={() => setActiveTab('care')} className="text-[10px] font-black text-soft-ink uppercase tracking-widest hover:text-soft-blue transition-all">View Full Log</button>
        </div>
        
        <div className="bg-white border border-soft-blue/20 p-12 rounded-[3rem] relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-soft-blue/5 rounded-full blur-3xl -mr-48 -mt-48" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-ruru-teal rounded-full" />
                  <p className="text-[10px] font-black text-ruru-teal uppercase tracking-[0.2em]">Operational Readiness</p>
                </div>
                <h5 className="text-5xl font-display font-semibold text-soft-ink tracking-tight leading-none">{t.home.instantAction}</h5>
                <p className="text-lg text-soft-ink/50 font-medium">Capture routine vitals with high-fidelity logging.</p>
              </div>
              <QuickActions onAction={onQuickAction || (() => {})} />
            </div>
            
            <div className="bg-soft-ink rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)]" />
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                    <TrendingUp size={32} className="text-ruru-teal-light" />
                  </div>
                  <div>
                    <h6 className="text-2xl font-display font-semibold text-white tracking-tight leading-none">{t.home.healthVelocity}</h6>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Stable Pattern Detected</p>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-white/10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{t.home.lastLog}</p>
                    <p className="text-xl font-bold text-white tracking-tight">
                       {quickLogs[0] ? new Date(quickLogs[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Standby'}
                    </p>
                  </div>
                  <motion.button 
                    whileHover={{ x: 5, scale: 1.1 }}
                    onClick={() => setActiveTab('health')}
                    className="w-14 h-14 rounded-2xl bg-white text-soft-ink flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SOS Uplink */}
      <motion.section 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onSOSClick}
        className="bg-pink-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer shadow-xl shadow-pink-600/20 overflow-hidden relative group"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="relative z-10 flex items-center gap-10">
          <div className="w-24 h-24 bg-white/10 text-white rounded-[2rem] flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
             <AlertTriangle size={48} strokeWidth={2} />
          </div>
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Emergency Link</p>
             <h3 className="text-5xl font-display font-semibold tracking-tight leading-none">{t.home.sosUplink}</h3>
             <p className="text-lg font-medium text-white/70">{t.home.tacticalSupport}</p>
          </div>
        </div>
        <div className="relative z-10 w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-pink-600 transition-all">
          <ChevronRight size={40} />
        </div>
      </motion.section>
    </motion.div>
  );
}
