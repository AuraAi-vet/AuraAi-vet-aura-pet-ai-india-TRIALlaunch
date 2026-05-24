import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  ShieldCheck, 
  AlertCircle, 
  FileCheck, 
  Search, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Printer,
  QrCode,
  BadgeAlert,
  RefreshCw,
  Activity,
  ShieldAlert,
  HeartPulse,
  Loader2
} from 'lucide-react';
import { Pet, PetLicense, PublicAlert } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { searchPetServicesAI, type AIServiceResult } from '../services/geminiService';

interface GovernmentHubViewProps {
  pets: Pet[];
  licenses: PetLicense[];
  alerts: PublicAlert[];
  onApplyLicense: (petId: string) => void;
  onESamrudhaSync: (petId: string) => void;
  onPrintLicense?: (petId: string) => void;
}

export function GovernmentHubView({ pets, licenses, alerts, onApplyLicense, onESamrudhaSync, onPrintLicense }: GovernmentHubViewProps) {
  const [activeSegment, setActiveSegment] = useState<'licensing' | 'hospitals' | 'alerts' | 'insurance'>('licensing');
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<AIServiceResult[]>([]);
  const [searchAdvice, setSearchAdvice] = useState<string>('');

  const defaultHospitals: AIServiceResult[] = [
    { name: 'City Municipal Veterinary Hospital', type: 'Public', address: '12 Civic Square, Central District', description: '2.4 km • 24/7 Service' },
    { name: 'Regional Animal Health Center', type: 'Government', address: 'Highway 4, North Block', description: '5.1 km • 8 AM - 6 PM' },
    { name: 'University Vet Teaching Hospital', type: 'Academic', address: 'Campus Circle, West Wing', description: '12.0 km • Emergency Only' },
  ];

  const displayHospitals = searchResults.length > 0 ? searchResults : defaultHospitals;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchAdvice('');
      return;
    }
    
    setIsSearching(true);
    try {
      const location = { lat: 8.5241, lng: 76.9366 }; // Thiruvananthapuram
      const res = await searchPetServicesAI(`Public/Govt hospitals in Kerala for: ${searchQuery}`, location);
      setSearchResults(res.services);
      setSearchAdvice(res.advice);
      if (res.services.length === 0) {
        toast.info("No specific public facilities found. Showing default list.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to search public facilities");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-slate/30 font-sans">
      <div className="max-w-5xl mx-auto px-8 py-16 space-y-16 pb-40">
        
        {/* Professional Official Header */}
        <header className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-soft-ink rounded-[2.25rem] flex items-center justify-center text-white shadow-xl shadow-soft-ink/10">
                <Building2 size={36} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-5xl font-display font-semibold text-soft-ink tracking-tight">Official Services</h1>
                  <span className="px-3 py-1 bg-soft-blue/20 text-soft-ink rounded-full text-[10px] font-black uppercase tracking-widest border border-soft-blue/50">State Portal</span>
                </div>
                <p className="text-soft-ink/40 text-sm font-medium tracking-wide">Official Veterinary Portal • Department of Animal Husbandry</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-6 py-3 bg-white border border-soft-blue/10 rounded-2xl shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-ruru-teal animate-pulse" />
                  <span className="text-[10px] font-black text-soft-ink/40 uppercase tracking-widest">Citizen Services Active</span>
               </div>
            </div>
          </div>

          <nav className="flex p-1.5 bg-white rounded-[2rem] border border-soft-blue/20 shadow-sm relative overflow-hidden">
            {[
              { id: 'licensing', label: 'Pet Licensing', icon: FileCheck },
              { id: 'hospitals', label: 'Public Care', icon: MapPin },
              { id: 'alerts', label: 'Health Alerts', icon: BadgeAlert },
              { id: 'insurance', label: 'State Insurance', icon: Activity },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSegment(tab.id as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-3 py-4.5 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  activeSegment === tab.id 
                    ? "bg-soft-ink text-white shadow-lg shadow-soft-ink/10" 
                    : "text-soft-ink/30 hover:text-soft-ink hover:bg-soft-slate/50"
                )}
              >
                <tab.icon size={18} />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {activeSegment === 'licensing' && (
              <motion.div
                key="licensing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {pets.map(pet => {
                    const license = licenses.find(l => l.petId === pet.id);
                    return (
                      <motion.div 
                        key={pet.id} 
                        className="bg-white border border-slate-200 rounded-[3.5rem] p-10 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                        
                        <div className="relative z-10 space-y-10">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-6">
                              <div className="w-20 h-20 rounded-[2rem] overflow-hidden p-1.5 border-2 border-slate-50 bg-white shadow-xl">
                                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover rounded-[1.5rem]" />
                              </div>
                              <div>
                                <h4 className="text-3xl font-brand text-slate-900 tracking-tight italic mb-1">{pet.name}</h4>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">{pet.breed}</p>
                              </div>
                            </div>
                            
                            <div className={cn(
                              "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                              license ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                            )}>
                              {license ? 'Verified Asset' : 'Pending Review'}
                            </div>
                          </div>

                          {license ? (
                            <div className="space-y-8">
                              <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 flex items-center justify-between group/id cursor-pointer hover:bg-white hover:border-slate-200 hover:shadow-xl transition-all">
                                <div>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">State Identifier</p>
                                  <p className="font-brand text-2xl text-slate-900 tracking-tighter italic">{license.licenseNumber}</p>
                                </div>
                                <QrCode size={48} className="text-slate-900 opacity-20 group-hover/id:opacity-100 transition-opacity" />
                              </div>
                              <div className="flex gap-4">
                                <button 
                                  onClick={() => onPrintLicense?.(pet.id)}
                                  className="flex-1 bg-white border-2 border-slate-900/5 text-slate-900 py-5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
                                >
                                  <Printer size={18} /> Hard Copy
                                </button>
                                <button className="flex-1 bg-slate-900 text-white py-5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-95 transition-all">
                                  <RefreshCw size={18} /> Update Lease
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-[2.5rem] space-y-8">
                              <p className="text-[11px] text-slate-400 font-bold tracking-widest uppercase italic max-w-xs mx-auto">Asset requires legal synchronization with state bylaws.</p>
                              <button 
                                onClick={() => onApplyLicense(pet.id)}
                                className="bg-slate-900 text-white px-12 py-5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
                              >
                                Initiate Digital Audit
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="bg-slate-900 rounded-[4rem] p-12 flex flex-col md:flex-row gap-12 relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-blue-400 shadow-2xl shrink-0 relative z-10 rotate-12">
                    <ShieldAlert size={40} />
                  </div>
                  <div className="relative z-10 flex-1 space-y-4">
                    <h4 className="font-brand text-3xl text-white tracking-tight italic">Compliance Mandate 2024</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium uppercase tracking-widest text-[11px]">
                      Digital registration is mandatory for all urban lifeforms under state decree. Failure to register results in loss of civic medical subsidies.
                      <button className="text-blue-400 underline font-black uppercase tracking-widest text-[10px] ml-4 hover:text-blue-300">Statute Reference</button>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSegment === 'alerts' && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div className="flex items-center justify-between px-4">
                   <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrated Bio-Security Stream</h3>
                   <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-2">
                     <Activity size={14} className="animate-pulse" /> Real-time Feed
                   </span>
                </div>

                <div className="space-y-6">
                  {alerts.length > 0 ? (
                    alerts.map((alert, idx) => (
                      <motion.div 
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                          "bg-white border rounded-[3.5rem] p-10 shadow-sm flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl transition-all",
                          alert.severity === 'critical' ? "border-rose-100 border-l-[12px] border-l-rose-500" :
                          alert.severity === 'high' ? "border-amber-100 border-l-[12px] border-l-amber-500" :
                          "border-slate-200 border-l-[12px] border-l-blue-500"
                        )}
                      >
                        <div className={cn(
                          "w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 shadow-lg",
                          alert.severity === 'critical' ? "bg-rose-50 text-rose-500" : 
                          alert.severity === 'high' ? "bg-amber-50 text-amber-500" :
                          "bg-blue-50 text-blue-500"
                        )}>
                          <BadgeAlert size={36} />
                        </div>
                        <div className="flex-1 space-y-4 text-center md:text-left">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <h4 className="text-3xl font-brand text-slate-900 tracking-tight italic">{alert.title}</h4>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(alert.timestamp).toLocaleDateString()} • {alert.issuedBy}</span>
                          </div>
                          <p className="text-slate-400 text-sm font-medium leading-relaxed uppercase tracking-widest text-[11px]">{alert.message}</p>
                        </div>
                        <button className="w-16 h-16 rounded-[1.75rem] bg-slate-900 text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                           <ExternalLink size={24} />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-32 bg-white border border-slate-200 rounded-[4rem] space-y-8">
                      <ShieldCheck size={80} className="mx-auto text-slate-100 mb-4" />
                      <div>
                        <h4 className="text-3xl font-brand text-slate-900 tracking-tight italic mb-3">Clearance Confirmed</h4>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">No active pathogen vectors or civic alerts in your regional sector.</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeSegment === 'insurance' && (
              <motion.div
                key="insurance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="bg-slate-900 rounded-[4rem] p-16 text-white relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1 space-y-8">
                      <div className="space-y-2">
                        <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.5em] italic">Official State Protocol</span>
                        <h3 className="text-5xl font-brand tracking-tighter italic">e-Samrudha Ecosystem</h3>
                      </div>
                      <p className="text-slate-400 text-base font-medium leading-relaxed uppercase tracking-widest text-[11px]">Integrated synchronization node with the Department of Animal Husbandry. Deploying state-backed medical subsidies and insurance logistics.</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-6 py-3 rounded-full">
                          <ShieldCheck size={16} className="text-emerald-400" /> Livestock Cover
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-6 py-3 rounded-full">
                          <HeartPulse size={16} className="text-rose-400" /> Vaccine Subsidy
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-96 bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-10 backdrop-blur-xl shrink-0">
                      <div className="flex items-center justify-between">
                         <Activity size={40} className="text-blue-400" />
                         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Synapse Online</span>
                      </div>
                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gateway Access</p>
                         <p className="text-3xl font-brand italic tracking-tight">Active Uplink</p>
                      </div>
                      <button 
                        onClick={() => window.open('https://esamrudha.kerala.gov.in/', '_blank')}
                        className="w-full bg-white text-slate-900 py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Launch Portal
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {pets.map((pet, idx) => (
                    <motion.div 
                      key={pet.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border border-slate-200 rounded-[3.5rem] p-10 hover:shadow-2xl transition-all flex flex-col justify-between space-y-10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <img src={pet.image} alt={pet.name} className="w-16 h-16 rounded-[1.75rem] object-cover ring-4 ring-slate-50" />
                          <div>
                            <h4 className="text-2xl font-brand text-slate-900 tracking-tight italic">{pet.name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{pet.breed}</p>
                          </div>
                        </div>
                        {pet.eSamrudhaId ? (
                          <div className="w-12 h-12 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                             <ShieldCheck size={24} />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100">
                             <RefreshCw size={24} />
                          </div>
                        )}
                      </div>

                      <div className="space-y-6">
                        <div className="bg-slate-50 rounded-[2rem] p-8 space-y-6">
                           <div className="flex items-center justify-between">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">e-Samrudha ID</span>
                             <span className="font-mono text-sm font-bold text-slate-900">{pet.eSamrudhaId || '---'}</span>
                           </div>
                           <div className="h-px bg-slate-200 w-full" />
                           <div className="flex items-center justify-between">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Policy Protocol</span>
                             <span className="font-mono text-sm font-bold text-slate-900 line-clamp-1">{pet.insuranceNumber || 'Not Deployed'}</span>
                           </div>
                        </div>

                        {!pet.eSamrudhaId ? (
                          <button 
                            onClick={() => onESamrudhaSync(pet.id)}
                            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20"
                          >
                            <RefreshCw size={18} /> Deploy State Sync
                          </button>
                        ) : (
                          <div className="flex gap-4">
                            <button className="flex-1 bg-white border border-slate-200 text-slate-900 py-5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest shadow-sm">
                              Health Card
                            </button>
                            <button className="flex-1 bg-slate-900 text-white py-5 rounded-[1.75rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20">
                              Claim Subsidy
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSegment === 'hospitals' && (
              <motion.div
                key="hospitals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isSearching}
                    placeholder="Search Public Health Infrastructure... (AI Grounded Mapping)" 
                    className="w-full pl-20 pr-32 py-8 bg-white border-2 border-slate-100 rounded-[3rem] text-base font-medium focus:outline-none focus:border-slate-900 focus:ring-0 shadow-2xl transition-all disabled:opacity-50"
                  />
                  <button 
                    type="submit" 
                    disabled={isSearching}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white h-16 px-10 rounded-[2.25rem] text-[11px] font-black uppercase tracking-widest shadow-xl disabled:opacity-50 transition-all hover:scale-[1.02]"
                  >
                    {isSearching ? <Loader2 size={18} className="animate-spin" /> : "Deploy Search"}
                  </button>
                </form>

                {searchAdvice && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="flex gap-8 relative z-10">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-[1.75rem] flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                        <MapPin size={28} />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-3 leading-none italic">ZooL Intelligence Node</h4>
                        <p className="text-xl font-brand tracking-tight leading-relaxed italic text-slate-200">{searchAdvice}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-6">
                  {displayHospitals.map((hosp, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white border border-slate-200 rounded-[3.5rem] p-10 hover:shadow-2xl transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-10">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-700 shadow-sm shrink-0">
                          <Building2 size={32} />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <h4 className="text-3xl font-brand text-slate-900 tracking-tighter italic leading-none">{hosp.name}</h4>
                            <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                              {hosp.type || 'Government'}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.1em]">{hosp.address}</p>
                          
                          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            <span className="flex items-center gap-2 text-blue-500">
                              <Activity size={14} /> 
                              {hosp.description || "Operational"}
                            </span>
                            {hosp.rating !== undefined && (
                              <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100 flex gap-2 items-center">
                                ★ {hosp.rating.toString()} Hub Score
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => hosp.url ? window.open(hosp.url, '_blank') : null}
                        className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all active:scale-95 shadow-sm"
                      >
                        <ChevronRight size={28} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-[4rem] p-16 flex flex-col md:flex-row items-center justify-between overflow-hidden relative shadow-sm gap-12">
                   <div className="absolute top-0 left-0 w-64 h-64 bg-slate-50 rounded-br-full -ml-32 -mt-32 opacity-50" />
                   <div className="relative z-10 space-y-6 flex-1">
                      <h4 className="text-4xl font-brand text-slate-900 tracking-tighter italic">Subsidized Clinical Care</h4>
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.15em] leading-relaxed max-w-lg">Citizen lifeforms are entitled to rabies-neutralizing protocols and subsidized surgical neaterings at municipal nodes.</p>
                      <button className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">
                        Validate Citizen Eligibility
                      </button>
                   </div>
                   <Building2 size={180} className="text-slate-50 shrink-0" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
