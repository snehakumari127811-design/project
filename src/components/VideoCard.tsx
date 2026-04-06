import { Video } from '../types/database';
import { formatDuration, formatViews, formatRelativeTime } from '../utils/helpers';
import { Play } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-xl group"
    >
      <div className="relative aspect-video bg-gray-700">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-16 h-16 text-gray-600" />
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs font-semibold">
          {formatDuration(video.duration)}
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
          <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition" />
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
          {video.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{formatViews(video.views)} views</span>
          <span>{formatRelativeTime(video.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
