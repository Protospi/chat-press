import React from 'react';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  phoneRef: React.RefObject<HTMLDivElement>;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ phoneRef }) => {
  const handleDownload = async () => {
    if (phoneRef.current) {
      const canvas = await html2canvas(phoneRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = 'conversa-smarttalks.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-[#00A884] text-white rounded-lg hover:bg-[#008f6f] transition-colors"
    >
      <Download size={20} />
      <span>Baixar Conversa</span>
    </button>
  );
};