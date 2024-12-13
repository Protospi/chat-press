import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  phoneRef: React.RefObject<HTMLDivElement>;
}

export function DownloadButton({ phoneRef }: DownloadButtonProps) {
  const handleDownload = async () => {
    if (!phoneRef.current) return;

    const canvas = await html2canvas(phoneRef.current, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true
    });

    const link = document.createElement('a');
    link.download = 'chat-screenshot.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 bg-[#6D5BEE] text-white px-4 py-2 rounded-lg hover:bg-[#5646db] transition-colors"
    >
      <Download size={24} />
      Baixar PNG
    </button>
  );
}