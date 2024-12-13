import React, { useState, useRef } from 'react';
import { MessageInput } from './components/MessageInput';
import { ChatBubble } from './components/ChatBubble';
import { NameInput } from './components/NameInput';
import { ChatHeader } from './components/ChatHeader';
import { AvatarInput } from './components/AvatarInput';
import { DownloadButton } from './components/DownloadButton';
import { Trash2, Download, Film } from 'lucide-react';
import * as gifshot from 'gifshot';
import html2canvas from 'html2canvas';

interface Message {
  text: string;
  isUser: boolean;
}

function App() {
  const [assistantName, setAssistantName] = useState('Assistente');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [isGeneratingGif, setIsGeneratingGif] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleAssistantMessage = (text: string) => {
    setMessages([...messages, { text, isUser: false }]);
  };

  const handleUserMessage = (text: string) => {
    setMessages([...messages, { text, isUser: true }]);
  };

  const handleCleanChat = () => {
    setMessages([]);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const scrollToBottom = (container: HTMLDivElement) => {
    const scrollHeight = container.scrollHeight;
    const currentScroll = container.scrollTop;
    const targetScroll = Math.min(currentScroll + container.clientHeight / 2, scrollHeight - container.clientHeight);
    
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  const handleCreateGif = async () => {
    if (!phoneRef.current || isGeneratingGif) return;
    setIsGeneratingGif(true);

    try {
      const frames: string[] = [];
      const messagesContainer = messagesContainerRef.current;
      
      // Reset scroll position
      if (messagesContainer) {
        messagesContainer.scrollTop = 0;
      }

      // Clear messages and add them one by one
      setMessages([]);
      for (let i = 0; i < messages.length; i++) {
        setMessages(prev => [...prev, messages[i]]);
        await delay(2000);
        
        // Capture frame with transparent background
        const canvas = await html2canvas(phoneRef.current!, {
          backgroundColor: null // This makes the background transparent
        });
        frames.push(canvas.toDataURL());

        // Scroll if needed
        if (messagesContainer) {
          scrollToBottom(messagesContainer);
        }
      }

      // Create GIF with transparent background
      (gifshot as any).createGIF({
        images: frames,
        gifWidth: 420,
        gifHeight: 780,
        interval: 2,
        transparent: true // Enable transparency in the GIF
      }, function(obj: { error: boolean; image: string }) {
        if (!obj.error) {
          const link = document.createElement('a');
          link.href = obj.image;
          link.download = 'chat-animation.gif';
          link.click();
        }
      });
    } catch (error) {
      console.error('Error generating GIF:', error);
    } finally {
      setIsGeneratingGif(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eae6df] flex">
      {/* Left Column - Controls */}
      <div className="w-1/2 p-8 flex flex-col gap-8">
        <img 
          src="/smarttalks_logo.png" 
          alt="SmartTalks Logo" 
          className="h-12 object-contain self-start"
        />
        
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Configurações do Chat</h2>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Nome do Assistente</label>
            </div>
            <div className="flex gap-1">
              <NameInput
                value={assistantName}
                onChange={setAssistantName}
                placeholder="Nome do Assistente"
              />
              <AvatarInput onAvatarChange={setAvatarUrl} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Controle de Mensagens</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem do Assistente</label>
              <MessageInput
                onSend={handleAssistantMessage}
                placeholder={`Digite como ${assistantName}...`}
                align="left"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem do Usuário</label>
              <MessageInput
                onSend={handleUserMessage}
                placeholder="Digite uma mensagem..."
                align="left"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <DownloadButton phoneRef={phoneRef} />
          <button
            onClick={handleCreateGif}
            disabled={isGeneratingGif}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Film size={24} />
            {isGeneratingGif ? 'Gerando...' : 'Baixar GIF'}
          </button>
          <button
            onClick={handleCleanChat}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Trash2 size={24} className="text-green-500 hover:text-green-600" />
          </button>
        </div>
      </div>

      {/* Right Column - Phone Preview */}
      <div className="w-1/2 p-8 flex items-center justify-center">
        <div ref={phoneRef} className="relative w-[380px] h-[780px] bg-black rounded-[55px] shadow-xl overflow-hidden border-8 border-black">
          {/* iPhone Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[150px] h-[30px] bg-black rounded-b-[20px] z-20"></div>
          
          <ChatHeader avatarUrl={avatarUrl} name={assistantName} />

          {/* Messages Container */}
          <div 
            ref={messagesContainerRef}
            className="h-[calc(100%-85px)] overflow-y-auto p-4 bg-[#e5ddd5]"
          >
            <div className="max-w-[380px] mx-auto">
              {messages.map((msg, index) => (
                <ChatBubble
                  key={index}
                  message={msg.text}
                  isUser={msg.isUser}
                />
              ))}
            </div>
          </div>

          {/* Bottom Black Rectangle */}
          <div className="absolute bottom-0 left-0 right-0 h-[25px] bg-black"></div>
        </div>
      </div>
    </div>
  );
}

export default App;