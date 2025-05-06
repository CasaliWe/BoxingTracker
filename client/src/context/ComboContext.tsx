import React, { createContext, useContext, useState, useEffect } from 'react';
import { Combo } from '@/lib/constants';
import { useAuth } from './AuthContext';
import { getToken } from '@/auth';

// Tipo do contexto para APIs
interface ApiCombo {
  id: number;
  userId: number;
  name: string;
  base: string;
  guarda: string;
  etapas: string; // JSON string
  dataModificacao: string;
  createdAt: string;
  updatedAt: string;
}

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

// Função para converter API Combo para formato da interface
const apiComboToCombo = (apiCombo: ApiCombo): Combo => {
  let etapasObj;
  try {
    etapasObj = JSON.parse(typeof apiCombo.etapas === 'string' ? apiCombo.etapas : JSON.stringify(apiCombo.etapas));
  } catch (error) {
    console.error('Erro ao fazer parse das etapas:', error);
    etapasObj = [];
  }
  
  return {
    id: apiCombo.id.toString(),
    nome: apiCombo.name,
    base: apiCombo.base,
    guarda: apiCombo.guarda,
    etapas: etapasObj,
    dataModificacao: apiCombo.dataModificacao
  };
};

// Criação do contexto
const ComboContext = createContext<ComboContextType | undefined>(undefined);

// Provider Component
export const ComboProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Função para buscar combos da API
  const fetchCombos = async () => {
    if (!isAuthenticated || !user) {
      setCombos([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      const response = await fetch('/api/combos', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar combos');
      }
      
      const data = await response.json();
      // Converter API Combos para formato da interface
      const formattedCombos = Array.isArray(data) 
        ? data.map(apiComboToCombo) 
        : [];
        
      setCombos(formattedCombos);
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
  }, [isAuthenticated, user?.id]);
  
  // Função para adicionar um combo
  const adicionarCombo = async (novoCombo: Omit<Combo, 'id'>): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      setError('Você precisa estar autenticado para adicionar um combo.');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      // Já que estamos enviando para a API, precisamos preparar os dados corretamente
      const apiCombo = {
        nome: novoCombo.nome,
        base: novoCombo.base,
        guarda: novoCombo.guarda,
        etapas: novoCombo.etapas, // Será transformado em string na API
        dataModificacao: novoCombo.dataModificacao
      };
      
      const response = await fetch('/api/combos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(apiCombo)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao criar combo');
      }
      
      const comboSalvo = await response.json();
      const formattedCombo = apiComboToCombo(comboSalvo);
      setCombos(combos => [...combos, formattedCombo]);
      return true;
    } catch (err) {
      console.error('Erro ao adicionar combo:', err);
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o combo. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para deletar um combo
  const deleteCombo = async (id: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      setError('Você precisa estar autenticado para excluir um combo.');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      const response = await fetch(`/api/combos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao excluir combo');
      }
      
      setCombos(combos => combos.filter(combo => combo.id !== id));
      return true;
    } catch (err) {
      console.error('Erro ao excluir combo:', err);
      setError(err instanceof Error ? err.message : 'Não foi possível excluir o combo. Tente novamente mais tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para editar um combo
  const editarCombo = async (id: string, dadosAtualizados: Omit<Combo, 'id'>): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      setError('Você precisa estar autenticado para editar um combo.');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      const apiCombo = {
        nome: dadosAtualizados.nome,
        base: dadosAtualizados.base,
        guarda: dadosAtualizados.guarda,
        etapas: dadosAtualizados.etapas, // Será transformado em string na API
        dataModificacao: dadosAtualizados.dataModificacao
      };
      
      const response = await fetch(`/api/combos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(apiCombo)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao atualizar combo');
      }
      
      const comboAtualizado = await response.json();
      const formattedCombo = apiComboToCombo(comboAtualizado);
      setCombos(combos => combos.map(combo => combo.id === id ? formattedCombo : combo));
      return true;
    } catch (err) {
      console.error('Erro ao editar combo:', err);
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar o combo. Tente novamente mais tarde.');
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
