import { create } from 'zustand';

/**
 * 5RNF: Context Separation Example
 * Rule: Separate concerns into different contexts/stores. Perfect for Redux & Zustand!
 */

// ❌ BAD: Monolithic store
type BadAppStore = {
  // Auth
  user: any | null;
  isAuthenticated: boolean;
  login: (user: any) => void;
  logout: () => void;

  // Posts
  posts: any[];
  addPost: (post: any) => void;

  // UI
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  toggleTheme: () => void;

  // Cart
  cartItems: any[];
  addToCart: (item: any) => void;

  // Settings
  language: string;
  notifications: boolean;

  // ... 50 more properties 😱
  // This becomes unmaintainable!
};

const useBadAppStore = create<BadAppStore>((set) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  login: (user: any) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  
  // Posts
  posts: [],
  addPost: (post: any) => set((state: any) => ({ posts: [...state.posts, post] })),
  
  // UI
  theme: 'light',
  sidebarOpen: true,
  toggleTheme: () => set((state: any) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  
  // Cart
  cartItems: [],
  addToCart: (item: any) => set((state: any) => ({ 
    cartItems: [...state.cartItems, item] 
  })),
  
  // Settings
  language: 'en',
  notifications: true,
  
  // ... 50 more properties 😱
  // This becomes unmaintainable!
}));

function BadComponent() {
  // Component re-renders when ANYTHING changes
  const store = useBadAppStore();
  return <div>{store.user?.name}</div>;
}

// ✅ GOOD: Separated stores by domain
const useAuthStore = create<{
  user: any | null;
  isAuthenticated: boolean;
  login: (user: any) => void;
  logout: () => void;
}>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false })
}));

const usePostsStore = create<{
  posts: any[];
  addPost: (post: any) => void;
  removePost: (id: number) => void;
}>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  removePost: (id) => set((state) => ({ 
    posts: state.posts.filter(p => p.id !== id) 
  }))
}));

const useUIStore = create<{
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}>((set, get) => ({
  theme: 'light',
  sidebarOpen: true,
  toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen })
}));

const useCartStore = create<{
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: number) => void;
  clear: () => void;
}>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(i => i.id !== id) 
  })),
  clear: () => set({ items: [] })
}));

function GoodComponent() {
  // Only subscribes to auth store - won't re-render when UI or cart changes
  const user = useAuthStore(state => state.user);
  const theme = useUIStore(state => state.theme);
  
  return <div className={theme}>{user?.name}</div>;
}

// ✅ Benefits of separation:
// 1. Better performance - components only re-render when their data changes
// 2. Easier testing - test each store independently
// 3. Better code organization - clear domain boundaries
// 4. Easier to understand - each store has a single responsibility

export { 
  useBadAppStore, 
  BadComponent,
  useAuthStore,
  usePostsStore,
  useUIStore,
  useCartStore,
  GoodComponent 
};
