import React from 'react';
import { Bot } from 'lucide-react';

interface ChatHeaderProps {
  avatarUrl: string | null;
  name: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ avatarUrl, name }) => {
  return (
    <div className="bg-[#008069] text-white p-4 pt-8">
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
        <h1 className="text-lg font-semibold">{name}</h1>
      </div>
    </div>
  );
};