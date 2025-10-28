import React from 'react';
import ImagePreview from '../Components/ImagePreview';
import ImageUpload from '../Components/ImageUpload';
import TypingEffect from '../Components/TypingEffect';

const Home = ({ 
  originalImage, 
  enhancedImage, 
  isProcessing, 
  error, 
  onImageUpload, 
  onEnhance, 
  onDownload, 
  onClear 
}) => {
  return (
    <div className="min-h-screen pt-20 px-4 opacity-100 transition-opacity duration-800">
      <div className="container mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-5xl font-bold text-white mb-4">
            <TypingEffect text="Enhance Your Images with AI" />
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Transform your ordinary photos into extraordinary masterpieces using cutting-edge AI technology
          </p>
        </div>

        {/* Upload Section */}
        <ImageUpload 
          onImageUpload={onImageUpload} 
          isProcessing={isProcessing} 
          error={error}
        />

        {/* Preview Section */}
        <ImagePreview
          originalImage={originalImage}
          enhancedImage={enhancedImage}
          isProcessing={isProcessing}
          onEnhance={onEnhance}
          onDownload={onDownload}
          onClear={onClear}
        />

        {/* Features Section */}
        {!originalImage && (
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose AI Enhancer?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="text-blue-400 text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-gray-300">Process your images in seconds with our advanced AI algorithms</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="text-green-400 text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-white mb-2">High Quality</h3>
                <p className="text-gray-300">Get professional-grade results with incredible detail enhancement</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="text-purple-400 text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
                <p className="text-gray-300">Your images are processed securely and never stored permanently</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;