import React from 'react';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  fontSize?: number;
  bubbleColor?: string;
  textColor?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  isUser, 
  fontSize = 15,
  bubbleColor,
  textColor
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
        className={`max-w-[85%] rounded-lg px-4 py-3 whitespace-pre-wrap ${
          isUser ? 'rounded-tr-none' : 'rounded-tl-none'
        } shadow-[0_2px_4px_rgba(0,0,0,0.3)]`}
        style={{ 
          backgroundColor: bubbleColor || (isUser ? '#DCF8C6' : 'white')
        }}
      >
        <p 
          className="flex items-center [:where(.gif-rendering)_&]:-mt-4"
          style={{ 
            fontSize: `${fontSize}px`,
            color: textColor || '#303030'
          }}
        >
          {formatMessage(message)}
        </p>
      </div>
    </div>
  );
};