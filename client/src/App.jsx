import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import PYQs from './pages/PYQs';
import AIKuttan from './pages/AIKuttan';
import MachanCorner from './pages/MachanCorner';
import SmartSearch from './pages/SmartSearch';
import FrequentQuestions from './pages/FrequentQuestions';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E4DDD3' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full" />
          <p className="font-grotesk text-primary text-action">Loading StuNet...</p>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Protected - within Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/:id" element={<Notes />} />
              <Route path="/pyqs" element={<PYQs />} />
              <Route path="/ai-kuttan" element={<AIKuttan />} />
              <Route path="/machan-corner" element={<MachanCorner />} />
              <Route path="/search" element={<SmartSearch />} />
              <Route path="/frequent-questions" element={<FrequentQuestions />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}
