import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { LanguageProvider } from '@/lib/LanguageContext';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Sandbox from './pages/Sandbox';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

function App() {
  return (
    <LanguageProvider>
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
            <Route path="/Blog" element={<LayoutWrapper currentPageName="Blog"><Blog /></LayoutWrapper>} />
            <Route path="/BlogPost" element={<LayoutWrapper currentPageName="Blog"><BlogPost /></LayoutWrapper>} />
            <Route path="/Sandbox" element={<LayoutWrapper currentPageName="Sandbox"><Sandbox /></LayoutWrapper>} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </LanguageProvider>
  )
}

export default App
