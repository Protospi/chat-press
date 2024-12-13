import React, { useRef } from 'react';
import { ImagePlus } from 'lucide-react';

interface AvatarInputProps {
  onAvatarChange: (url: string | null) => void;
}

export const AvatarInput: React.FC<AvatarInputProps> = ({ onAvatarChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onAvatarChange(imageUrl);
    }
  };

  return (
    <button
      onClick={() => inputRef.current?.click()}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-green-500 focus:outline-none transition-colors"
    >
      <ImagePlus size={20} />
      <span>Alterar Avatar</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </button>
  );
};