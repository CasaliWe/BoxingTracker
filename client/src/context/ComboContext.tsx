import React, { createContext, useContext } from 'react';
import { Combo } from '@/lib/constants';
import useLocalStorage from '@/hooks/useLocalStorage';

// Exemplos de combos
const combosPadroes: Combo[] = [
  {
    id: '1',
    nome: 'Combo Básico Destro',
    base: 'destro',
    guarda: 'Guarda Tradicional',
    etapas: [
      {
        golpes: [
          { nome: 'Jab up', categoria: 'ATAQUE', variacao: 'up' },
          { nome: 'Jab down', categoria: 'ATAQUE', variacao: 'down' }
        ]
      },
      {
        golpes: [
          { nome: 'Slip L', categoria: 'ESQUIVA', variacao: 'L' },
          { nome: 'Slip R', categoria: 'ESQUIVA', variacao: 'R' }
        ]
      },
      {
        golpes: [
          { nome: 'Cruzado up', categoria: 'ATAQUE', variacao: 'up' }
        ]
      }
    ],
    dataModificacao: '2023-05-02T10:00:00Z'
  },
  {
    id: '2',
    nome: 'Combo Defensivo',
    base: 'canhoto',
    guarda: 'Philly Shell',
    etapas: [
      {
        golpes: [
          { nome: 'Block head R', categoria: 'BLOQUEIO', variacao: 'R' },
          { nome: 'Block head L', categoria: 'BLOQUEIO', variacao: 'L' }
        ]
      },
      {
        golpes: [
          { nome: 'Passo atrás', categoria: 'FOOTWORK' }
        ]
      },
      {
        golpes: [
          { nome: 'Direto up', categoria: 'ATAQUE', variacao: 'up' },
          { nome: 'Upper up', categoria: 'ATAQUE', variacao: 'up' }
        ]
      }
    ],
    dataModificacao: '2023-04-28T14:30:00Z'
  }
];

// Tipo do contexto
interface ComboContextType {
  combos: Combo[];
  adicionarCombo: (combo: Combo) => void;
  deleteCombo: (id: string) => void;
  editarCombo: (id: string, novoCombo: Combo) => void;
}

// Criação do contexto
const ComboContext = createContext<ComboContextType | undefined>(undefined);

// Provider Component
export const ComboProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [combos, setCombos] = useLocalStorage<Combo[]>('vibeboxing-combos', combosPadroes);

  const adicionarCombo = (combo: Combo) => {
    setCombos([...combos, combo]);
  };

  const deleteCombo = (id: string) => {
    setCombos(combos.filter(combo => combo.id !== id));
  };

  const editarCombo = (id: string, novoCombo: Combo) => {
    setCombos(combos.map(combo => combo.id === id ? novoCombo : combo));
  };

  return (
    <ComboContext.Provider value={{ combos, adicionarCombo, deleteCombo, editarCombo }}>
      {children}
    </ComboContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useComboContext = () => {
  const context = useContext(ComboContext);
  if (context === undefined) {
    throw new Error('useComboContext deve ser usado dentro de um ComboProvider');
  }
  return context;
};
