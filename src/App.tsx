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

  return (
    <div className="min-h-screen flex flex-col bg-glyph-bg text-[#f5f6f8] selection:bg-glyph-red selection:text-white">
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
        {currentPage === 'features' && <FeaturesPage />}
        {currentPage === 'how-it-works' && <HowItWorksPage />}
        {currentPage === 'compatibility' && <CompatibilityPage />}
        {currentPage === 'download' && <DownloadPage />}
        {currentPage === 'support' && <SupportPage />}
        {currentPage === 'playground' && <PlaygroundPage />}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default App;
