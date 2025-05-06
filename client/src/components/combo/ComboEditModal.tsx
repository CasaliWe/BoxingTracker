import React, { useState, useEffect } from 'react';
import { Golpe, CategoriaGolpe, tiposGuarda, Combo } from '@/lib/constants';
import { obterGolpesPorCategoria } from '@/lib/golpes';
import GolpeButton from './GolpeButton';
import GolpeTag from './GolpeTag';
import StepPreview from './StepPreview';
import { useComboContext } from '@/context/ComboContext';
import { toast } from '@/hooks/use-toast';

interface ComboEditModalProps {
  combo: Combo;
  onClose: () => void;
}

const ComboEditModal: React.FC<ComboEditModalProps> = ({ combo, onClose }) => {
  const { editarCombo } = useComboContext();
  
  // Estados do modal
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [nome, setNome] = useState<string>(combo.nome);
  const [selectedBase, setSelectedBase] = useState<string>(combo.base);
  const [selectedGuarda, setSelectedGuarda] = useState<string>(combo.guarda);
  const [steps, setSteps] = useState<{ golpes: Golpe[] }[]>(combo.etapas);
  const [currentSubStep, setCurrentSubStep] = useState<number>(0);
  const [categoriaAtual, setCategoriaAtual] = useState<CategoriaGolpe>('ATAQUE');
  
  // Progresso visual da etapa
  const progressWidth = `${(currentStep / 3) * 100}%`;
  
  // Descrição da etapa atual
  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return 'Editar nome e base';
      case 2:
        return 'Escolha a guarda';
      case 3:
        return 'Editar os golpes';
      default:
        return '';
    }
  };
  
  // Textos dos botões
  const backButtonText = currentStep === 1 ? 'Cancelar' : 'Voltar';
  const nextButtonText = currentStep === 3 ? 'Finalizar' : 'Próximo';
  
  // Manipuladores de eventos
  const handleNextStep = () => {
    if (currentStep === 1 && !selectedBase) {
      toast({
        title: "Selecione uma base",
        description: "Você precisa escolher a base (destro ou canhoto) para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 2 && !selectedGuarda) {
      toast({
        title: "Selecione uma guarda",
        description: "Você precisa escolher um tipo de guarda para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 3) {
      // Verificar se tem pelo menos um golpe
      const temGolpes = steps.some(step => step.golpes.length > 0);
      if (!temGolpes) {
        toast({
          title: "Adicione golpes",
          description: "Você precisa adicionar pelo menos um golpe para criar o combo.",
          variant: "destructive"
        });
        return;
      }
      
      // Atualizar o combo
      const comboAtualizado = {
        ...combo,
        nome,
        base: selectedBase,
        guarda: selectedGuarda,
        etapas: steps,
        dataModificacao: new Date().toISOString()
      };
      
      editarCombo(combo.id, comboAtualizado);
      toast({
        title: "Combo atualizado com sucesso!",
        description: "As alterações foram salvas.",
      });
      onClose();
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };
  
  const handlePreviousStep = () => {
    if (currentStep === 1) {
      onClose();
      return;
    }
    
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSelectBase = (base: string) => {
    setSelectedBase(base);
  };
  
  const handleSelectGuarda = (guarda: string) => {
    setSelectedGuarda(guarda);
  };
  
  const handleAddNewSubStep = () => {
    setSteps([...steps, { golpes: [] }]);
    setCurrentSubStep(steps.length);
  };
  
  const handleSelectGolpe = (golpe: Golpe) => {
    const newSteps = [...steps];
    newSteps[currentSubStep] = {
      ...newSteps[currentSubStep],
      golpes: [...newSteps[currentSubStep].golpes, golpe]
    };
    setSteps(newSteps);
  };
  
  const handleRemoveGolpe = (index: number) => {
    const newSteps = [...steps];
    newSteps[currentSubStep].golpes.splice(index, 1);
    setSteps(newSteps);
  };
  
  const handleChangeSubStep = (index: number) => {
    setCurrentSubStep(index);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) {
      toast({
        title: "Não é possível remover",
        description: "Um combo deve ter pelo menos uma etapa.",
        variant: "destructive"
      });
      return;
    }

    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    
    // Ajustar o sub-step atual se necessário
    if (currentSubStep >= newSteps.length) {
      setCurrentSubStep(newSteps.length - 1);
    }
  };
  
  const golpesDaCategoria = obterGolpesPorCategoria(categoriaAtual, selectedBase);
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-dark-600 flex justify-between items-center">
          <h3 className="font-bold text-lg text-white">Editar Combo</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-white">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        {/* Indicador de progresso */}
        <div className="px-6 pt-6">
          <div className="flex items-center mb-2">
            <div className="text-sm font-medium text-white">
              <span className="mr-1">{currentStep}</span>
              <span className="text-muted-foreground">/ 3</span>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              {getStepDescription()}
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div className="bg-base-base h-2 rounded-full" style={{ width: progressWidth }}></div>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-grow px-6 pb-6">
          {/* Etapa 1: Editar Nome e Base */}
          {currentStep === 1 && (
            <div className="py-4">
              <div className="mb-4">
                <label htmlFor="nome" className="block text-sm text-muted-foreground mb-1">Nome do Combo</label>
                <input 
                  type="text" 
                  id="nome" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white"
                />
              </div>
              
              <h4 className="text-white font-medium mb-4 mt-6">Escolha a Base</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleSelectBase('destro')}
                  className={`flex flex-col items-center justify-center p-6 bg-muted hover:bg-secondary rounded-lg border-2 ${selectedBase === 'destro' ? 'border-base-base' : 'border-transparent hover:border-base-dark'} transition-all cursor-pointer`}
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-base-dark/20 rounded-full mb-4">
                    <i className="ri-boxing-fill text-2xl text-base-base"></i>
                  </div>
                  <span className="text-white font-medium">Destro</span>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Mão direita é a mão dominante</p>
                </button>
                
                <button
                  onClick={() => handleSelectBase('canhoto')}
                  className={`flex flex-col items-center justify-center p-6 bg-muted hover:bg-secondary rounded-lg border-2 ${selectedBase === 'canhoto' ? 'border-base-base' : 'border-transparent hover:border-base-dark'} transition-all cursor-pointer`}
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-base-dark/20 rounded-full mb-4">
                    <i className="ri-boxing-fill text-2xl text-base-base transform scale-x-[-1]"></i>
                  </div>
                  <span className="text-white font-medium">Canhoto</span>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Mão esquerda é a mão dominante</p>
                </button>
              </div>
            </div>
          )}
          
          {/* Etapa 2: Escolher Guarda */}
          {currentStep === 2 && (
            <div className="py-4">
              <h4 className="text-white font-medium mb-4">Escolha a Guarda</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tiposGuarda.map((guarda) => (
                  <button
                    key={guarda.valor}
                    onClick={() => handleSelectGuarda(guarda.nome)}
                    className={`flex flex-col items-center justify-center p-4 bg-muted hover:bg-secondary rounded-lg border-2 ${selectedGuarda === guarda.nome ? 'border-guardas-base' : 'border-transparent hover:border-guardas-dark'} transition-all cursor-pointer`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-guardas-dark/20 rounded-full mb-3">
                      <i className={`${guarda.icone} text-xl text-guardas-base`}></i>
                    </div>
                    <span className="text-white font-medium">{guarda.nome}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Etapa 3: Editar Golpes */}
          {currentStep === 3 && (
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">Editar Golpes - Etapa {currentSubStep + 1}</h4>
                <button 
                  onClick={handleAddNewSubStep}
                  className="text-sm bg-muted hover:bg-secondary px-3 py-1 rounded-lg text-gray-300 flex items-center"
                >
                  <i className="ri-add-line mr-1"></i>
                  <span>Nova etapa</span>
                </button>
              </div>
              
              {/* Seletor de categorias */}
              <div className="border-b border-dark-600 mb-4">
                <div className="flex overflow-x-auto no-scrollbar">
                  <button 
                    onClick={() => setCategoriaAtual('ATAQUE')}
                    className={`px-4 py-2 ${categoriaAtual === 'ATAQUE' ? 'text-white font-medium border-b-2 border-ataques-base' : 'text-muted-foreground hover:text-white border-b-2 border-transparent'}`}
                  >
                    Ataques
                  </button>
                  <button 
                    onClick={() => setCategoriaAtual('ESQUIVA')}
                    className={`px-4 py-2 ${categoriaAtual === 'ESQUIVA' ? 'text-white font-medium border-b-2 border-esquivas-base' : 'text-muted-foreground hover:text-white border-b-2 border-transparent'}`}
                  >
                    Esquivas
                  </button>
                  <button 
                    onClick={() => setCategoriaAtual('BLOQUEIO')}
                    className={`px-4 py-2 ${categoriaAtual === 'BLOQUEIO' ? 'text-white font-medium border-b-2 border-bloqueios-base' : 'text-muted-foreground hover:text-white border-b-2 border-transparent'}`}
                  >
                    Bloqueios
                  </button>
                  <button 
                    onClick={() => setCategoriaAtual('FOOTWORK')}
                    className={`px-4 py-2 ${categoriaAtual === 'FOOTWORK' ? 'text-white font-medium border-b-2 border-footwork-base' : 'text-muted-foreground hover:text-white border-b-2 border-transparent'}`}
                  >
                    Footwork
                  </button>
                  <button 
                    onClick={() => setCategoriaAtual('CLINCH')}
                    className={`px-4 py-2 ${categoriaAtual === 'CLINCH' ? 'text-white font-medium border-b-2 border-clinch-base' : 'text-muted-foreground hover:text-white border-b-2 border-transparent'}`}
                  >
                    Clinch
                  </button>
                </div>
              </div>
              
              {/* Grid de golpes */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                {golpesDaCategoria.map((golpe) => (
                  <GolpeButton 
                    key={golpe.nome} 
                    golpe={golpe}
                    onClick={() => handleSelectGolpe(golpe)}
                  />
                ))}
              </div>
              
              {/* Golpes selecionados */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-sm text-muted-foreground">Golpes Selecionados - Etapa {currentSubStep + 1}:</h5>
                  {steps.length > 1 && (
                    <button 
                      onClick={() => handleRemoveStep(currentSubStep)}
                      className="text-xs bg-ataques-dark hover:bg-ataques-base px-2 py-1 rounded-md text-white"
                    >
                      Remover etapa
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 min-h-16 p-3 bg-muted rounded-lg border border-dark-600">
                  {steps[currentSubStep]?.golpes.map((golpe, index) => (
                    <GolpeTag 
                      key={index} 
                      golpe={golpe} 
                      onRemove={() => handleRemoveGolpe(index)} 
                    />
                  ))}
                </div>
              </div>
              
              {/* Navegação entre sub-etapas */}
              <div className="flex flex-wrap gap-2 mb-4">
                {steps.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => handleChangeSubStep(index)}
                    className={`px-3 py-1 rounded-md bg-muted text-white text-sm border-2 ${currentSubStep === index ? 'border-base-dark' : 'border-transparent hover:border-base-dark'}`}
                  >
                    Etapa {index + 1}
                  </button>
                ))}
              </div>
              
              {/* Prévia do combo */}
              <div className="bg-muted rounded-lg p-4 border border-dark-600">
                <h5 className="text-sm text-muted-foreground mb-2">Prévia do Combo:</h5>
                <div className="flex flex-col gap-3">
                  {steps.map((step, index) => (
                    <StepPreview 
                      key={index} 
                      numeroEtapa={index + 1} 
                      golpes={step.golpes} 
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Rodapé do modal */}
        <div className="border-t border-dark-600 p-4 flex justify-between">
          <button 
            onClick={handlePreviousStep}
            className="px-4 py-2 bg-muted hover:bg-secondary text-white rounded-lg transition-colors"
          >
            {backButtonText}
          </button>
          
          <button 
            onClick={handleNextStep}
            className="px-4 py-2 bg-base-dark hover:bg-base-base text-white rounded-lg transition-colors"
          >
            {nextButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComboEditModal;