import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 text-center border-t border-white/20">
      <p className="text-sm">&copy; {new Date().getFullYear()} AI Image Enhancer. 
        {/* Built by Manab Biswas. */}
        </p>
    </footer>
  );
};

export default Footer;