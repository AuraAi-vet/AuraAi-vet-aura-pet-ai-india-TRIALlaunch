import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Map, Users, TrendingUp, Sparkles, Building, BriefcaseMedical } from 'lucide-react';

const mockPilotData = [
  { name: 'Month 1', adoption: 120, vetEngagement: 15 },
  { name: 'Month 2', adoption: 350, vetEngagement: 45 },
  { name: 'Month 3', adoption: 800, vetEngagement: 110 },
  { name: 'Month 4', adoption: 1500, vetEngagement: 250 }
];

export const AppRoadmapDashboard: React.FC = () => {
  return (
    <div className="bg-[#FAF9F7] rounded-[2.5rem] p-6 border border-ruru-navy/10 mb-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-ruru-navy flex items-center gap-2">
          <Map className="text-emerald-600" />
          ZooL Test Market Pilot: Kerala (Trivandrum)
        </h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-ruru-navy/50 bg-ruru-navy/5 px-3 py-1 rounded-full">
          v2.5 - IND Market
        </span>
      </div>

      <p className="text-sm text-ruru-navy/60 leading-relaxed">
        Strategic deployment initiative tailored for the Indian animal care sector. Focusing on Trivandrum (Thiruvananthapuram) as the primary testbed due to its high pet ownership, tech-literate demographic, and active Panchayat-level veterinary networks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/95 backdrop-blur-3xl p-4 rounded-[2rem] border border-ruru-navy/10 shadow-sm">
          <p className="text-[10px] font-black tracking-widest uppercase text-[#A8A29E] mb-2 flex items-center gap-2"><Users size={12}/> Target Demographic</p>
          <p className="text-2xl font-brand text-ruru-navy">1.2M+</p>
          <p className="text-xs text-ruru-navy/60 mt-1">Pet Owners in Kerala</p>
        </div>
        <div className="bg-white/95 backdrop-blur-3xl p-4 rounded-[2rem] border border-ruru-navy/10 shadow-sm">
          <p className="text-[10px] font-black tracking-widest uppercase text-[#A8A29E] mb-2 flex items-center gap-2"><Building size={12}/> Infra Focus</p>
          <p className="text-2xl font-brand text-ruru-navy">250+</p>
          <p className="text-xs text-ruru-navy/60 mt-1">Gov. Vet Clinics (Tvm)</p>
        </div>
        <div className="bg-white/95 backdrop-blur-3xl p-4 rounded-[2rem] border border-ruru-navy/10 shadow-sm">
          <p className="text-[10px] font-black tracking-widest uppercase text-[#A8A29E] mb-2 flex items-center gap-2"><Sparkles size={12}/> Pricing Edge</p>
          <p className="text-2xl font-brand text-ruru-navy">₹799/m</p>
          <p className="text-xs text-ruru-navy/60 mt-1">Localized Premium Tier</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/95 backdrop-blur-3xl p-6 rounded-[2.5rem] shadow-sm border border-ruru-navy/10">
          <h4 className="font-semibold text-ruru-navy mb-4 flex items-center gap-2">
            <BriefcaseMedical size={18} className="text-ruru-teal" />
            Market Edge & Enhancements Implemented
          </h4>
          <ul className="space-y-4 text-sm text-ruru-navy/70">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-[1.25rem] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><span className="font-bold">1</span></div>
              <div>
                <strong className="block text-ruru-navy mb-1">Government Hub Integration</strong>
                Integrated "Panchayat Vet Clinics" and "Govt Veterinary Hospitals". India relies heavily on subsidized care. Map layers defaults to Lat: 8.5241, Lng: 76.9366 (Thiruvananthapuram).
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-[1.25rem] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><span className="font-bold">2</span></div>
              <div>
                <strong className="block text-ruru-navy mb-1">Malayalam Language Subsystem</strong>
                Malayalam interface mapping (`src/lib/translations.ts`) deployed to bridge rural-urban divides, catering directly to Kerala's local linguistics.
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-[1.25rem] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><span className="font-bold">3</span></div>
              <div>
                <strong className="block text-ruru-navy mb-1">Community Street Dog Tracking</strong>
                Features added for "Community" tabs to allow tracking and feeding schedules of local street dogs—a unique and critical requirement for the Indian urban ecosystem.
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white/95 backdrop-blur-3xl p-6 rounded-[2.5rem] shadow-sm border border-ruru-navy/10">
          <h4 className="font-semibold text-ruru-navy mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-ruru-navy-light" />
            Projected Trivandrum Adoption Curve
          </h4>
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPilotData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EBE6" />
                <XAxis dataKey="name" tick={{fontSize: 10, fill: '#8B8B6B'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 10, fill: '#8B8B6B'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="adoption" name="Pet Owners" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAdoption)" />
                <Area type="monotone" dataKey="vetEngagement" name="Vet Clinics" stroke="ruru-navy-light" strokeWidth={2} fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
