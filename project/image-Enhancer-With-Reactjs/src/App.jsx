import React, { useState } from "react";
import { motion } from "framer-motion";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import TypingEffect from "./Components/TypingEffect";
import { enhancedImageAPI } from "./utils/enhanceImageApi";

const App = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  const handleImageUpload = (imageDataUrl, file) => {
    setOriginalImage(imageDataUrl);
    setOriginalFile(file);
    setEnhancedImage(null); // Clear previous result
    setError(null); // Clear previous errors
  };

  const handleEnhance = async () => {
    if (!originalFile) {
      setError("No image file selected");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await enhancedImageAPI(originalFile);
      setEnhancedImage(result.output_url);
    } catch (error) {
      console.error("Enhancement failed:", error);
      setError(error.message || "Failed to enhance image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!enhancedImage) return;

    try {
      const response = await fetch(enhancedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = "enhanced-image.png";
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download image. Please try again.");
    }
  };

  const onClear = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setOriginalFile(null);
    setError(null);
  };

  return (
    <>
      <Navbar />
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h1 className="text-5xl font-bold m-4">
            <TypingEffect text="It's a free image enhancer" />
          </h1>
          <div className="mt-4">
            <h2>
              <TypingEffect text="Enhance images with AI, made by Manab Biswas!" />
            </h2>
          </div>
          <p className="text-xl text-gray-300 my-2.5">
            Upload the Image to enhance with AI
          </p>
          <p>Made By Manab Biswas</p>
          <p>Powered By picWish API</p>
          <p>Special thanks to Sheryian Coding School</p>
        </motion.div>
      </motion.div>
      <Home
        originalImage={originalImage}
        enhancedImage={enhancedImage}
        isProcessing={isProcessing}
        error={error}
        onImageUpload={handleImageUpload}
        onEnhance={handleEnhance}
        onDownload={handleDownload}
        onClear={onClear}
      />
      <Footer />
    </>
  );
};

export default App;