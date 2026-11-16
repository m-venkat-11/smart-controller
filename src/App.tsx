import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CompatibilityPage } from './pages/CompatibilityPage';
import { DownloadPage } from './pages/DownloadPage';
import { SupportPage } from './pages/SupportPage';
import { PlaygroundPage } from './pages/PlaygroundPage';

export function App() {
  const getPageFromHash = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (['home', 'features', 'how-it-works', 'compatibility', 'download', 'support', 'playground'].includes(hash)) {
      return hash;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<string>(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string) => {
    window.location.hash = `#/${page}`;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isControllerMode = currentPage === 'home' || currentPage === 'playground';

  return (
    <div className="min-h-screen flex flex-col bg-[#08090a] text-[#f5f6f8] selection:bg-[#eb0029] selection:text-white">
      {/* Show marketing Navbar only when browsing documentation / download pages */}
      {!isControllerMode && <Navbar currentPage={currentPage} onNavigate={navigateTo} />}

      <main className="flex-1 flex flex-col">
        {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
        {currentPage === 'playground' && <HomePage onNavigate={navigateTo} />}
        {currentPage === 'features' && <FeaturesPage />}
        {currentPage === 'how-it-works' && <HowItWorksPage />}
        {currentPage === 'compatibility' && <CompatibilityPage />}
        {currentPage === 'download' && <DownloadPage />}
        {currentPage === 'support' && <SupportPage />}
      </main>

      {/* Show marketing Footer only when browsing documentation / download pages */}
      {!isControllerMode && <Footer onNavigate={navigateTo} />}
    </div>
  );
}

export default App;
