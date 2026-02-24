import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import SubmitIdea from './pages/SubmitIdea';
import MySubmissions from './pages/MySubmissions';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOpportunities from './pages/admin/AdminOpportunities';
import AdminEvents from './pages/admin/AdminEvents';
import AdminSubmissions from './pages/admin/AdminSubmissions';

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
        <Route path="/submit" element={<SubmitIdea />} />
        <Route path="/my-submissions" element={<MySubmissions />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin routes with admin layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="opportunities" element={<AdminOpportunities />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="submissions" element={<AdminSubmissions />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <DataStoreProvider>
          <AppContent />
        </DataStoreProvider>
      </UIProvider>
    </BrowserRouter>
  );
}