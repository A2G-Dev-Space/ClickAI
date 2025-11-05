import React from 'react';
import { MessageType } from '@/shared/types';

interface CitationProps {
  referenceId: string;
}

const Citation: React.FC<CitationProps> = ({ referenceId }) => {
  const citationNumber = referenceId.split('-').pop();

  const handleClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: MessageType.SHOW_CONTEXT_RESULT, // Re-using for highlighting
          payload: { referenceId },
        });
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 text-xs font-bold mx-1 align-middle transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
      title={`Go to source ${citationNumber}`}
      aria-label={`Citation ${citationNumber}`}
    >
      {citationNumber}
    </button>
  );
};

export default Citation;
