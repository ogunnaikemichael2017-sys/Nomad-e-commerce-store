
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2070" 
        alt="Hero Banner" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative text-center text-white space-y-8 px-4 max-w-4xl">
        <h1 className="text-6xl md:text-9xl font-light tracking-tight leading-none">
          The Modern Uniform
        </h1>
        <p className="text-sm md:text-lg tracking-[0.4em] uppercase font-light">
          Unisex Essentials for the Contemporary Soul
        </p>
        <div className="pt-4">
          <button className="bg-white text-black px-12 py-5 uppercase text-[10px] tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all duration-500 shadow-2xl">
            Explore Collection
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-50">
        <span className="text-[10px] uppercase tracking-widest text-white">Scroll</span>
        <div className="w-px h-12 bg-white"></div>
      </div>
    </section>
  );
};

export default Hero;
