import React from 'react';
import { Golpe } from '@/lib/constants';

interface GolpeButtonProps {
  golpe: Golpe;
  onClick: () => void;
}

const GolpeButton: React.FC<GolpeButtonProps> = ({ golpe, onClick }) => {
  // Escolha da cor baseada na categoria
  let bgColorClass = '';
  let hoverColorClass = '';
  
  switch (golpe.categoria) {
    case 'ATAQUE':
      bgColorClass = golpe.variacao === 'up' ? 'bg-ataques-base' : 'bg-ataques-dark';
      hoverColorClass = golpe.variacao === 'up' ? 'hover:bg-ataques-dark' : 'hover:bg-ataques-base';
      break;
    case 'ESQUIVA':
      bgColorClass = golpe.variacao === 'L' ? 'bg-esquivas-base' : 'bg-esquivas-dark';
      hoverColorClass = golpe.variacao === 'L' ? 'hover:bg-esquivas-dark' : 'hover:bg-esquivas-base';
      break;
    case 'BLOQUEIO':
      bgColorClass = golpe.variacao === 'L' ? 'bg-bloqueios-base' : 'bg-bloqueios-dark';
      hoverColorClass = golpe.variacao === 'L' ? 'hover:bg-bloqueios-dark' : 'hover:bg-bloqueios-base';
      break;
    case 'FOOTWORK':
      bgColorClass = 'bg-footwork-base';
      hoverColorClass = 'hover:bg-footwork-dark';
      break;
    case 'CLINCH':
      bgColorClass = 'bg-clinch-base';
      hoverColorClass = 'hover:bg-clinch-dark';
      break;
    default:
      bgColorClass = 'bg-base-base';
      hoverColorClass = 'hover:bg-base-dark';
  }
  
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center p-3 ${bgColorClass} text-white rounded-lg ${hoverColorClass} transition-colors`}
    >
      {golpe.nome}
    </button>
  );
};

export default GolpeButton;
