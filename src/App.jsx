import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { LanguageProvider } from '@/lib/LanguageContext';
import { AuthProvider } from '@/lib/AuthContext';
import { lazy, Suspense } from 'react';

const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Sandbox = lazy(() => import('./pages/Sandbox'));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div role="status" aria-label="Loading / Chargement" className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
  </div>
);

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
            <Route path="/Blog" element={<LayoutWrapper currentPageName="Blog"><Blog /></LayoutWrapper>} />
            <Route path="/blog" element={<LayoutWrapper currentPageName="Blog"><Blog /></LayoutWrapper>} />
            <Route path="/BlogPost" element={<LayoutWrapper currentPageName="Blog"><BlogPost /></LayoutWrapper>} />
            <Route path="/blogpost" element={<LayoutWrapper currentPageName="Blog"><BlogPost /></LayoutWrapper>} />
            <Route path="/Sandbox" element={<LayoutWrapper currentPageName="Sandbox"><Sandbox /></LayoutWrapper>} />
            <Route path="/sandbox" element={<LayoutWrapper currentPageName="Sandbox"><Sandbox /></LayoutWrapper>} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster />
          <SonnerToaster position="bottom-right" />
        </Router>
      </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
