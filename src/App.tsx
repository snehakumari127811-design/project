import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { VideoPlayerPage } from './pages/VideoPlayerPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { VideoManagement } from './pages/admin/VideoManagement';
import { ReportManagement } from './pages/admin/ReportManagement';
import { CommentModeration } from './pages/admin/CommentModeration';
import { VideoUpload } from './pages/admin/VideoUpload';

type Page = 'home' | 'video' | 'admin';
type AdminSection = 'dashboard' | 'videos' | 'reports' | 'comments' | 'upload';

function AgeDisclaimer({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Age Verification</h2>
        <p className="text-gray-300 mb-6">
          This website contains content intended for adults only. You must be 18 years or
          older to access this site.
        </p>
        <div className="space-y-3">
          <button
            onClick={onAccept}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
          >
            I am 18 or older - Enter
          </button>
          <button
            onClick={() => window.location.href = 'https://www.google.com'}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
          >
            I am under 18 - Exit
          </button>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');
  const [ageVerified, setAgeVerified] = useState(false);
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    const verified = localStorage.getItem('ageVerified');
    if (verified === 'true') {
      setAgeVerified(true);
    }
  }, []);

  function handleAgeAccept() {
    localStorage.setItem('ageVerified', 'true');
    setAgeVerified(true);
  }

  function handleVideoClick(videoId: string) {
    setSelectedVideoId(videoId);
    setCurrentPage('video');
  }

  function handleBackToHome() {
    setCurrentPage('home');
    setSelectedVideoId(null);
  }

  function handleCategorySelect(categoryId: string | null) {
    setSelectedCategory(categoryId);
    setSearchQuery('');
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    setSelectedCategory(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!ageVerified && currentPage !== 'admin') {
    return <AgeDisclaimer onAccept={handleAgeAccept} />;
  }

  if (currentPage === 'admin') {
    if (!isAdmin) {
      return <AdminLogin />;
    }

    switch (adminSection) {
      case 'videos':
        return <VideoManagement onBack={() => setAdminSection('dashboard')} />;
      case 'reports':
        return <ReportManagement onBack={() => setAdminSection('dashboard')} />;
      case 'comments':
        return <CommentModeration onBack={() => setAdminSection('dashboard')} />;
      case 'upload':
        return <VideoUpload onBack={() => setAdminSection('dashboard')} />;
      default:
        return <AdminDashboard onNavigate={setAdminSection} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {currentPage !== 'video' && (
        <Header
          onSearch={handleSearch}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
      )}

      {currentPage === 'home' && (
        <HomePage
          onVideoClick={handleVideoClick}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
      )}

      {currentPage === 'video' && selectedVideoId && (
        <VideoPlayerPage videoId={selectedVideoId} onBack={handleBackToHome} />
      )}

      {currentPage !== 'video' && <Footer />}

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCurrentPage('admin');
        }}
        className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-3 py-2 rounded-lg text-xs transition opacity-50 hover:opacity-100"
      >
        Admin
      </a>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
