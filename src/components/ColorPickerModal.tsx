import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  currentColor: string;
}

export function ColorPickerModal({ isOpen, onClose, onColorSelect, currentColor }: ColorPickerModalProps) {
  const [hexColor, setHexColor] = useState(currentColor);

  const presetColors = [
    '#ffffff', // White (Default background)
    '#eae6df', // Original background
    '#000000', // Black
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
  ];

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexColor(value);
    if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
      onColorSelect(value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[320px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Cor do Fundo</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor Hexadecimal
            </label>
            <input
              type="text"
              value={hexColor}
              onChange={handleHexChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="#000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cores Predefinidas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setHexColor(color);
                    onColorSelect(color);
                  }}
                  className="w-full aspect-square rounded-lg border-2 hover:scale-105 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 