import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Upload, 
  Flag, 
  MessageCircle, 
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onNavigate: (section: any) => void;
  onBack: () => void;
}

export function AdminLayout({ children, activeSection, onNavigate, onBack }: AdminLayoutProps) {
  const { signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans selection:bg-red-500/30">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800 flex flex-col sticky top-0 h-screen transition-all duration-300">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-700 rounded-xl shadow-lg shadow-red-900/20 flex items-center justify-center transform hover:rotate-6 transition-transform">
            <span className="font-bold text-white text-xl italic uppercase">VR</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white leading-tight">
              Viral Raja
            </span>
            <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">
              Admin Suite
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                activeSection === item.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {activeSection === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50" />
              )}
              <item.icon className={`w-5 h-5 transition-all duration-300 ${
                activeSection === item.id 
                  ? 'text-white scale-110' 
                  : 'text-gray-500 group-hover:text-red-400 group-hover:scale-110'
              }`} />
              <span className="font-medium relative z-10">{item.label}</span>
              {activeSection === item.id && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-l-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2 bg-gray-900/20 backdrop-blur-md">
          <button
            onClick={onBack}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium text-sm">Return to Site</span>
          </button>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Agent Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Visual Decoration Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/15 blur-[100px] rounded-full pointer-events-none select-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none select-none" />
        
        <div className="flex-1 overflow-y-auto px-8 py-8 relative z-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
