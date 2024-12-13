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
      className="h-10 px-3 rounded-lg bg-[#6D5BEE] hover:bg-[#5846eb] text-white focus:outline-none transition-colors flex items-center gap-1"
    >
      <ImagePlus size={16} />
      <span className="text-sm">Avatar</span>
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