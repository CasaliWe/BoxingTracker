// Tipos de golpes
export type CategoriaGolpe = 'ATAQUE' | 'ESQUIVA' | 'BLOQUEIO' | 'FOOTWORK' | 'CLINCH' | 'BASE' | 'GUARDA';

// Interface para golpes
export interface Golpe {
  nome: string;
  categoria: CategoriaGolpe;
  variacao?: string;
  descricao?: string;
}

// Interface para combos
export interface Combo {
  id: string;
  nome: string;
  base: string; // 'destro' | 'canhoto'
  guarda: string;
  etapas: { golpes: Golpe[] }[];
  dataModificacao: string;
}

// Tipos de guarda
export const tiposGuarda = [
  { 
    nome: 'Guarda Tradicional', 
    valor: 'tradicional', 
    icone: 'ri-shield-line'
  },
  { 
    nome: 'Philly Shell', 
    valor: 'philly', 
    icone: 'ri-shield-star-line'
  },
  { 
    nome: 'Guarda Longa', 
    valor: 'longa', 
    icone: 'ri-shield-cross-line'
  },
  { 
    nome: 'Guarda Baixa', 
    valor: 'baixa', 
    icone: 'ri-shield-flash-line'
  },
  { 
    nome: 'Peek-a-boo', 
    valor: 'peekaboo', 
    icone: 'ri-shield-keyhole-line'
  }
];

// Cores das categorias
export const coresCategorias = {
  ATAQUE: {
    base: 'bg-ataques-base',
    light: 'bg-ataques-light',
    dark: 'bg-ataques-dark'
  },
  ESQUIVA: {
    base: 'bg-esquivas-base',
    light: 'bg-esquivas-light',
    dark: 'bg-esquivas-dark'
  },
  BLOQUEIO: {
    base: 'bg-bloqueios-base',
    light: 'bg-bloqueios-light',
    dark: 'bg-bloqueios-dark'
  },
  FOOTWORK: {
    base: 'bg-footwork-base',
    light: 'bg-footwork-light',
    dark: 'bg-footwork-dark'
  },
  GUARDA: {
    base: 'bg-guardas-base',
    light: 'bg-guardas-light',
    dark: 'bg-guardas-dark'
  },
  BASE: {
    base: 'bg-base-base',
    light: 'bg-base-light',
    dark: 'bg-base-dark'
  },
  CLINCH: {
    base: 'bg-clinch-base',
    light: 'bg-clinch-light',
    dark: 'bg-clinch-dark'
  }
};
