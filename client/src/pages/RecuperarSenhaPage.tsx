import React, { useState } from 'react';
import { Link } from 'wouter';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

enum FormStage {
  INPUT_EMAIL,
  SUCCESS,
  ERROR
}

const RecuperarSenhaPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<FormStage>(FormStage.INPUT_EMAIL);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiRequest(
        "POST", 
        "/api/forgot-password", 
        { email }
      );
      
      if (response.ok) {
        setStage(FormStage.SUCCESS);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Ocorreu um erro ao solicitar a recuperação de senha.");
        setStage(FormStage.ERROR);
      }
    } catch (error) {
      console.error("Erro ao recuperar senha:", error);
      setErrorMessage("Erro de conexão. Por favor, tente novamente mais tarde.");
      setStage(FormStage.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-xl shadow-lg border border-dark-600 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="mb-6 text-center">
            <Link href="/">
              <div className="inline-block">
                <span className="text-3xl font-bold text-base-base">Vibe<span className="text-white">Boxing</span></span>
              </div>
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            {stage === FormStage.INPUT_EMAIL && "Recuperar Senha"}
            {stage === FormStage.SUCCESS && "Email Enviado"}
            {stage === FormStage.ERROR && "Ocorreu um Erro"}
          </h1>
          
          {stage === FormStage.INPUT_EMAIL && (
            <>
              <p className="text-muted-foreground mb-6 text-center">
                Informe seu email de cadastro para receber uma nova senha temporária.
              </p>
              
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
                    placeholder="seu@email.com"
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
                  Enviar
                </button>
              </form>
            </>
          )}
          
          {stage === FormStage.SUCCESS && (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-base-dark/20 rounded-full flex items-center justify-center">
                  <i className="ri-mail-check-line text-3xl text-base-base"></i>
                </div>
              </div>
              <p className="text-white mb-2">
                Uma nova senha foi enviada para <strong>{email}</strong>
              </p>
              <p className="text-muted-foreground mb-6">
                Verifique sua caixa de entrada e também a pasta de spam.
              </p>
              <Link href="/login" className="text-base-base hover:underline">
                Voltar para o login
              </Link>
            </div>
          )}
          
          {stage === FormStage.ERROR && (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-ataques-dark/20 rounded-full flex items-center justify-center">
                  <i className="ri-error-warning-line text-3xl text-ataques-base"></i>
                </div>
              </div>
              <p className="text-white mb-6">
                {errorMessage || "Não foi possível recuperar sua senha. Tente novamente mais tarde."}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => setStage(FormStage.INPUT_EMAIL)}
                  className="text-base-base hover:underline"
                >
                  Tentar novamente
                </button>
                <Link href="/login" className="text-muted-foreground hover:text-white">
                  Voltar para o login
                </Link>
              </div>
            </div>
          )}
          
          {stage === FormStage.INPUT_EMAIL && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Lembrou sua senha?{' '}
                <Link href="/login" className="text-base-base hover:underline">
                  Entrar
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenhaPage;