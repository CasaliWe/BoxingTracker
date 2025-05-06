import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getToken } from '../auth';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Obter token de autenticação do localStorage, se disponível
  const token = getToken();
  
  // Preparar headers padrão
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  };
  
  // Adicionar Content-Type se houver dados
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  // Adicionar token na autorização se disponível
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Manter cookies de sessão como fallback
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Obter token de autenticação, se disponível
    const token = getToken();
    
    // Configurar headers para a requisição
    const headers: Record<string, string> = {
      "Accept": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    };
    
    // Adicionar token de autorização, se disponível
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include", // Manter cookies como fallback
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
