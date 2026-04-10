import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  Video,
  Flag,
  MessageCircle,
  Upload,
  LogOut,
  Eye,
  ThumbsUp,
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
  const { signOut } = useAuth();

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BarChart3 className="w-8 h-8 text-red-500" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Videos</span>
              <Video className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{stats.totalVideos}</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Views</span>
              <Eye className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Likes</span>
              <ThumbsUp className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold">{stats.totalLikes}</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Pending Reports</span>
              <Flag className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">{stats.pendingReports}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('upload')}
            className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 p-6 rounded-lg transition transform hover:scale-105"
          >
            <Upload className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg">Upload Video</h3>
            <p className="text-sm text-red-100 mt-2">Add new content</p>
          </button>

          <button
            onClick={() => onNavigate('videos')}
            className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-6 rounded-lg transition transform hover:scale-105"
          >
            <Video className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg">Manage Videos</h3>
            <p className="text-sm text-blue-100 mt-2">Edit or delete videos</p>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="bg-gradient-to-br from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 p-6 rounded-lg transition transform hover:scale-105"
          >
            <Flag className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg">Review Reports</h3>
            <p className="text-sm text-yellow-100 mt-2">{stats.pendingReports} pending</p>
          </button>

          <button
            onClick={() => onNavigate('comments')}
            className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 p-6 rounded-lg transition transform hover:scale-105"
          >
            <MessageCircle className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg">Moderate Comments</h3>
            <p className="text-sm text-purple-100 mt-2">Manage user comments</p>
          </button>
        </div>
      </div>
    </div>
  );
}
