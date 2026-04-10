import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Video } from '../../types/database';
import { formatViews, formatRelativeTime } from '../../utils/helpers';
import { Trash2, ArrowLeft } from 'lucide-react';

interface VideoManagementProps {
  onBack: () => void;
}

export function VideoManagement({ onBack }: VideoManagementProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
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
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await api.delete(`/api/videos/${videoId}`);
      setVideos(videos.filter((v) => v.id !== videoId));
      alert('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold">Video Management</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left">Video</th>
                <th className="px-6 py-3 text-left">Views</th>
                <th className="px-6 py-3 text-left">Uploaded</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={video.thumbnail_url || '/placeholder.jpg'}
                        alt={video.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold">{video.title}</p>
                        <p className="text-sm text-gray-400 line-clamp-1">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{formatViews(video.views)}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {formatRelativeTime(video.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
