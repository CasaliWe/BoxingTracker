import { useState, useEffect } from 'react';

export function useLocalToken() {
  const [token, setTokenState] = useState<string | null>(null);

  // Inicializar o token do localStorage ao montar o componente
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('auth_token', newToken);
    } else {
      localStorage.removeItem('auth_token');
    }
    setTokenState(newToken);
  };

  return { token, setToken };
}