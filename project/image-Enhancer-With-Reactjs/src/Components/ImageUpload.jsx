import React, { useState, useRef } from 'react';
import { Upload, ImageIcon, AlertCircle } from 'lucide-react';

const ImageUpload = ({ onImageUpload, isProcessing, error }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size too large. Please choose an image smaller than 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        // Pass both the data URL and the file object
        onImageUpload(e.target.result, file);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto opacity-100 transform translate-y-0 transition-all duration-600">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          dragOver
            ? 'border-blue-400 bg-blue-50/10 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/5'
        } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
          className="hidden"
        />

        <div className={`transition-transform duration-300 ${dragOver ? 'scale-110' : 'scale-100'}`}>
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Drop your image here
        </h3>
        <p className="text-gray-500 mb-4">
          or click to browse files
        </p>

        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200">
          <ImageIcon className="h-4 w-4 mr-2" />
          Select Image
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100/20 border border-red-400/50 rounded-lg backdrop-blur-sm">
          <div className="flex items-center text-red-400">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;