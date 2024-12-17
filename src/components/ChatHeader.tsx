import React from 'react';
import { User, Phone, Video, ChevronLeft } from 'lucide-react';

interface ChatHeaderProps {
  avatarUrl: string | null;
  name: string;
  backgroundColor?: string;
  isHidden?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  avatarUrl, 
  name, 
  backgroundColor = '#008069',
  isHidden = false 
}) => {
  return (
    <div 
      className="flex flex-col" 
      style={{ backgroundColor }}
    >
      {/* Empty space for notch area */}
      <div className="h-[40px]"></div>
      
      {/* User info row with action icons */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-6 h-6 text-white" />
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center gap-1">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
            )}
          </div>
          <div className={`flex items-center ${isHidden ? '-mt-5' : ''}`}>
            <div className="flex-1">
              <h2 className="text-xl font-medium text-white">{name}</h2>
            </div>
          </div>
        </div>
        
        {/* Action icons */}
        <div className="flex items-center gap-5">
          <Video className="w-6 h-6 text-white" />
          <Phone className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};