import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  ScrollRestoration,
  Navigate,
  useLocation,
} from 'react-router-dom';
// Public Pages
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import Subsidiaries from './pages/Subsidiaries';
import Services from './pages/Services';
import Sustainability from './pages/Sustainability';
import Governance from './pages/Governance';
import Projects from './pages/Projects';
import Gallery from './pages/Gallery';
import StoneCrestResource from './pages/StoneCrestResource';
import StoneCrestMining from './pages/StoneCrestMining';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import History from './pages/History';
import OurTeam from './pages/OurTeam';
import Contact from './pages/Contact';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { initAnalyticsTracker } from './lib/analyticsTracker';

// New SEO Services Pages & Blog
import EnvironmentalImpactAssessment from './pages/EnvironmentalImpactAssessment';
import MiningGeologicalServices from './pages/MiningGeologicalServices';
import GeotechnicalEngineering from './pages/GeotechnicalEngineering';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Careers from './pages/Careers';
import Present from './pages/Present';
import FAQPage from './pages/FAQ';
import StaffPortal from './pages/StaffPortal';
import MiningLicensesPage from './pages/MiningLicensesPage';

// Admin panel — lazy loaded (heavy, only used by admins)
const CareersAdmin = React.lazy(() => import('./pages/CareersAdmin'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    // Track every page navigation
    initAnalyticsTracker();
  }, [pathname]);

  return null;
};

const Website: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <PWAInstallPrompt />
      <Routes>
        <Route
          path="/admin/careers"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-['Outfit',sans-serif]">
                  Loading Admin Portal…
                </div>
              }
            >
              <CareersAdmin />
            </Suspense>
          }
        />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/subsidiaries" element={<Subsidiaries />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/projects-services" element={<Projects />} />
          <Route
            path="/services/environmental-impact-assessment"
            element={<EnvironmentalImpactAssessment />}
          />
          <Route
            path="/services/mining-geological"
            element={<MiningGeologicalServices />}
          />
          <Route
            path="/services/geotechnical-engineering"
            element={<GeotechnicalEngineering />}
          />
          <Route
            path="/services/mining-licenses"
            element={<MiningLicensesPage />}
          />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/careers" element={<Careers />} />
          <Route
            path="/vacancies"
            element={<Navigate to="/careers" replace />}
          />
          <Route
            path="/subsidiaries/stonecrest-resource"
            element={<StoneCrestResource />}
          />
          <Route
            path="/subsidiaries/stonecrest-mining"
            element={<StoneCrestMining />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/history" element={<History />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/present" element={<Present />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/faqs" element={<Navigate to="/faq" replace />} />
          <Route
            path="/knowledge-hub"
            element={<Navigate to="/faq" replace />}
          />
          <Route path="/aeo" element={<Navigate to="/faq" replace />} />
          <Route path="/staff-portal" element={<StaffPortal />} />
          <Route
            path="/webmail"
            element={<Navigate to="/staff-portal" replace />}
          />
          <Route
            path="/mail"
            element={<Navigate to="/staff-portal" replace />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default Website;
