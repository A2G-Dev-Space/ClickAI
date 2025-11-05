import React from 'react';
import { useChatStore } from '../store/chatStore';

interface SuggestedQuestionProps {
  question: string;
}

const SuggestedQuestion: React.FC<SuggestedQuestionProps> = ({ question }) => {
  const sendMessage = useChatStore((state) => state.sendMessage);

  const handleClick = () => {
    sendMessage(question);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 text-sm text-left hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {question}
    </button>
  );
};

export default SuggestedQuestion;
