
import React, { useState } from 'react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onStylistClick: () => void;
  onLogoClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, onStylistClick, onLogoClick }) => {
  return (
    <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div 
          onClick={onLogoClick}
          className="text-2xl font-bold tracking-tighter italic cursor-pointer select-none active:scale-95 transition-transform"
        >
          NOMAD
        </div>
        
        <div className="hidden md:flex space-x-8 text-[10px] uppercase tracking-[0.2em] font-medium">
          <a href="#" className="hover:text-gray-400 transition">New Arrivals</a>
          <a href="#" className="hover:text-gray-400 transition">Clothing</a>
          <a href="#" className="hover:text-gray-400 transition">Footwear</a>
          <a href="#" className="hover:text-gray-400 transition">Lookbook</a>
        </div>

        <div className="flex items-center space-x-6">
          <button 
            onClick={onStylistClick}
            className="hidden sm:flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-black transition"
          >
            <span>✨ AI Stylist</span>
          </button>
          <button aria-label="Search" className="hover:opacity-60 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
          <button 
            onClick={onCartClick}
            aria-label="Cart" 
            className="relative hover:opacity-60 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
