import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('vibeboxing-user', null);
  
  const isAuthenticated = !!user;

  // Função de login com email/senha
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulação de login (em produção, conectaria a um backend real)
      if (email && password) {
        // Simular um delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUser({
          id: '1',
          name: email.split('@')[0],
          email
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  // Função de login com Google
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Simulação de login com Google
      // Em produção, conectaria com Firebase ou outro provedor
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser({
        id: '2',
        name: 'Usuário Google',
        email: 'usuario@gmail.com'
      });
      return true;
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      return false;
    }
  };

  // Função de registro
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulação de registro
      if (name && email && password) {
        // Simular um delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUser({
          id: '3',
          name,
          email
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return false;
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};