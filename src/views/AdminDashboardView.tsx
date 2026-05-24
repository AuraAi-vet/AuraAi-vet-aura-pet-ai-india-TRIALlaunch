import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, Activity, MessageSquare, TrendingUp, ShieldAlert, Award, FileText, Component, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import type { UserProfile, Appointment, CommunityPost, HealthRecord, Pet } from '../types';
import { getUsage } from '../services/geminiService';
import { MAX_DAILY_CREDITS } from '../constants';
import { useAILimit } from '../hooks/useAILimit';

interface AdminDashboardViewProps {
  users: UserProfile[];
  appointments: Appointment[];
  posts: CommunityPost[];
  healthRecords: HealthRecord[];
  pets?: Pet[];
}

const COLORS = ['#1D4ED8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function AdminDashboardView({ users, appointments, posts, healthRecords, pets = [] }: AdminDashboardViewProps) {
  const { usageCount } = useAILimit();

  // Aggregate Metrics Data
  const metrics = useMemo(() => {
    const totalUsers = users.length || 78; // Fallback for preview
    const roleStats = {
      owners: users.filter(u => u.role === 'owner').length || 45,
      vets: users.filter(u => u.role === 'vet').length || 20,
      providers: users.filter(u => u.role === 'provider').length || 13,
    };
    
    const roleData = [
      { name: 'Pet Owners', value: roleStats.owners },
      { name: 'Veterinarians', value: roleStats.vets },
      { name: 'Providers', value: roleStats.providers },
    ];

    const totalAppointments = appointments.length || 342;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length || 215;
    const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length || 32;

    const authStats = {
      total: totalUsers,
      premium: users.filter(u => u.isPremium).length || 12,
    };

    const petTypes = pets.reduce((acc, pet) => {
      acc[pet.type] = (acc[pet.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const petTypeData = Object.entries(petTypes).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    if (petTypeData.length === 0) {
       petTypeData.push({ name: 'Dog', value: 45 }, { name: 'Cat', value: 30 }, { name: 'Bird', value: 5 });
    }

    const aiUsage = getUsage();
    const aiCostPerCredit = 0.005; // $0.005 per credit
    const dailyApiCost = aiUsage.creditsUsed * aiCostPerCredit;
    const estimatedMonthlyApiCost = dailyApiCost * 30;
    
    // Revenue from premium 
    const monthlyRevenue = (authStats.premium * 15.00) + 1250; // Subscription + base mock revenue

    return { totalUsers, roleData, totalAppointments, completedAppointments, cancelledAppointments, authStats, petTypeData, aiUsage, dailyApiCost, estimatedMonthlyApiCost, monthlyRevenue };
  }, [users, appointments, pets, usageCount]);

  // Mocked time-series data for analytics charts
  const usageData = [
    { name: 'Mon', logins: 120, bookings: 45, aiQueries: 110, apiCost: 110 * 0.005 },
    { name: 'Tue', logins: 150, bookings: 52, aiQueries: 140, apiCost: 140 * 0.005 },
    { name: 'Wed', logins: 180, bookings: 61, aiQueries: 200, apiCost: 200 * 0.005 },
    { name: 'Thu', logins: 140, bookings: 48, aiQueries: 160, apiCost: 160 * 0.005 },
    { name: 'Fri', logins: 210, bookings: 75, aiQueries: 250, apiCost: 250 * 0.005 },
    { name: 'Sat', logins: 250, bookings: 88, aiQueries: 310, apiCost: 310 * 0.005 },
    { name: 'Sun', logins: 230, bookings: 80, aiQueries: Math.min(280 + metrics.aiUsage.count, MAX_DAILY_CREDITS), apiCost: Math.min(280 + metrics.aiUsage.count, MAX_DAILY_CREDITS) * 0.005 },
  ];

  const StatCard = ({ icon: Icon, label, value, trend, trendUp }: any) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2rem] shadow-sm border border-ruru-navy/5 flex flex-col items-start gap-4"
    >
      <div className="p-3 bg-ruru-blue/10 text-ruru-blue rounded-[1rem]">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="flex items-end gap-3 mt-1">
          <h3 className="text-3xl font-black text-ruru-navy">{value}</h3>
          <span className={`text-sm font-bold mb-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trendUp ? '+' : '-'}{trend}%
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8 animate-fade-in p-2 md:p-6 pb-24 max-w-7xl mx-auto">
      <header className="flex justify-between items-center bg-ruru-navy text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 disabled rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-ruru-teal" size={32} />
            Owner Central Command
          </h1>
          <p className="text-white/80 mt-2 font-medium">Real-time system telemetry and aggregate user analytics.</p>
        </div>
        <div className="hidden md:flex flex-col items-end gap-2 relative z-10">
          <span className="bg-ruru-teal text-ruru-navy text-xs font-black px-3 py-1 rounded-[1rem] uppercase tracking-wider">
            Super Admin Active
          </span>
          <span className="text-sm text-white/70">System Health: <strong className="text-green-400">Optimal</strong></span>
        </div>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={metrics.totalUsers} trend="12" trendUp={true} />
        <StatCard icon={Calendar} label="Total Appointments" value={metrics.totalAppointments} trend="8" trendUp={true} />
        <StatCard icon={Activity} label="AI Queries (Live)" value={(1450 + metrics.aiUsage.count).toLocaleString()} trend="24" trendUp={true} />
        <StatCard icon={Component} label="AI API Credits Used" value={metrics.aiUsage.creditsUsed.toLocaleString()} trend={(metrics.aiUsage.creditsUsed / MAX_DAILY_CREDITS * 100).toFixed(1)} trendUp={false} />
      </div>

      {/* API Quota & Financial Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-ruru-navy/5 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-[1rem]">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="font-bold text-ruru-navy tracking-tight">AI API Daily Limit Health</h3>
                <p className="text-sm text-gray-500 font-medium">Daily AI execution limits across all features.</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between w-full text-xs font-bold uppercase tracking-wider mb-2">
              <span className="text-indigo-600">Used: {metrics.aiUsage.creditsUsed}</span>
              <span className="text-gray-400">Cap: {MAX_DAILY_CREDITS}</span>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${metrics.aiUsage.creditsUsed >= MAX_DAILY_CREDITS ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${(metrics.aiUsage.creditsUsed / MAX_DAILY_CREDITS) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-ruru-navy p-6 rounded-[2rem] shadow-sm border border-ruru-navy/5 flex flex-col justify-between text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-[1rem]">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="font-bold tracking-tight text-white">Financial Estimator</h3>
                <p className="text-sm text-gray-400 font-medium">Estimated AI costs vs Base Revenue</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Daily AI Cost</p>
              <p className="text-xl font-black">${metrics.dailyApiCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Est. Monthly Cost</p>
              <p className="text-xl font-black">${metrics.estimatedMonthlyApiCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Est. Revenue</p>
              <p className="text-xl font-black text-emerald-400">${metrics.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-ruru-navy/5">
          <h3 className="text-lg font-bold text-ruru-navy mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-ruru-blue" />
            Weekly Activity Trends
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#F59E0B' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ fontWeight: 600 }}
                  formatter={(value: number, name: string) => name === 'API Cost' ? `$${value.toFixed(2)}` : value}
                />
                <Area yAxisId="left" type="monotone" dataKey="logins" stroke="#1D4ED8" strokeWidth={3} fillOpacity={1} fill="url(#colorLogins)" name="User Logins" />
                <Area yAxisId="left" type="monotone" dataKey="aiQueries" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorAi)" name="AI Queries" />
                <Area yAxisId="right" type="monotone" dataKey="apiCost" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" name="API Cost" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Demographics Pie Chart */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-ruru-navy/5 flex flex-col">
          <h3 className="text-lg font-bold text-ruru-navy mb-6 flex items-center gap-2">
            <Users size={20} className="text-violet-500" />
            User Roles Breakdown
          </h3>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {metrics.roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-ruru-navy">{metrics.totalUsers}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {metrics.roleData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-medium text-gray-700">{entry.name}</span>
                </div>
                <span className="font-bold text-ruru-navy">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pet Demographics Pie Chart */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-ruru-navy/5 flex flex-col">
          <h3 className="text-lg font-bold text-ruru-navy mb-6 flex items-center gap-2">
            <FileText size={20} className="text-orange-500" />
            Patient Species
          </h3>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.petTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {metrics.petTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-ruru-navy">{metrics.petTypeData.reduce((acc, curr) => acc + curr.value, 0)}</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {metrics.petTypeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }} />
                  <span className="font-medium text-gray-700">{entry.name}</span>
                </div>
                <span className="font-bold text-ruru-navy">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gradient-to-br from-ruru-navy to-slate-800 p-6 rounded-[2rem] shadow-sm text-white flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Calendar size={20} className="text-ruru-teal" />
              Appointment Health
            </h3>
            <p className="text-sm text-white/70 mb-6">Metrics covering booking completion and cancellation rates across the platform.</p>
            
            <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                   <span className="text-green-400">Completed</span>
                   <span className="text-white">{metrics.completedAppointments}</span>
                 </div>
                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-green-400 rounded-full" style={{ width: `${(metrics.completedAppointments / (metrics.totalAppointments || 1)) * 100}%` }} />
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1">
                   <span className="text-red-400">Cancelled</span>
                   <span className="text-white">{metrics.cancelledAppointments}</span>
                 </div>
                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-red-400 rounded-full" style={{ width: `${(metrics.cancelledAppointments / (metrics.totalAppointments || 1)) * 100}%` }} />
                 </div>
               </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-white/50 leading-relaxed">
              * High cancellation rates may indicate UI friction or provider scheduling mismatches. Consider reviewing the provider onboarding flow.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-ruru-navy/5">
          <h3 className="text-lg font-bold text-ruru-navy mb-6 flex items-center gap-2">
            <MessageSquare size={20} className="text-ruru-blue" />
            Live App Usage Logs
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {[
              { id: 'log-1', action: "User 'Dr. Simmons' updated clinic hours.", time: "2 mins ago", type: "info" },
              { id: 'log-2', action: "AI Query: 'Can dogs eat grapes?' flagged as urgent.", time: "15 mins ago", type: "alert" },
              ...posts.slice(0, 3).map(p => ({ id: p.id, action: `Community post by ${p.author.split(' ')[0]}: "${p.content.substring(0, 35)}..."`, time: new Date(p.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), type: 'success' })),
              { id: 'log-3', action: "New Pet Owner 'Sarah T.' registered.", time: "45 mins ago", type: "success" },
              ...healthRecords.slice(0, 2).map(r => ({ id: r.id, action: `Health record added for pet. Type: ${r.type}`, time: new Date(r.date).toLocaleDateString(), type: 'info' })),
              { id: 'log-4', action: "Failed Payment Webhook received.", time: "1 hr ago", type: "error" },
              { id: 'log-5', action: "Government License sync completed.", time: "2 hrs ago", type: "success" },
            ].map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    log.type === 'alert' ? 'bg-orange-500' :
                    log.type === 'error' ? 'bg-red-500' :
                    log.type === 'success' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="text-sm font-medium text-ruru-navy truncate max-w-[200px] md:max-w-md">{log.action}</span>
                </div>
                <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-2">{log.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-bold text-ruru-blue hover:text-blue-800 transition-colors border-t border-ruru-navy/5 pt-4">
            View All System Logs &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
