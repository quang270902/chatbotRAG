import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text, context }) => {
  const [displayText, setDisplayText] = useState('');
  const [displayContext, setDisplayContext] = useState(null)
  const speed = 5; // Tốc độ hiển thị, milliseconds

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        setDisplayContext(context);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text]);

  return <p className="w-full bg-gray-100 text-black rounded-r-3xl rounded-tl-3xl text-justify p-5 ml-auto text-base tracking-normal leading-normal">
  {displayText}
  {displayContext}
</p>
};

export default TypingEffect;
