import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { DataStoreProvider } from './contexts/DataStoreContext';
import { UIProvider } from './contexts/UIContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import PastEventsPage from './features/events/PastEventsPage';

// Dashboard Module Contexts & Router
import { AuthProvider } from './contexts/AuthContext';
import { AppDataProvider } from './contexts/AppDataContext';
import { ToastProvider } from './components/ui/Toast';
import AppRouter from './app/AppRouter';

function AppContent() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <Routes>
      {/* Public routes with shared layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/past-events" element={<PastEventsPage />} />
      </Route>

      {/* Admin, Trainee, and Auth Routes handled by AppRouter */}
      <Route path="/*" element={<AppRouter />} />
      
      {/* Legacy Route Redirects */}
      <Route path="/submit" element={<Navigate to="/dashboard/trainee/new-submission" replace />} />
      <Route path="/my-submissions" element={<Navigate to="/dashboard/trainee/my-submissions" replace />} />
      <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <UIProvider>
        <DataStoreProvider>
          <AuthProvider>
            <AppDataProvider>
              <ToastProvider>
                <AppContent />
              </ToastProvider>
            </AppDataProvider>
          </AuthProvider>
        </DataStoreProvider>
      </UIProvider>
    </HashRouter>
  );
}