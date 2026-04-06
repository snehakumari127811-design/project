import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Comment } from '../../types/database';
import { formatRelativeTime } from '../../utils/helpers';
import { ArrowLeft, Trash2, Ban } from 'lucide-react';

interface CommentModerationProps {
  onBack: () => void;
}

export function CommentModeration({ onBack }: CommentModerationProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);

      if (error) throw error;
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  async function handleModerate(commentId: string) {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_moderated: true })
        .eq('id', commentId);

      if (error) throw error;
      setComments(
        comments.map((c) => (c.id === commentId ? { ...c, is_moderated: true } : c))
      );
    } catch (error) {
      console.error('Error moderating comment:', error);
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
          <h1 className="text-2xl font-bold">Comment Moderation</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-gray-900 rounded-lg p-6 ${
                comment.is_moderated ? 'opacity-50 border border-red-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold">{comment.commenter_name}</span>
                    {comment.is_moderated && (
                      <span className="text-xs bg-red-600 px-2 py-1 rounded">
                        HIDDEN
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 mb-2">{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    Video ID: {comment.video_id} • {formatRelativeTime(comment.created_at)}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  {!comment.is_moderated && (
                    <button
                      onClick={() => handleModerate(comment.id)}
                      className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded transition"
                      title="Hide comment"
                    >
                      <Ban className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="bg-red-600 hover:bg-red-700 p-2 rounded transition"
                    title="Delete comment"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-gray-400 text-center py-8">No comments to moderate</p>
          )}
        </div>
      </div>
    </div>
  );
}
