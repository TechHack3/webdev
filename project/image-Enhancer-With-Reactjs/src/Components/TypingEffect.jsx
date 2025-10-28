import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text, speed = 100, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayText('');
      }, delay);

      return () => clearTimeout(delayTimer);
    }
  }, [delay]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default TypingEffect;