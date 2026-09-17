import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const { products, categories, euroData } = useStore();
  const currentRate = euroData?.currentRate || 72600;
  const getPrice = (p: any) => p.priceInEuro ? p.priceInEuro * currentRate : (p.priceInToman || 0);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';
  const isOfferOnly = searchParams.get('offer') === 'true';
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (query) {
      result = result.filter(p => p.title.includes(query) || p.code.includes(query));
    }
    
    if (categoryFilter) {
      result = result.filter(p => p.tag === categoryFilter);
    }

    if (isOfferOnly) {
      result = result.filter(p => p.offer);
    }

    if (sortOrder === 'asc') {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    }

    return result;
  }, [query, categoryFilter, isOfferOnly, sortOrder, products, currentRate]);

  return (
    <div className="flex flex-col md:flex-row gap-8 pt-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-4 dark:text-white">فیلترها</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500 mb-2 block">دسته‌بندی</label>
              <select 
                value={categoryFilter}
                onChange={(e) => {
                  if (e.target.value) {
                    searchParams.set('category', e.target.value);
                  } else {
                    searchParams.delete('category');
                  }
                  setSearchParams(searchParams);
                }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 dark:text-white focus:outline-none focus:border-primary-blue"
              >
                <option value="">همه</option>
                {categories.map(cat => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-500 mb-2 block">مرتب‌سازی قیمت</label>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 dark:text-white focus:outline-none focus:border-primary-blue"
              >
                <option value="default">پیش‌فرض</option>
                <option value="asc">ارزان‌ترین به گران‌ترین</option>
                <option value="desc">گران‌ترین به ارزان‌ترین</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold dark:text-white">محصولات</h1>
          <span className="text-slate-500 dark:text-slate-400 text-sm">{filteredProducts.length} کالا</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white/50 dark:bg-slate-900/50 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">کالایی یافت نشد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
