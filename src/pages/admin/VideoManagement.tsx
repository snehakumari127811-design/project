import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Video } from '../../types/database';
import { formatViews, formatRelativeTime } from '../../utils/helpers';
import { Trash2, ExternalLink, Search, RefreshCw, BarChart2 } from 'lucide-react';

interface VideoManagementProps {
  onBack: () => void;
}

export function VideoManagement({ onBack }: VideoManagementProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    try {
      const data = await api.get('/api/videos');
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(videoId: string) {
    if (!confirm('Are you sure you want to permanently delete this video?')) return;

    try {
      await api.delete(`/api/videos/${videoId}`);
      setVideos(videos.filter((v) => v.id !== videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  }

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Vault Refinery</h1>
          <p className="text-gray-400 font-medium">Manage and monitor your video assets.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search vault..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-900/50 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all w-64 backdrop-blur-md"
            />
          </div>
          <button 
            onClick={fetchVideos}
            className="p-3 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 rounded-xl transition-all active:scale-95"
            title="Refresh Vault"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-gray-900/30 backdrop-blur-md border border-gray-800 rounded-[2rem] overflow-hidden shadow-[0_22px_44px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/30 border-b border-gray-800">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Metadata</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.25em] text-gray-500 text-center">Performance</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.25em] text-gray-500 text-center">Ingestion Date</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.25em] text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
              {filteredVideos.map((video) => (
                <tr key={video.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-6">
                      <div className="relative w-36 aspect-video rounded-2xl overflow-hidden border border-gray-800 group-hover:border-blue-500/40 transition-all duration-500 shadow-lg">
                        <img
                          src={video.thumbnail_url || '/placeholder.jpg'}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500" />
                        </div>
                      </div>
                      <div className="max-w-xs">
                        <h3 className="font-bold text-gray-100 leading-tight mb-1.5 group-hover:text-blue-400 transition-colors text-lg tracking-tight">{video.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 italic font-medium leading-relaxed">{video.description || 'No descriptive metadata provided for this asset.'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-baseline space-x-1">
                        <BarChart2 className="w-4 h-4 text-emerald-400 mr-1 translate-y-0.5" />
                        <span className="text-2xl font-black text-white tabular-nums tracking-tighter">{formatViews(video.views)}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">Platform Views</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm font-black text-gray-200 tracking-tight">{formatRelativeTime(video.created_at)}</span>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">System Entry</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="p-3.5 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all duration-500 hover:shadow-[0_10px_20px_rgba(239,68,68,0.2)] group/btn relative overflow-hidden active:scale-95"
                    >
                      <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform relative z-10" />
                      <div className="absolute inset-0 bg-red-600 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {!loading && filteredVideos.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center space-y-6 animate-pulse">
                      <div className="p-6 bg-gray-800/50 rounded-full border border-gray-700 shadow-2xl">
                        <Search className="w-12 h-12 text-gray-600" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-bold text-gray-400">Target Not Found</p>
                        <p className="text-gray-600 text-sm max-w-xs mx-auto font-medium">No video assets match your current search query. Try broadening your parameters.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
