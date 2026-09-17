import { MapPin, Phone, Github, Send, Instagram, Youtube, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Footer() {
  const [activeModal, setActiveModal] = useState<'contact' | 'about' | 'terms' | 'guide' | 'trust_pasargad' | 'trust_users' | 'trust_chapar' | null>(null);

  const modalContent = {
contact: {
      title: 'تماس با ما',
      content: `برای پیگیری سفارشات، دریافت مشاوره و ارتباط با پشتیبانی «موبی لند»، می‌توانید از طریق راه‌های زیر با ما در ارتباط باشید:

📞 شماره تماس: 09920504399
📸 اینستاگرام: mobi_lande
✈️ کانال تلگرام: mobi_lande
💬 پشتیبانی در بله: mobi_landee@

کافیست آیدی‌های بالا را کپی کرده و در شبکه اجتماعی مورد نظر خود جستجو کنید.`
    },
about: {
      title: 'درباره ما',
      content: `به «موبی لند» خوش آمدید؛ مرجع تخصصی بررسی و خرید به‌روزترین کالاهای دیجیتال.

ما در موبی لند، تعهد خود را بر عرضه محصولات کاملاً اورجینال، تضمین اصالت کالا و ارائه گارانتی‌های معتبر بنا نهاده‌ایم تا خیال شما را از بابت کیفیت خریدی که انجام می‌دهید کاملاً آسوده کنیم. 

رسالت اصلی موبی لند تنها فروش کالا نیست؛ بلکه این مجموعه با هدف ارتقای سطح آگاهی هم‌وطنان از فرهنگ خرید اینترنتیِ امن و هوشمند شکل گرفته است. ما در تلاشیم تا با ارائه اطلاعات دقیق، شفاف و مشاوره‌های تخصصی، به شما کمک کنیم تا با دیدی باز و اطمینان خاطر، بهترین انتخاب را داشته باشید. 

اعتماد و همراهی شما، بزرگ‌ترین سرمایه ماست.`
    },
    terms: {
      title: 'قوانین و مقررات',
      content: `خرید از "موبی لند" به معنای آگاهی و پذیرش قوانین زیر است:

۱. ثبت و لغو سفارش: لغو سفارش فقط تا 1 ساعت پس از ثبت امکان‌پذیر است. ارسال بسته‌ها به صورت پس‌کرایه بوده و در صورت عدم تامین کالا به دلایل خارج از کنترل، وجه پرداختی  عودت داده می‌شود.

۲. تحویل کالا: هنگام دریافت بسته از پیک یا پست، سلامت ظاهری جعبه را بررسی کنید. امضای رسید تحویل، به معنای تایید سلامت فیزیکی بسته است و پس از آن اعتراضی پذیرفته نیست.

۳. پلمپ دستگاه (بسیار مهم): در صورت باز شدن پلمپ، کالا تحت هیچ شرایطی مرجوع نمی‌شود.

۴. استثنائات: کالاهای وابسته به نوسانات ارزی و سفارش‌های خاصی که برای آن‌ها پیش‌پرداخت (بیعانه) دریافت شده است، به هیچ‌وجه قابل لغو و عودت وجه نیستند.`
    },
    guide: {
      title: 'راهنمای خرید',
      content: `برای خرید از موبی لند، ابتدا کالای مورد نظر را از دسته‌بندی‌ها انتخاب و به سبد خرید اضافه کنید. سپس با لمس آیکون سبد خرید (در بالا یا پایین صفحه)، مراحل نهایی را طی کنید. 
توجه: سفارشات شما بر بستر ایمن شرکت متا ثبت و بررسی می‌شود؛ لذا از نصب بودن برنامه «واتساپ» روی دستگاه خود مطمئن شوید. در غیر این صورت، می‌توانید رسید سفارش خود را دانلود کرده و آن را از طرق دیگر برای پشتیبانی موبی لند ارسال کنید.`
    },
    trust_pasargad: {
      title: 'پرداخت امن',
      content: `تمامی مراحل پرداخت در موبی لند با بالاترین سطح امنیت و از طریق بسترهای مالی معتبر داخلی انجام می‌شود. شما می‌توانید وجه سفارش خود را به صورت پرداخت آنی (کارت‌به‌کارت یا حواله شبا) از طریق بانک پاسارگاد، بلو بانک و یا اپلیکیشن بله با خیالی آسوده واریز نمایید.`
    },
    trust_users: {
      title: 'اعتماد مشتریان',
      content: `موبی لند مفتخر است که توانسته اعتماد جامعه بزرگی از همشهریان و مشتریان سراسر کشور را جلب نماید. شما می‌توانید برای اطمینان بیشتر، امتیازات و نظرات کاربران را در صفحه هر محصول مطالعه کرده و یا با کلیک روی «نماد اعتماد خریداران»، تجربیات خرید مشتریان قبلی ما را بررسی کنید.`
    },
    trust_chapar: {
      title: 'ارسال ایمن',
      content: `انتخاب اول موبی لند برای ارسالی سریع و مطمئن، «کالارسان چاپار» است و تمامی مرسولات دقیقاً معادل مبلغ خرید شما بیمه می‌شوند. 
نکته: در صورت درخواست شما، امکان ارسال با سایر شرکت‌های پستی نیز وجود دارد (که در این حالت مسئولیت قوانین خاص آن شرکت‌ها بر عهده مشتری است). همچنین ارسال کالاهای حساس مانند لپ‌تاپ با پست ملی ایران پیشنهاد نمی‌شود.`
    },
      blue_bank: {
      title: 'بلو بانک',
            content: `تمامی مراحل پرداخت در موبی لند با بالاترین سطح امنیت و از طریق بسترهای مالی معتبر داخلی انجام می‌شود. شما می‌توانید وجه سفارش خود را به صورت پرداخت آنی (کارت‌به‌کارت یا حواله شبا) از طریق بانک پاسارگاد، بلو بانک و یا اپلیکیشن بله با خیالی آسوده واریز نمایید.`
    }
    
  };

  const featureIcons = [
    {
      text: 'تحویل اکسپرس',
      // آیکون کامیون در حال حرکت سریع
      img: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3Cfilter id='n' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeGaussianBlur stdDeviation='3' result='b1'/%3E%3CfeGaussianBlur stdDeviation='8' result='b2'/%3E%3CfeGaussianBlur stdDeviation='15' result='b3'/%3E%3CfeMerge%3E%3CfeMergeNode in='b3'/%3E%3CfeMergeNode in='b2'/%3E%3CfeMergeNode in='b1'/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%3Crect width='200' height='200' fill='%23080a13' rx='20'/%3E%3Cg filter='url(%23n)' stroke='%2300e5ff' stroke-width='7' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M40,120 L40,75 L115,75 L115,120 Z'/%3E%3Cpath d='M115,120 L115,90 L135,90 L155,105 L155,120 Z'/%3E%3Ccircle cx='65' cy='120' r='12'/%3E%3Ccircle cx='130' cy='120' r='12'/%3E%3Cpath d='M20,85 L35,85'/%3E%3Cpath d='M10,100 L30,100'/%3E%3Cpath d='M25,115 L35,115'/%3E%3C/g%3E%3C/svg%3E"
    },
    {
      text: '6 روز هفته، 8 ساعته',
      // آیکون ساعت دیواری / پشتیبانی
      img: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3Cfilter id='n' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeGaussianBlur stdDeviation='3' result='b1'/%3E%3CfeGaussianBlur stdDeviation='8' result='b2'/%3E%3CfeGaussianBlur stdDeviation='15' result='b3'/%3E%3CfeMerge%3E%3CfeMergeNode in='b3'/%3E%3CfeMergeNode in='b2'/%3E%3CfeMergeNode in='b1'/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%3Crect width='200' height='200' fill='%23080a13' rx='20'/%3E%3Cg filter='url(%23n)' stroke='%2300e5ff' stroke-width='7' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='100' cy='100' r='50'/%3E%3Cpath d='M100,65 L100,100 L125,115'/%3E%3Cpath d='M100,35 L100,45 M165,100 L155,100 M100,165 L100,155 M35,100 L45,100'/%3E%3C/g%3E%3C/svg%3E"
    },
    {
      text: 'مثبت 18 ماه ضمانت',
      // آیکون سپر محافظ با تیک (گارانتی)
      img: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3Cfilter id='n' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeGaussianBlur stdDeviation='3' result='b1'/%3E%3CfeGaussianBlur stdDeviation='8' result='b2'/%3E%3CfeGaussianBlur stdDeviation='15' result='b3'/%3E%3CfeMerge%3E%3CfeMergeNode in='b3'/%3E%3CfeMergeNode in='b2'/%3E%3CfeMergeNode in='b1'/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%3Crect width='200' height='200' fill='%23080a13' rx='20'/%3E%3Cg filter='url(%23n)' stroke='%2300e5ff' stroke-width='7' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M100,40 L150,60 L150,110 C150,145 100,170 100,170 C100,170 50,145 50,110 L50,60 Z'/%3E%3Cpath d='M80,110 L95,125 L125,90'/%3E%3C/g%3E%3C/svg%3E"
    },
    {
      text: 'ضمانت اصل بودن کالا',
      // آیکون مدال / نشان اصالت با ستاره
      img: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3Cfilter id='n' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeGaussianBlur stdDeviation='3' result='b1'/%3E%3CfeGaussianBlur stdDeviation='8' result='b2'/%3E%3CfeGaussianBlur stdDeviation='15' result='b3'/%3E%3CfeMerge%3E%3CfeMergeNode in='b3'/%3E%3CfeMergeNode in='b2'/%3E%3CfeMergeNode in='b1'/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%3Crect width='200' height='200' fill='%23080a13' rx='20'/%3E%3Cg filter='url(%23n)' stroke='%2300e5ff' stroke-width='7' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='100,30 120,50 150,50 150,80 170,100 150,120 150,150 120,150 100,170 80,150 50,150 50,120 30,100 50,80 50,50 80,50'/%3E%3Ccircle cx='100' cy='100' r='30'/%3E%3Cpath d='M100,80 L105,95 L120,95 L108,105 L112,120 L100,110 L88,120 L92,105 L80,95 L95,95 Z'/%3E%3C/g%3E%3C/svg%3E"
    },
  ];

  return (
    <>
      <footer className="mt-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 rounded-t-3xl overflow-hidden shadow-2xl relative z-10 pb-24 md:pb-0">

        {/* Decorative Top Line with Logo Space */}
        <div className="h-1 w-full bg-gradient-to-r from-accent-pink via-primary-blue to-accent-purple relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black rounded-lg border-2 border-primary-blue flex items-center justify-center">
            <span className="text-white text-xs font-black">MOBI</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Top Info Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <span className="text-slate-600 dark:text-slate-400 font-medium">پشتیبانی سایت:</span>
              <button
                onClick={() => navigator.clipboard.writeText('09920504399')}
                className="bg-primary-ice/20 dark:bg-primary-blue/20 text-primary-blue dark:text-primary-ice px-4 py-2 rounded-xl font-bold transition-all hover:scale-105"
              >
                09920504399
              </button>
            </div>

            <div className="flex items-center gap-4">
              <a href="https://web.bale.ai/@mobi_landee" className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:scale-110 transition-transform"><MessageCircle size={20} /></a>
              <a href="https://www.instagram.com/mobi_lande/" className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 text-white flex items-center justify-center hover:scale-110 transition-transform"><Instagram size={20} /></a>
              <a href="https://t.me/boost/mobi_lande" className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:scale-110 transition-transform"><Send size={20} /></a>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-800 dark:text-white font-medium">8 ساعت 6 روز هفته پاسخگو هستیم</p>
            </div>
          </div>

          {/* Features Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {featureIcons.map((feature, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-black/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full mb-3 flex items-center justify-center p-3">
                  <img src={feature.img} alt={feature.text} className="w-full h-full object-contain opacity-80" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Main Footer Links & Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-slate-200 dark:border-slate-800 pb-12">

            {/* Column 1 */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">با موبی لند</h3>
              <ul className="space-y-3">
                <li><button onClick={() => setActiveModal('contact')} className="text-slate-600 dark:text-slate-400 hover:text-primary-blue transition-colors">تماس با ما</button></li>
                <li><button onClick={() => setActiveModal('about')} className="text-slate-600 dark:text-slate-400 hover:text-primary-blue transition-colors">درباره ما</button></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">راهنمای مشتریان</h3>
              <ul className="space-y-3">
                <li><button onClick={() => setActiveModal('terms')} className="text-slate-600 dark:text-slate-400 hover:text-primary-blue transition-colors">قوانین و مقررات</button></li>
                <li><button onClick={() => setActiveModal('guide')} className="text-slate-600 dark:text-slate-400 hover:text-primary-blue transition-colors">راهنمای خرید</button></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <Phone size={20} className="shrink-0" />
                  <p className="text-sm" dir="ltr">09920504399</p>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <MessageCircle size={20} className="shrink-0" />
                  <p className="text-sm">بله: @mobi_landee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Newsletter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 pb-12 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">فروشگاه اینترنتی لپ تاپ و کالای دیجیتال</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-loose text-justify">
                موبی لند، یکی از بروزترین فروشگاه‌ها در حوزه رایانه با بیش از دو دهه تجربه، اکنون در عرصه اینترنتی با پایبندی به سه اصل کلیدی پرداخت امن، 2 ساعت ضمانت لغو سفارش و تضمین اصل‌بودن کالا، موفق شده تا همگام با فروشگاه‌های معتبر کشور، به مرجعی قابل اتکا برای فروش آنلاین تبدیل شود. سایت موبی لند، امکاناتی بی‌نظیر و برای اولین بار در کشور، برای کاربران خود فراهم آورده است. خرید سریع آنلاین و قابل انجام در واتساپ، پنل سریع، امکان خرید سفارشات با مبلغ بالای 300 میلیون تومان به صورت کاملا آنلاین، امکان پرداخت بیعانه برای رزرو کالا، همه و همه در سایت موبی لند. از خرید خود لذت ببرید.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start justify-center bg-slate-50 dark:bg-black/40 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 text-center md:text-right">از جدید ترین تخفیف ها و پیشنهادات با خبر شو!</h3>
              <a href="https://web.bale.ai/@mobi_landee" className="bg-primary-blue hover:bg-sky-400 text-white font-bold py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2">
                <Send size={18} /> عضویت در کانال بله
              </a>
            </div>
          </div>

          {/* Trust Badges Area */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <button onClick={() => setActiveModal('trust_pasargad')} className="w-24 h-24 rounded-2xl bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform overflow-hidden p-2">
              <img src="https://upload.wikimedia.org/wikipedia/fa/a/a3/BPasargad.webp?utm_source=fa.wikipedia.org&utm_campaign=index&utm_content=original" alt="بانک پاسارگاد" className="w-full h-full object-contain" />
            </button>
            <button onClick={() => setActiveModal('trust_users')} className="w-24 h-24 rounded-2xl bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform overflow-hidden p-2">
              <img src="https://uploadkon.ir/uploads/0ff607_26trust-icon-1-.png" alt="نماد اعتماد" className="w-full h-full object-contain" />
            </button>
            <button onClick={() => setActiveModal('trust_chapar')} className="w-24 h-24 rounded-2xl bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform overflow-hidden p-2">
              <img src="https://uploadkon.ir/uploads/adae07_26images-حدل.png" alt="پست چاپار" className="w-full h-full object-contain" />
            </button>

            <button onClick={() => setActiveModal('blue_bank')} className="w-24 h-24 rounded-2xl bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform overflow-hidden p-2">
              <img src="https://uploadkon.ir/uploads/c53417_26com-samanpr-blu.png" alt="بلو بانک" className="w-full h-full object-contain" />
            </button>
            <a href="#" target="_blank" rel="noopener noreferrer" className="w-24 h-24 rounded-2xl bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform overflow-hidden p-2" >
              <img src="https://uploadkon.ir/uploads/a6f112_2635-4star.png" alt="نماد اعتماد خزیداران" className="w-full h-full object-contain" />
            </a>
          </div>

          <div className="text-center text-slate-500 dark:text-slate-500 text-sm mb-4">
            © استفاده از مطالب فروشگاه اینترنتی موبی لند فقط برای مقاصد غیرتجاری و با ذکر منبع بلامانع است.
          </div>
        </div>

        {/* Bottom absolute footer */}
        <div className="bg-black py-4 text-center">
          <p className="text-slate-400 text-sm">
            طراحی و توسعه وبسایت توسط <a href="#" target="_blank" rel="noreferrer" className="text-white hover:text-primary-blue font-bold ml-1">SRT</a>
          </p>
        </div>
      </footer>

      {/* Info Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 left-6 text-slate-400 hover:text-red-500 transition-colors bg-slate-100 dark:bg-slate-800 p-2 rounded-full"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                {modalContent[activeModal].title}
              </h2>

              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-loose min-h-[150px]">
                <p>{modalContent[activeModal].content}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 px-8 rounded-xl transition-colors"
                >
                  بستن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
