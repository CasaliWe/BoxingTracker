import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalToken } from '../hooks/useLocalToken';

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
  token?: string; // Adicionado campo para o token JWT
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
  const { token, setToken } = useLocalToken();
  
  const isAuthenticated = !!user;

  // Verifica se o usuário está autenticado ao iniciar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Verificando autenticação...');
        
        if (!token) {
          console.log('Nenhum token encontrado no localStorage');
          setUser(null);
          return;
        }
        
        // Usar o token JWT no cabeçalho Authorization
        const res = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include', // Manter cookies como fallback
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
        
        if (res.ok) {
          const userData = await res.json();
          console.log('Usuário autenticado:', userData);
          setUser({...userData, token});
        } else {
          console.log('Usuário não autenticado ou token expirado');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setUser(null);
      }
    };
    
    checkAuth();
  }, [token, setToken]);

  // Função de login com email/senha
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'  // Importante: mantém cookies como fallback
      });
      
      if (!res.ok) {
        throw new Error('Falha no login');
      }
      
      const userData = await res.json();
      
      // Armazenar o token JWT no localStorage
      if (userData.token) {
        setToken(userData.token);
      }
      
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
        credentials: 'include' // Manter cookies como fallback
      });
      
      if (!res.ok) {
        throw new Error('Falha no registro');
      }
      
      const userData = await res.json();
      
      // Armazenar o token JWT no localStorage
      if (userData.token) {
        setToken(userData.token);
      }
      
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
        credentials: 'include',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      // Limpar o token do localStorage
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, remover dados de autenticação local
      setToken(null);
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
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(userData),
        credentials: 'include' // Manter cookies como fallback
      });
      
      if (!res.ok) {
        throw new Error('Falha ao atualizar perfil');
      }
      
      const updatedUser = await res.json();
      setUser(prev => prev ? {...updatedUser, token: prev.token} : null);
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
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include' // Manter cookies como fallback
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