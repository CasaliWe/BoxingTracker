import { Golpe, CategoriaGolpe } from './constants';

// Lista de todos os golpes
export const todosGolpes: Golpe[] = [
  // ATAQUES
  { nome: 'Jab D ↑', categoria: 'ATAQUE', variacao: 'up' },
  { nome: 'Jab D ↓', categoria: 'ATAQUE', variacao: 'down' },
  { nome: 'Jab E ↑', categoria: 'ATAQUE', variacao: 'up' },
  { nome: 'Jab E ↓', categoria: 'ATAQUE', variacao: 'down' },
  { nome: 'Direto D ↑', categoria: 'ATAQUE', variacao: 'up' },
  { nome: 'Direto D ↓', categoria: 'ATAQUE', variacao: 'down' },
  { nome: 'Direto E ↑', categoria: 'ATAQUE', variacao: 'up' },
  { nome: 'Direto E ↓', categoria: 'ATAQUE', variacao: 'down' },
  { nome: 'Cruzado D ↑', categoria: 'ATAQUE', variacao: 'up' },
  { nome: 'Cruzado D ↓', categoria: 'ATAQUE', variacao: 'down' },
  { nome: 'Cruzado E ↑', categoria: 'ATAQUE', variacao: 'up' },
  { nome: 'Cruzado E ↓', categoria: 'ATAQUE', variacao: 'down' },
  { nome: 'Upper D ↑', categoria: 'ATAQUE', variacao: 'up' },
  { nome: 'Upper D ↓', categoria: 'ATAQUE', variacao: 'down' },
  { nome: 'Upper E ↑', categoria: 'ATAQUE', variacao: 'up' },
  { nome: 'Upper E ↓', categoria: 'ATAQUE', variacao: 'down' },
  { nome: 'Overhand D', categoria: 'ATAQUE' },
  { nome: 'Overhand E', categoria: 'ATAQUE' },
  
  // ESQUIVAS
  { nome: 'Slip E', categoria: 'ESQUIVA', variacao: 'E' },
  { nome: 'Slip D', categoria: 'ESQUIVA', variacao: 'D' },
  { nome: 'Pêndulo', categoria: 'ESQUIVA' },
  { nome: 'Pêndulo E', categoria: 'ESQUIVA', variacao: 'E' },
  { nome: 'Pêndulo D', categoria: 'ESQUIVA', variacao: 'D' },
  { nome: 'Pêndulo avança E', categoria: 'ESQUIVA', variacao: 'E' },
  { nome: 'Pêndulo avança D', categoria: 'ESQUIVA', variacao: 'D' },
  { nome: 'Step back', categoria: 'ESQUIVA' },
  
  // BLOQUEIOS
  { nome: 'Bloqueio alto E', categoria: 'BLOQUEIO', variacao: 'E' },
  { nome: 'Bloqueio alto D', categoria: 'BLOQUEIO', variacao: 'D' },
  { nome: 'Bloqueio baixo E', categoria: 'BLOQUEIO', variacao: 'E' },
  { nome: 'Bloqueio baixo D', categoria: 'BLOQUEIO', variacao: 'D' },
  { nome: 'Esgrima E', categoria: 'BLOQUEIO', variacao: 'E' },
  { nome: 'Esgrima D', categoria: 'BLOQUEIO', variacao: 'D' },
  { nome: 'Fechar guarda', categoria: 'BLOQUEIO' },
  
  // FOOTWORK
  { nome: 'Passo atrás', categoria: 'FOOTWORK' },
  { nome: 'Passo E', categoria: 'FOOTWORK', variacao: 'E' },
  { nome: 'Passo D', categoria: 'FOOTWORK', variacao: 'D' },
  { nome: 'Passo à frente', categoria: 'FOOTWORK' },
  { nome: 'Giro E', categoria: 'FOOTWORK', variacao: 'E' },
  { nome: 'Giro D', categoria: 'FOOTWORK', variacao: 'D' },
  
  // CLINCH
  { nome: 'Clinch (grappling)', categoria: 'CLINCH' },
];

// Mapeamento de golpes quando a base é canhoto
const mapeamentoGolpesCanhoto: Record<string, string> = {
  // Invertendo D e E para ataques
  'Jab D ↑': 'Jab E ↑',
  'Jab D ↓': 'Jab E ↓',
  'Jab E ↑': 'Jab D ↑',
  'Jab E ↓': 'Jab D ↓',
  'Direto D ↑': 'Direto E ↑',
  'Direto D ↓': 'Direto E ↓',
  'Direto E ↑': 'Direto D ↑',
  'Direto E ↓': 'Direto D ↓',
  'Cruzado D ↑': 'Cruzado E ↑',
  'Cruzado D ↓': 'Cruzado E ↓',
  'Cruzado E ↑': 'Cruzado D ↑',
  'Cruzado E ↓': 'Cruzado D ↓',
  'Upper D ↑': 'Upper E ↑',
  'Upper D ↓': 'Upper E ↓',
  'Upper E ↑': 'Upper D ↑',
  'Upper E ↓': 'Upper D ↓',
  'Overhand D': 'Overhand E',
  'Overhand E': 'Overhand D',
  
  // Invertendo E e D para esquivas
  'Slip E': 'Slip D',
  'Slip D': 'Slip E',
  'Pêndulo E': 'Pêndulo D',
  'Pêndulo D': 'Pêndulo E',
  'Pêndulo avança E': 'Pêndulo avança D',
  'Pêndulo avança D': 'Pêndulo avança E',
  
  // Invertendo E e D para bloqueios
  'Bloqueio alto E': 'Bloqueio alto D',
  'Bloqueio alto D': 'Bloqueio alto E',
  'Bloqueio baixo E': 'Bloqueio baixo D',
  'Bloqueio baixo D': 'Bloqueio baixo E',
  'Esgrima E': 'Esgrima D',
  'Esgrima D': 'Esgrima E',
  
  // Invertendo E e D para footwork
  'Passo E': 'Passo D',
  'Passo D': 'Passo E',
  'Giro E': 'Giro D',
  'Giro D': 'Giro E'
};

// Função para ajustar golpes baseado na posição (destro ou canhoto)
export const ajustarGolpePorBase = (golpe: Golpe, base: string): Golpe => {
  if (base === 'destro' || !mapeamentoGolpesCanhoto[golpe.nome]) {
    return golpe;
  }
  
  // Encontrar o golpe correspondente para canhoto
  const nomeGolpeAjustado = mapeamentoGolpesCanhoto[golpe.nome];
  const golpeAjustado = todosGolpes.find(g => g.nome === nomeGolpeAjustado);
  
  return golpeAjustado || golpe;
};

// Função para obter golpes por categoria
export const obterGolpesPorCategoria = (categoria: CategoriaGolpe, base: string = 'destro'): Golpe[] => {
  const golpesDaCategoria = todosGolpes.filter(golpe => golpe.categoria === categoria);
  
  if (base === 'destro') {
    return golpesDaCategoria;
  }
  
  // Ajustar golpes para base canhota
  return golpesDaCategoria.map(golpe => {
    const nomeAjustado = mapeamentoGolpesCanhoto[golpe.nome] || golpe.nome;
    return {
      ...golpe,
      nome: nomeAjustado
    };
  });
};
