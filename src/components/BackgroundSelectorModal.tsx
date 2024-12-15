import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface BackgroundSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (background: string) => void;
  currentBackground: string;
}

export function BackgroundSelectorModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentBackground 
}: BackgroundSelectorModalProps) {
  const [selectedTab, setSelectedTab] = useState<'solid' | 'predefined' | 'custom'>('solid');
  const [color, setColor] = useState(currentBackground);
  const [predefinedBackgrounds, setPredefinedBackgrounds] = useState<string[]>([]);
  
  // Load all background images from the public/backgrounds folder
  useEffect(() => {
    // Function to load background images
    const loadBackgrounds = async () => {
      try {
        const backgrounds = [
          'Whatsapp_2.png',
          'Whatsapp_3.png',
          'Whatsapp_4.jpg',
          'Whatsapp_5.jpg',
          'Whatsapp_6.jpg'
        ];
        
        // Filter only existing images
        const existingBackgrounds = await Promise.all(
          backgrounds.map(async (bg) => {
            try {
              const response = await fetch(`/backgrounds/${bg}`, { method: 'HEAD' });
              return response.ok ? bg : null;
            } catch {
              return null;
            }
          })
        );

        setPredefinedBackgrounds(existingBackgrounds.filter((bg): bg is string => bg !== null));
      } catch (error) {
        console.error('Error loading backgrounds:', error);
      }
    };

    if (isOpen) {
      loadBackgrounds();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onSelect(`url(${result})`);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  // Predefined colors similar to WhatsApp themes
  const predefinedColors = [
    '#e5ddd5', // WhatsApp default
    '#DCF8C6', // WhatsApp light green
    '#ffffff', // White
    '#f0f2f5', // Light gray
    '#efffde', // Very light green
    '#d1f4ff', // Light blue
    '#fff3c7', // Light yellow
    '#ffe9e9', // Light red
    '#f5e6ff', // Light purple
    '#e8e8e8', // Another gray
    '#dbddbb', // Olive
    '#b9d9eb', // Sky blue
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Selecionar Plano de Fundo</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${selectedTab === 'solid' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setSelectedTab('solid')}
          >
            Cor Sólida
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${selectedTab === 'predefined' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setSelectedTab('predefined')}
          >
            Predefinidos
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${selectedTab === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setSelectedTab('custom')}
          >
            Personalizado
          </button>
        </div>

        {selectedTab === 'solid' && (
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-2 mb-4">
              {predefinedColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    onSelect(presetColor);
                    onClose();
                  }}
                />
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor personalizada
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 cursor-pointer"
              />
            </div>

            <button
              onClick={() => {
                onSelect(color);
                onClose();
              }}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Aplicar Cor
            </button>
          </div>
        )}

        {selectedTab === 'predefined' && (
          <div className="grid grid-cols-3 gap-4">
            {predefinedBackgrounds.map((bg, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelect(`url(/backgrounds/${bg})`);
                  onClose();
                }}
                className="relative aspect-square overflow-hidden rounded-lg border-2 hover:border-blue-500 group"
              >
                <img
                  src={`/backgrounds/${bg}`}
                  alt={`Background ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
            ))}
          </div>
        )}

        {selectedTab === 'custom' && (
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <span className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
                Selecione um arquivo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"    
              />
              <span className="text-gray-500">
                {(document.getElementById('file-upload') as HTMLInputElement)?.files?.[0]?.name || 'Nenhum arquivo selecionado'}
              </span>
            </label>
            <p className="text-sm text-gray-500">
              Formatos suportados: JPG, PNG, GIF
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 