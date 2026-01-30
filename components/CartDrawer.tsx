
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string, isSubscription?: boolean, frequency?: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove }) => {
  const subtotal = items.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-light uppercase tracking-widest">Your Bag ({items.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <svg className="w-12 h-12 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <p className="text-xs uppercase tracking-widest">Your bag is empty</p>
                <button onClick={onClose} className="text-[10px] font-bold border-b border-black pb-1 hover:text-black/50 hover:border-black/50 transition">Shop Essentials</button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={`${item.id}-${item.isSubscription}-${item.subscriptionFrequency}-${idx}`} className="flex space-x-4">
                  <div className="w-24 h-32 bg-gray-50 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold uppercase">{item.name}</h3>
                        {item.isSubscription && (
                          <span className="text-[8px] bg-black text-white px-1.5 py-0.5 uppercase tracking-tighter rounded">Member</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 italic">{item.color} • Qty {item.quantity}</p>
                      {item.isSubscription && (
                        <p className="text-[9px] text-black font-bold uppercase tracking-widest mt-1">
                          Refill Every {item.subscriptionFrequency}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-xs font-medium">
                        ${item.finalPrice}
                        {item.isSubscription && <span className="text-[10px] text-gray-400 line-through ml-2 font-normal">${item.price}</span>}
                      </p>
                      <button 
                        onClick={() => onRemove(item.id, item.isSubscription, item.subscriptionFrequency)}
                        className="text-[9px] uppercase tracking-widest font-bold text-gray-400 hover:text-black transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-light">Shipping & taxes calculated at checkout.</p>
              <button className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition shadow-lg">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
