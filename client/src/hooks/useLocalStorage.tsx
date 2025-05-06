import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Função para obter o valor armazenado ou usar o valor inicial
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // Estado para armazenar o valor atual
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Função para atualizar tanto o estado quanto o localStorage
  const setValue = (value: T) => {
    try {
      // Permitir o valor ser uma função para ter a mesma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Salvar no estado
      setStoredValue(valueToStore);
      
      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Erro ao definir localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
