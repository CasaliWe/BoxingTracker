import { Golpe, CategoriaGolpe } from './constants';

// Lista de todos os golpes
export const todosGolpes: Golpe[] = [
  // ATAQUES
  { nome: 'Jab up', categoria: 'ATAQUE', variacao: 'up' },
  { nome: 'Jab down', categoria: 'ATAQUE', variacao: 'down' },
  { nome: 'Direto up', categoria: 'ATAQUE', variacao: 'up' },
  { nome: 'Direto down', categoria: 'ATAQUE', variacao: 'down' },
  { nome: 'Cruzado up', categoria: 'ATAQUE', variacao: 'up' },
  { nome: 'Cruzado down', categoria: 'ATAQUE', variacao: 'down' },
  { nome: 'Upper up', categoria: 'ATAQUE', variacao: 'up' },
  { nome: 'Upper down', categoria: 'ATAQUE', variacao: 'down' },
  { nome: 'Overhand', categoria: 'ATAQUE' },
  
  // ESQUIVAS
  { nome: 'Slip L', categoria: 'ESQUIVA', variacao: 'L' },
  { nome: 'Slip R', categoria: 'ESQUIVA', variacao: 'R' },
  { nome: 'Pêndulo', categoria: 'ESQUIVA' },
  { nome: 'Pêndulo L', categoria: 'ESQUIVA', variacao: 'L' },
  { nome: 'Pêndulo R', categoria: 'ESQUIVA', variacao: 'R' },
  { nome: 'Pêndulo avança L', categoria: 'ESQUIVA', variacao: 'L' },
  { nome: 'Pêndulo avança R', categoria: 'ESQUIVA', variacao: 'R' },
  { nome: 'Step back', categoria: 'ESQUIVA' },
  
  // BLOQUEIOS
  { nome: 'Block head L', categoria: 'BLOQUEIO', variacao: 'L' },
  { nome: 'Block head R', categoria: 'BLOQUEIO', variacao: 'R' },
  { nome: 'Block body L', categoria: 'BLOQUEIO', variacao: 'L' },
  { nome: 'Block body R', categoria: 'BLOQUEIO', variacao: 'R' },
  { nome: 'Esgrima L', categoria: 'BLOQUEIO', variacao: 'L' },
  { nome: 'Esgrima R', categoria: 'BLOQUEIO', variacao: 'R' },
  { nome: 'Block center', categoria: 'BLOQUEIO' },
  
  // FOOTWORK
  { nome: 'Passo atrás', categoria: 'FOOTWORK' },
  { nome: 'Passo L', categoria: 'FOOTWORK', variacao: 'L' },
  { nome: 'Passo R', categoria: 'FOOTWORK', variacao: 'R' },
  { nome: 'Passo à frente', categoria: 'FOOTWORK' },
  { nome: 'Giro L', categoria: 'FOOTWORK', variacao: 'L' },
  { nome: 'Giro R', categoria: 'FOOTWORK', variacao: 'R' },
  
  // CLINCH
  { nome: 'Clinch (grappling)', categoria: 'CLINCH' },
];

// Mapeamento de golpes quando a base é canhoto
const mapeamentoGolpesCanhoto: Record<string, string> = {
  'Jab up': 'Jab up',
  'Jab down': 'Jab down',
  'Direto up': 'Direto up',
  'Direto down': 'Direto down',
  'Cruzado up': 'Cruzado up',
  'Cruzado down': 'Cruzado down',
  'Upper up': 'Upper up',
  'Upper down': 'Upper down',
  'Overhand': 'Overhand',
  'Slip L': 'Slip R',
  'Slip R': 'Slip L',
  'Pêndulo L': 'Pêndulo R',
  'Pêndulo R': 'Pêndulo L',
  'Pêndulo avança L': 'Pêndulo avança R',
  'Pêndulo avança R': 'Pêndulo avança L',
  'Block head L': 'Block head R',
  'Block head R': 'Block head L',
  'Block body L': 'Block body R',
  'Block body R': 'Block body L',
  'Esgrima L': 'Esgrima R',
  'Esgrima R': 'Esgrima L',
  'Passo L': 'Passo R',
  'Passo R': 'Passo L',
  'Giro L': 'Giro R',
  'Giro R': 'Giro L'
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
