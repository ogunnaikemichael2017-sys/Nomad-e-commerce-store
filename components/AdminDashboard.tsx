
import React, { useState } from 'react';
import { Product, BlogPost } from '../types';

interface AdminDashboardProps {
  products: Product[];
  categories: string[];
  blogs: BlogPost[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateCategories: (categories: string[]) => void;
  onUpdateBlogs: (blogs: BlogPost[]) => void;
  onPreviewImage: (url: string) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  blogs,
  onUpdateProducts,
  onUpdateCategories,
  onUpdateBlogs,
  onPreviewImage,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'blogs'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newCategory, setNewCategory] = useState('');

  // Product Handlers
  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      color: formData.get('color') as string,
      image: formData.get('image') as string,
      description: formData.get('description') as string,
    };

    if (editingProduct) {
      onUpdateProducts(products.map(p => p.id === editingProduct.id ? productData : p));
    } else {
      onUpdateProducts([...products, productData]);
    }
    setEditingProduct(null);
  };

  const deleteProduct = (id: string) => {
    onUpdateProducts(products.filter(p => p.id !== id));
  };

  // Category Handlers
  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      onUpdateCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  // Blog Handlers
  const addBlogPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: 'New Journal Entry',
      excerpt: 'A brief summary of the story...',
      content: 'The full story goes here.',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'
    };
    onUpdateBlogs([newPost, ...blogs]);
  };

  const deleteBlog = (id: string) => {
    onUpdateBlogs(blogs.filter(b => b.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col font-sans">
      <header className="border-b border-gray-100 p-6 flex justify-between items-center bg-white sticky top-0">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold tracking-tighter italic">NOMAD ADMIN</span>
          <div className="h-4 w-px bg-gray-200"></div>
          <nav className="flex space-x-6 text-[10px] uppercase tracking-widest font-bold">
            <button 
              onClick={() => setActiveTab('products')}
              className={`${activeTab === 'products' ? 'text-black' : 'text-gray-400'}`}
            >Products</button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`${activeTab === 'categories' ? 'text-black' : 'text-gray-400'}`}
            >Categories</button>
            <button 
              onClick={() => setActiveTab('blogs')}
              className={`${activeTab === 'blogs' ? 'text-black' : 'text-gray-400'}`}
            >Journal</button>
          </nav>
        </div>
        <button onClick={onClose} className="text-[10px] uppercase tracking-widest font-bold border border-black px-4 py-2 hover:bg-black hover:text-white transition">Exit Dashboard</button>
      </header>

      <main className="flex-1 overflow-y-auto p-12 max-w-7xl mx-auto w-full">
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <h2 className="text-3xl serif italic">Product Inventory</h2>
              <button 
                onClick={() => setEditingProduct({ id: '', name: '', price: 0, category: categories[0] || 'Clothing', color: '', image: '', description: '' })}
                className="bg-black text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold"
              >Add New Product</button>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  <th className="py-4 font-medium">Image</th>
                  <th className="py-4 font-medium">Name</th>
                  <th className="py-4 font-medium">Category</th>
                  <th className="py-4 font-medium">Price</th>
                  <th className="py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {products.map(product => (
                  <tr key={product.id} className="border-b border-gray-50 group hover:bg-gray-50 transition">
                    <td className="py-4 w-20">
                      <div className="relative group/thumb cursor-zoom-in" onClick={() => onPreviewImage(product.image)}>
                        <img src={product.image} className="w-12 h-16 object-cover bg-gray-100" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-bold">{product.name}</td>
                    <td className="py-4 uppercase tracking-wider text-gray-400">{product.category}</td>
                    <td className="py-4">${product.price}</td>
                    <td className="py-4 text-right space-x-4">
                      <button onClick={() => setEditingProduct(product)} className="hover:text-black text-gray-400 font-bold uppercase tracking-tighter">Edit</button>
                      <button onClick={() => deleteProduct(product.id)} className="hover:text-red-500 text-gray-400 font-bold uppercase tracking-tighter">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="max-w-md space-y-8">
            <h2 className="text-3xl serif italic">Manage Categories</h2>
            <div className="flex space-x-2">
              <input 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New Category Name..."
                className="flex-1 border-b border-gray-200 outline-none text-xs py-2"
              />
              <button onClick={addCategory} className="bg-black text-white px-4 py-2 text-[10px] uppercase font-bold tracking-widest">Add</button>
            </div>
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat} className="flex justify-between items-center p-3 border border-gray-100 group hover:border-black transition">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{cat}</span>
                  <button 
                    onClick={() => onUpdateCategories(categories.filter(c => c !== cat))}
                    className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-widest font-bold text-red-500 hover:scale-105 transition"
                  >Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <h2 className="text-3xl serif italic">The NOMAD Journal</h2>
              <button onClick={addBlogPost} className="bg-black text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold">Write Entry</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogs.map(blog => (
                <div key={blog.id} className="border border-gray-100 p-6 space-y-4 group hover:border-black transition">
                  <div className="aspect-video bg-gray-100 overflow-hidden cursor-zoom-in" onClick={() => onPreviewImage(blog.image)}>
                    <img src={blog.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] uppercase tracking-widest text-gray-400">{blog.date}</p>
                    <h3 className="text-lg serif italic">{blog.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{blog.excerpt}</p>
                  </div>
                  <div className="flex space-x-4 pt-2">
                    <button className="text-[9px] uppercase tracking-widest font-bold border-b border-black pb-1">Edit Entry</button>
                    <button onClick={() => deleteBlog(blog.id)} className="text-[9px] uppercase tracking-widest font-bold text-red-500 border-b border-red-500 pb-1">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Edit Product Modal Overlay */}
      {editingProduct && (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl serif italic mb-8">{editingProduct.id ? 'Edit' : 'New'} Product</h3>
            <form onSubmit={handleSaveProduct} className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold">Product Name</label>
                <input name="name" defaultValue={editingProduct.name} required className="w-full border-b border-gray-200 py-2 text-xs outline-none focus:border-black" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold">Price ($)</label>
                <input name="price" type="number" defaultValue={editingProduct.price} required className="w-full border-b border-gray-200 py-2 text-xs outline-none focus:border-black" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold">Category</label>
                <select name="category" defaultValue={editingProduct.category} className="w-full border-b border-gray-200 py-2 text-xs outline-none focus:border-black">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold">Color</label>
                <input name="color" defaultValue={editingProduct.color} required className="w-full border-b border-gray-200 py-2 text-xs outline-none focus:border-black" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold">Image URL</label>
                <input name="image" defaultValue={editingProduct.image} required className="w-full border-b border-gray-200 py-2 text-xs outline-none focus:border-black" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold">Description</label>
                <textarea name="description" defaultValue={editingProduct.description} className="w-full border border-gray-100 p-3 text-xs outline-none focus:border-black min-h-[100px]" />
              </div>
              <div className="col-span-2 pt-4 flex space-x-4">
                <button type="submit" className="flex-1 bg-black text-white py-4 text-[10px] uppercase font-bold tracking-widest">Save Changes</button>
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 border border-black py-4 text-[10px] uppercase font-bold tracking-widest">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
