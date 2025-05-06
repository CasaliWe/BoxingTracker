import { Switch, Route, useLocation, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/DashboardPage";
import MeusCombosPage from "@/pages/MeusCombosPage";
import BibliotecaPage from "@/pages/BibliotecaPage";
import PerfilPage from "@/pages/PerfilPage";
import LoginPage from "@/pages/LoginPage";
import RegistroPage from "@/pages/RegistroPage";
import RecuperarSenhaPage from "@/pages/RecuperarSenhaPage";
import { ComboProvider } from "@/context/ComboContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getToken } from "./auth";

// Componente para carregamento
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin h-8 w-8 border-4 border-base-base rounded-full border-t-transparent"></div>
  </div>
);

// Componente de redirecionamento para rotas protegidas
const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      // Verificar autenticação
      if (!isAuthenticated && !getToken()) {
        console.log("Usuário não autenticado. Redirecionando para login...");
        setLocation('/login');
      } else {
        setIsLoading(false);
      }
    };
    
    // Breve tempo para permitir que a autenticação seja verificada
    const timer = setTimeout(() => {
      setIsLoading(false);
      checkAuth();
    }, 200);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, setLocation]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? <Component /> : null;
};

// Componente para rotas públicas (login, registro, recuperação de senha)
const PublicOnlyRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      // Se o usuário estiver autenticado, redirecionar para o dashboard
      if (isAuthenticated || getToken()) {
        console.log("Usuário já autenticado. Redirecionando para dashboard...");
        setLocation('/');
      } else {
        setIsLoading(false);
      }
    };
    
    // Breve tempo para permitir que a autenticação seja verificada
    const timer = setTimeout(() => {
      setIsLoading(false);
      checkAuth();
    }, 200);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, setLocation]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return !isAuthenticated ? <Component /> : null;
};

function Router() {
  return (
    <Switch>
      <Route path="/login">
        {() => <PublicOnlyRoute component={LoginPage} />}
      </Route>
      <Route path="/registro">
        {() => <PublicOnlyRoute component={RegistroPage} />}
      </Route>
      <Route path="/recuperar-senha">
        {() => <PublicOnlyRoute component={RecuperarSenhaPage} />}
      </Route>
      <Route path="/">
        {() => <ProtectedRoute component={DashboardPage} />}
      </Route>
      <Route path="/combos">
        {() => <ProtectedRoute component={MeusCombosPage} />}
      </Route>
      <Route path="/biblioteca">
        {() => <ProtectedRoute component={BibliotecaPage} />}
      </Route>
      <Route path="/perfil">
        {() => <ProtectedRoute component={PerfilPage} />}
      </Route>
      <Route>
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <ComboProvider>
        <QueryClientProvider client={queryClient}>
          <Router />
          <Toaster />
        </QueryClientProvider>
      </ComboProvider>
    </AuthProvider>
  );
}

export default App;
