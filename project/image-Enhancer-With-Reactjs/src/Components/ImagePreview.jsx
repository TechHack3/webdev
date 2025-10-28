import React from 'react';
import { X, Sparkles, Zap, ImageIcon, Download } from 'lucide-react';

const ImagePreview = ({
  originalImage,
  enhancedImage,
  isProcessing,
  onEnhance,
  onDownload,
  onClear,
}) => {
  if (!originalImage) return null;

  // Handle download functionality
  const handleDownload = async () => {
    if (!enhancedImage) return;
    
    try {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = enhancedImage;
      link.download = `enhanced-image-${Date.now()}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open image in new tab
      window.open(enhancedImage, '_blank');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 opacity-100 transform translate-y-0 transition-all duration-600">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Image Preview</h2>
          <button
            onClick={onClear}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:scale-110 duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image Columns */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Original */}
          <div className="space-y-4 transform translate-x-0 opacity-100 transition-all duration-600">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <ImageIcon className="h-5 w-5 mr-2" />
              Original
            </h3>
            <div className="relative h-72 bg-gray-400/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center overflow-hidden">
              <img
                src={originalImage}
                alt="Original"
                className="max-w-full max-h-full object-contain shadow-2xl"
                onError={(e) => {
                  console.error('Failed to load original image:', e);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Enhanced */}
          <div className="space-y-4 transform translate-x-0 opacity-100 transition-all duration-600">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Enhanced
            </h3>
            <div className="relative h-72 bg-gray-400/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center overflow-hidden">
              {isProcessing ? (
                <div className="flex flex-col items-center opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-white mt-4">Enhancing...</p>
                </div>
              ) : enhancedImage ? (
                <img
                  src={enhancedImage}
                  alt="Enhanced"
                  className="max-w-full max-h-full object-contain opacity-100 scale-100 transition-all duration-600"
                  onError={(e) => {
                    console.error('Failed to load enhanced image:', enhancedImage);
                    e.target.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log('Enhanced image loaded successfully:', enhancedImage);
                  }}
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Zap className="h-12 w-12 mx-auto mb-2" />
                  <p>Enhanced image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-6 justify-center opacity-100 transform translate-y-0 transition-all duration-600 delay-200">
          <button
            onClick={onEnhance}
            disabled={isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center hover:scale-105 transition-transform duration-200"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Enhance Image
              </>
            )}
          </button>

          {enhancedImage && !isProcessing && (
            <button
              onClick={onDownload || handleDownload}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium flex items-center hover:scale-105 transition-transform duration-200 opacity-100"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          )}
        </div>

        {/* Debug info (remove in production) */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-xs text-gray-300">
            <p><strong>Original:</strong> {originalImage ? 'Loaded' : 'Not loaded'}</p>
            <p><strong>Enhanced:</strong> {enhancedImage ? 'Loaded' : 'Not loaded'}</p>
            <p><strong>Processing:</strong> {isProcessing ? 'Yes' : 'No'}</p>
            {enhancedImage && <p><strong>Enhanced URL:</strong> {enhancedImage.substring(0, 50)}...</p>}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ImagePreview;