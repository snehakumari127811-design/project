import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import {
  Video,
  Flag,
  MessageCircle,
  Upload,
  Eye,
  ThumbsUp,
  TrendingUp,
} from 'lucide-react';

interface Stats {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  pendingReports: number;
}

interface AdminDashboardProps {
  onNavigate: (section: 'videos' | 'reports' | 'comments' | 'upload') => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    pendingReports: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const data = await api.get('/api/admin/stats', true);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  const statCards = [
    { label: 'Total Content', value: stats.totalVideos, icon: Video, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    { label: 'Platform Reach', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    { label: 'User Engagement', value: stats.totalLikes, icon: ThumbsUp, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
    { label: 'Active Reports', value: stats.pendingReports, icon: Flag, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
            System Overview
          </h1>
          <p className="text-gray-400 font-medium">
            Monitor and refine your platform's streaming ecosystem.
          </p>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl px-6 py-4 flex items-center space-x-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400">
                U{i}
              </div>
            ))}
          </div>
          <div className="h-8 w-px bg-gray-800" />
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Operations Global</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div 
            key={idx}
            className={`relative group bg-gray-900/30 backdrop-blur-md border ${card.border} rounded-3xl p-6 transition-all duration-500 hover:bg-gray-800/40 hover:-translate-y-2 hover:shadow-[0_22px_44px_rgba(0,0,0,0.4)]`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-4 rounded-2xl ${card.bg} group-hover:scale-110 transition-transform duration-500`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className="flex flex-col items-end">
                <TrendingUp className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                <span className="text-[10px] font-bold text-emerald-500 mt-1">LATEST</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">{card.label}</span>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-black text-white tabular-nums tracking-tight">{card.value}</p>
                <div className="flex items-center text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <span>+12%</span>
                </div>
              </div>
            </div>
            
            {/* Hover Decor */}
            <div className={`absolute bottom-0 left-6 right-6 h-0.5 ${card.color.replace('text', 'bg')} opacity-0 group-hover:opacity-40 transition-opacity rounded-full`} />
          </div>
        ))}
      </div>

      {/* Action Hub */}
      <div className="space-y-8 pt-4">
        <div className="flex items-center space-x-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
          <h2 className="text-lg font-bold text-gray-400 uppercase tracking-[0.3em]">Operational Hub</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => onNavigate('upload')}
            className="relative group h-60 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-red-600 to-rose-900 p-[1px] shadow-2xl shadow-red-900/10 active:scale-[0.98] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
            <div className="h-full w-full bg-[#0a0a0c] group-hover:bg-transparent transition-colors duration-500 rounded-[2.45rem] p-8 flex flex-col justify-between text-left relative z-10">
              <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Upload className="w-7 h-7 text-red-500 group-hover:text-white transition-colors" />
              </div>
              <div className="transform group-hover:translate-x-2 transition-transform duration-500">
                <h3 className="text-2xl font-black text-white mb-2 leading-none">Content<br />Injection</h3>
                <p className="text-gray-400 text-sm font-medium leading-tight group-hover:text-white/80 transition-colors">Broadcast new video streams to the global catalog.</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('videos')}
            className="relative group h-60 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-900 p-[1px] shadow-2xl shadow-blue-900/10 active:scale-[0.98] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
            <div className="h-full w-full bg-[#0a0a0c] group-hover:bg-transparent transition-colors duration-500 rounded-[2.45rem] p-8 flex flex-col justify-between text-left relative z-10">
              <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                <Video className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors" />
              </div>
              <div className="transform group-hover:translate-x-2 transition-transform duration-500">
                <h3 className="text-2xl font-black text-white mb-2 leading-none">Vault<br />Refinery</h3>
                <p className="text-gray-400 text-sm font-medium leading-tight group-hover:text-white/80 transition-colors">Curate, edit and secure your platform media vault.</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="relative group h-60 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-600 to-orange-900 p-[1px] shadow-2xl shadow-orange-900/10 active:scale-[0.98] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
            <div className="h-full w-full bg-[#0a0a0c] group-hover:bg-transparent transition-colors duration-500 rounded-[2.45rem] p-8 flex flex-col justify-between text-left relative z-10">
              <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative">
                <Flag className="w-7 h-7 text-amber-500 group-hover:text-white transition-colors" />
                {stats.pendingReports > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-[10px] font-black flex items-center justify-center rounded-full animate-bounce shadow-lg shadow-red-900/40">
                    {stats.pendingReports}
                  </span>
                )}
              </div>
              <div className="transform group-hover:translate-x-2 transition-transform duration-500">
                <h3 className="text-2xl font-black text-white mb-2 leading-none">Signal<br />Resolution</h3>
                <p className="text-gray-400 text-sm font-medium leading-tight group-hover:text-white/80 transition-colors">Resolve flags and uphold community safety standards.</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('comments')}
            className="relative group h-60 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-fuchsia-900 p-[1px] shadow-2xl shadow-purple-900/10 active:scale-[0.98] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
            <div className="h-full w-full bg-[#0a0a0c] group-hover:bg-transparent transition-colors duration-500 rounded-[2.45rem] p-8 flex flex-col justify-between text-left relative z-10">
              <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                <MessageCircle className="w-7 h-7 text-purple-500 group-hover:text-white transition-colors" />
              </div>
              <div className="transform group-hover:translate-x-2 transition-transform duration-500">
                <h3 className="text-2xl font-black text-white mb-2 leading-none">Social<br />Moderation</h3>
                <p className="text-gray-400 text-sm font-medium leading-tight group-hover:text-white/80 transition-colors">Control user interactions and manage social discourse.</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
