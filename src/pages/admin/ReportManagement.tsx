import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Report } from '../../types/database';
import { formatRelativeTime } from '../../utils/helpers';
import { ArrowLeft, Check, X, Eye } from 'lucide-react';

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
          <h1 className="text-2xl font-bold">Report Management</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            Pending Reports ({pendingReports.length})
          </h2>
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <div key={report.id} className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-2">
                      Video ID: {report.video_id}
                    </p>
                    <p className="text-gray-300 mb-2">{report.description}</p>
                    {report.reporter_email && (
                      <p className="text-sm text-gray-400">
                        Reporter: {report.reporter_email}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {formatRelativeTime(report.created_at)}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                      className="bg-green-600 hover:bg-green-700 p-2 rounded transition"
                      title="Resolve"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, 'reviewed')}
                      className="bg-blue-600 hover:bg-blue-700 p-2 rounded transition"
                      title="Mark as Reviewed"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, 'ignored')}
                      className="bg-gray-600 hover:bg-gray-700 p-2 rounded transition"
                      title="Ignore"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingReports.length === 0 && (
              <p className="text-gray-400 text-center py-8">No pending reports</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">
            Reviewed Reports ({reviewedReports.length})
          </h2>
          <div className="space-y-4">
            {reviewedReports.slice(0, 20).map((report) => (
              <div key={report.id} className="bg-gray-900 rounded-lg p-6 opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-2">
                      Video ID: {report.video_id}
                    </p>
                    <p className="text-gray-300 mb-2">{report.description}</p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="capitalize">{report.status}</span> •{' '}
                      {formatRelativeTime(report.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
