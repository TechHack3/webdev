import React from 'react';
import { Sparkles } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-gray-400/10 backdrop-blur-md border-b border-white/20 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            <h1 className="text-2xl font-bold text-white">AI Enhancer</h1>
          </div>
          <div className="flex items-center space-x-6">
            <a 
              href="#home" 
              className="text-white/80 hover:text-white transition-colors hover:scale-110 duration-200"
            >
              Home
            </a>
            <a 
              href="#about" 
              className="text-white/80 hover:text-white transition-colors hover:scale-110 duration-200"
            >
              About
            </a>
            <button 
              className="bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-lg text-white font-medium hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
              onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;