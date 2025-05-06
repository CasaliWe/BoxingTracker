import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';

enum FormStage {
  INPUT_EMAIL,
  SUCCESS,
  ERROR
}

const RecuperarSenhaPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<FormStage>(FormStage.INPUT_EMAIL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu e-mail.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest("POST", "/api/forgot-password", { email });
      const data = await response.json();

      if (response.ok) {
        setStage(FormStage.SUCCESS);
      } else {
        setErrorMessage(data.message || 'Ocorreu um erro ao processar sua solicitação.');
        setStage(FormStage.ERROR);
      }
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      setErrorMessage('Ocorreu um erro ao conectar com o servidor. Tente novamente mais tarde.');
      setStage(FormStage.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {stage === FormStage.INPUT_EMAIL && "Recuperar Senha"}
            {stage === FormStage.SUCCESS && "E-mail Enviado"}
            {stage === FormStage.ERROR && "Erro"}
          </CardTitle>
          <CardDescription className="text-center">
            {stage === FormStage.INPUT_EMAIL && "Insira seu e-mail para recuperar sua senha"}
            {stage === FormStage.SUCCESS && "Verifique sua caixa de entrada"}
            {stage === FormStage.ERROR && "Não foi possível recuperar sua senha"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stage === FormStage.INPUT_EMAIL && (
            <form onSubmit={handleRecuperarSenha}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      autoComplete="email"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Recuperar Senha"}
                </Button>
              </div>
            </form>
          )}

          {stage === FormStage.SUCCESS && (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-500">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">E-mail enviado com sucesso!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Enviamos um e-mail com uma nova senha para {email}. Verifique sua caixa de entrada e também a pasta de spam.
                </AlertDescription>
              </Alert>
              <p className="text-sm text-gray-600 text-center">
                Use a nova senha para acessar sua conta e depois altere para uma senha de sua preferência no seu perfil.
              </p>
            </div>
          )}

          {stage === FormStage.ERROR && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                  {errorMessage}
                </AlertDescription>
              </Alert>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={() => setStage(FormStage.INPUT_EMAIL)}
              >
                Tentar Novamente
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <div className="text-sm text-gray-500">
            Lembrou sua senha?{" "}
            <a
              href="/login"
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Fazer login
            </a>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 text-gray-500 hover:text-gray-700"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecuperarSenhaPage;