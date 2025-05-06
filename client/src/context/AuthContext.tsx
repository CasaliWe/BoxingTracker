import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveToken, saveUser, getUser, clearAuth } from '../auth';

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
  token?: string;
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
  
  // Função de login com email/senha
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Falha no login');
      }
      
      const userData = await res.json();
      
      // Salvar token e dados do usuário no localStorage para persistência
      if (userData.token) {
        saveToken(userData.token);
      }
      saveUser(userData);
      
      // Atualizar estado
      setUser(userData);
      
      // Verificar se recebemos os dados do usuário corretamente
      console.log('Login bem-sucedido, dados do usuário:', userData);
      
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  // Função de registro
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Falha no registro');
      }
      
      const userData = await res.json();
      
      // Salvar token e dados do usuário no localStorage para persistência
      if (userData.token) {
        saveToken(userData.token);
      }
      saveUser(userData);
      
      // Atualizar estado
      setUser(userData);
      
      console.log('Registro bem-sucedido, dados do usuário:', userData);
      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return false;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Limpar dados de autenticação do localStorage
      clearAuth();
      
      // Atualizar estado
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, remover dados de autenticação local
      clearAuth();
      setUser(null);
    }
  };
  
  // Função para atualizar perfil
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Falha ao atualizar perfil');
      }
      
      const updatedUser = await res.json();
      
      // Atualizar dados no localStorage
      const currentUser = getUser();
      if (currentUser) {
        const mergedUser = { ...currentUser, ...updatedUser };
        saveUser(mergedUser);
      }
      
      // Atualizar estado
      setUser(prev => prev ? {...updatedUser} : null);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    }
  };
  
  // Função para alterar senha
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Falha ao alterar senha');
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return false;
    }
  };
  
  // Função para excluir conta
  const deleteAccount = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/user', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Falha ao excluir conta');
      }
      
      // Limpar dados de autenticação do localStorage
      clearAuth();
      
      // Atualizar estado
      setUser(null);
      return true;
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      return false;
    }
  };

  // Verificar login no carregamento da aplicação
  useEffect(() => {
    const loadUserFromStorage = () => {
      // Primeiro, tentar obter o usuário do localStorage
      const savedUser = getUser();
      if (savedUser && savedUser.token) {
        console.log('Usuário encontrado no localStorage:', savedUser);
        setUser(savedUser);
        return true;
      }
      return false;
    };

    const checkServerAuth = async () => {
      try {
        console.log('Verificando autenticação no servidor...');
        
        const res = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
        
        if (res.ok) {
          const userData = await res.json();
          console.log('Usuário autenticado no servidor:', userData);
          
          // Salvar no localStorage para persistência
          if (userData.token) {
            saveToken(userData.token);
          }
          saveUser(userData);
          
          setUser(userData);
          return true;
        } else {
          console.log('Usuário não autenticado no servidor');
          return false;
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação no servidor:', error);
        return false;
      }
    };
    
    // Primeiro tentar do localStorage, se não funcionar, tentar do servidor
    const userLoaded = loadUserFromStorage();
    if (!userLoaded) {
      checkServerAuth().catch(err => {
        console.error("Erro ao verificar autenticação:", err);
        setUser(null);
        clearAuth();
      });
    }
  }, []);

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