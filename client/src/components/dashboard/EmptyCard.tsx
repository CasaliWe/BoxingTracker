import React from 'react';

interface EmptyCardProps {
  onCreateClick: () => void;
}

const EmptyCard: React.FC<EmptyCardProps> = ({ onCreateClick }) => {
  return (
    <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-dashed border-dark-500 hover:border-base-dark transition-colors duration-200 flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <i className="ri-add-line text-2xl text-muted-foreground"></i>
      </div>
      <h3 className="font-semibold text-lg text-white mb-2">Adicionar novo combo</h3>
      <p className="text-muted-foreground text-center mb-4">Crie combos personalizados para seus treinos</p>
      <button 
        onClick={onCreateClick}
        className="flex items-center text-white bg-base-base hover:bg-base-dark px-4 py-2 rounded-md transition-colors duration-200"
      >
        <i className="ri-add-line mr-2"></i>
        <span>Criar combo</span>
      </button>
    </div>
  );
};

export default EmptyCard;
