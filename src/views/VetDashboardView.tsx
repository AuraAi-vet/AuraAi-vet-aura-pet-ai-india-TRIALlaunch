import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Clock, 
  Stethoscope, 
  Activity, 
  Search, 
  ArrowUpRight,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Radar,
  ChevronRight,
  LogOut,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { Pet, Appointment, HealthRecord } from '../types';
import { cn } from '../lib/utils';
import { BiospatialRadar } from '../components/BiospatialRadar';
import { QuickActions } from '../components/QuickActions';
import { DiagnosticTool } from '../components/DiagnosticTool';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface VetDashboardViewProps {
  appointments: Appointment[];
  pets: Pet[];
  healthRecords: HealthRecord[];
  onCompleteAppointment: (id: string) => void;
  onUpdatePatient: (petId: string, updates: Partial<Pet>) => void;
  onNavigateToPet: (petId: string) => void;
  onNavigateToSchedule: () => void;
  onNavigateToCriticalRecords: () => void;
  onAddAppointment?: (appointment: Partial<Appointment>) => void;
}

export function VetDashboardView({ 
  appointments, 
  pets, 
  healthRecords,
  onCompleteAppointment,
  onNavigateToPet,
  onNavigateToSchedule,
  onNavigateToCriticalRecords,
  onAddAppointment
}: VetDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'services'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDiagnosticToolOpen, setIsDiagnosticToolOpen] = useState(false);
  const [selectedDiagnosticPet, setSelectedDiagnosticPet] = useState<Pet | null>(null);
  
  // Local service management for demo
  const [services, setServices] = useState([
      { id: '1', name: 'General Consultation', type: 'Clinical', duration: 30, price: 500, description: 'Comprehensive checkup and physical examination.' },
      { id: '2', name: 'Vaccination', type: 'Wellness', duration: 15, price: 300, description: 'Standard vaccinations and booster shots.' },
      { id: '3', name: 'Dental Cleaning', type: 'Clinical', duration: 60, price: 1200, description: 'Professional teeth scaling and polishing.' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'Clinical', duration: 30, price: 500, description: '' });

  const [showBookModal, setShowBookModal] = useState(false);
  const [bookData, setBookData] = useState({ petId: '', serviceName: '', type: 'visit', date: '', time: '' });

  const handleBookAppointment = () => {
    if (onAddAppointment && bookData.petId && bookData.serviceName && bookData.date && bookData.time) {
      const pet = pets.find(p => p.id === bookData.petId);
      onAddAppointment({
        petId: bookData.petId,
        petName: pet?.name,
        ownerId: pet?.ownerId || 'temp',
        serviceName: bookData.serviceName,
        type: bookData.type as any,
        date: bookData.date,
        time: bookData.time,
        status: 'pending'
      });
      setShowBookModal(false);
      setBookData({ petId: '', serviceName: '', type: 'visit', date: '', time: '' });
    }
  };

  const handleOpenAddModal = () => { setFormData({ name: '', type: 'Clinical', duration: 30, price: 500, description: '' }); setShowAddModal(true); setEditingServiceId(null); };
  const handleOpenEditModal = (service: any) => { setFormData(service); setShowAddModal(true); setEditingServiceId(service.id); };
  const deleteService = (id: string) => setServices(services.filter(s => s.id !== id));
  const handleSaveService = () => {
    if (editingServiceId) {
      setServices(services.map(s => s.id === editingServiceId ? { ...formData, id: editingServiceId } : s));
    } else {
      setServices([...services, { ...formData, id: Date.now().toString() }]);
    }
    setShowAddModal(false);
  };

  const filteredQuickFind = pets.filter(p => 
    !searchQuery || 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.includes(searchQuery) ||
    p.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayAppointments = appointments.filter(apt => apt.status !== 'completed' && apt.status !== 'cancelled');

  const stats = [
    { label: 'Patient Load', value: '18', sub: 'Today', icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-50/50' },
    { label: 'Critical Ops', value: '3', sub: 'Urgent', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50/50' },
    { label: 'Health Nodes', value: '42', sub: 'Active', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50/50' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] font-sans pb-32">
      {/* 1. Header Area with Master Controls */}
      <header className="bg-white border-b border-ruru-navy/5 px-6 py-8 md:px-12 md:py-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-ruru-navy rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-ruru-navy/10 relative overflow-hidden group">
                <Sparkles size={20} className="text-blue-400 relative z-10 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-blue-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-ruru-navy/50">Clinical</span>
                <span className="block font-brand text-2xl text-ruru-navy tracking-tight">ZooL Vet OS</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Lvl 4 Grid Access</span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-4 w-full md:w-auto">
            <QuickActions onAction={(type) => console.log('Quick Action:', type)} />
            <motion.button
              onClick={() => {
                setSelectedDiagnosticPet(pets.length > 0 ? pets[0] : null);
                setIsDiagnosticToolOpen(true);
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-ruru-navy text-white px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-ruru-navy/15 w-full md:w-auto justify-center"
            >
              Diagnostic Hub <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto mt-8 flex flex-wrap gap-2">
          {['overview', 'analytics', 'services'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-6 py-3 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest transition-all",
                activeTab === tab 
                  ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" 
                  : "bg-transparent text-ruru-navy/50 hover:bg-[#F5F5F0] hover:text-ruru-navy"
              )}
            >
              {tab === 'overview' ? 'Command Center' : tab === 'analytics' ? 'Spatial Radar' : 'Service Catalog'}
            </button>
          ))}
        </div>
      </header>

      {/* 2. Main Dashboard Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 mt-4">
        
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 xl:grid-cols-12 gap-8"
          >
            {/* Primary Column */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* Performance Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border border-ruru-navy/5 rounded-[2rem] p-6 md:p-8 shadow-sm relative overflow-hidden group"
                  >
                    <div className="flex items-center gap-3 mb-3 relative z-10">
                      <div className={cn("p-2.5 rounded-xl", stat.bg, stat.color)}>
                        <stat.icon size={18} />
                      </div>
                      <span className="text-[10px] font-black text-[#A8A29E] uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2 relative z-10">
                      <span className="text-4xl font-brand text-ruru-navy group-hover:text-blue-600 transition-colors">{stat.value}</span>
                      <span className="text-[10px] font-black text-[#A8A29E] uppercase tracking-widest">{stat.sub}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Queue Management */}
              <section className="bg-white border border-ruru-navy/5 rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-ruru-navy rounded-full" />
                    <h2 className="text-[11px] font-black text-[#A8A29E] uppercase tracking-[0.3em]">Active Patient Stream</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setBookData({ petId: pets[0]?.id || '', serviceName: services[0]?.name || '', type: 'visit', date: new Date().toISOString().split('T')[0], time: '10:00' });
                        setShowBookModal(true);
                      }}
                      className="text-[10px] font-black text-white hover:text-white uppercase tracking-widest bg-ruru-navy hover:bg-ruru-navy/90 px-4 py-2 rounded-full flex items-center gap-1 transition-colors"
                    >
                      <Plus size={12} /> Book
                    </button>
                    <button 
                      onClick={onNavigateToSchedule}
                      className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline bg-blue-50/50 px-4 py-2 rounded-full"
                    >
                      Full Schedule
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((apt, idx) => (
                      <motion.div 
                        key={apt.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 md:p-6 rounded-[2rem] bg-[#FDFBF7] border border-ruru-navy/5 hover:bg-white hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-6 flex-1 w-full mb-4 sm:mb-0 cursor-pointer" onClick={() => onNavigateToPet(apt.petId)}>
                          <span className="text-2xl font-brand text-ruru-navy w-16 text-center">{apt.time}</span>
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white rounded-[1.25rem] flex items-center justify-center shadow-sm border border-ruru-navy/5 text-ruru-navy/30 group-hover:text-blue-500 transition-colors">
                              <Users size={20} />
                            </div>
                            <div className="text-left">
                              <h4 className="text-lg font-bold text-ruru-navy group-hover:text-blue-600 transition-colors">{apt.petName}</h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="px-3 py-1 bg-white text-[#A8A29E] rounded-lg text-[9px] font-black uppercase tracking-widest border border-ruru-navy/5">{apt.serviceName}</span>
                                <span className="text-[9px] font-bold text-[#A8A29E] uppercase tracking-widest">{apt.id.slice(0, 6)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:pl-4 sm:border-l sm:border-ruru-navy/5">
                          <div className="text-left sm:text-right">
                            <p className="text-[9px] font-black text-[#A8A29E] uppercase tracking-widest mb-1">Status</p>
                            <span className="text-xs font-bold text-blue-500 capitalize">{apt.status}</span>
                          </div>
                          <button 
                            onClick={() => onCompleteAppointment(apt.id)}
                            className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center bg-white text-ruru-navy border border-ruru-navy/10 hover:bg-ruru-navy hover:text-white transition-all shadow-sm group-hover:shadow-md"
                          >
                            <ArrowUpRight size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-16 text-center space-y-4 rounded-[2rem] bg-[#FDFBF7] border border-dashed border-ruru-navy/10">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-[#A8A29E] shadow-sm">
                         <ClipboardList size={24} />
                      </div>
                      <p className="text-sm text-[#A8A29E] font-medium italic">Clinical flow current clear. No active admissions.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Tactical Intelligence Sidebar */}
            <div className="xl:col-span-4 space-y-8">
               {/* Health Surveillance Trigger */}
               <motion.button
                 whileHover={{ scale: 1.02 }}
                 onClick={() => setActiveTab('analytics')}
                 className="w-full p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group text-left block"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                  <div className="relative z-10 flex items-center justify-between mb-6">
                     <div className="w-12 h-12 bg-white/20 rounded-[1.25rem] flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                        <Radar className="text-white" size={24} />
                     </div>
                     <ChevronRight className="opacity-50 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="relative z-10">
                     <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-100 mb-1">Spatial IQ</h3>
                     <p className="text-xl font-brand tracking-tight mb-2">Activate Radar</p>
                     <p className="text-xs text-blue-100/70 font-medium">Cross-reference patient data with real-time AHD surveillance networks.</p>
                  </div>
               </motion.button>

               {/* Rapid Patient Retrieval */}
               <section className="bg-white border border-ruru-navy/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-ruru-navy uppercase tracking-[0.4em]">Neural Search</h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  </div>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A8A29E]" size={16} />
                    <input 
                      type="text" 
                      placeholder="Access clinical archives..."
                      className="w-full bg-[#F5F5F0] border-none rounded-[1.5rem] py-4 pl-12 pr-6 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    {filteredQuickFind.slice(0, 4).map(pet => (
                      <button 
                        key={pet.id}
                        onClick={() => onNavigateToPet(pet.id)}
                        className="w-full flex items-center justify-between p-3 rounded-[1.5rem] hover:bg-[#F5F5F0] transition-colors group/item"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <img src={pet.image} alt={pet.name} className="w-12 h-12 rounded-xl object-cover shadow-sm bg-[#E5E5E0]" />
                          <div>
                            <p className="text-sm font-bold text-ruru-navy tracking-tight">{pet.name}</p>
                            <p className="text-[8px] text-[#A8A29E] font-black uppercase tracking-widest">{pet.breed}</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#A8A29E] group-hover/item:text-blue-500 group-hover/item:bg-white shadow-sm transition-all">
                          <ChevronRight size={16} />
                        </div>
                      </button>
                    ))}
                  </div>
               </section>
               
               {/* Critical Intelligence Node */}
               <section className="bg-ruru-navy rounded-[2.5rem] p-8 relative overflow-hidden group shadow-lg">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-rose-500/10 rounded-[1.25rem] flex items-center justify-center border border-rose-500/20 shadow-inner">
                        <AlertTriangle size={24} className="text-rose-500" />
                      </div>
                      <div>
                        <h3 className="text-[9px] font-black text-rose-400 uppercase tracking-[0.4em]">High Alert</h3>
                        <p className="text-xl font-brand text-white tracking-tight">Clinical Priority</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#A8A29E] font-medium leading-relaxed">
                      Immediate evaluation required. Biospatial sensors detected anomalies.
                    </p>
                    <button 
                      onClick={onNavigateToCriticalRecords}
                      className="w-full py-4 bg-white text-ruru-navy rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Enter Critical Hub
                    </button>
                  </div>
               </section>
            </div>
          </motion.div>
        )}

        {/* Spatial Radar Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <BiospatialRadar />
          </motion.div>
        )}

        {activeTab === 'services' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-ruru-navy/5 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-brand text-ruru-navy">Service Catalog</h3>
                      <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-ruru-navy text-white px-5 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-ruru-navy/15 hover:bg-blue-600 transition-all">
                        <Plus size={16}/> Add Service
                      </button>
                  </div>
                  <div className="space-y-4">
                    {services.map(s => (
                        <div key={s.id} className="flex justify-between items-center p-6 bg-[#FDFBF7] rounded-[1.5rem] border border-ruru-navy/5 hover:border-ruru-navy/10 transition-colors">
                          <div className="flex-1">
                            <p className="font-brand text-xl text-ruru-navy tracking-tight">{s.name}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">{s.type}</p>
                                <p className="text-xs text-[#A8A29E] font-medium flex items-center gap-1"><Clock size={12}/> {s.duration} min</p>
                            </div>
                            {s.description && <p className="text-sm text-ruru-navy/70 mt-3 font-medium">{s.description}</p>}
                          </div>
                          <div className="text-right mr-8">
                             <p className="text-lg font-brand text-ruru-navy">₹{s.price}</p>
                             <p className="text-[9px] text-[#A8A29E] uppercase tracking-widest">Rate</p>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => handleOpenEditModal(s)} className="p-3 text-blue-500 bg-blue-50 rounded-[1rem] hover:bg-blue-100 transition-colors"><Edit2 size={16} /></button>
                             <button onClick={() => deleteService(s.id)} className="p-3 text-red-500 bg-red-50 rounded-[1rem] hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                          </div>
                       </div>
                    ))}
                  </div>
                </div>
           </motion.div>
        )}
      </main>

      {/* Book Appointment Modal */}
      <AnimatePresence>
        {showBookModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowBookModal(false)}
              className="absolute inset-0 bg-ruru-navy/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 pb-4 border-b border-ruru-navy/5 flex justify-between items-center">
                <h2 className="text-2xl font-brand text-ruru-navy">Book Appointment</h2>
              </div>
              <div className="p-8 space-y-6 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A29E] mb-2 px-1">Select Patient</label>
                    <select 
                      className="w-full bg-[#F5F5F0] border-none rounded-2xl p-4 text-sm font-bold text-ruru-navy focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                      value={bookData.petId}
                      onChange={(e) => setBookData({...bookData, petId: e.target.value})}
                    >
                      <option value="" disabled>Choose a patient...</option>
                      {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A29E] mb-2 px-1">Service</label>
                    <select 
                      className="w-full bg-[#F5F5F0] border-none rounded-2xl p-4 text-sm font-bold text-ruru-navy focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                      value={bookData.serviceName}
                      onChange={(e) => setBookData({...bookData, serviceName: e.target.value})}
                    >
                      <option value="" disabled>Choose a service...</option>
                      {services.map(s => <option key={s.id} value={s.name}>{s.name} - ₹{s.price}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A29E] mb-2 px-1">Type</label>
                    <select 
                      className="w-full bg-[#F5F5F0] border-none rounded-2xl p-4 text-sm font-bold text-ruru-navy focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                      value={bookData.type}
                      onChange={(e) => setBookData({...bookData, type: e.target.value})}
                    >
                      <option value="visit">Clinic Visit</option>
                      <option value="telehealth">Telehealth</option>
                      <option value="grooming">Grooming</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A29E] mb-2 px-1">Date</label>
                      <input 
                        type="date"
                        className="w-full bg-[#F5F5F0] border-none rounded-2xl p-4 text-sm font-bold text-ruru-navy focus:ring-2 focus:ring-blue-500/20 outline-none"
                        value={bookData.date}
                        onChange={(e) => setBookData({...bookData, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A29E] mb-2 px-1">Time</label>
                      <input 
                        type="time"
                        className="w-full bg-[#F5F5F0] border-none rounded-2xl p-4 text-sm font-bold text-ruru-navy focus:ring-2 focus:ring-blue-500/20 outline-none"
                        value={bookData.time}
                        onChange={(e) => setBookData({...bookData, time: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 pt-4 bg-[#FDFBF7] border-t border-ruru-navy/5 flex items-center justify-end gap-4 mt-auto">
                <button 
                  onClick={() => setShowBookModal(false)}
                  className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-ruru-navy/50 hover:bg-ruru-navy/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBookAppointment}
                  disabled={!bookData.petId || !bookData.serviceName || !bookData.date || !bookData.time}
                  className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-ruru-navy text-white shadow-xl shadow-ruru-navy/20 hover:bg-ruru-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Service Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-ruru-navy/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 pb-4 border-b border-ruru-navy/5 flex justify-between items-center">
                <h2 className="text-2xl font-brand text-ruru-navy">{editingServiceId ? 'Edit Service' : 'Add New Service'}</h2>
              </div>
              <div className="p-8 space-y-6 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A29E] mb-2 px-1">Service Name</label>
                    <input 
                      type="text"
                      className="w-full bg-[#F5F5F0] border-none rounded-2xl p-4 text-sm font-bold text-ruru-navy focus:ring-2 focus:ring-blue-500/20 outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Wellness Exam"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A29E] mb-2 px-1">Type</label>
                      <select 
                        className="w-full bg-[#F5F5F0] border-none rounded-2xl p-4 text-sm font-bold text-ruru-navy focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="Clinical">Clinical</option>
                        <option value="Wellness">Wellness</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Grooming">Grooming</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A29E] mb-2 px-1">Duration (Min)</label>
                      <input 
                        type="number"
                        className="w-full bg-[#F5F5F0] border-none rounded-2xl p-4 text-sm font-bold text-ruru-navy focus:ring-2 focus:ring-blue-500/20 outline-none"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A29E] mb-2 px-1">Price (₹)</label>
                    <input 
                      type="number"
                      className="w-full bg-[#F5F5F0] border-none rounded-2xl p-4 text-sm font-bold text-ruru-navy focus:ring-2 focus:ring-blue-500/20 outline-none"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#A8A29E] mb-2 px-1">Description</label>
                    <textarea 
                      className="w-full bg-[#F5F5F0] border-none rounded-2xl p-4 text-sm font-bold text-ruru-navy focus:ring-2 focus:ring-blue-500/20 outline-none min-h-[100px] resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Briefly describe the service..."
                    />
                  </div>
                </div>
              </div>
              <div className="p-8 pt-4 bg-[#FDFBF7] border-t border-ruru-navy/5 flex items-center justify-end gap-4 mt-auto">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-ruru-navy/50 hover:bg-ruru-navy/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveService}
                  disabled={!formData.name}
                  className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-blue-500 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Save Service
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Diagnostic Modal */}
      <DiagnosticTool 
        isOpen={isDiagnosticToolOpen} 
        onClose={() => setIsDiagnosticToolOpen(false)}
        pet={selectedDiagnosticPet || (pets.length > 0 ? pets[0] : null)}
        availablePets={pets}
        onPetChange={(pet) => setSelectedDiagnosticPet(pet)}
        records={healthRecords}
      />
    </div>
  );
}
