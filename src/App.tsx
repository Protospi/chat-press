import React, { useState, useRef } from 'react';
import { MessageInput } from './components/MessageInput';
import { ChatBubble } from './components/ChatBubble';
import { NameInput } from './components/NameInput';
import { ChatHeader } from './components/ChatHeader';
import { AvatarInput } from './components/AvatarInput';
import { DownloadButton } from './components/DownloadButton';
import { Trash2, Download, Film, Plus, Camera, Mic, Palette, Battery, Signal, Wifi } from 'lucide-react';
import * as gifshot from 'gifshot';
import html2canvas from 'html2canvas';
import { ColorPickerModal } from './components/ColorPickerModal';
import { ProgressBar } from './components/ProgressBar';
import { HiddenPhone } from './components/HiddenPhone';

interface Message {
  text: string;
  isUser: boolean;
}

function App() {
  const [assistantName, setAssistantName] = useState('Assistente');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [headerColor, setHeaderColor] = useState('#075e54');
  const [isHeaderColorPickerOpen, setIsHeaderColorPickerOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [isGeneratingGif, setIsGeneratingGif] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [gifBackground, setGifBackground] = useState('#ffffff');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [currentStep, setCurrentStep] = useState('Preparando...');
  const [progress, setProgress] = useState(0);
  const hiddenPhoneRef = useRef<HTMLDivElement>(null);
  const [messageDelay, setMessageDelay] = useState(1);
  const [frameDuration, setFrameDuration] = useState(1);

  const TOTAL_STEPS = (messages: Message[]) => messages.length + 1;
  const FRAME_WEIGHT = 0.8;
  const GIF_WEIGHT = 0.2;

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
    if (!hiddenPhoneRef.current || isGeneratingGif) return;
    setIsGeneratingGif(true);
    setProgress(0);
    setCurrentStep('Preparando frames...');

    try {
      await document.fonts.ready;
      
      const frames: string[] = [];
      const totalFrames = messages.length;
      let currentMessages: Message[] = [];
      
      for (let i = 0; i < messages.length; i++) {
        currentMessages = [...currentMessages, messages[i]];
        
        setMessages(currentMessages);
        
        await delay((messageDelay / 10) * 1000);

        const canvas = await html2canvas(hiddenPhoneRef.current!, {
          backgroundColor: gifBackground,
          scale: 3,
          logging: false,
          useCORS: true
        });
        
        frames.push(canvas.toDataURL('image/png', 1.0));
        
        const frameProgress = ((i + 1) / totalFrames) * FRAME_WEIGHT * 100;
        setProgress(frameProgress);
        setCurrentStep(`Gerando frame ${i + 1} de ${totalFrames}`);
      }

      setCurrentStep('Criando GIF...');
      
      await new Promise<void>((resolve, reject) => {
        (gifshot as any).createGIF({
          images: frames,
          gifWidth: 380 * 4,
          gifHeight: 780 * 4,
          interval: messageDelay,
          transparent: true,
          quality: 20,
          numWorkers: 2,
          frameDuration: frameDuration,
          sampleInterval: 10,
          progressCallback: (captureProgress: number) => {
            const gifProgress = (FRAME_WEIGHT + (captureProgress * GIF_WEIGHT)) * 100;
            setProgress(gifProgress);
          }
        }, function(obj: { error: boolean; image: string }) {
          if (!obj.error) {
            setProgress(100);
            setCurrentStep('Baixando GIF...');
            
            const link = document.createElement('a');
            link.href = obj.image;
            link.download = 'chat-animation.gif';
            link.click();
            
            setTimeout(() => {
              resolve();
            }, 1000);
          } else {
            reject(new Error('Failed to generate GIF'));
          }
        });
      });

    } catch (error) {
      console.error('Error generating GIF:', error);
    } finally {
      setIsGeneratingGif(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  const handleFontSizeChange = (change: number) => {
    setFontSize(prev => Math.min(Math.max(prev + change, 12), 24));
  };

  return (
    <div className="min-h-screen bg-[#eae6df] flex">
      {/* Left Column - Controls */}
      <div className="w-1/2 p-8 flex flex-col">
        <div className="flex-1 flex flex-col gap-8">
          <h1 className="text-2xl font-semibold text-gray-800">Apresentador de Conversas</h1>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Configurações do Assistente</h3>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Nome do Assistente</label>
              </div>
              <div className="flex gap-1 items-center justify-between">
                <div className="flex gap-1">
                  <NameInput
                    value={assistantName}
                    onChange={setAssistantName}
                    placeholder="Nome do Assistente"
                  />
                  <AvatarInput onAvatarChange={setAvatarUrl} />
                </div>
                <button
                  onClick={() => setIsHeaderColorPickerOpen(true)}
                  className="flex items-center gap-2 bg-[#6D5BEE] text-white px-4 py-2 rounded-lg hover:bg-[#5646db] transition-colors"
                  title="Cor do cabeçalho"
                >
                  <Palette size={20} />
                  Cor do Assistente
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Controle de Mensagens</h3>
            </div>
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
                  placeholder="Digite como usuário..."
                  align="left"
                />
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Tempo entre mensagens:</span>
                  <select
                    value={messageDelay}
                    onChange={(e) => setMessageDelay(Number(e.target.value))}
                    className="bg-white rounded-lg border border-gray-300 shadow-sm px-2 py-1"
                  >
                    <option value={1}>1 segundo</option>
                    <option value={2}>2 segundos</option>
                    <option value={3}>3 segundos</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Duração dos frames:</span>
                  <select
                    value={frameDuration}
                    onChange={(e) => setFrameDuration(Number(e.target.value))}
                    className="bg-white rounded-lg border border-gray-300 shadow-sm px-2 py-1"
                  >
                    <option value={1}>1 segundo</option>
                    <option value={2}>2 segundos</option>
                    <option value={3}>3 segundos</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Tamanho da Fonte:</span>
                  <div className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm">
                    <button
                      onClick={() => handleFontSizeChange(-1)}
                      className="px-2 py-1 hover:bg-gray-100 border-r border-gray-300"
                      title="Diminuir fonte"
                    >
                      ↓
                    </button>
                    <span className="px-2 min-w-[2rem] text-center">{fontSize}</span>
                    <button
                      onClick={() => handleFontSizeChange(1)}
                      className="px-2 py-1 hover:bg-gray-100 border-l border-gray-300"
                      title="Aumentar fonte"
                    >
                      ↑
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <DownloadButton phoneRef={phoneRef} />
            <button
              onClick={() => setIsColorPickerOpen(true)}
              className="flex items-center gap-2 bg-[#6D5BEE] text-white px-4 py-2 rounded-lg hover:bg-[#5646db] transition-colors"
              title="Cor do fundo"
            >
              <Palette size={24} />
              Cor do Fundo
            </button>
            <button
              onClick={handleCreateGif}
              disabled={isGeneratingGif}
              className="flex items-center gap-2 bg-[#6D5BEE] text-white px-4 py-2 rounded-lg hover:bg-[#5646db] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Film size={24} />
              {isGeneratingGif ? 'Gerando...' : 'Baixar GIF'}
            </button>
            <button
              onClick={handleCleanChat}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Trash2 size={24} className="text-[#6D5BEE] hover:text-[#5646db]" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Phone Preview */}
      <div className="w-1/2 p-8 flex items-center justify-center">
        {isGeneratingGif ? (
          <div className="w-full max-w-md">
            <ProgressBar 
              progress={progress} 
              total={100} 
              currentStep={currentStep} 
            />
          </div>
        ) : (
          <div ref={phoneRef} className="relative w-[380px] h-[780px] bg-[#151515] rounded-[55px] shadow-xl overflow-hidden border-8 border-[#151515]">
            {/* iPhone Status Bar and Notch */}
            <div className="relative">
              {/* Status Bar */}
              <div className={`absolute ${isGeneratingGif ? 'top-2' : 'top-4'} left-0 right-0 px-6 flex justify-between items-center z-10`}>
                {/* Time */}
                <div className="text-white text-[15px] font-medium w-[40px] ml-4">
                  23:00
                </div>
                
                {/* Right Icons */}
                <div className={`flex items-center gap-2 ${isGeneratingGif ? 'translate-y-2' : 'translate-y-0'} mr-3`}>
                  <Signal size={17} className="text-white fill-white" />
                  <Wifi size={17} className="text-white fill-white" />
                  <Battery size={17} className="text-white fill-white" />
                </div>
              </div>
              
              {/* Notch */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[126px] h-[32px] bg-[#151515] rounded-[20px] z-20"></div>
            </div>
            
            <ChatHeader 
              avatarUrl={avatarUrl} 
              name={assistantName} 
              backgroundColor={headerColor}
            />

            {/* Messages Container - reduced height to create more black space above input */}
            <div 
              ref={messagesContainerRef}
              className="h-[calc(100%-160px)] overflow-y-auto p-4 bg-[#e5ddd5]"
            >
              <div className="max-w-[380px] mx-auto">
                {messages.map((msg, index) => (
                  <ChatBubble
                    key={index}
                    message={msg.text}
                    isUser={msg.isUser}
                    fontSize={fontSize}
                  />
                ))}
              </div>
            </div>

            {/* Static Input Bar - adjusted bottom position */}
            <div className="absolute bottom-[12px] left-0 right-0 h-[50px] bg-[#151515] px-2 py-1 flex items-center gap-1">
              <button className="p-2 text-gray-400">
                <Plus size={24} />
              </button>
              <div className="flex-1 bg-white rounded-full h-9 px-4 flex items-center justify-center">
                <img 
                  src="/smarttalks_logo.png" 
                  alt="SmartTalks Logo" 
                  className="h-5 object-contain"
                />
              </div>
              <button className="p-2 text-gray-400">
                <Camera size={24} />
              </button>
              <button className="p-2 text-gray-400">
                <Mic size={24} />
              </button>
            </div>

            {/* iPhone Home Indicator - adjusted height */}
            <div className="absolute bottom-0 left-0 right-0 h-[12px] bg-[#151515] flex items-center justify-center">
              <div className="w-[134px] h-[5px] bg-gray-200 rounded-full"></div>
            </div>
          </div>
        )}

        {/* Hidden phone for GIF generation */}
        <HiddenPhone
          ref={hiddenPhoneRef}
          messages={messages}
          assistantName={assistantName}
          avatarUrl={avatarUrl}
          headerColor={headerColor}
          fontSize={fontSize}
        />
      </div>

      <ColorPickerModal
        isOpen={isHeaderColorPickerOpen}
        onClose={() => setIsHeaderColorPickerOpen(false)}
        onColorSelect={setHeaderColor}
        currentColor={headerColor}
      />

      <ColorPickerModal
        isOpen={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        onColorSelect={setGifBackground}
        currentColor={gifBackground}
      />
    </div>
  );
}

export default App;