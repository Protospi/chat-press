import React, { useState, useRef } from 'react';
import { MessageInput } from './components/MessageInput';
import { ChatBubble } from './components/ChatBubble';
import { NameInput } from './components/NameInput';
import { ChatHeader } from './components/ChatHeader';
import { AvatarInput } from './components/AvatarInput';
import { DownloadButton } from './components/DownloadButton';
import { Trash2, Download, Film, Plus, Camera, Mic, Palette, Battery, Signal, Wifi, Image } from 'lucide-react';
import * as gifshot from 'gifshot';
import html2canvas from 'html2canvas';
import { ColorPickerModal } from './components/ColorPickerModal';
import { ProgressBar } from './components/ProgressBar';
import { HiddenPhone } from './components/HiddenPhone';
import { BackgroundSelectorModal } from './components/BackgroundSelectorModal';

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
  const [assistantBubbleColor, setAssistantBubbleColor] = useState('#ffffff');
  const [assistantTextColor, setAssistantTextColor] = useState('#303030');
  const [isBubbleColorPickerOpen, setIsBubbleColorPickerOpen] = useState(false);
  const [isTextColorPickerOpen, setIsTextColorPickerOpen] = useState(false);
  const [userBubbleColor, setUserBubbleColor] = useState('#DCF8C6');
  const [userTextColor, setUserTextColor] = useState('#303030');
  const [isUserBubbleColorPickerOpen, setIsUserBubbleColorPickerOpen] = useState(false);
  const [isUserTextColorPickerOpen, setIsUserTextColorPickerOpen] = useState(false);
  const [chatBackground, setChatBackground] = useState('url("/backgrounds/Whatsapp_2.png")');
  const [isBackgroundSelectorOpen, setIsBackgroundSelectorOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('23');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [inputBarColor, setInputBarColor] = useState('#343232');
  const [isInputBarColorPickerOpen, setIsInputBarColorPickerOpen] = useState(false);

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

        const hiddenMessagesContainer = hiddenPhoneRef.current!.querySelector('.messages-container');
        
        if (hiddenMessagesContainer) {
          hiddenMessagesContainer.scrollTop = hiddenMessagesContainer.scrollHeight;
          
          await delay(100);
        }

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

  const phoneStyles = {
    frame: {
      background: '#000000',
      padding: '3px',
      borderRadius: '60px',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
    },
    innerFrame: {
      background: '#808080',
      padding: '2px',
      borderRadius: '58px',
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
                  <button
                    onClick={() => setIsBackgroundSelectorOpen(true)}
                    className="flex items-center gap-2 bg-[#6D5BEE] text-white px-4 py-2 rounded-lg hover:bg-[#5646db] transition-colors"
                    title="Plano de fundo do chat"
                  >
                    <Image size={20} />
                    Chat
                  </button>
                  <button
                    onClick={() => setIsHeaderColorPickerOpen(true)}
                    className="flex items-center gap-2 bg-[#6D5BEE] text-white px-4 py-2 rounded-lg hover:bg-[#5646db] transition-colors"
                    title="Cor do cabeçalho"
                  >
                    <Palette size={20} />
                    Cabeçalho
                  </button>
                  <button
                    onClick={() => setIsInputBarColorPickerOpen(true)}
                    className="flex items-center gap-2 bg-[#6D5BEE] text-white px-4 py-2 rounded-lg hover:bg-[#5646db] transition-colors"
                    title="Cor da barra de input"
                  >
                    <Palette size={20} />
                    Rodapé
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-gray-800">Controle da Conversa</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Horas:</label>
                  <select
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                    className="bg-white rounded-lg border border-gray-300 shadow-sm px-2 py-1"
                  >
                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Minutos:</label>
                  <select
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(e.target.value)}
                    className="bg-white rounded-lg border border-gray-300 shadow-sm px-2 py-1"
                  >
                    {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
                      <option key={minute} value={minute}>{minute}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleCleanChat}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Limpar conversa"
                >
                  <Trash2 size={24} className="text-[#6D5BEE] hover:text-[#5646db]" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem do Assistente</label>
                <div className="flex gap-4">
                  <div className="flex-1 max-w-[75%]">
                    <MessageInput
                      onSend={handleAssistantMessage}
                      placeholder={`Digite como ${assistantName}...`}
                      align="left"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Balão</span>
                      <button
                        onClick={() => setIsBubbleColorPickerOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                        title="Cor do balão"
                      >
                        <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: assistantBubbleColor }} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Texto</span>
                      <button
                        onClick={() => setIsTextColorPickerOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                        title="Cor do texto"
                      >
                        <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: assistantTextColor }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem do Usuário</label>
                <div className="flex gap-4">
                  <div className="flex-1 max-w-[75%]">
                    <MessageInput
                      onSend={handleUserMessage}
                      placeholder="Digite como usuário..."
                      align="left"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Balão</span>
                      <button
                        onClick={() => setIsUserBubbleColorPickerOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                        title="Cor do balão"
                      >
                        <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: userBubbleColor }} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Texto</span>
                      <button
                        onClick={() => setIsUserTextColorPickerOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                        title="Cor do texto"
                      >
                        <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: userTextColor }} />
                      </button>
                    </div>
                  </div>
                </div>
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
              GIF
            </button>
            <button
              onClick={handleCreateGif}
              disabled={isGeneratingGif}
              className="flex items-center gap-2 bg-[#6D5BEE] text-white px-4 py-2 rounded-lg hover:bg-[#5646db] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Film size={24} />
              {isGeneratingGif ? 'Gerando...' : 'Baixar GIF'}
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
          <div style={phoneStyles.frame} className="shadow-xl">
            <div style={phoneStyles.innerFrame}>
              <div style={phoneStyles.phone}>
                {/* Power Button */}
                <div
                  style={{
                    ...phoneStyles.button,
                    width: '4px',
                    height: '80px',
                    right: '-14px',
                    top: '120px',
                    borderRadius: '4px 2px 2px 4px',
                  }}
                />
                {/* Volume Up Button */}
                <div
                  style={{
                    ...phoneStyles.button,
                    width: '4px',
                    height: '40px',
                    left: '-14px',
                    top: '100px',
                    borderRadius: '2px 4px 4px 2px',
                  }}
                />
                {/* Volume Down Button */}
                <div
                  style={{
                    ...phoneStyles.button,
                    width: '4px',
                    height: '40px',
                    left: '-14px',
                    top: '150px',
                    borderRadius: '2px 4px 4px 2px',
                  }}
                />
                {/* iPhone Status Bar and Notch */}
                <div className="relative">
                  {/* Status Bar */}
                  <div className={`absolute ${isGeneratingGif ? 'top-2' : 'top-4'} left-0 right-0 px-6 flex justify-between items-center z-10`}>
                    {/* Time */}
                    <div className="text-white text-[15px] font-medium w-[40px] ml-4">
                      {selectedHour}:{selectedMinute}
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
                  className="h-[calc(100%-158px)] overflow-y-auto p-4"
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
                        bubbleColor={msg.isUser ? userBubbleColor : assistantBubbleColor}
                        textColor={msg.isUser ? userTextColor : assistantTextColor}
                      />
                    ))}
                  </div>
                </div>

                {/* Static Input Bar - adjusted bottom position */}
                <div className="absolute bottom-[12px] left-0 right-0 h-[50px] px-2 py-1 flex items-center gap-1" style={{ backgroundColor: inputBarColor }}>
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
                <div className="absolute bottom-0 left-0 right-0 h-[12px] flex items-center justify-center" style={{ backgroundColor: inputBarColor }}>
                  <div className="w-[134px] h-[5px] bg-gray-200 rounded-full"></div>
                </div>
              </div>
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
          bubbleColor={assistantBubbleColor}
          textColor={assistantTextColor}
          userBubbleColor={userBubbleColor}
          userTextColor={userTextColor}
          chatBackground={chatBackground}
          selectedHour={selectedHour}
          selectedMinute={selectedMinute}
          inputBarColor={inputBarColor}
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

      <ColorPickerModal
        isOpen={isBubbleColorPickerOpen}
        onClose={() => setIsBubbleColorPickerOpen(false)}
        onColorSelect={setAssistantBubbleColor}
        currentColor={assistantBubbleColor}
      />

      <ColorPickerModal
        isOpen={isTextColorPickerOpen}
        onClose={() => setIsTextColorPickerOpen(false)}
        onColorSelect={setAssistantTextColor}
        currentColor={assistantTextColor}
      />

      <ColorPickerModal
        isOpen={isUserBubbleColorPickerOpen}
        onClose={() => setIsUserBubbleColorPickerOpen(false)}
        onColorSelect={setUserBubbleColor}
        currentColor={userBubbleColor}
      />

      <ColorPickerModal
        isOpen={isUserTextColorPickerOpen}
        onClose={() => setIsUserTextColorPickerOpen(false)}
        onColorSelect={setUserTextColor}
        currentColor={userTextColor}
      />

      <BackgroundSelectorModal
        isOpen={isBackgroundSelectorOpen}
        onClose={() => setIsBackgroundSelectorOpen(false)}
        onSelect={setChatBackground}
        currentBackground={chatBackground}
      />

      <ColorPickerModal
        isOpen={isInputBarColorPickerOpen}
        onClose={() => setIsInputBarColorPickerOpen(false)}
        onColorSelect={setInputBarColor}
        currentColor={inputBarColor}
      />
    </div>
  );
}

export default App;