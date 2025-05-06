import { Switch, Route, useLocation } from "wouter";
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

// Componente de redirecionamento para rotas protegidas
const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Breve tempo para permitir que a autenticação seja verificada
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      if (!isAuthenticated) {
        console.log("Usuário não autenticado. Redirecionando para login...");
        setLocation('/login');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, setLocation, user]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-base-base rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <Component /> : null;
};

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/registro" component={RegistroPage} />
      <Route path="/recuperar-senha" component={RecuperarSenhaPage} />
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
      <Route component={NotFound} />
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
