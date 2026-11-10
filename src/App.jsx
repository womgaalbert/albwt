import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { LanguageProvider } from '@/lib/LanguageContext';
import { AuthProvider } from '@/lib/AuthContext';
import { trackPageView } from '@/lib/analytics';
import { lazy, Suspense, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';

const BlogPost = lazy(() => import('./pages/BlogPost'));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div role="status" aria-label="Loading / Chargement" className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
  </div>
);

// A new route starts at the top unless the link targets an anchor.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// GA4 page_view on every SPA route change.
function PageViewTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}><Suspense fallback={<PageFallback />}>{children}</Suspense></Layout>
  : <Suspense fallback={<PageFallback />}>{children}</Suspense>;

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <PageViewTracker />
          <MotionConfig reducedMotion="user">
          <Routes>
            <Route path="/" element={
              <LayoutWrapper currentPageName={mainPageKey}>
                <MainPage />
              </LayoutWrapper>
            } />
            {Object.entries(Pages).map(([path, Page]) => (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  <LayoutWrapper currentPageName={path}>
                    <Page />
                  </LayoutWrapper>
                }
              />
            ))}
            {Object.entries(Pages).map(([path, Page]) => (
              <Route
                key={`lower-${path}`}
                path={`/${path.toLowerCase()}`}
                element={
                  <LayoutWrapper currentPageName={path}>
                    <Page />
                  </LayoutWrapper>
                }
              />
            ))}
            <Route path="/blog/:slug" element={<LayoutWrapper currentPageName="Blog"><BlogPost /></LayoutWrapper>} />
            <Route path="/BlogPost" element={<LayoutWrapper currentPageName="Blog"><BlogPost /></LayoutWrapper>} />
            <Route path="/blogpost" element={<LayoutWrapper currentPageName="Blog"><BlogPost /></LayoutWrapper>} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          </MotionConfig>
          <Toaster />
          <SonnerToaster position="top-center" />
        </Router>
      </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
