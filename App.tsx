
import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES } from './constants';
import { Product, CartItem, BlogPost } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AIStylist from './components/AIStylist';
import AdminDashboard from './components/AdminDashboard';

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Art of Essentialism',
    excerpt: 'Exploring why less is often more in the modern urban wardrobe.',
    content: 'Full content...',
    date: 'February 12, 2024',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b2',
    title: 'Sustainability Report 2023',
    excerpt: 'Transparency on our supply chain and environmental goals.',
    content: 'Full content...',
    date: 'January 28, 2024',
    image: 'https://images.unsplash.com/photo-1542060717-d79860433221?auto=format&fit=crop&q=80&w=800'
  }
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nomad_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('nomad_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES.filter(c => c !== 'All');
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('nomad_blogs');
    return saved ? JSON.parse(saved) : INITIAL_BLOGS;
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Secret Admin States
  const [logoClicks, setLogoClicks] = useState(0);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [isAdminButtonVisible, setIsAdminButtonVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    localStorage.setItem('nomad_products', JSON.stringify(products));
    localStorage.setItem('nomad_categories', JSON.stringify(categories));
    localStorage.setItem('nomad_blogs', JSON.stringify(blogs));
  }, [products, categories, blogs]);

  const allCategories = useMemo(() => ['All', ...categories], [categories]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(p => 
        p.id === item.id && 
        p.isSubscription === item.isSubscription && 
        p.subscriptionFrequency === item.subscriptionFrequency
      );
      
      if (existing) {
        return prev.map(p => 
          (p.id === item.id && p.isSubscription === item.isSubscription && p.subscriptionFrequency === item.subscriptionFrequency)
          ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string, isSubscription?: boolean, frequency?: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === id && item.isSubscription === isSubscription && item.subscriptionFrequency === frequency)
    ));
  };

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowPasswordPrompt(true);
        return 0; // Reset count after triggering prompt
      }
      return newCount;
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '12345') {
      setIsAdminButtonVisible(true);
      setShowPasswordPrompt(false);
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 500);
      setPassword('');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        cartCount={cartCount} 
        onCartClick={() => setIsCartOpen(true)} 
        onStylistClick={() => setIsStylistOpen(true)}
        onLogoClick={handleLogoClick}
      />
      
      <main>
        <Hero />

        <section id="collection" className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0">
            <div className="space-y-4">
              <h2 className="text-5xl font-light serif italic">Curated Edit</h2>
              <div className="flex flex-wrap gap-x-8 gap-y-4 pt-2">
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] uppercase tracking-[0.3em] font-bold pb-1 transition border-b ${
                      activeCategory === cat ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
              Showing {filteredProducts.length} Results
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
                onPreview={() => setPreviewImage(product.image)}
              />
            ))}
          </div>
        </section>

        {/* Blog, Lifestyle, Newsletter sections remain unchanged */}
        <section className="border-t border-gray-100 py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">The Archive</p>
                <h2 className="text-5xl font-light serif italic">The Journal</h2>
              </div>
              <button className="text-[10px] uppercase tracking-widest font-bold border-b border-black pb-1 hover:opacity-50 transition">View All Stories</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {blogs.map(blog => (
                <article key={blog.id} className="group cursor-pointer" onClick={() => setPreviewImage(blog.image)}>
                  <div className="aspect-[4/5] bg-gray-50 overflow-hidden mb-6">
                    <img src={blog.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[9px] uppercase tracking-widest text-gray-400">{blog.date}</p>
                    <h3 className="text-xl serif italic leading-tight group-hover:text-gray-500 transition">{blog.title}</h3>
                    <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-2">{blog.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-light leading-tight serif">
                Sustainability in <br/> Every Stitch.
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed font-light max-w-md">
                NOMAD is committed to ethical manufacturing and minimal environmental impact. Our essentials are built to last beyond seasons, reducing the need for constant consumption.
              </p>
              <button className="text-[10px] font-bold uppercase tracking-[0.3em] border-b border-black pb-2 hover:opacity-50 transition">
                Our Philosophy
              </button>
            </div>
            <div className="relative aspect-square md:aspect-[4/5] bg-gray-200 cursor-zoom-in" onClick={() => setPreviewImage("https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=1200")}>
               <img 
                 src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=1200" 
                 alt="Lifestyle" 
                 className="w-full h-full object-cover shadow-2xl"
               />
               <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white p-4 shadow-xl hidden lg:block">
                  <p className="text-[9px] uppercase tracking-widest leading-loose font-medium">
                    Fall/Winter <br/> 2024 Collection <br/> Available Now
                  </p>
               </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-32 text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-4xl mb-6 serif italic">Join the Inner Circle</h2>
            <p className="text-gray-400 text-xs mb-12 tracking-widest uppercase font-light">Be the first to know about new drops and exclusive access.</p>
            <form className="flex border-b border-black pb-3 group" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="email@address.com" 
                className="bg-transparent flex-grow outline-none text-[10px] uppercase tracking-[0.3em] p-2 focus:placeholder-transparent transition"
              />
              <button className="uppercase text-[10px] font-bold tracking-[0.3em] px-4 group-hover:translate-x-1 transition">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer code unchanged */}
      <footer className="bg-white border-t border-gray-100 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tighter italic">NOMAD</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Premium unisex essentials for the modern lifestyle. Designed in London, crafted globally.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold">Shop</h4>
            <ul className="text-xs text-gray-400 space-y-2 font-light">
              <li><a href="#" className="hover:text-black transition">New Arrivals</a></li>
              <li><a href="#" className="hover:text-black transition">Clothing</a></li>
              <li><a href="#" className="hover:text-black transition">Footwear</a></li>
              <li><a href="#" className="hover:text-black transition">Lookbook</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold">Help</h4>
            <ul className="text-xs text-gray-400 space-y-2 font-light">
              <li><a href="#" className="hover:text-black transition">Shipping</a></li>
              <li><a href="#" className="hover:text-black transition">Returns</a></li>
              <li><a href="#" className="hover:text-black transition">Contact</a></li>
              <li><a href="#" className="hover:text-black transition">Privacy</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold">Admin</h4>
            <ul className="text-xs text-gray-400 space-y-2 font-light">
              <li><button onClick={() => setIsAdminOpen(true)} className="hover:text-black transition">Dashboard</button></li>
              <li><a href="#" className="hover:text-black transition">Analytics</a></li>
              <li><a href="#" className="hover:text-black transition">Settings</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 flex justify-between items-center text-[9px] uppercase tracking-widest text-gray-300">
          <p>© 2024 NOMAD Essentials. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>Terms</span>
            <span>Privacy</span>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemove={handleRemoveFromCart}
      />
      <AIStylist 
        isOpen={isStylistOpen} 
        onClose={() => setIsStylistOpen(false)} 
      />
      {isAdminOpen && (
        <AdminDashboard 
          products={products}
          categories={categories}
          blogs={blogs}
          onUpdateProducts={setProducts}
          onUpdateCategories={setCategories}
          onUpdateBlogs={setBlogs}
          onPreviewImage={setPreviewImage}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Secret Password Prompt */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className={`bg-white p-12 max-w-sm w-full shadow-2xl transition-transform duration-300 ${passwordError ? 'animate-bounce' : ''}`}>
             <div className="text-center space-y-4 mb-8">
               <h3 className="text-3xl serif italic">Vault Access</h3>
               <p className="text-[10px] uppercase tracking-widest text-gray-400">Security Clearance Required</p>
             </div>
             <form onSubmit={handlePasswordSubmit} className="space-y-6">
               <input 
                 autoFocus
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className={`w-full border-b text-center text-2xl tracking-[1em] outline-none py-2 focus:border-black transition-colors ${passwordError ? 'border-red-500' : 'border-gray-200'}`}
                 placeholder="•••••"
               />
               <div className="flex space-x-4 pt-4">
                 <button 
                   type="submit"
                   className="flex-1 bg-black text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition"
                 >
                   Authorize
                 </button>
                 <button 
                   type="button"
                   onClick={() => setShowPasswordPrompt(false)}
                   className="flex-1 border border-black py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition"
                 >
                   Cancel
                 </button>
               </div>
             </form>
             {passwordError && (
               <p className="text-center text-[9px] uppercase tracking-widest text-red-500 mt-4 font-bold">Invalid Credential</p>
             )}
          </div>
        </div>
      )}

      {/* Conditional Floating Admin Button */}
      {isAdminButtonVisible && !isAdminOpen && (
        <button
          onClick={() => setIsAdminOpen(true)}
          className="fixed bottom-8 left-8 z-30 bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group overflow-hidden"
          title="Admin Dashboard"
        >
          <span className="text-[10px] font-bold tracking-tighter italic uppercase group-hover:hidden animate-pulse">Admin</span>
          <svg className="w-5 h-5 hidden group-hover:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <button className="absolute top-8 right-8 text-white p-2 hover:opacity-50 transition">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <img 
            src={previewImage} 
            className="max-w-full max-h-full object-contain shadow-2xl animate-in fade-in zoom-in duration-300" 
            alt="Preview" 
          />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-[10px] uppercase tracking-widest font-bold">
            High Resolution Preview
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
