// Enhanced API configuration for Vite + React
import axios from "axios";

// Configuration - Vite uses VITE_ prefix for environment variables
const API_KEY = import.meta.env.VITE_API_KEY || "YOUR_API_KEY_HERE";

const BASE_URL = "https://techhk.aoscdn.com";
const MAXIMUM_RETRIES = 30;
const POLL_INTERVAL = 2000; // 2 seconds

// Validate API key with Vite-specific error message
if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
  console.error("❌ API key not configured!");
  console.log("For Vite: Set VITE_API_KEY in your .env file");
  console.log("Example: VITE_API_KEY=your_actual_api_key_here");
}

/**
 * Main function to enhance an image
 * @param {File} file - The image file to enhance
 * @returns {Promise<Object>} Enhanced image data
 */
export const enhancedImageAPI = async (file) => {
  try {
    // Check API key first
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
      throw new Error('API key not configured. Please set your API key in the .env file.');
    }

    // Validate input
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please provide a valid image file.');
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size too large. Please choose an image smaller than 10MB.');
    }

    console.log('📤 Uploading image for enhancement...');
    console.log('📋 File details:', {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.type
    });

    const taskId = await uploadImage(file);
    
    console.log('⏳ Processing image enhancement...');
    const enhancedImageData = await pollForEnhancedImage(taskId);
    
    console.log('✅ Image enhancement completed');
    return enhancedImageData;
    
  } catch (error) {
    console.error('❌ Error enhancing image:', error);
    throw new Error(error.message || 'Failed to enhance image. Please try again.');
  }
};

/**
 * Upload image to the API
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} Task ID for tracking
 */
const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image_file", file);

    console.log('🔑 Using API key:', API_KEY.substring(0, 8) + '...');
    console.log('📤 Uploading to:', `${BASE_URL}/api/tasks/visual/scale`);

    const response = await axios.post(
      `${BASE_URL}/api/tasks/visual/scale`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": API_KEY,
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    console.log('📥 Upload response:', response.data);

    if (!response.data?.data?.task_id) {
      throw new Error("Upload failed: No task ID received from server");
    }

    console.log('✅ Upload successful, task ID:', response.data.data.task_id);
    return response.data.data.task_id;
    
  } catch (error) {
    console.error('❌ Upload error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response) {
      // Server responded with an error
      const status = error.response.status;
      const message = error.response.data?.message || 'Unknown server error';
      
      switch (status) {
        case 401:
          throw new Error('Invalid API key. Please check your API key configuration.');
        case 429:
          throw new Error('Rate limit exceeded. Please try again later.');
        case 413:
          throw new Error('File too large. Please use a smaller image.');
        case 400:
          throw new Error(`Bad request: ${message}`);
        default:
          throw new Error(`Server error (${status}): ${message}`);
      }
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your internet connection and try again.');
    } else {
      // Other error
      throw new Error(error.message || 'Failed to upload image');
    }
  }
};

/**
 * Poll for enhanced image result
 * @param {string} taskId - Task ID to poll
 * @param {number} retries - Current retry count
 * @returns {Promise<Object>} Enhanced image data
 */
const pollForEnhancedImage = async (taskId, retries = 0) => {
  try {
    console.log(`🔍 Checking task status... (${retries + 1}/${MAXIMUM_RETRIES})`);
    const result = await fetchEnhancedImage(taskId);

    console.log('📊 Task status:', {
      state: result.state,
      progress: result.progress || 'N/A',
      task_id: taskId
    });

    // Check if still processing
    if (result.state === 4) {
      if (retries >= MAXIMUM_RETRIES) {
        throw new Error('Processing timeout. The image is taking too long to enhance. Please try again.');
      }

      console.log(`⏳ Still processing... (${retries + 1}/${MAXIMUM_RETRIES})`);
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
      
      return pollForEnhancedImage(taskId, retries + 1);
    }

    // Check if processing failed
    if (result.state === 3) {
      throw new Error('Image processing failed. Please try again with a different image.');
    }

    // Check if completed successfully
    if (result.state === 1) {
      console.log('🎉 Enhancement completed successfully!');
      console.log('📋 Full result object:', result);
      
      // The API returns 'image' property, not 'output_url'
      const outputUrl = result.image;
      
      if (outputUrl) {
        return {
          output_url: outputUrl,  // Return as output_url for consistency with your app
          task_id: taskId,
          state: result.state,
          processing_time: result.processing_time || 'N/A'
        };
      } else {
        console.error('❌ No image URL found in result:', result);
        throw new Error('Enhancement completed but no image URL received. Please try again.');
      }
    }

    // Check for other known states
    if (result.state === 0) {
      throw new Error('Task is queued. Please wait and try again.');
    }

    if (result.state === 2) {
      throw new Error('Task is being processed. Please wait and try again.');
    }

    // Unknown state
    console.error('❌ Unknown processing state:', result.state, 'Full result:', result);
    throw new Error(`Unexpected processing state: ${result.state}. Please contact support.`);
    
  } catch (error) {
    if (error.message.includes('Processing timeout') || 
        error.message.includes('Unexpected processing state')) {
      throw error;
    }
    
    // Retry on network errors
    if (retries < 3) {
      console.log(`🔄 Retrying fetch... (${retries + 1}/3)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return pollForEnhancedImage(taskId, retries + 1);
    }
    
    throw new Error('Failed to fetch enhanced image. Please try again.');
  }
};

/**
 * Fetch enhanced image status
 * @param {string} taskId - Task ID to check
 * @returns {Promise<Object>} Image processing status
 */
const fetchEnhancedImage = async (taskId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/tasks/visual/scale/${taskId}`,
      {
        headers: {
          "X-API-KEY": API_KEY,
        },
        timeout: 15000, // 15 seconds timeout
      }
    );

    if (!response.data?.data) {
      throw new Error("Invalid response from server");
    }

    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Task not found. Please try again later or re-upload the image.');
    }
    throw new Error(error.message || 'Failed to fetch image enhancement status.');
  }
};