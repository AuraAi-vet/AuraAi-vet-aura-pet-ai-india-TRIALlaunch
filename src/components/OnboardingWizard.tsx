import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';

interface OnboardingWizardProps {
  onComplete: () => void;
  onAddPet: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export function OnboardingWizard({ onComplete, onAddPet, userProfile, onUpdateProfile }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [localRole, setLocalRole] = useState<'owner' | 'vet' | 'provider'>(userProfile.role || 'owner');
  const [businessName, setBusinessName] = useState('');
  const [providerType, setProviderType] = useState<UserProfile['providerType']>('clinic');

  const handleRoleSelect = (role: 'owner' | 'vet' | 'provider') => {
    setLocalRole(role);
    onUpdateProfile({ role });
    setStep(2);
  };

  const handleBusinessSubmit = () => {
    onUpdateProfile({ 
      businessName, 
      providerType: localRole === 'vet' ? 'clinic' : providerType,
      onboardingComplete: true 
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-3xl w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6 text-center"
      >
        {step === 1 && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-ruru-navy-light rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
               <Heart className="text-white w-8 h-8" fill="currentColor" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-brand text-ruru-navy-light">Welcome to ZooL</h2>
              <p className="text-ruru-navy/60 text-sm">Tell us how you'll be using the app</p>
            </div>
            <div className="grid gap-3">
              {[
                { id: 'owner', label: 'Pet Owner', sub: 'Care for my pets', icon: Heart },
                { id: 'vet', label: 'Veterinarian', sub: 'Manage my practice', icon: Shield },
                { id: 'provider', label: 'Service Provider', sub: 'Grooming, shops, etc', icon: MessageCircle }
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id as any)}
                  className="flex items-center gap-4 p-4 rounded-[1.5rem] border-2 border-ruru-navy/10 hover:border-ruru-navy-light text-left transition-all group"
                >
                  <div className="w-10 h-10 bg-[#F5F5F0] rounded-[1.25rem] flex items-center justify-center text-ruru-navy/60 group-hover:bg-ruru-navy-light group-hover:text-white transition-all">
                    <r.icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-ruru-navy">{r.label}</p>
                    <p className="text-[10px] text-[#A8A29E] uppercase tracking-widest">{r.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && localRole === 'owner' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-ruru-navy-light rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl transition-all">
               <Heart className="text-white w-8 h-8" fill="currentColor" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-brand text-ruru-navy-light">One last thing...</h2>
              <p className="text-ruru-navy/60 text-sm">Let's add your first pet to get started.</p>
            </div>
            <button 
              onClick={() => {
                onAddPet();
                onUpdateProfile({ onboardingComplete: true });
                onComplete();
              }}
              className="w-full py-4 rounded-[1.5rem] font-bold text-white bg-ruru-navy-light hover:bg-[#4A4A35] shadow-lg"
            >
              Add My First Pet
            </button>
          </div>
        )}

        {step === 2 && (localRole === 'vet' || localRole === 'provider') && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-ruru-navy-light rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
               <Shield className="text-white w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-brand text-ruru-navy-light">Business Setup</h2>
              <p className="text-ruru-navy/60 text-sm">Tell us about your practice or service.</p>
            </div>
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-black text-[#A8A29E] uppercase tracking-widest mb-1.5">Business / Practice Name</label>
                <input 
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-ruru-navy/10 rounded-[1.25rem] px-4 py-3 focus:outline-none focus:border-ruru-navy-light"
                  placeholder="e.g. Paws & Claws Clinic"
                />
              </div>
              {localRole === 'provider' && (
                <div>
                  <label className="block text-[10px] font-black text-[#A8A29E] uppercase tracking-widest mb-1.5">Service Type</label>
                  <select 
                    value={providerType}
                    onChange={(e) => setProviderType(e.target.value as any)}
                    className="w-full bg-[#FDFCFB] border border-ruru-navy/10 rounded-[1.25rem] px-4 py-3 focus:outline-none focus:border-ruru-navy-light"
                  >
                    <option value="groomer">Grooming & Spa</option>
                    <option value="boarding">Hostel / Boarding</option>
                    <option value="trainer">Pet Trainer</option>
                    <option value="shop">Pet Shop & Food</option>
                    <option value="breeder">Breeder</option>
                    <option value="farm">Farming / Livestock</option>
                  </select>
                </div>
              )}
            </div>
            <button 
              onClick={handleBusinessSubmit}
              disabled={!businessName}
              className="w-full py-4 rounded-[1.5rem] font-bold text-white bg-ruru-navy-light hover:bg-[#4A4A35] shadow-lg disabled:opacity-50"
            >
              Complete Setup
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
