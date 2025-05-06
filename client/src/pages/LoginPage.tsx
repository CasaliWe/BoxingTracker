import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const [_, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta ao VibeBoxing."
        });
        setLocation('/');
      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const success = await loginWithGoogle();
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta ao VibeBoxing."
        });
        setLocation('/');
      } else {
        toast({
          title: "Falha no login",
          description: "Não foi possível fazer login com Google.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro durante o login com Google. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-base-dark/20 flex items-center justify-center">
              <i className="ri-boxing-fill text-3xl text-base-base"></i>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">VibeBoxing</h1>
          <p className="text-muted-foreground">Faça login para acessar sua conta</p>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-dark-600 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-muted-foreground">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm text-muted-foreground">Senha</label>
                <a href="#" className="text-xs text-base-base hover:underline">Esqueceu a senha?</a>
              </div>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white"
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-base-dark hover:bg-base-base text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Entrar
            </button>
          </form>
          
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-dark-600"></div>
            <span className="mx-4 text-sm text-muted-foreground">ou</span>
            <div className="flex-grow border-t border-dark-600"></div>
          </div>
          
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-muted hover:bg-secondary text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex justify-center items-center"
            disabled={isLoading}
          >
            <i className="ri-google-fill mr-2 text-lg"></i>
            Entrar com Google
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link href="/registro" className="text-base-base hover:underline">
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;