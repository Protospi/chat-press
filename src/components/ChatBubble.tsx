import React from 'react';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  fontSize?: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  isUser, 
  fontSize = 14
}) => {
  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-3 whitespace-pre-wrap ${
          isUser
            ? 'bg-[#DCF8C6] rounded-tr-none'
            : 'bg-white rounded-tl-none'
        } shadow-[0_2px_4px_rgba(0,0,0,0.3)]`}
      >
        <p 
          className="text-[#303030] flex items-center [:where(.gif-rendering)_&]:-mt-4"
          style={{ fontSize: `${fontSize}px` }}
        >
          {formatMessage(message)}
        </p>
      </div>
    </div>
  );
};