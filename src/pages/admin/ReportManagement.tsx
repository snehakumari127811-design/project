import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Report } from '../../types/database';
import { formatRelativeTime } from '../../utils/helpers';
import { Check, X, Eye, ShieldAlert, History } from 'lucide-react';

interface ReportManagementProps {
  onBack: () => void;
}

export function ReportManagement({ onBack }: ReportManagementProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const data = await api.get('/api/admin/reports', true);
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateReportStatus(reportId: string, status: Report['status']) {
    try {
      await api.post(`/api/admin/reports/${reportId}/status`, { status }, true);
      setReports(
        reports.map((r) =>
          r.id === reportId ? { ...r, status: status as Report['status'] } : r
        )
      );
    } catch (error) {
      console.error('Error updating report:', error);
    }
  }

  const pendingReports = reports.filter((r) => r.status === 'pending');
  const reviewedReports = reports.filter((r) => r.status !== 'pending');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Signal Resolution</h1>
          <p className="text-gray-400 font-medium">Resolve user reports and uphold community trust.</p>
        </div>
        <div className="flex items-center space-x-3 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-2 shadow-xl">
          <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <span className="text-amber-500 font-black text-sm">{pendingReports.length} Active Signals</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-gray-400 uppercase tracking-[0.3em] flex items-center space-x-3">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>Active Feed</span>
          </h2>
          
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <div key={report.id} className="group relative bg-gray-900/30 backdrop-blur-md border border-gray-800 rounded-[2rem] p-8 transition-all duration-500 hover:bg-gray-800/40 hover:border-amber-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 bg-gray-800 text-[10px] font-black text-gray-400 rounded-lg uppercase tracking-tight border border-gray-700">
                        ASSET ID: {report.video_id.slice(0, 12)}...
                      </span>
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/5 px-2 py-1 rounded-lg border border-amber-500/10">{formatRelativeTime(report.created_at)}</span>
                    </div>
                    <div className="relative pl-6 border-l-2 border-amber-500/20">
                      <p className="text-white font-bold text-xl leading-snug group-hover:text-amber-400 transition-colors">{report.description}</p>
                    </div>
                    {report.reporter_email && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500 pt-2 font-medium">
                        <span className="font-bold flex items-center">
                          <div className="w-1 h-1 bg-gray-600 rounded-full mr-2" />
                          SIGNAL SOURCE:
                        </span>
                        <span className="text-gray-300 bg-gray-800/80 px-3 py-1 rounded-full border border-white/5">{report.reporter_email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex xl:flex-col space-x-3 xl:space-x-0 xl:space-y-3 shrink-0">
                    <button
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                      className="w-14 h-14 flex items-center justify-center bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-900/20 hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-emerald-500/40 group/btn"
                      title="Resolve Signal"
                    >
                      <Check className="w-7 h-7 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, 'reviewed')}
                      className="w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-900/20 hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-blue-500/40 group/btn"
                      title="Confirm Review"
                    >
                      <Eye className="w-7 h-7 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, 'ignored')}
                      className="w-14 h-14 flex items-center justify-center bg-gray-800 text-gray-400 rounded-2xl border border-gray-700 hover:bg-gray-700 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
                      title="Discard Signal"
                    >
                      <X className="w-7 h-7 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {pendingReports.length === 0 && !loading && (
              <div className="bg-emerald-500/[0.03] border-2 border-dashed border-emerald-500/20 rounded-[2.5rem] p-20 text-center space-y-6">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-full animate-pulse" />
                  <div className="relative w-24 h-24 bg-gray-900 border-2 border-emerald-500/30 rounded-full flex items-center justify-center shadow-2xl">
                    <Check className="w-12 h-12 text-emerald-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">Perimeter Secure</h3>
                  <p className="text-gray-500 text-sm font-medium max-w-xs mx-auto leading-relaxed">System scan complete. No active signals requiring intervention at this timestamp.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History/Archive Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-400 uppercase tracking-[0.3em] flex items-center space-x-3">
            <History className="w-5 h-5 text-gray-600" />
            <span>Entry Archive</span>
          </h2>
          
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-3 custom-scrollbar">
            {reviewedReports.slice(0, 40).map((report) => (
              <div key={report.id} className="bg-gray-900/20 border border-gray-800/40 rounded-3xl p-5 transition-all duration-300 hover:bg-gray-800/30 group">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                    report.status === 'resolved' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' :
                    report.status === 'ignored' ? 'bg-gray-500/5 text-gray-500 border-gray-500/20' :
                    'bg-blue-500/5 text-blue-500 border-blue-500/20'
                  }`}>
                    {report.status}
                  </span>
                  <span className="text-[11px] font-bold text-gray-700 group-hover:text-gray-500 transition-colors tracking-tighter">{formatRelativeTime(report.created_at)}</span>
                </div>
                <p className="text-sm font-semibold text-gray-400 line-clamp-2 italic leading-relaxed mb-3 group-hover:text-gray-300 transition-colors">
                  "{report.description}"
                </p>
                <div className="pt-3 border-t border-gray-800 text-[10px] font-black text-gray-700 uppercase tracking-[0.25em] flex items-center justify-between">
                  <span>LOG ID: {report.id.slice(0, 8)}</span>
                  <ShieldAlert className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
            {reviewedReports.length === 0 && !loading && (
              <div className="py-20 text-center space-y-3 opacity-30">
                <History className="w-10 h-10 text-gray-600 mx-auto" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-600">Archive Null</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
