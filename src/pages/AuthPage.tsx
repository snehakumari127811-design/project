import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ChevronRight, Play } from 'lucide-react';

interface AuthPageProps {
  onSuccess: () => void;
}

export function AuthPage({ onSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* Left Side - Visual/Branding (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 bg-gray-900/40 backdrop-blur-sm border-r border-white/5 flex-col justify-center px-20">
        <div className="space-y-8 max-w-lg">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-900/30">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">VIRAL RAJA</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-white leading-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-700">Digital Experience</span>
            </h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">
              Join the elite circle of streamers and curators. Access premium content, engage with the community, and manage your media vault with unparalleled fluidty.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-10">
            {[
              { label: 'Cloud Storage', value: 'Unlimited' },
              { label: 'Stream Quality', value: '4K Native' },
              { label: 'Admin Tools', value: 'Advanced' },
              { label: 'Analytics', value: 'Real-time' }
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-gray-800/50 border border-white/5 rounded-2xl">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-black text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-10 duration-700">
          <div className="text-center lg:text-left">
            <h3 className="text-3xl font-black text-white tracking-tight mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-gray-400 font-medium">
              {isLogin ? 'Enter your credentials to access your terminal.' : 'Register for a new platform identity.'}
            </p>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Email Identity</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@agency.com"
                      className="w-full bg-gray-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Security Cipher</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl flex items-center space-x-3 animate-in shake duration-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-bold leading-tight">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-red-900/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3 group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Initialize Session' : 'Register Identity'}</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                {isLogin ? "New to Viral Raja?" : 'Already registered?'}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-red-500 hover:text-red-400 transition-colors underline underline-offset-4"
                >
                  {isLogin ? 'Request Access' : 'Sign In Instead'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
