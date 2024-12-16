import React from 'react';
import { ChevronLeft, Phone, Video } from 'lucide-react';

interface ChatHeaderProps {
  avatarUrl: string | null;
  name: string;
  backgroundColor: string;
  isHidden?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  avatarUrl, 
  name, 
  backgroundColor,
  isHidden = false 
}) => {
  return (
    <div style={{ backgroundColor }}>
      <div className="h-[40px]"></div>
      
      <div className="h-[60px] flex items-center px-2 gap-1">
        <button className="text-white p-1 -ml-1">
          <ChevronLeft size={26} />
        </button>
        
        <div className="flex items-center gap-2 flex-1 -ml-1">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-xl">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className={`text-white font-medium text-lg ${isHidden ? '-mt-5' : ''}`}>{name}</span>
        </div>

        <div className="flex items-center gap-4 mr-2">
          <button className="text-white p-1">
            <Video size={24} />
          </button>
          <button className="text-white p-1">
            <Phone size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};