import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { 
  ShoppingCart, 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  PhoneCall, 
  MessageCircle,
  Home,
  PackageSearch,
  X,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

export default function Header() {
  const { userName, cart, theme, toggleTheme, showToast, toastMessage, euroData } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        setIsScrolled(true);
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          setHideHeader(true);
        } else {
          setHideHeader(false);
        }
      } else {
        setIsScrolled(false);
        setHideHeader(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const copyPhone = () => {
    navigator.clipboard.writeText('09920504399');
    showToast('شماره موبایل کپی شد');
  };

  const navLinkClass = (path: string) => clsx(
    "font-medium flex items-center gap-1 px-4 py-2 rounded-xl transition-colors",
    location.pathname === path 
      ? "bg-slate-200 dark:bg-slate-800 text-primary-blue" 
      : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-blue",
    // Special light mode styling for better visibility
    "bg-white/50 dark:bg-transparent shadow-sm dark:shadow-none border border-slate-200/50 dark:border-transparent"
  );

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-0 left-1/2 z-[100] flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold"
          >
            <CheckCircle2 size={20} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {contactModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setContactModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setContactModalOpen(false)}
                className="absolute top-6 left-6 text-slate-400 hover:text-red-500 transition-colors bg-slate-100 dark:bg-slate-800 p-2 rounded-full"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                تماس با ما
              </h2>
              
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-loose min-h-[150px]">
                <p>
                  برای پیگیری سفارشات، دریافت مشاوره و ارتباط با پشتیبانی «موبی لند»، می‌توانید از طریق راه‌های زیر با ما در ارتباط باشید:

📞 شماره تماس: 09920504399
📸 اینستاگرام: mobi_lande
✈️ کانال تلگرام: mobi_lande
💬 پشتیبانی در بله: mobi_landee@

کافیست آیدی‌های بالا را کپی کرده و در شبکه اجتماعی مورد نظر خود جستجو کنید.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button 
                  onClick={() => setContactModalOpen(false)}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors"
                >
                  بستن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner */}
      <div className="fixed top-0 left-0 w-full h-10 bg-gradient-to-r from-primary-blue to-accent-pink z-50 flex items-center justify-center text-white text-sm font-medium">
        <span>کد تخفیف به مناسبت آپدیت سایت welcome!</span>
      </div>

      {/* Euro Rate display */}
      {/* <div className="fixed top-10 left-0 w-full h-8 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-50 flex items-center justify-center text-xs text-slate-700 dark:text-slate-300 font-bold gap-4">
        <span>قیمت یورو: {euroData?.currentRate.toLocaleString() || '...'} تومان</span>
        {euroData?.previousRate && (
          <span className="opacity-70 line-through">
            {euroData?.previousRate.toLocaleString()}
          </span>
        )}
      </div> */}

      {/* Desktop Header */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hideHeader ? -100 : 72 }} // 72px down to account for banner and euro bar
        transition={{ duration: 0.3 }}
        className={clsx(
          "fixed left-0 w-full z-40 transition-colors duration-300 hidden md:block",
          isScrolled ? "glass-panel" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 py-2">
          {/* Top Row */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-6">
              {/* Logo Area */}
              <Link to="/" className="flex flex-col items-center justify-center bg-slate-900/80 dark:bg-black px-6 py-2 rounded-2xl border-b-2 border-primary-blue backdrop-blur-md">
                <span className="text-2xl font-black text-white tracking-tighter">MOBI LAND</span>
                <span className="text-sm text-primary-ice font-bold">موبی لند</span>
              </Link>
              
              {/* Search */}
              <form onSubmit={handleSearch} className="relative w-96">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در نام محصولات..." 
                  className="w-full bg-white/10 dark:bg-black/30 border border-slate-300 dark:border-slate-700 rounded-full py-2 px-4 pe-10 text-slate-800 dark:text-white focus:outline-none focus:border-primary-blue transition-colors shadow-sm"
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                  <Search size={18} />
                </button>
              </form>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="flex items-center gap-2 bg-white/50 dark:bg-black/40 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-primary-blue transition-colors shadow-sm">
                <div className="relative">
                  <ShoppingCart size={20} className="text-slate-800 dark:text-white" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-pink text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-800 dark:text-white">
                  سلام! {userName || 'کاربر'}
                </span>
              </Link>
              
              <button onClick={toggleTheme} className="p-2 rounded-full bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-transparent shadow-sm text-slate-800 dark:text-white hover:text-primary-blue transition-colors">
                <motion.div animate={{ rotate: theme === 'dark' ? 180 : 0 }}>
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </motion.div>
              </button>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            <nav className="flex items-center gap-3">
              <Link to="/" className={navLinkClass('/')}>
                <Home size={18} /> خانه
              </Link>
              <Link to="/products" className={navLinkClass('/products')}>
                <PackageSearch size={18} /> محصولات
              </Link>
              <button onClick={() => setContactModalOpen(true)} className={clsx(
                "font-medium flex items-center gap-1 px-4 py-2 rounded-xl transition-colors",
                "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary-blue",
                "bg-white/50 dark:bg-transparent shadow-sm dark:shadow-none border border-slate-200/50 dark:border-transparent"
              )}>
                تماس با ما
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <button onClick={copyPhone} className="flex items-center gap-2 bg-primary-blue/90 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-primary-blue transition-colors border border-transparent dark:border-primary-blue/30">
                <PhoneCall size={16} /> 09920504399
              </button>
              <a href="https://wa.me/989920504399" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-green-500/90 text-black px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-green-500 transition-colors border border-transparent dark:border-green-500/30">
                <MessageCircle size={16} /> واتساپ
              </a>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Top Header */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hideHeader ? -100 : 72 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          "fixed left-0 w-full z-40 transition-colors duration-300 md:hidden flex items-center justify-between px-4 py-3",
          isScrolled ? "glass-panel" : "bg-white/80 dark:bg-transparent backdrop-blur-md"
        )}
      >
        <button onClick={() => setMobileMenuOpen(true)} className="text-slate-800 dark:text-white p-2">
          <Menu size={24} />
        </button>
        <Link to="/" className="text-xl font-black text-slate-900 dark:text-white tracking-tighter bg-white/50 dark:bg-black/50 px-4 py-1 rounded-full">MOBI LAND</Link>
        <button onClick={toggleTheme} className="p-2 text-slate-800 dark:text-white bg-white/50 dark:bg-black/50 rounded-full">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </motion.header>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-slate-100 dark:bg-slate-900 shadow-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg dark:text-white">منوی سایت</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500"><X size={24} /></button>
              </div>
              <nav className="flex flex-col gap-4">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-800 dark:text-slate-200 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
                  <Home size={20} /> خانه
                  <ChevronLeft size={16} className="mr-auto opacity-50" />
                </Link>
                <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-800 dark:text-slate-200 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
                  <PackageSearch size={20} /> محصولات
                  <ChevronLeft size={16} className="mr-auto opacity-50" />
                </Link>
                <button onClick={() => { setContactModalOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-slate-800 dark:text-slate-200 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
                  <PhoneCall size={20} /> تماس با ما
                  <ChevronLeft size={16} className="mr-auto opacity-50" />
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Floating Bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-3xl p-3 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2 truncate flex-1">
          <div className="w-8 h-8 rounded-full bg-primary-blue/20 flex items-center justify-center text-primary-blue font-bold">
            {userName ? userName.charAt(0) : 'U'}
          </div>
          <span className="text-sm font-medium dark:text-white truncate">{userName || 'کاربر عزیز'}</span>
        </div>
        
        <Link to="/cart" className="relative flex items-center justify-center bg-primary-blue text-white w-12 h-12 rounded-full shadow-lg -mt-8 border-4 border-slate-50 dark:border-black flex-shrink-0">
          <ShoppingCart size={20} />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent-pink text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-primary-blue">
              {cartItemsCount}
            </span>
          )}
        </Link>

        <div className="flex justify-end flex-1">
          <button onClick={copyPhone} className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
            <PhoneCall size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
