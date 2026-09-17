import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useStore } from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import { motion, AnimatePresence } from 'motion/react';

import { supabase } from './lib/supabase';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function TrackVisit() {
  const { pathname } = useLocation();
  useEffect(() => {
    const track = async () => {
      try {
        const deviceType = /Mobile|Android|iP(ad|hone)/.test(navigator.userAgent) ? 'mobile' : 'desktop';
        let browser = 'unknown';
        if (navigator.userAgent.indexOf("Chrome") !== -1) browser = "Chrome";
        else if (navigator.userAgent.indexOf("Safari") !== -1) browser = "Safari";
        else if (navigator.userAgent.indexOf("Firefox") !== -1) browser = "Firefox";

        await supabase.functions.invoke('track-visit', {
          body: { page: pathname, device_type: deviceType, browser }
        });
      } catch (err) {
        // Silently fail if Supabase is down or functions are not deployed
        console.error("Visit tracking failed");
      }
    };
    track();
  }, [pathname]);
  return null;
}

function WelcomeModal() {
  const { userName, setUserName } = useStore();
  const [inputName, setInputName] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!userName) {
      setShow(true);
    }
  }, [userName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      setUserName(inputName.trim());
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl shadow-primary-blue/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4">به موبی لند خوش آمدید</h2>
          <p className="text-slate-300 mb-6">برای تجربه بهتر، لطفا نام خود را وارد کنید.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="نام شما..."
              className="px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-blue transition-colors text-center"
              autoFocus
            />
            <button 
              type="submit" 
              className="bg-primary-blue hover:bg-sky-400 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              ورود به سایت
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { loadData, isDataLoaded } = useStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <TrackVisit />
      {/* Video Background */}
      <video 
        autoPlay loop muted playsInline 
        className="fixed top-0 left-0 w-full h-full object-cover opacity-30 dark:opacity-50 -z-10 pointer-events-none"
      >
        {/* Placeholder video URL (using a simple abstract loop) */}
        <source src="https://cdn.pixabay.com/video/2021/08/04/83944-585145788_large.mp4" type="video/mp4" />
      </video>

      <div className="min-h-screen flex flex-col relative z-0">
        <div className="focus-blur-overlay"></div>
        <WelcomeModal />
        <Header />
        
        <main className="flex-grow pt-28 pb-20 md:pb-8 w-full max-w-7xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
