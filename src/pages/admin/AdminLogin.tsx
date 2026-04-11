import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, ArrowRight, Fingerprint } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminSignIn } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminSignIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Access Denied: Invalid System Credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-red-500/30">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      </div>

      <div className="relative w-full max-w-xl z-10 animate-in fade-in zoom-in slide-in-from-bottom-10 duration-1000">
        <div className="bg-gray-900/40 backdrop-blur-3xl border border-gray-800/50 rounded-[3.5rem] p-12 md:p-16 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gray-950 border-2 border-gray-800 rounded-[2rem] mb-8 shadow-2xl relative group transform hover:rotate-3 transition-transform duration-500">
              <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 group-hover:opacity-50 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-50 rounded-[2rem]" />
              <ShieldCheck className="w-14 h-14 text-red-500 relative z-10 transform group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              Terminal Access
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px w-8 bg-gray-800" />
              <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px]">
                Secure Administrative Gateway
              </p>
              <div className="h-px w-8 bg-gray-800" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-8 py-5 rounded-3xl text-sm font-black animate-shake flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-7">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] pl-2">Agent Identifier</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Fingerprint className="h-6 w-6 text-gray-700 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-950/60 text-white pl-16 pr-8 py-5.5 rounded-[1.75rem] border border-gray-800 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 focus:outline-none transition-all font-bold text-lg placeholder:text-gray-800"
                    placeholder="agent@viralraja.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] pl-2">Security Cipher</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6 text-gray-700 group-focus-within:text-red-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-950/60 text-white pl-16 pr-8 py-5.5 rounded-[1.75rem] border border-gray-800 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 focus:outline-none transition-all font-bold text-lg placeholder:text-gray-800"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group h-20 bg-red-600 hover:bg-red-700 text-white rounded-[1.75rem] font-black uppercase tracking-[0.5em] text-lg shadow-[0_20px_40px_rgba(220,38,38,0.2)] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 flex items-center justify-center space-x-4 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10">{loading ? 'Decrypting...' : 'Authorize Access'}</span>
              {!loading && <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform relative z-10" />}
            </button>
          </form>

          <div className="mt-16 text-center">
            <div className="flex items-center justify-center space-x-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">AES-256</span>
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">SSL-SECURE</span>
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">RSA-4096</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
