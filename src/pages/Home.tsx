import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const navigate = useNavigate();
  const { products, categories } = useStore();
  // Most expensive products (newest mapping as per prompt)
  const mostExpensive = [...products].sort((a, b) => b.priceInToman - a.priceInToman).slice(0, 4);

  return (
    <div className="flex flex-col gap-12 pt-8">
      
      {/* Slider / Banners area */}
      <div className="relative w-full min-h-[350px] md:min-h-[450px] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-between p-8 md:p-16 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 group">
        {/* Bubbles Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '100%', opacity: 0 }}
              animate={{
                y: '-50%',
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear'
              }}
              className="absolute rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
              style={{
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                left: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">موبی لند، فراتر از یک خرید</h2>
          <p className="text-primary-ice md:text-xl font-bold mb-8">پیشنهادات ویژه و تخفیف‌های استثنایی</p>
          <button 
            onClick={() => navigate('/products?offer=true')}
            className="bg-accent-pink text-white px-8 py-3 rounded-full w-max font-bold shadow-lg shadow-accent-pink/40 hover:scale-105 transition-transform"
          >
            مشاهده پیشنهادات
          </button>
        </div>

        {/* 3D Rotating Phone */}
        <div className="hidden md:flex relative z-10 w-1/2 justify-center items-center perspective-[1200px]">
          <motion.div 
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-56 h-[420px] rounded-[3rem] border-[14px] border-slate-800 bg-black shadow-2xl shadow-primary-blue/30 flex flex-col items-center justify-between p-1 relative"
          >
            {/* Notch */}
            <div className="absolute top-0 w-1/2 h-6 bg-slate-800 rounded-b-2xl z-20 shadow-inner"></div>
            
            {/* Screen */}
            <div className="w-full h-full bg-gradient-to-br from-primary-blue via-indigo-500 to-accent-pink rounded-[2rem] overflow-hidden relative">
               <img 
                 src="https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=400&q=80" 
                 alt="Phone Screen" 
                 className="w-full h-full object-cover opacity-50 mix-blend-overlay"
               />
               <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                 <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg border border-white/30">
                   📱
                 </div>
                 <span className="text-white font-black tracking-widest drop-shadow-md">MobiLand</span>
               </div>
            </div>
            
            {/* Side Buttons (Simulated 3D edges) */}
            <div className="absolute -left-[18px] top-24 w-1 h-12 bg-slate-700 rounded-l-md"></div>
            <div className="absolute -left-[18px] top-40 w-1 h-12 bg-slate-700 rounded-l-md"></div>
            <div className="absolute -right-[18px] top-32 w-1 h-16 bg-slate-700 rounded-r-md"></div>
          </motion.div>
        </div>
      </div>

      {/* Categories Row */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-8 w-2 bg-primary-blue rounded-full"></div>
          <h2 className="text-xl font-bold dark:text-white">دسته‌بندی‌های موبی لند</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {categories.slice(0, 5).map((cat, idx) => (
            <motion.button
              key={cat.slug}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(`/products?category=${cat.slug}`)}
              className="snap-start shrink-0 min-w-[120px] md:flex-1 p-4 rounded-2xl glass-panel relative overflow-hidden group"
              style={{ borderBottomColor: cat.color, borderBottomWidth: 4 }}
            >
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: cat.color }} />
              <span className="font-bold text-slate-800 dark:text-white relative z-10">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Newest (Most Expensive) Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-2 bg-accent-pink rounded-full"></div>
            <h2 className="text-xl font-bold dark:text-white">جدیدترین محصولات (ویژه)</h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-primary-blue hover:text-sky-400">مشاهده همه {'>'}</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mostExpensive.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Some extra banners for trust */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
         <div className="aspect-[21/9] rounded-3xl overflow-hidden relative shadow-xl">
           <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" alt="Gamers" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/50 flex items-center p-8">
             <h3 className="text-2xl font-bold text-white">تجهیزات گیمینگ حرفه‌ای</h3>
           </div>
         </div>
         <div className="aspect-[21/9] rounded-3xl overflow-hidden relative shadow-xl">
           <img src="https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=600&q=80" alt="Mobiles" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/50 flex items-center p-8">
             <h3 className="text-2xl font-bold text-white">جدیدترین گوشی‌های هوشمند</h3>
           </div>
         </div>
      </div>

    </div>
  );
}
