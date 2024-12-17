import React, { forwardRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatBubble } from './ChatBubble';
import { Battery, Signal, Wifi, Plus, Camera, Mic } from 'lucide-react';

interface HiddenPhoneProps {
  messages: Array<{ text: string; isUser: boolean }>;
  assistantName: string;
  avatarUrl: string | null;
  headerColor: string;
  fontSize: number;
  bubbleColor?: string;
  textColor?: string;
  userBubbleColor?: string;
  userTextColor?: string;
  chatBackground: string;
  selectedHour: string;
  selectedMinute: string;
  inputBarColor: string;
}

export const HiddenPhone = forwardRef<HTMLDivElement, HiddenPhoneProps>(({
  messages,
  assistantName,
  avatarUrl,
  headerColor,
  fontSize,
  bubbleColor,
  textColor,
  userBubbleColor,
  userTextColor,
  chatBackground,
  selectedHour,
  selectedMinute,
  inputBarColor
}, ref) => {
  const phoneStyles = {
    frame: {
      background: '#000000',
      padding: '3px',
      borderRadius: '60px',
      position: 'fixed' as const,
      left: '-9999px',
    },
    innerFrame: {
      background: '#808080',
      padding: '1px',
      borderRadius: '58px',
      border: '1px solid #808080',
    },
    phone: {
      position: 'relative' as const,
      width: '380px',
      height: '780px',
      background: '#151515',
      borderRadius: '55px',
      overflow: 'hidden',
      border: '8px solid #151515',
    },
    button: {
      position: 'absolute' as const,
      background: 'linear-gradient(to bottom, #D3D3D3, #A0A0A0)',
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
    },
  };

  return (
    <div ref={ref} style={phoneStyles.frame} className="gif-rendering">
      <div style={phoneStyles.innerFrame}>
        <div style={phoneStyles.phone}>
          {/* Status Bar */}
          <div className="relative">
            <div className="absolute top-1 left-0 right-0 px-6 flex justify-between items-center z-10">
              <div className="text-white text-[17px] font-medium w-[40px] ml-4">
                {selectedHour}:{selectedMinute}
              </div>
              <div className="flex items-center gap-2 translate-y-2 mr-3">
                <Signal size={19} className="text-white fill-white" />
                <Wifi size={19} className="text-white fill-white" />
                <Battery size={19} className="text-white fill-white" />
              </div>
            </div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[126px] h-[32px] bg-[#151515] rounded-[20px] z-20"></div>
          </div>

          <ChatHeader 
            avatarUrl={avatarUrl} 
            name={assistantName} 
            backgroundColor={headerColor}
            isHidden={true}
          />

          <div 
            className="messages-container h-[calc(100%-158px)] overflow-y-auto p-4"
            style={{
              background: chatBackground.startsWith('url') 
                ? `${chatBackground} center/cover no-repeat`
                : chatBackground
            }}
          >
            <div className="max-w-[380px] mx-auto">
              {messages.map((msg, index) => (
                <ChatBubble
                  key={index}
                  message={msg.text}
                  isUser={msg.isUser}
                  fontSize={fontSize}
                  bubbleColor={msg.isUser ? userBubbleColor : bubbleColor}
                  textColor={msg.isUser ? userTextColor : textColor}
                />
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="absolute bottom-[12px] left-0 right-0 h-[50px] px-2 py-1 flex items-center gap-1" style={{ backgroundColor: inputBarColor }}>
            <button className="p-2 text-gray-300">
              <Plus size={24} />
            </button>
            <div className="flex-1 bg-white rounded-full h-9 px-4 flex items-center justify-center">
              <img 
                src="/smarttalks_logo.png" 
                alt="SmartTalks Logo" 
                className="h-5 object-contain"
              />
            </div>
            <button className="p-2 text-gray-300">
              <Camera size={24} />
            </button>
            <button className="p-2 text-gray-300">
              <Mic size={24} />
            </button>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-[12px] flex items-center justify-center" style={{ backgroundColor: inputBarColor }}>
            <div className="w-[134px] h-[5px] bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
});

HiddenPhone.displayName = 'HiddenPhone'; 