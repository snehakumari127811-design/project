import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Comment } from '../../types/database';
import { formatRelativeTime } from '../../utils/helpers';
import { Trash2, Ban, ShieldCheck, MessageSquare, ShieldAlert } from 'lucide-react';


export function CommentModeration() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'hidden'>('all');

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    try {
      const data = await api.get('/api/admin/comments', true);
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (!confirm('Permanently delete this comment? This action cannot be undone.')) return;

    try {
      await api.delete(`/api/admin/comments/${commentId}`);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  async function handleModerate(commentId: string) {
    try {
      await api.post(`/api/admin/comments/${commentId}/moderate`, {}, true);
      setComments(
        comments.map((c) => (c.id === commentId ? { ...c, is_moderated: true } : c))
      );
    } catch (error) {
      console.error('Error moderating comment:', error);
    }
  }

  const filteredComments = comments.filter(c => {
    if (filter === 'hidden') return c.is_moderated;
    if (filter === 'flagged') return !c.is_moderated;
    return true;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Social Moderation</h1>
          <p className="text-gray-400 font-medium">Govern the discourse and maintain platform health.</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-2 shadow-xl">
          {(['all', 'flagged', 'hidden'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                filter === f 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 translate-y-[-1px]' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className={`group relative bg-gray-900/30 backdrop-blur-md border rounded-[2.5rem] p-8 transition-all duration-500 hover:bg-gray-800/40 ${
              comment.is_moderated 
                ? 'border-red-900/20 grayscale-[0.6]' 
                : 'border-gray-800 hover:border-gray-700 shadow-[0_15px_30px_rgba(0,0,0,0.2)]'
            }`}
          >
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1 space-y-5">
                <div className="flex items-center space-x-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl transition-transform duration-500 group-hover:scale-110 ${
                    comment.is_moderated ? 'bg-gray-800 text-gray-600 border border-gray-700' : 'bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-700 text-white'
                  }`}>
                    {comment.commenter_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl tracking-tight flex items-center gap-3">
                      {comment.commenter_name}
                      {comment.is_moderated && (
                        <div className="flex items-center space-x-1.5 bg-red-600/10 text-red-500 px-3 py-1 rounded-full border border-red-500/10">
                          <ShieldAlert className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Censored</span>
                        </div>
                      )}
                    </h3>
                    <div className="flex items-center mt-1">
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] flex items-center bg-gray-800/40 px-2 py-0.5 rounded">
                        <MessageSquare className="w-3 h-3 mr-1.5 opacity-50" />
                        {formatRelativeTime(comment.created_at)}
                      </p>
                      <div className="w-1 h-1 bg-gray-800 rounded-full mx-3" />
                      <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest leading-none">
                        ASSET LOG: {comment.video_id.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative pl-8 border-l-2 border-gray-800 group-hover:border-indigo-500/30 transition-all duration-500 py-1">
                  <p className="text-gray-300 text-lg leading-relaxed font-semibold group-hover:text-gray-100 transition-colors italic">
                    "{comment.content}"
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-3 shrink-0 pt-2">
                {!comment.is_moderated ? (
                  <button
                    onClick={() => handleModerate(comment.id)}
                    className="w-14 h-14 flex items-center justify-center bg-amber-500/5 text-amber-500 border border-amber-500/20 rounded-[1.25rem] hover:bg-amber-500 hover:text-white transition-all duration-500 shadow-xl shadow-amber-900/5 group/btn active:scale-95"
                    title="Suppress Comment"
                  >
                    <Ban className="w-7 h-7 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all" />
                  </button>
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center bg-gray-800/80 text-gray-700 rounded-[1.25rem] border border-gray-700 shadow-inner">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                )}
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="w-14 h-14 flex items-center justify-center bg-gray-900/50 text-gray-600 border border-gray-800 rounded-[1.25rem] hover:bg-red-600 hover:text-white hover:border-red-500 transition-all duration-500 group/btn shadow-xl active:scale-95"
                  title="Expunge Record"
                >
                  <Trash2 className="w-7 h-7 group-hover/btn:scale-110 group-hover/btn:-translate-y-0.5 transition-all" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && filteredComments.length === 0 && (
          <div className="text-center py-40 space-y-8 animate-in zoom-in duration-700">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
              <div className="relative w-24 h-24 bg-gray-900 rounded-[2.5rem] border border-gray-800 flex items-center justify-center shadow-2xl">
                <MessageSquare className="w-10 h-10 text-gray-700" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tight">Social Stasis</h3>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.3em]">No discourse flux detected in this sector.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
