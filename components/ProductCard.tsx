
import React, { useState } from 'react';
import { Product, CartItem } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: CartItem) => void;
  onPreview: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onPreview }) => {
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>('one-time');
  const [frequency, setFrequency] = useState('30 Days');
  
  const discount = 0.15;
  const subscriptionPrice = Math.round(product.price * (1 - discount));
  const currentPrice = purchaseType === 'subscription' ? subscriptionPrice : product.price;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart({
      ...product,
      quantity: 1,
      isSubscription: purchaseType === 'subscription',
      subscriptionFrequency: purchaseType === 'subscription' ? frequency : undefined,
      finalPrice: currentPrice
    });
  };

  return (
    <div className="product-card group cursor-pointer flex flex-col h-full">
      <div 
        className="relative overflow-hidden bg-gray-50 aspect-[3/4]"
        onClick={onPreview}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm">
             <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-tight">{product.name}</h3>
          <p className="text-gray-400 text-[11px] italic font-light">{product.color}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium">${currentPrice}</p>
          {purchaseType === 'subscription' && (
            <p className="text-[9px] text-green-600 font-bold uppercase tracking-tighter">Save 15%</p>
          )}
        </div>
      </div>

      {/* Subscription Selector */}
      <div className="space-y-2 mb-6">
        <div 
          onClick={() => setPurchaseType('one-time')}
          className={`flex items-center justify-between p-3 border transition-colors ${purchaseType === 'one-time' ? 'border-black bg-black/5' : 'border-gray-100'}`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${purchaseType === 'one-time' ? 'border-black' : 'border-gray-300'}`}>
              {purchaseType === 'one-time' && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold">One-time purchase</span>
          </div>
          <span className="text-[10px] text-gray-400">${product.price}</span>
        </div>

        <div 
          onClick={() => setPurchaseType('subscription')}
          className={`p-3 border transition-colors ${purchaseType === 'subscription' ? 'border-black bg-black/5' : 'border-gray-100'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${purchaseType === 'subscription' ? 'border-black' : 'border-gray-300'}`}>
                {purchaseType === 'subscription' && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold">Subscribe & Save</span>
            </div>
            <span className="text-[10px] text-black font-bold">${subscriptionPrice}</span>
          </div>
          
          {purchaseType === 'subscription' && (
            <div className="mt-3 pt-3 border-t border-black/10 flex items-center justify-between">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest">Delivery Every:</span>
              <select 
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent text-[9px] font-bold uppercase tracking-widest outline-none cursor-pointer"
              >
                <option>30 Days</option>
                <option>60 Days</option>
                <option>90 Days</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleAdd}
        className="mt-auto w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-lg active:scale-[0.98]"
      >
        {purchaseType === 'subscription' ? 'Add Subscription' : 'Add to Bag'}
      </button>
    </div>
  );
};

export default ProductCard;
