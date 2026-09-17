import React, { useState } from 'react';
import { useStore } from '../store';
import { ShoppingCart, Trash2, Plus, Minus, Download, MessageCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, discountCode, discountAmount, applyDiscount, clearCart, userName, euroData } = useStore();
  const [inputCode, setInputCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [checkoutMode, setCheckoutMode] = useState<'cart' | 'address' | 'processing' | 'done'>('cart');
  const [countdown, setCountdown] = useState(10);
  const [orderNumber, setOrderNumber] = useState('');

  const currentRate = euroData?.currentRate || 72600;
  const getPrice = (item: any) => item.product.priceInEuro ? item.product.priceInEuro * currentRate : (item.product.priceInToman || 0);

  const subtotal = cart.reduce((acc, item) => acc + (getPrice(item) * item.quantity), 0);
  const discountValue = subtotal * discountAmount;
  const total = subtotal - discountValue;

  const handleApplyDiscount = () => {
    const res = applyDiscount(inputCode);
    setDiscountMessage(res.message);
  };

  const startCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutMode('address');
  };

  const submitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !postalCode || !phone) return;
    
    // Check stock
    const outOfStock = cart.find(item => item.quantity > item.product.mountExist);
    if (outOfStock) {
      setErrorMsg(`موجودی محصول ${outOfStock.product.title} کافی نیست (حداکثر ${outOfStock.product.mountExist} عدد)`);
      return;
    }

    setCheckoutMode('processing');
    setErrorMsg('');
    const currentOrderNumber = `ML-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`;
    setOrderNumber(currentOrderNumber);

    try {
      const { error } = await supabase.functions.invoke('place-order', {
        body: {
          orderNumber: currentOrderNumber,
          cart: cart.map(item => ({
            id: item.product.id,
            title: item.product.title,
            code: item.product.code,
            quantity: item.quantity,
            price: getPrice(item)
          })),
          customerName: userName || 'مهمان',
          phone,
          address,
          postalCode,
          totalAmount: total
        }
      });
      
      if (error) {
        console.warn("Could not save backup to Supabase (Edge Function might not be deployed yet). Proceeding with checkout.", error);
      }
    } catch (error) {
      console.warn("Order placement backup failed", error);
    }
    
    // Always proceed to WhatsApp redirect regardless of Supabase backup success
    handleWhatsAppRedirect(currentOrderNumber);
  };

  const generateInvoiceText = (finalOrderNum: string = orderNumber) => {
    const items = cart.map(i => `${i.product.title} (${i.quantity} عدد) - ${i.product.priceInToman.toLocaleString()} تومان`).join('\n');
    let text = `فروشگاه اینترنتی موبی لند\n`;
    if (finalOrderNum) text += `شماره سفارش: ${finalOrderNum}\n`;
    text += `نام کاربر: ${userName}\n`;
    text += `شماره تماس: ${phone}\n`;
    text += `آدرس: ${address}\nکد پستی: ${postalCode}\n\n`;
    text += `اقلام:\n${items}\n\n`;
    text += `جمع مبلغ: ${subtotal.toLocaleString()} تومان\n`;
    if (discountAmount > 0) {
      text += `کد تخفیف اعمال شده: ${discountCode} - مبلغ ${discountValue.toLocaleString()} تومان کسر شد\n`;
    }
    text += `مبلغ نهایی: ${total.toLocaleString()} تومان\n\n`;
    text += `لطفاً وجه سفارش را به شماره کارت اعلامی پشتیبانی واریز نمایید:\n`;
    text += `شماره کارت را از پشتیبانی دریافت کنید.\n`;
    text += `\n\n`;
    text += `این فاکتور بدون رسید پرداخت اعتبار ندارد. پس از واریز وجه، رسید خود را در همین صفحه ارسال نمایید.`;
    return text;
  };

  const handleWhatsAppRedirect = (finalOrderNum: string = orderNumber) => {
    const text = encodeURIComponent(generateInvoiceText(finalOrderNum));
    window.open(`https://wa.me/989920504399?text=${text}`, '_blank');
    setCheckoutMode('done');
    clearCart();
  };

  const downloadTextInvoice = () => {
    const text = generateInvoiceText(orderNumber);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MobiLand-Invoice-${orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadInvoice = async () => {
    const element = document.getElementById('invoice-template');
    if (!element) return;
    
    try {
      element.style.display = 'block';
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      element.style.display = 'none';
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`mobi-land-invoice-${orderNumber || Date.now()}.pdf`);
      setCheckoutMode('done');
      clearCart();
    } catch (err) {
      console.error('Error generating PDF', err);
    }
  };

  if (cart.length === 0 && checkoutMode === 'cart') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <ShoppingCart size={64} className="text-slate-300 dark:text-slate-700 mb-6" />
        <h2 className="text-2xl font-bold dark:text-white mb-2">سبد خرید شما خالی است</h2>
        <p className="text-slate-500 mb-8">شما هنوز هیچ محصولی به سبد خرید خود اضافه نکرده‌اید.</p>
        <button onClick={() => window.history.back()} className="bg-primary-blue text-white px-8 py-3 rounded-xl font-bold">
          بازگشت به فروشگاه
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-8 flex flex-col md:flex-row gap-8">
      
      {/* Main Content Area */}
      <div className="flex-grow flex flex-col gap-6">
        
        <AnimatePresence mode="wait">
          {checkoutMode === 'cart' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">سبد خرید شما</h2>
              <div className="flex flex-col gap-6">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-black rounded-xl p-2 shrink-0">
                      <img src={item.product.pictureLink} alt={item.product.title} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="flex-grow flex flex-col gap-2">
                      <h3 className="font-bold dark:text-white line-clamp-1">{item.product.title}</h3>
                      <p className="text-primary-blue font-bold">{getPrice(item).toLocaleString()} تومان</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1">
                          <button onClick={() => updateQuantity(item.product.id, Math.min(item.product.mountExist, item.quantity + 1))} className="text-slate-600 dark:text-slate-300 hover:text-primary-blue"><Plus size={16} /></button>
                          <span className="font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="text-slate-600 dark:text-slate-300 hover:text-primary-blue"><Minus size={16} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-600 p-2">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {checkoutMode === 'address' && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold dark:text-white mb-6">اطلاعات ارسال</h2>
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6">
                  {errorMsg}
                </div>
              )}
              <form onSubmit={submitAddress} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 mb-2">شماره موبایل</label>
                  <input 
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white focus:outline-none focus:border-primary-blue"
                    placeholder="09123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 mb-2">آدرس دقیق تحویل</label>
                  <textarea 
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white focus:outline-none focus:border-primary-blue h-24 resize-none"
                    placeholder="استان، شهر، خیابان، کوچه، پلاک..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 mb-2">کد پستی (۱۰ رقمی)</label>
                  <input 
                    type="text"
                    required
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white focus:outline-none focus:border-primary-blue"
                    placeholder="مثلا: 1234567890"
                  />
                </div>
                <div className="mt-4 flex gap-4">
                  <button type="button" onClick={() => setCheckoutMode('cart')} className="flex-1 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white py-3 rounded-xl font-bold">برگشت</button>
                  <button type="submit" className="flex-1 bg-primary-blue text-white py-3 rounded-xl font-bold">ثبت نهایی خرید</button>
                </div>
              </form>
            </motion.div>
          )}

          {checkoutMode === 'processing' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-xl border border-slate-200 dark:border-slate-800 text-center">
              <MessageCircle size={64} className="mx-auto text-green-500 mb-6 animate-bounce" />
              <h2 className="text-2xl font-bold dark:text-white mb-4">در حال انتقال به واتساپ...</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">شما تا {countdown} ثانیه دیگر به رابط خرید ایمن در واتساپ منتقل می‌شوید.</p>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mt-8">
                <AlertTriangle className="mx-auto text-red-500 mb-2" />
                <p className="text-red-500 font-bold mb-4">اگر واتساپ ندارید روی دکمه زیر بزنید:</p>
                <button onClick={downloadInvoice} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-colors flex items-center gap-2 mx-auto">
                  <Download size={20} /> واتساپ ندارم (دانلود پیش‌فاکتور)
                </button>
              </div>
            </motion.div>
          )}

          {checkoutMode === 'done' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
              <CheckCircle2 size={64} className="text-green-500 mb-6" />
              <h2 className="text-2xl font-bold dark:text-white mb-4">سفارش شما در سیستم ثبت شد</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">اگر به صورت خودکار به واتساپ منتقل نشدید، می‌توانید پیش‌فاکتور خود را دانلود کرده و یا از طریق پشتیبانی نسبت به ثبت سفارش اقدام نمایید .</p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button onClick={downloadTextInvoice} className="bg-slate-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-2 justify-center">
                  <Download size={20} /> دانلود پیش‌فاکتور پیشنهادی! (متنی)
                </button>
                <button onClick={downloadInvoice} className="bg-red-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-2 justify-center">
                  <Download size={20} /> دانلود پیش‌فاکتور (تصویری PDF)
                </button>
              </div>

              <button onClick={() => window.location.href = '/'} className="bg-primary-blue text-white font-bold py-3 px-8 rounded-xl shadow-lg">
                بازگشت به خانه
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Checkout Box */}
      {checkoutMode !== 'done' && (
        <aside className="w-full md:w-80 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 sticky top-28">
            <h3 className="font-bold text-lg mb-6 dark:text-white">صورتحساب</h3>
            
            <div className="flex justify-between items-center mb-4 text-slate-600 dark:text-slate-400">
              <span>جمع مبلغ</span>
              <span className="font-bold dark:text-white">{subtotal.toLocaleString()} تومان</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between items-center mb-4 text-green-500">
                <span>سود شما از خرید</span>
                <span className="font-bold">{discountValue.toLocaleString()} تومان</span>
              </div>
            )}
            
            <div className="border-t border-slate-200 dark:border-slate-700 my-4 pt-4 flex justify-between items-center text-lg">
              <span className="font-bold dark:text-white">مبلغ قابل پرداخت</span>
              <span className="font-black text-primary-blue">{total.toLocaleString()} تومان</span>
            </div>

            {checkoutMode === 'cart' && (
              <>
                <div className="mt-8 mb-6">
                  <label className="text-sm text-slate-500 block mb-2">کد تخفیف (مثال: WELCOME)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={inputCode}
                      onChange={e => setInputCode(e.target.value)}
                      className="flex-grow bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 dark:text-white focus:outline-none"
                    />
                    <button onClick={handleApplyDiscount} className="bg-slate-800 dark:bg-white text-white dark:text-black px-4 rounded-xl font-bold text-sm">اعمال</button>
                  </div>
                  {discountMessage && <p className="text-xs mt-2 text-primary-blue">{discountMessage}</p>}
                </div>

                <button onClick={startCheckout} className="w-full bg-primary-blue hover:bg-sky-400 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary-blue/30 transition-colors">
                  تکمیل خرید
                </button>
              </>
            )}
          </div>
        </aside>
      )}

      {/* Hidden Invoice Template for PDF Generation */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
        <div id="invoice-template" style={{ display: 'none', width: '800px', padding: '40px', backgroundColor: '#fff', color: '#000', direction: 'rtl', fontFamily: 'Vazirmatn, sans-serif' }}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>فروشگاه اینترنتی موبی لند</h1>
            <p>پیش‌فاکتور خرید</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <p><strong>نام خریدار:</strong> {userName}</p>
            <p><strong>آدرس:</strong> {address}</p>
            <p><strong>کد پستی:</strong> {postalCode}</p>
            <p><strong>تاریخ:</strong> {new Date().toLocaleDateString('fa-IR')}</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>ردیف</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>شرح کالا</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>تعداد</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>مبلغ واحد (تومان)</th>
                <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>مبلغ کل (تومان)</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={item.product.id}>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>{item.product.title}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>{getPrice(item).toLocaleString()}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>{(getPrice(item) * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'left', marginTop: '20px' }}>
            <p><strong>جمع مبلغ:</strong> {subtotal.toLocaleString()} تومان</p>
            {discountAmount > 0 && <p><strong>تخفیف ({discountCode}):</strong> {discountValue.toLocaleString()} تومان</p>}
            <p style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>مبلغ نهایی: {total.toLocaleString()} تومان</p>
          </div>
          <div style={{ marginTop: '40px', fontSize: '12px', color: '#666', textAlign: 'center', borderTop: '1px dashed #ccc', paddingTop: '20px' }}>
            این پیش‌فاکتور فاقد ارزش قانونی است و تنها جهت اطلاع خریدار صادر شده است. لطفا رسید پرداخت را به همراه این فایل در واتساپ یا بله یا تلگرام یا اینستاگرام ارسال نمایید.
          </div>
        </div>
      </div>

    </div>
  );
}
