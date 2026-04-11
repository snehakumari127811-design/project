import { useState } from 'react';
import { api } from '../../lib/api';
import { useCategories } from '../../hooks/useCategories';
import { Upload, FileText, Link as LinkIcon, Clock, Layers, Sparkles } from 'lucide-react';

interface VideoUploadProps {
  onBack: () => void;
}

export function VideoUpload({}: VideoUploadProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { categories } = useCategories();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    try {
      await api.post('/api/videos', {
        title,
        description,
        category_id: categoryId || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        duration,
      }, true);

      setTitle('');
      setDescription('');
      setCategoryId('');
      setVideoUrl('');
      setThumbnailUrl('');
      setDuration(0);
      alert('Video broadcast successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to broadcast video asset');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-red-600/10 rounded-xl">
              <Sparkles className="w-8 h-8 text-red-500" />
            </div>
            Content Injection
          </h1>
          <p className="text-gray-400 font-medium italic">Deploy new media assets to the global streaming grid.</p>
        </div>
      </div>

      <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800 rounded-[3rem] p-10 xl:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden group">
        {/* Background Visual Flare */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/5 blur-[120px] rounded-full -mr-40 -mt-40 group-hover:bg-red-600/10 transition-colors duration-1000 pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
            {/* Left Column: Metadata */}
            <div className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3">
                  <div className="p-1.5 bg-gray-800 rounded-lg">
                    <FileText className="w-4 h-4 text-indigo-400" />
                  </div>
                  Primary Metadata
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Title Target</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-gray-950/50 text-white px-6 py-4.5 rounded-[1.25rem] border border-gray-800 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 focus:outline-none transition-all placeholder:text-gray-800 font-bold text-lg"
                      placeholder="Enter asset title..."
                      required
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Description Brief</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-gray-950/50 text-white px-6 py-4.5 rounded-[1.25rem] border border-gray-800 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 focus:outline-none transition-all h-48 resize-none placeholder:text-gray-800 font-medium leading-relaxed"
                      placeholder="Describe the content payload and narrative..."
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Category Sector</label>
                    <div className="relative group/select">
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full bg-gray-950/50 text-white px-6 py-4.5 rounded-[1.25rem] border border-gray-800 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 focus:outline-none transition-all appearance-none cursor-pointer font-bold tracking-tight"
                      >
                        <option value="" className="bg-gray-900 text-gray-600 italic">Uncategorized Archive</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id} className="bg-gray-900 text-white font-medium">
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <Layers className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-hover/select:text-gray-400 pointer-events-none transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Logistics */}
            <div className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3">
                  <div className="p-1.5 bg-gray-800 rounded-lg">
                    <LinkIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  Asset Logistics
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Video Source Node (URL)</label>
                    <div className="relative">
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full bg-gray-950/50 text-white px-6 py-4.5 rounded-[1.25rem] border border-gray-800 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 focus:outline-none transition-all placeholder:text-gray-800 font-bold"
                        placeholder="https://cdn.example.com/asset.mp4"
                        required
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-20" />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Thumbnail Cover Vector (URL)</label>
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      className="w-full bg-gray-950/50 text-white px-6 py-4.5 rounded-[1.25rem] border border-gray-800 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 focus:outline-none transition-all placeholder:text-gray-800 font-bold"
                      placeholder="https://cdn.example.com/cover.jpg"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Temporal Duration (SEC)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                        className="w-full bg-gray-950/50 text-white px-6 py-4.5 rounded-[1.25rem] border border-gray-800 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-black text-xl tabular-nums tracking-widest"
                        placeholder="0"
                        min="0"
                      />
                      <Clock className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-10">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full relative group h-24 overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-[1.5px] shadow-[0_20px_40px_rgba(225,29,72,0.25)] active:scale-[0.97] transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  <div className="h-full w-full bg-[#0a0a0c]/40 group-hover:bg-transparent transition-colors duration-700 rounded-[calc(1.5rem-1.5px)] flex items-center justify-center space-x-4 text-white font-black uppercase tracking-[0.4em] text-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    {uploading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="italic relative z-10">Broadcasting...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-7 h-7 transform group-hover:-translate-y-1 transition-transform relative z-10" />
                        <span className="relative z-10">Inject Content</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
