import React from 'react';
import { Golpe } from '@/lib/constants';

interface GolpeTagProps {
  golpe: Golpe;
  onRemove?: () => void;
}

const GolpeTag: React.FC<GolpeTagProps> = ({ golpe, onRemove }) => {
  // Escolha da cor baseada na categoria
  let bgColorClass = '';
  
  switch (golpe.categoria) {
    case 'ATAQUE':
      bgColorClass = golpe.variacao === 'up' ? 'bg-ataques-base' : 'bg-ataques-dark';
      break;
    case 'ESQUIVA':
      bgColorClass = golpe.variacao === 'L' ? 'bg-esquivas-base' : 'bg-esquivas-dark';
      break;
    case 'BLOQUEIO':
      bgColorClass = golpe.variacao === 'L' ? 'bg-bloqueios-base' : 'bg-bloqueios-dark';
      break;
    case 'FOOTWORK':
      bgColorClass = 'bg-footwork-base';
      break;
    case 'CLINCH':
      bgColorClass = 'bg-clinch-base';
      break;
    default:
      bgColorClass = 'bg-base-base';
  }
  
  return (
    <span className={`inline-block px-3 py-1 rounded-md ${bgColorClass} text-white text-sm group`}>
      {golpe.nome}
      {onRemove && (
        <button onClick={onRemove} className="ml-2 opacity-75 hover:opacity-100">×</button>
      )}
    </span>
  );
};

export default GolpeTag;
