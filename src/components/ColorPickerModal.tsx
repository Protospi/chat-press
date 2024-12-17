import React from 'react';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  currentColor: string;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  onColorSelect,
  currentColor,
}) => {
  if (!isOpen) return null;

  const predefinedColors = [
    '#008069', // WhatsApp default green
    '#128c7e', // WhatsApp light green (default)
    '#6D5BEE', // Your purple
    '#DD2A7B', // Instagram pink
    '#075e54', // WhatsApp dark green
    '#128C7E', // WhatsApp secondary green
    '#34B7F1', // WhatsApp blue
    '#833AB4', // Instagram purple
    '#405DE6', // Instagram blue
    '#5851DB', // Instagram indigo
    '#C13584', // Instagram magenta
    '#FD1D1D', // Instagram red
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Escolha uma cor</h2>
        
        <div className="grid grid-cols-6 gap-2 mb-4">
          {predefinedColors.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
              style={{ backgroundColor: color }}
              onClick={() => {
                onColorSelect(color);
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
            value={currentColor}
            onChange={(e) => onColorSelect(e.target.value)}
            className="w-full h-10 cursor-pointer"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}; 