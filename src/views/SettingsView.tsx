import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bell, 
  ChevronRight,
  ChevronDown, 
  CreditCard, 
  Edit2, 
  HelpCircle, 
  LogOut, 
  Moon, 
  Shield, 
  Smartphone, 
  User, 
  Languages,
  BadgeCheck,
  MessageSquare,
  Activity,
  RefreshCw,
  Zap,
  Calendar,
  Users,
  MapPin,
  ClipboardList,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';
import { auth } from '../firebase';
import { toast } from 'sonner';
import { getUsage, resetUsage, UsageData } from '../services/geminiService';
import { MAX_DAILY_CREDITS } from '../constants';
import { useStore } from '../store/useStore';
import { translations, Language } from '../lib/translations';
import { AppRoadmapDashboard } from '../components/AppRoadmapDashboard';
import { TaskManagement } from '../components/TaskManagement';

interface SettingsViewProps {
  userProfile: UserProfile | null;
  onEditProfile: () => void;
  onFeedback?: () => void;
  role: 'owner' | 'vet' | 'provider';
  onSwitchRole: () => void;
  onNavigate: (tab: any) => void;
}

export function SettingsView({ userProfile, onEditProfile, onFeedback, role, onSwitchRole, onNavigate }: SettingsViewProps) {
  const [aiUsage, setAiUsage] = useState<UsageData>({ date: '', count: 0, creditsUsed: 0 });
  const [showLangSelect, setShowLangSelect] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSubs, setShowSubs] = useState(false);
  const [showUnits, setShowUnits] = useState(false);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'operations': true,
    'credentials': true,
    'account': true,
    'preferences': true,
    'support': false
  });

  const { 
    language, 
    setLanguage, 
    darkMode, 
    setDarkMode, 
    notificationsEnabled, 
    setNotificationsEnabled,
    setCachedLocation,
    setCachedNearbyPlaces,
    setCachedAIServices,
    setCachedAIAdvice
  } = useStore();
  const t = translations[language];

  useEffect(() => {
    setAiUsage(getUsage());
  }, []);

  const handleResetUsage = () => {
    resetUsage();
    setAiUsage(getUsage());
    toast.success("AI Limit Protocol Reset for Testing");
  };

  const handleResetCache = () => {
    setCachedLocation(null as any);
    setCachedNearbyPlaces([]);
    setCachedAIServices([]);
    setCachedAIAdvice('');
    toast.success(t.settings.cacheCleared);
    setShowAppSettings(false);
  };

  const LANG_NAMES = {
    en: 'English',
    ml: 'മലയാളം (Malayalam)',
    hi: 'हिन्दी (Hindi)'
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const menuSections = [
    {
      id: 'operations',
      title: role === 'vet' ? "Practice Operations" : role === 'provider' ? "Service Operations" : "Clinical & Care Modules",
      items: [
        role === 'vet' 
          ? { icon: ClipboardList, label: "Patients & Case Files", action: () => onNavigate('appointments'), value: "Managed Records" }
          : role === 'provider' 
            ? { icon: ClipboardList, label: "Bookings Management", action: () => onNavigate('appointments'), value: "Active Queue" }
            : { icon: ClipboardList, label: "Care Tracker", action: () => onNavigate('care'), value: "Daily Logs" },
        { icon: Calendar, label: role === 'vet' ? "Clinic Schedule" : role === 'provider' ? "Service Schedule" : "My Appointments", action: () => onNavigate('appointments'), value: "Real-time Sync" },
        role === 'owner' ? { icon: MessageSquare, label: "Consultations (Chat)", action: () => onNavigate('chat'), value: "Direct Msg" } : { icon: Sparkles, label: "RuRu AI Assistant", action: () => onNavigate('ai'), value: "Clinical Mode" },
        { icon: Users, label: role === 'owner' ? "Community Forum" : "Professional Community", action: () => onNavigate('community'), value: "ZooL Groups" },
        { icon: MapPin, label: role === 'vet' ? "Diagnostic Networks" : role === 'provider' ? "Partner Locators" : "Vet Locators", action: () => onNavigate('services'), value: "Verified Partners" }
      ]
    },
    {
      id: 'credentials',
      title: role === 'vet' ? "Professional Credentials" : role === 'provider' ? "Business Verification" : "Pet Registry & Safety",
      items: role === 'vet' ? [
        { icon: BadgeCheck, label: "Clinical Certifications", action: () => toast.success("All credentials verified by ZooL"), value: "Council Verified" },
        { icon: Shield, label: "Prescription Authority", action: () => toast.info("Digital Signature: Enabled"), value: "Level 3" },
        { icon: Activity, label: "Professional Stats", action: () => toast.error("Practice analytics module pending infrastructure sync"), value: "Under Dev" }
      ] : role === 'provider' ? [
        { icon: BadgeCheck, label: "Business License", action: () => toast.success("Verified by ZooL"), value: "Active" },
        { icon: Shield, label: "Liability Insurance", action: () => toast.info("Docu-vault synchronized"), value: "Up to Date" },
        { icon: Activity, label: "Service Ratings", action: () => toast.info("Client satisfaction analytics loading..."), value: "4.9/5.0" }
      ] : [
        { icon: BadgeCheck, label: "Gov License Status", action: () => onNavigate('gov'), value: "e-Samrudha Sync" },
        { icon: Shield, label: "Insurance Hub", action: () => toast.info("Linked to PetLife Premium"), value: "Active" },
        { icon: Activity, label: "Family Health Score", action: () => onNavigate('health'), value: "92/100" }
      ]
    },
    {
      id: 'account',
      title: "Account Settings",
      items: [
        { icon: User, label: t.settings.profile, action: onEditProfile, value: userProfile?.name },
        { icon: Zap, label: `Transition Role`, action: onSwitchRole, value: `Mode: ${role.toUpperCase()}` },
        { icon: CreditCard, label: t.settings.subscriptions, action: () => setShowSubs(!showSubs), value: role === 'vet' ? "Practice Enterprise" : role === 'provider' ? "Service Vendor Plan" : "Family Premium" },
        { 
          icon: Shield, 
          label: "Security Keys", 
          action: () => toast.info("Cloud Biometrics: System Default"), 
          value: "Linked" 
        }
      ]
    },
    {
      id: 'preferences',
      title: "App Preferences",
      items: [
        { 
          icon: Moon, 
          label: "Theme Mode", 
          action: () => setDarkMode(!darkMode), 
          value: darkMode ? "Dark Protocol" : "Light ZooL" 
        },
        { 
          icon: Languages, 
          label: "System Language", 
          action: () => setShowLangSelect(!showLangSelect), 
          value: LANG_NAMES[language] 
        },
        { 
          icon: Smartphone, 
          label: "Storage & Cache", 
          action: () => setShowAppSettings(!showAppSettings),
          value: "Manage Data"
        },
        {
          icon: Bell,
          label: "Notifications",
          action: () => setNotificationsEnabled(!notificationsEnabled),
          value: notificationsEnabled ? "Real-time" : "Silenced"
        },
        {
          icon: Activity,
          label: "Unit System",
          action: () => setShowUnits(!showUnits),
          value: units === 'metric' ? "Metric (kg, cm)" : "Imperial (lb, in)"
        }
      ]
    },
    {
      id: 'support',
      title: "Assistance & Legal",
      items: [
        { 
          icon: HelpCircle, 
          label: "ZooL Intelligence Hub", 
          action: () => setShowHelp(!showHelp),
          value: "Guides & FAQ"
        },
        { 
          icon: MessageSquare, 
          label: "Operational Feedback", 
          action: onFeedback,
          value: "Direct to Devs"
        },
        { 
          icon: Shield, 
          label: "Privacy Framework", 
          action: () => setShowPrivacy(!showPrivacy),
          value: "Data Rights"
        },
        { 
          icon: BadgeCheck, 
          label: "Usage Protocol", 
          action: () => setShowTerms(!showTerms),
          value: "EULA & Legal"
        }
      ]
    },
    {
      id: 'qa_testing',
      title: "QA & Cost Optimization Tools",
      items: [
        {
          icon: AlertTriangle,
          label: "Simulate AI Quota Exceeded",
          action: () => {
            import('../services/geminiService').then(m => {
              m.simulateMaxUsage();
              toast.error('AI Daily Quota simulated as EXHAUSTED (Cost Optimization Engaged).');
            });
          },
          value: "Test Fallback"
        },
        {
          icon: RefreshCw,
          label: "Reset AI Quota Limits",
          action: () => {
            import('../services/geminiService').then(m => {
              m.resetUsage();
              toast.success('AI Quota has been securely reset.');
            });
          },
          value: "Restore Functions"
        }
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 py-10 pb-32 space-y-12 max-w-2xl mx-auto"
    >
      <header className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 bg-ruru-navy-light rounded-full" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ruru-navy/60">Ecosystem Hub</p>
        </div>
        <h2 className="text-4xl font-brand text-ruru-navy tracking-tighter">{t.settings.title}</h2>
        <p className="text-ruru-navy/60 text-sm font-medium">Configure your clinical environment and access modules.</p>
      </header>

      <AppRoadmapDashboard />

      {/* Units Selector Sub-panel */}
      {showUnits && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FDFBF7] border border-ruru-navy/10 rounded-[2.5rem] p-6 space-y-4"
        >
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black text-ruru-navy/60 uppercase tracking-widest">Metric vs Imperial</p>
            <button onClick={() => setShowUnits(false)} className="text-[10px] font-bold text-[#A8A29E] uppercase hover:text-ruru-navy">Close</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'metric', label: 'Metric', desc: 'kg, cm, °C' },
              { id: 'imperial', label: 'Imperial', desc: 'lb, in, °F' }
            ].map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  setUnits(u.id as any);
                  setShowUnits(false);
                  toast.success(`Units updated to ${u.label}`);
                }}
                className={cn(
                  "py-6 px-4 rounded-[1.5rem] transition-all border-2 flex flex-col items-center gap-1",
                  units === u.id 
                    ? "bg-ruru-navy border-ruru-navy text-white shadow-xl" 
                    : "bg-white/95 backdrop-blur-3xl border-ruru-navy/10 text-ruru-navy/60 hover:border-ruru-navy-light"
                )}
              >
                <span className="text-[11px] font-black uppercase tracking-widest">{u.label}</span>
                <span className="text-[9px] opacity-60 font-medium">{u.desc}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Language Selector Sub-panel */}
      {showLangSelect && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FDFBF7] border border-ruru-navy/10 rounded-[2.5rem] p-6 space-y-4"
        >
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black text-ruru-navy/60 uppercase tracking-widest">{t.settings.language}</p>
            <button onClick={() => setShowLangSelect(false)} className="text-[10px] font-bold text-[#A8A29E] uppercase hover:text-ruru-navy">Close</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.keys(LANG_NAMES) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setShowLangSelect(false);
                  toast.success(`Language set to ${LANG_NAMES[lang]}`);
                }}
                className={cn(
                  "py-4 px-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all border-2",
                  language === lang 
                    ? "bg-ruru-navy border-ruru-navy text-white shadow-xl" 
                    : "bg-white/95 backdrop-blur-3xl border-ruru-navy/10 text-ruru-navy/60 hover:border-ruru-navy-light"
                )}
              >
                {LANG_NAMES[lang]}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* App Settings Sub-panel */}
      {showAppSettings && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FDFBF7] border border-ruru-navy/10 rounded-[2.5rem] p-6 space-y-4"
        >
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-black text-ruru-navy/60 uppercase tracking-widest">{t.settings.appSettings}</p>
            <button onClick={() => setShowAppSettings(false)} className="text-[10px] font-bold text-[#A8A29E] uppercase hover:text-ruru-navy">Close</button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleResetCache}
              className="w-full flex items-center justify-between p-6 bg-white/95 backdrop-blur-3xl border border-ruru-navy/10 rounded-[1.5rem] hover:bg-white/95 backdrop-blur-3xl hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FDFBF7] rounded-[1.25rem] flex items-center justify-center text-ruru-navy-light">
                  <RefreshCw size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-ruru-navy">{t.settings.resetCache}</p>
                  <p className="text-[10px] text-[#A8A29E] font-black uppercase tracking-widest mt-0.5">Clear local AI & Map cache</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#A8A29E]" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Help Sub-panel */}
      {showHelp && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-3xl border border-ruru-navy/10 rounded-[2.5rem] p-8 space-y-6 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F5F5F0] rounded-[1.25rem] flex items-center justify-center text-ruru-navy-light">
                <HelpCircle size={24} />
              </div>
              <h3 className="text-xl font-brand text-ruru-navy">{t.settings.helpCenter}</h3>
            </div>
            <button onClick={() => setShowHelp(false)} className="text-[10px] font-black text-[#A8A29E] uppercase tracking-widest hover:text-ruru-navy">Close</button>
          </div>
          <p className="text-ruru-navy/60 leading-relaxed text-sm">{t.settings.helpContent}</p>
          <button 
            onClick={() => {
              setShowHelp(false);
              onNavigate('community');
            }}
            className="w-full py-4 bg-[#F5F5F0] text-ruru-navy-light rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-[#F0EBE6] transition-all"
          >
            Visit Community Forums
          </button>
        </motion.div>
      )}

      {/* Privacy Sub-panel */}
      {showPrivacy && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-3xl border border-ruru-navy/10 rounded-[2.5rem] p-8 space-y-6 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-[1.25rem] flex items-center justify-center text-emerald-600">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-brand text-ruru-navy">{t.settings.privacyPolicy}</h3>
            </div>
            <button onClick={() => setShowPrivacy(false)} className="text-[10px] font-black text-[#A8A29E] uppercase tracking-widest hover:text-ruru-navy">Close</button>
          </div>
          <div className="space-y-4">
            <p className="text-ruru-navy/60 leading-relaxed text-sm">{t.settings.privacyContent}</p>
            <div className="p-4 bg-emerald-50/50 rounded-[1.5rem] border border-ruru-teal-100 flex items-start gap-4">
              <BadgeCheck className="text-ruru-teal mt-1 shrink-0" size={20} />
              <div>
                <p className="text-[11px] font-black text-ruru-navy uppercase tracking-widest">End-to-End Encryption</p>
                <p className="text-[10px] text-emerald-700 font-medium mt-1">Status: Active & Verified by ZooL Infrastructure</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Terms Sub-panel */}
      {showTerms && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-3xl border border-ruru-navy/10 rounded-[2.5rem] p-8 space-y-6 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F5F5F0] rounded-[1.25rem] flex items-center justify-center text-ruru-navy-light">
                <BadgeCheck size={24} />
              </div>
              <h3 className="text-xl font-brand text-ruru-navy">Terms of Service</h3>
            </div>
            <button onClick={() => setShowTerms(false)} className="text-[10px] font-black text-[#A8A29E] uppercase tracking-widest hover:text-ruru-navy">Close</button>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 no-scrollbar">
            <p className="text-ruru-navy/60 leading-relaxed text-sm">By using ZooL, you agree to our comprehensive terms surrounding clinical data management and AI assistance.</p>
            <div className="space-y-4">
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-ruru-navy mb-1">1. Clinical Accuracy</h4>
                <p className="text-xs text-ruru-navy/60">ZooL provides AI-driven insights which should not replace professional veterinary consultation. Always seek expert advice for critical medical conditions.</p>
              </section>
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-ruru-navy mb-1">2. Data Sovereignty</h4>
                <p className="text-xs text-ruru-navy/60">You retain ownership of your pet's records. We provide the infrastructure to secure and manage this data.</p>
              </section>
            </div>
          </div>
        </motion.div>
      )}

      {/* Subscriptions Sub-panel */}
      {showSubs && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ruru-navy border border-ruru-navy rounded-[2.5rem] p-8 space-y-6 shadow-2xl text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-[1.25rem] flex items-center justify-center text-amber-400">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-brand">Premium Protocols</h3>
            </div>
            <button onClick={() => setShowSubs(false)} className="text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white">Close</button>
          </div>
          <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Current Plan</p>
                <p className="text-lg font-brand">ZooL Professional</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Status</p>
                <p className="text-sm font-black text-ruru-teal-light uppercase">Active</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Zap size={14} className="text-amber-400" />
                <span>Unlimited Multimodal AI Scans</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Zap size={14} className="text-amber-400" />
                <span>High-Res Voice & Image Support</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Premium Profile Bento */}
      <div className="bg-white/95 backdrop-blur-3xl border border-ruru-navy/10 rounded-[2.5rem] p-8 shadow-sm flex items-center gap-6 relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-ruru-navy-light/5">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FDFBF7] rounded-bl-[5rem] -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
        <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl relative z-10 p-0.5 bg-[#F0EBE6]">
          <img src={userProfile?.image} alt="" className="w-full h-full object-cover rounded-[1.75rem]" />
        </div>
        <div className="flex-1 relative z-10 space-y-2">
          <div>
            <h3 className="text-2xl font-brand text-ruru-navy tracking-tight">{userProfile?.name}</h3>
            <p className="text-[10px] text-[#A8A29E] font-black tracking-[0.2em] uppercase mt-1">Verified {userProfile?.role}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-ruru-teal-100">Care Pro</span>
            <span className="px-3 py-1 bg-[#F5F5F0] text-ruru-navy-light text-[9px] font-black uppercase tracking-widest rounded-full border border-ruru-navy/10">Rep: 4.9</span>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={onEditProfile}
          className="w-12 h-12 bg-ruru-navy text-white rounded-[1.5rem] flex items-center justify-center shadow-lg relative z-10"
        >
          <Edit2 size={18} />
        </motion.button>
      </div>

      {/* Clinical Sync Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-6">
          <p className="text-[10px] font-black text-[#A8A29E] uppercase tracking-[0.3em]">Infrastructure Sync</p>
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-ruru-teal-100">
            <span className="w-1.5 h-1.5 bg-ruru-teal rounded-full animate-pulse shadow-sm shadow-ruru-teal-500/50" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Active Link</span>
          </div>
        </div>
        <div className="p-8 bg-ruru-navy rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-[#2D2A26]/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-ruru-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center text-ruru-teal-light">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-ruru-teal-light uppercase tracking-[0.2em]">Neural Database Sync</p>
              <p className="text-lg font-brand text-white/90 tracking-tight mt-1">End-to-End Encryption Active</p>
            </div>
          </div>
          <p className="text-[10px] font-black text-white/40 py-2 px-4 border border-white/10 rounded-full uppercase tracking-widest relative z-10">Real-time</p>
        </div>
      </div>

      {/* AI Limit Protocol Testing Card */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-6">
          <p className="text-[10px] font-black text-[#A8A29E] uppercase tracking-[0.3em]">Neural link budget</p>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-sm shadow-blue-500/50" />
            <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Active Limit Cap</span>
          </div>
        </div>
        <div className="p-8 bg-white/95 backdrop-blur-3xl border border-ruru-navy/10 rounded-[2.5rem] flex flex-col gap-6 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-[#2D2A26]/5 transition-all">
          <div className="flex items-center justify-between relative z-10 w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-500">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#A8A29E] uppercase tracking-[0.2em]">Neural Power (Daily)</p>
                <p className="text-lg font-brand text-ruru-navy tracking-tight mt-1">
                  {MAX_DAILY_CREDITS - aiUsage.creditsUsed} <span className="text-xs text-ruru-navy/60 font-medium ml-1 font-sans">credits remaining</span>
                </p>
              </div>
            </div>
            <button 
              onClick={handleResetUsage}
              className="w-10 h-10 bg-[#FDFBF7] rounded-full flex items-center justify-center text-[#A8A29E] hover:text-ruru-navy hover:bg-[#F0EBE6] transition-colors relative z-10"
              title="Reset limits for testing"
            >
              <RefreshCw size={16} />
            </button>
          </div>
          
          <div className="w-full space-y-2 relative z-10">
            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-[#A8A29E]">
              <span>Usage Efficiency</span>
              <span>{Math.round((aiUsage.creditsUsed / MAX_DAILY_CREDITS) * 100)}% Consumed</span>
            </div>
            <div className="h-2 w-full bg-[#F5F5F0] rounded-full overflow-hidden border border-ruru-navy/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(aiUsage.creditsUsed / MAX_DAILY_CREDITS) * 100}%` }}
                className={cn(
                  "h-full transition-all duration-1000",
                  (aiUsage.creditsUsed / MAX_DAILY_CREDITS) > 0.8 ? "bg-rose-500" : "bg-ruru-teal"
                )}
              />
            </div>
            <p className="text-[9px] text-[#A8A29E] font-medium leading-relaxed">
              Cost Model: Lite (1), Standard (5), Vision (20), Maps (25). Budget resets at 00:00 UTC.
            </p>
          </div>
        </div>
      </div>

      {/* Task Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-6">
          <p className="text-[10px] font-black text-[#A8A29E] uppercase tracking-[0.3em]">Organization</p>
        </div>
        <TaskManagement />
      </div>

      <div className="space-y-6">
        {menuSections.map(section => {
          const isOpen = expandedSections[section.id];
          return (
            <div key={section.id} className="space-y-4">
              <button 
                onClick={() => setExpandedSections(prev => ({ ...prev, [section.id]: !isOpen }))}
                className="w-full flex items-center justify-between px-6 group"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-1 h-4 rounded-full transition-all duration-300",
                    isOpen ? "bg-ruru-navy-light h-6" : "bg-[#A8A29E] h-2"
                  )} />
                  <h4 className="text-[10px] font-black text-[#A8A29E] group-hover:text-ruru-navy transition-colors uppercase tracking-[0.3em]">{section.title}</h4>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 0 : -90 }}
                  className="text-[#A8A29E]"
                >
                  <ChevronDown size={14} />
                </motion.div>
              </button>
              
              <div className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
              )}>
                <div className="bg-white/95 backdrop-blur-3xl border border-ruru-navy/10 rounded-[2.5rem] overflow-hidden shadow-sm mx-1">
                  {section.items.map((item, idx) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className={cn(
                        "w-full flex items-center justify-between p-6 hover:bg-[#FDFBF7] transition-all group",
                        idx !== section.items.length - 1 && "border-b border-[#F5F5F5]"
                      )}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-[1.5rem] bg-[#FDFBF7] text-ruru-navy-light flex items-center justify-center group-hover:bg-white/95 backdrop-blur-3xl group-hover:shadow-xl group-hover:rotate-3 transition-all duration-300">
                          <item.icon size={22} />
                        </div>
                        <div className="text-left">
                          <span className="text-base font-medium text-ruru-navy block leading-none">{item.label}</span>
                          {item.value && <span className="text-[10px] font-black text-[#A8A29E] uppercase tracking-widest mt-1 block">{item.value}</span>}
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-[#A8A29E] group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-4 p-7 bg-red-50/30 border-2 border-red-100 text-red-500 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-red-50 hover:border-red-200 transition-all shadow-xl shadow-red-500/5 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          Terminal Session Out
        </motion.button>
      </div>

      <footer className="text-center space-y-2 py-12">
        <p className="text-[10px] font-black text-[#A8A29E] tracking-[0.3em] uppercase">ZooL Ecosystem v1.0.4-CLINICAL</p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 bg-ruru-teal rounded-full" />
          <p className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-widest italic">Clinical Precision for Every Pet</p>
        </div>
      </footer>
    </motion.div>
  );
}

