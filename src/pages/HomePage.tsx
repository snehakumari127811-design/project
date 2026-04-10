import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Video } from '../types/database';
import { VideoCard } from '../components/VideoCard';
import { Flame, Shuffle, Clock } from 'lucide-react';

interface HomePageProps {
  onVideoClick: (videoId: string) => void;
  selectedCategory: string | null;
  searchQuery: string;
}

export function HomePage({ onVideoClick, selectedCategory, searchQuery }: HomePageProps) {
  const [latestVideos, setLatestVideos] = useState<Video[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [randomVideos, setRandomVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (searchQuery) params.append('search', searchQuery);

        const data = await api.get(`/api/videos?${params.toString()}`);
        
        if (data) {
          // Sort for latest and trending on client side for now to minimize API complexity
          const latest = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 12);
          const trending = [...data].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 12);
          const random = [...data].sort(() => Math.random() - 0.5).slice(0, 12);

          setLatestVideos(latest);
          setTrendingVideos(trending);
          setRandomVideos(random);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">Latest Videos</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {latestVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => onVideoClick(video.id)}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Flame className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => onVideoClick(video.id)}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Shuffle className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">Recommended For You</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {randomVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => onVideoClick(video.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
