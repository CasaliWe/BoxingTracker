import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth/setup";
import { setupCombosRoutes } from "./routes/combos";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar autenticação e rotas de usuário
  setupAuth(app);
  
  // Configurar rotas de combos
  setupCombosRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
