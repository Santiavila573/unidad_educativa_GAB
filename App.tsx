import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import InstitutionalPage from './pages/InstitutionalPage';
import AcademicOfferPage from './pages/AcademicOfferPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RepositoryPage from './pages/RepositoryPage';
import AuditPage from './pages/AuditPage';
import AdminHub from './pages/AdminHub';
import GalleryPage from './pages/GalleryPage';
import { useAuth } from './services/authContext';
import SessionTimeout from './components/SessionTimeout';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Route Transition Handler Component
const AppContent: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== previousPath) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPreviousPath(location.pathname);
      }, 400); // 400ms transition

      return () => clearTimeout(timer);
    }
  }, [location.pathname, previousPath]);

  if (isLoading) {
    // PageLoading is not defined in this file. Provide a fallback UI instead.
    return <div>Cargando página...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/institucional" element={<InstitutionalPage />} />
      <Route path="/oferta" element={<AcademicOfferPage />} />
      <Route path="/noticias" element={<NewsPage />} />
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="/galeria" element={<GalleryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/repositorio"
        element={
          <ProtectedRoute>
            <RepositoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/auditoria"
        element={
          <ProtectedRoute>
            <AuditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminHub />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app load
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <div>Cargando aplicación...</div>;
  }

  return (
    <HashRouter>
      <SessionTimeout />
      <Layout>
        <AppContent />
      </Layout>
    </HashRouter>
  );
};

export default App;