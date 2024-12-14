import React from 'react';
import { Bot } from 'lucide-react';

interface ChatHeaderProps {
  avatarUrl: string | null;
  name: string;
  backgroundColor?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  avatarUrl, 
  name,
  backgroundColor = '#128c7e'
}) => {
  return (
    <div 
      className="text-white px-4 pt-12 pb-2"
      style={{ backgroundColor }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '';
                e.currentTarget.parentElement!.innerHTML = '<Bot className="text-white" size={24} />';
              }}
            />
          ) : (
            <Bot className="text-white" size={24} />
          )}
        </div>
        <h1 className="text-lg font-semibold leading-6 [.gif-rendering_&]:-mt-5">{name}</h1>
      </div>
    </div>
  );
};