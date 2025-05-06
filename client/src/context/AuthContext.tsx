import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { QueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  city?: string;
  state?: string;
  weight?: number;
  height?: number;
  gym?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const isAuthenticated = !!user;

  // Verifica se o usuário está autenticado ao iniciar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/user', {
          credentials: 'include'
        });
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      }
    };
    
    checkAuth();
  }, []);

  // Função de login com email/senha
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiRequest('POST', '/api/login', { email, password });
      const userData = await res.json();
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  // Função de registro
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiRequest('POST', '/api/register', { name, email, password });
      const userData = await res.json();
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return false;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await apiRequest('POST', '/api/logout');
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  
  // Função para atualizar perfil
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const res = await apiRequest('PUT', '/api/user', userData);
      const updatedUser = await res.json();
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    }
  };
  
  // Função para alterar senha
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await apiRequest('POST', '/api/change-password', { currentPassword, newPassword });
      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return false;
    }
  };
  
  // Função para excluir conta
  const deleteAccount = async (): Promise<boolean> => {
    try {
      await apiRequest('DELETE', '/api/user');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      updateProfile,
      changePassword,
      deleteAccount 
    }}>
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