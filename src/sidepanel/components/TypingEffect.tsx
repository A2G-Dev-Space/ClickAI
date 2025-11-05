import { useState, useEffect, useRef } from 'react';

interface TypingEffectProps {
  text: string;
  children: (text: string) => React.ReactNode;
}

export default function TypingEffect({ text, children }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  const currentIndexRef = useRef(0);

  useEffect(() => {
    if (!text) return;

    const intervalId = setInterval(() => {
      if (currentIndexRef.current < text.length) {
        setDisplayedText(text.substring(0, currentIndexRef.current + 1));
        currentIndexRef.current += 1;
      } else {
        clearInterval(intervalId);
      }
    }, 20);

    return () => clearInterval(intervalId);
  }, [text]);

  return <>{children(displayedText)}</>;
}
