import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Video, Comment } from '../types/database';
import { formatViews, formatRelativeTime, getClientIP } from '../utils/helpers';
import { ThumbsUp, MessageCircle, Flag, Send, Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface VideoPlayerPageProps {
  videoId: string;
  onBack: () => void;
}

export function VideoPlayerPage({ videoId, onBack }: VideoPlayerPageProps) {
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchVideoData = useCallback(async () => {
    try {
      const [videoData, commentsData] = await Promise.all([
        api.get(`/api/videos/${videoId}`),
        api.get(`/api/videos/${videoId}/comments`),
      ]);

      if (videoData) {
        setVideo(videoData);
        const likesData = await api.get(`/api/videos/${videoId}/likes`);
        if (likesData) {
          setLikeCount(likesData.length);
          const userIP = await getClientIP();
          setHasLiked(likesData.some((like: any) => 
            (user && like.user_id === user.uid) || like.ip_address === userIP
          ));
        }

        if (user) {
          const saves = await api.get('/api/user/saves', true);
          setIsSaved(saves.some((s: any) => s.id === videoId));
          
          // Record history
          await api.post('/api/user/history', { video_id: videoId }, true);
        }
      }
      if (commentsData) setComments(commentsData);
    } catch (error) {
      console.error('Error fetching video data:', error);
    } finally {
      setLoading(false);
    }
  }, [videoId, user]);

  const incrementViews = useCallback(async () => {
    try {
      await api.post(`/api/videos/${videoId}/view`, {});
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }, [videoId]);

  useEffect(() => {
    fetchVideoData();
    incrementViews();
  }, [fetchVideoData, incrementViews]);

  async function handleLike() {
    if (hasLiked) return;

    try {
      const userIP = await getClientIP();
      await api.post('/api/likes', {
        video_id: videoId,
        ip_address: userIP,
      }, !!user);

      setLikeCount(prev => prev + 1);
      setHasLiked(true);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  }

  async function handleSave() {
    if (!user) {
      alert('Please sign in to save videos');
      return;
    }

    try {
      if (isSaved) {
        await api.delete(`/api/user/saves/${videoId}`);
        setIsSaved(false);
      } else {
        await api.post('/api/user/saves', { video_id: videoId }, true);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving video:', error);
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !commenterName.trim()) return;

    try {
      const data = await api.post('/api/comments', {
        video_id: videoId,
        commenter_name: commenterName,
        content: newComment,
      });

      if (data) {
        setComments(prev => [data, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  }

  async function handleReport(e: React.FormEvent) {
    e.preventDefault();
    if (!reportDescription.trim()) return;

    try {
      await api.post('/api/reports', {
        video_id: videoId,
        description: reportDescription,
        reporter_email: reportEmail,
      });

      alert('Report submitted successfully. Thank you for helping us maintain our community standards.');
      setShowReport(false);
      setReportDescription('');
      setReportEmail('');
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Video not found</h2>
          <button
            onClick={onBack}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="mb-4 text-gray-400 hover:text-white transition"
        >
          ← Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden aspect-video mb-4">
              <video
                src={video.video_url}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>

            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">{formatViews(video.views)} views • {formatRelativeTime(video.created_at)}</span>
              <div className="flex space-x-4">
                <button
                  onClick={handleLike}
                  disabled={hasLiked}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    hasLiked
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>{likeCount}</span>
                </button>
                <button
                  onClick={handleSave}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    isSaved
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={() => setShowReport(true)}
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
                >
                  <Flag className="w-5 h-5" />
                  <span>Report</span>
                </button>
              </div>
            </div>

            {video.description && (
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <p className="text-gray-300">{video.description}</p>
              </div>
            )}

            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Comments ({comments.length})</span>
              </h3>

              <form onSubmit={handleComment} className="mb-6">
                <input
                  type="text"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition flex items-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{comment.commenter_name}</span>
                      <span className="text-sm text-gray-400">
                        {formatRelativeTime(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Report Video</h3>
            <form onSubmit={handleReport}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Video Title</label>
                <input
                  type="text"
                  value={video.title}
                  disabled
                  className="w-full bg-gray-800 text-gray-400 px-4 py-2 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Please describe the issue..."
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-32"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Your Email (optional)</label>
                <input
                  type="email"
                  value={reportEmail}
                  onChange={(e) => setReportEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  Submit Report
                </button>
                <button
                  type="button"
                  onClick={() => setShowReport(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
