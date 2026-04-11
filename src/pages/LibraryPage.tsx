import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Video } from '../types/database';
import { formatViews, formatRelativeTime } from '../utils/helpers';
import { History, Bookmark, ThumbsUp, Play } from 'lucide-react';

interface LibraryPageProps {
  onVideoClick: (videoId: string) => void;
}

type Tab = 'history' | 'saves' | 'likes';

export function LibraryPage({ onVideoClick }: LibraryPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('history');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [activeTab]);

  async function fetchVideos() {
    setLoading(true);
    try {
      let data: Video[] = [];
      if (activeTab === 'history') {
        data = await api.get('/api/user/history', true);
      } else if (activeTab === 'saves') {
        data = await api.get('/api/user/saves', true);
      } else if (activeTab === 'likes') {
        data = await api.get('/api/user/likes', true);
      }
      setVideos(data || []);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: 'history', name: 'History', icon: History },
    { id: 'saves', name: 'Saved', icon: Bookmark },
    { id: 'likes', name: 'Liked', icon: ThumbsUp },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center space-x-3">
          <Library className="w-8 h-8 text-red-500" />
          <span>My Library</span>
        </h1>

        <div className="flex space-x-4 mb-8 border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition relative ${
                activeTab === tab.id
                  ? 'text-red-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500" />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={`${activeTab}-${video.id}`}
                onClick={() => onVideoClick(video.id)}
                className="bg-gray-900 rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-red-500 transition shadow-lg"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-red-400 transition mb-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{formatViews(video.views)} views</span>
                    <span>{formatRelativeTime(video.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
            {videos.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full mb-4">
                  {activeTab === 'history' ? <History className="w-10 h-10 text-gray-700" /> : 
                   activeTab === 'saves' ? <Bookmark className="w-10 h-10 text-gray-700" /> :
                   <ThumbsUp className="w-10 h-10 text-gray-700" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">Your {activeTab} is empty</h3>
                <p className="text-gray-500">Go watch some videos and come back!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Missing icon fix
import { Library } from 'lucide-react';
