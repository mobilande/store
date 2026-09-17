import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Category, EuroData } from './types';

interface StoreState {
  userName: string | null;
  setUserName: (name: string) => void;
  
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  discountCode: string | null;
  discountAmount: number;
  applyDiscount: (code: string) => { success: boolean; message: string; discount?: number };
  
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Data
  products: Product[];
  categories: Category[];
  euroData: EuroData | null;
  isDataLoaded: boolean;
  loadData: () => Promise<void>;

  // UI
  toastMessage: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
}

const DISCOUNT_CODES: Record<string, number> = {
  'WELCOME': 0.02,
  'BAHAR40': 0.03,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      userName: null,
      setUserName: (name) => set({ userName: name }),
      
      cart: [],
      addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find(item => item.product.id === product.id);
        if (existing) {
          if (existing.quantity < product.mountExist) {
            set({ cart: cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) });
          }
        } else {
          set({ cart: [...cart, { product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) => set(state => ({ cart: state.cart.filter(item => item.product.id !== productId) })),
      updateQuantity: (productId, quantity) => set(state => ({
        cart: state.cart.map(item => item.product.id === productId ? { ...item, quantity } : item)
      })),
      clearCart: () => set({ cart: [], discountCode: null, discountAmount: 0 }),
      
      discountCode: null,
      discountAmount: 0,
      applyDiscount: (code) => {
        const upperCode = code.toUpperCase();
        if (DISCOUNT_CODES[upperCode]) {
          const discountPercent = DISCOUNT_CODES[upperCode];
          set({ discountCode: upperCode, discountAmount: discountPercent });
          return { success: true, message: `کد ${upperCode} با موفقیت اعمال شد.`, discount: discountPercent };
        }
        return { success: false, message: 'کد تخفیف نامعتبر است' };
      },
      
      theme: 'dark',
      toggleTheme: () => set(state => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: newTheme };
      }),
      
      products: [],
      categories: [],
      euroData: null,
      isDataLoaded: false,
      loadData: async () => {
        try {
          const [productsRes, tagsRes, euroRes] = await Promise.all([
            fetch('/data/products.json'),
            fetch('/data/tags.json'),
            fetch('/data/euro.json').catch(() => null)
          ]);
          
          const products = await productsRes.json();
          const categories = await tagsRes.json();
          let euroData = null;
          if (euroRes && euroRes.ok) {
            euroData = await euroRes.json();
          } else {
            // Default fallback if euro.json not found
            euroData = { currentRate: 72600, previousRate: 70000 };
          }
          
          set({ products, categories, euroData, isDataLoaded: true });
        } catch (error) {
          console.error("Failed to load data:", error);
          set({ isDataLoaded: true }); // Prevent infinite loading state
        }
      },

      toastMessage: null,
      showToast: (message) => {
        set({ toastMessage: message });
        setTimeout(() => {
          set({ toastMessage: null });
        }, 3000);
      },
      hideToast: () => set({ toastMessage: null })
    }),
    {
      name: 'mobiland-storage',
      partialize: (state) => ({ 
        userName: state.userName, 
        cart: state.cart, 
        theme: state.theme,
        discountCode: state.discountCode,
        discountAmount: state.discountAmount
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }
  )
);
