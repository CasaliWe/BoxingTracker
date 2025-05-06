// Funções simples para gerenciamento de autenticação com localStorage

// Constante para o nome da chave do token no localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Salvar o token no localStorage
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Obter o token do localStorage
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remover o token do localStorage
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Salvar dados do usuário no localStorage
export const saveUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Obter dados do usuário do localStorage
export const getUser = (): any | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Erro ao analisar dados do usuário:', error);
    return null;
  }
};

// Remover dados do usuário do localStorage
export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Limpar todos os dados de autenticação
export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

// Verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getUser();
};