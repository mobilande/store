import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../store';
import { ShoppingCart, Check, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';

interface Props {
  product: Product;
  key?: React.Key;
}

const borderColors: Record<string, string> = {
  green: 'border-green-500 shadow-green-500/20',
  orange: 'border-orange-500 shadow-orange-500/20',
  purple: 'border-purple-500 shadow-purple-500/20',
  pink: 'border-pink-500 shadow-pink-500/20',
  yellow: 'border-yellow-400 shadow-yellow-400/20',
  colorfull: 'border-cyan-400 shadow-cyan-400/20', // fallback for colorful
};

export default function ProductCard({ product }: Props) {
  const addToCart = useStore(state => state.addToCart);
  const euroData = useStore(state => state.euroData);
  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Calculate prices
  const currentRate = euroData?.currentRate || 72600;
  const priceInToman = product.priceInEuro 
    ? product.priceInEuro * currentRate 
    : (product.priceInToman || 0);

  const previousRate = euroData?.previousRate || 70000;
  let oldPriceInToman = null;
  if (product.oldPriceInEuro) {
    oldPriceInToman = product.oldPriceInEuro * currentRate;
  } else if (product.priceInEuro && previousRate !== currentRate) {
    oldPriceInToman = product.priceInEuro * previousRate;
  }

  // Determine price color
  let priceColorClass = "text-primary-blue dark:text-primary-ice";
  if (oldPriceInToman) {
    if (priceInToman < oldPriceInToman) {
      priceColorClass = "text-green-600 dark:text-green-400"; // Cheaper now
    } else if (priceInToman > oldPriceInToman) {
      priceColorClass = "text-red-500 dark:text-red-400"; // More expensive now
    }
  }

  const borderColorClass = borderColors[product.borderColor] || 'border-slate-200 dark:border-slate-700';

  return (
    <>
      <motion.div 
        onClick={() => setIsModalOpen(true)}
        whileHover={{ y: -5 }}
        className={clsx(
          "relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border-2 shadow-xl group transition-all duration-300 cursor-pointer",
          borderColorClass,
          product.live ? "breathing-border" : ""
        )}
      >
        {product.offer && (
          <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            پیشنهاد!
          </div>
        )}
        
        <div className="relative aspect-square w-full p-4 overflow-hidden bg-slate-50 dark:bg-black">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <img 
            src={product.pictureLink} 
            alt={product.title}
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-110 transition-transform duration-500"
          />
          {/* Small Logo inside product */}
          <div className="absolute bottom-2 left-2 text-[10px] font-black text-slate-400 opacity-50">
            MOBI LAND
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-xs text-slate-500 mb-1 font-mono">{product.code}</p>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 line-clamp-2 leading-relaxed flex-grow">
            {product.title}
          </h3>
          
          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {product.badges.map((badge, idx) => (
                <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  {badge}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-end justify-between mt-auto">
            <div className="flex flex-col">
              {oldPriceInToman && (
                <span className="text-[11px] text-slate-400 line-through mb-1">
                  {oldPriceInToman.toLocaleString()} تومان
                </span>
              )}
              <span className={clsx("font-black text-lg", priceColorClass)}>
                {priceInToman.toLocaleString()} <span className="text-xs font-normal">تومان</span>
              </span>
              {product.priceInEuro && (
                <span className="text-[10px] text-slate-500 mt-1">قیمت اصلی: {product.priceInEuro} یورو</span>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button 
                type="button"
                onClick={handleAddToCart}
                className={clsx(
                  "w-10 h-10 rounded-xl text-white flex items-center justify-center transition-colors shadow-lg",
                  added ? "bg-green-500 shadow-green-500/30" : "bg-primary-blue hover:bg-sky-400 shadow-primary-blue/30"
                )}
                title="افزودن به سبد"
              >
                {added ? <Check size={18} /> : <ShoppingCart size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white mb-2">{product.title}</h2>
                  <p className="text-slate-500 font-mono text-sm">{product.code}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-full md:w-1/2 aspect-square bg-slate-50 dark:bg-black rounded-2xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                  <img src={product.pictureLink} alt={product.title} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                </div>
                
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  {/* Badges */}
                  {product.badges && product.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.badges.map((badge, idx) => (
                        <span key={idx} className="bg-primary-blue/10 text-primary-blue dark:bg-primary-blue/20 dark:text-blue-300 font-medium text-sm px-3 py-1.5 rounded-xl">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50">
                    <div className="text-slate-500 dark:text-slate-400 text-sm mb-2">قیمت نهایی با نرخ روز:</div>
                    <div className="flex items-end gap-3 flex-wrap">
                      {oldPriceInToman && (
                        <span className="text-lg text-slate-400 line-through">
                          {oldPriceInToman.toLocaleString()}
                        </span>
                      )}
                      <span className={clsx("font-black text-3xl", priceColorClass)}>
                        {priceInToman.toLocaleString()} <span className="text-lg font-normal text-slate-500 dark:text-slate-400">تومان</span>
                      </span>
                    </div>
                    {product.priceInEuro && (
                      <div className="mt-2 text-sm text-slate-500 font-medium bg-slate-200/50 dark:bg-slate-700/50 px-2 py-1 rounded inline-block">
                        قیمت اصلی دلاری/یورویی: {product.priceInEuro} 
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="w-full mt-4 bg-primary-blue hover:bg-sky-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-blue/30 transition-colors flex justify-center items-center gap-2"
                  >
                    {added ? (
                      <><Check size={20} /> به سبد خرید افزوده شد</>
                    ) : (
                      <><ShoppingCart size={20} /> افزودن به سبد خرید</>
                    )}
                  </button>
                </div>
              </div>

              {/* Specifications Table */}
              {product.specs && product.specs.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold dark:text-white mb-4">مشخصات فنی</h3>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    {product.specs.map((spec, idx) => (
                      <div key={idx} className={clsx(
                        "flex flex-col sm:flex-row border-b border-slate-200 dark:border-slate-700 last:border-0",
                        idx % 2 === 0 ? "bg-slate-50 dark:bg-slate-800/50" : "bg-white dark:bg-slate-900"
                      )}>
                        <div className="w-full sm:w-1/3 p-4 text-slate-500 dark:text-slate-400 font-medium">
                          {spec.key}
                        </div>
                        <div className="w-full sm:w-2/3 p-4 text-slate-800 dark:text-slate-200 font-bold border-t sm:border-t-0 sm:border-r border-slate-200 dark:border-slate-700">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
