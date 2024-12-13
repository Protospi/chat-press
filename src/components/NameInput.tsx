import React from 'react';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const NameInput: React.FC<NameInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500 w-48"
    />
  );
};