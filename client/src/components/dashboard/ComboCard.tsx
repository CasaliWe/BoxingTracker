import React, { useState } from 'react';
import { Combo } from '@/lib/constants';
import StepPreview from '@/components/combo/StepPreview';
import ComboEditModal from '@/components/combo/ComboEditModal';
import { useComboContext } from '@/context/ComboContext';
import { toast } from '@/hooks/use-toast';

interface ComboCardProps {
  combo: Combo;
}

const ComboCard: React.FC<ComboCardProps> = ({ combo }) => {
  const { deleteCombo } = useComboContext();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditCombo = () => {
    setShowEditModal(true);
  };

  const handleDeleteCombo = () => {
    if (window.confirm('Tem certeza que deseja excluir este combo?')) {
      deleteCombo(combo.id);
      toast({
        title: "Combo excluído",
        description: "O combo foi excluído com sucesso."
      });
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  // Formatar a data
  const dataFormatada = new Date(combo.dataModificacao).toLocaleDateString('pt-BR');

  return (
    <>
      <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-dark-600 hover:border-base-dark transition-colors duration-200">
        <div className="p-4 border-b border-dark-600">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-white">{combo.nome}</h3>
            <div className="flex">
              <button onClick={handleEditCombo} className="text-muted-foreground hover:text-white p-1">
                <i className="ri-edit-line"></i>
              </button>
              <button onClick={handleDeleteCombo} className="text-muted-foreground hover:text-ataques-base p-1">
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          </div>
          <span className="inline-block px-2 py-1 mt-2 text-xs rounded-full bg-base-dark text-white">
            {combo.base === 'destro' ? 'Destro' : 'Canhoto'}
          </span>
          <span className="inline-block px-2 py-1 mt-2 ml-2 text-xs rounded-full bg-guardas-dark text-white">
            {combo.guarda}
          </span>
        </div>

        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-2">Sequência:</div>
          <div className="flex flex-col gap-3">
            {combo.etapas.map((etapa, index) => (
              <StepPreview 
                key={index} 
                numeroEtapa={index + 1} 
                golpes={etapa.golpes} 
              />
            ))}
          </div>
        </div>
        
        <div className="px-4 py-3 bg-muted border-t border-dark-600">
          <span className="text-sm text-muted-foreground">Modificado: {dataFormatada}</span>
        </div>
      </div>

      {/* Modal de edição */}
      {showEditModal && <ComboEditModal combo={combo} onClose={closeEditModal} />}
    </>
  );
};

export default ComboCard;
