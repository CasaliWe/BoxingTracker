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
import { ComboProvider } from "@/context/ComboContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

// Componente de redirecionamento para rotas protegidas
const ProtectedRoute = ({ component: Component }: { component: React.ComponentType }) => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);
  
  return isAuthenticated ? <Component /> : null;
};

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/registro" component={RegistroPage} />
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
