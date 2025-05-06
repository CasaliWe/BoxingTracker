import React, { createContext, useContext, useState, useEffect } from 'react';
import { Combo } from '@/lib/constants';
import { useAuth } from './AuthContext';

// Tipo do contexto
interface ComboContextType {
  combos: Combo[];
  isLoading: boolean;
  error: string | null;
  adicionarCombo: (combo: Omit<Combo, 'id'>) => Promise<boolean>;
  deleteCombo: (id: string) => Promise<boolean>;
  editarCombo: (id: string, novoCombo: Omit<Combo, 'id'>) => Promise<boolean>;
  fetchCombos: () => Promise<void>;
}

// Criação do contexto
const ComboContext = createContext<ComboContextType | undefined>(undefined);

// Provider Component
export const ComboProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Função para buscar combos da API
  const fetchCombos = async () => {
    if (!isAuthenticated) {
      setCombos([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/combos', {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar combos');
      }
      
      const data = await response.json();
      setCombos(data);
    } catch (err) {
      console.error('Erro ao buscar combos:', err);
      setError('Não foi possível carregar seus combos. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Buscar combos inicialmente e quando autenticação mudar
  useEffect(() => {
    fetchCombos();
  }, [isAuthenticated]);
  
  // Função para adicionar um combo
  const adicionarCombo = async (novoCombo: Omit<Combo, 'id'>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/combos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(novoCombo)
      });
      
      if (!response.ok) {
        throw new Error('Falha ao criar combo');
      }
      
      const comboSalvo = await response.json();
      setCombos(combos => [...combos, comboSalvo]);
      return true;
    } catch (err) {
      console.error('Erro ao adicionar combo:', err);
      setError('Não foi possível salvar o combo. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para deletar um combo
  const deleteCombo = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/combos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir combo');
      }
      
      setCombos(combos => combos.filter(combo => combo.id !== id));
      return true;
    } catch (err) {
      console.error('Erro ao excluir combo:', err);
      setError('Não foi possível excluir o combo. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para editar um combo
  const editarCombo = async (id: string, dadosAtualizados: Omit<Combo, 'id'>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/combos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(dadosAtualizados)
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar combo');
      }
      
      const comboAtualizado = await response.json();
      setCombos(combos => combos.map(combo => combo.id === id ? comboAtualizado : combo));
      return true;
    } catch (err) {
      console.error('Erro ao editar combo:', err);
      setError('Não foi possível atualizar o combo. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComboContext.Provider value={{ 
      combos, 
      isLoading, 
      error, 
      adicionarCombo, 
      deleteCombo, 
      editarCombo,
      fetchCombos 
    }}>
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
