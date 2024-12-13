import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
  placeholder: string;
  align: 'left' | 'right';
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, placeholder, align }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        onSend(message);
        setMessage('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={`flex gap-2 w-full ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500 resize-none overflow-y-auto max-h-32"
          style={{ lineHeight: '1.5rem', minHeight: '9rem' }}
        />
        <button
          type="submit"
          className="p-2 rounded-lg bg-[#6D5BEE] text-white hover:bg-[#5646db] transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};