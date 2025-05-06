import { Express, Request, Response } from 'express';
import prisma from '../../prisma/prisma-client';

// Middleware para verificar autenticação
function requireAuth(req: Request, res: Response, next: () => void) {
  if (!req.user) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  next();
}

export function setupCombosRoutes(app: Express) {
  // Listar todos os combos do usuário
  app.get('/api/combos', requireAuth, async (req: Request, res: Response) => {
    try {
      const combos = await prisma.combo.findMany({
        where: { userId: req.user.id },
        orderBy: { dataModificacao: 'desc' },
      });

      // Transformar o campo etapas de JSON string para objeto
      const formattedCombos = combos.map(combo => ({
        ...combo,
        etapas: JSON.parse(combo.etapas),
      }));

      res.json(formattedCombos);
    } catch (error) {
      console.error('Erro ao buscar combos:', error);
      res.status(500).json({ message: 'Erro ao buscar combos' });
    }
  });

  // Buscar um combo específico
  app.get('/api/combos/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const comboId = parseInt(req.params.id);
      
      const combo = await prisma.combo.findUnique({
        where: { 
          id: comboId,
          userId: req.user.id
        },
      });

      if (!combo) {
        return res.status(404).json({ message: 'Combo não encontrado' });
      }

      // Transformar o campo etapas de JSON string para objeto
      const formattedCombo = {
        ...combo,
        etapas: JSON.parse(combo.etapas),
      };

      res.json(formattedCombo);
    } catch (error) {
      console.error('Erro ao buscar combo:', error);
      res.status(500).json({ message: 'Erro ao buscar combo' });
    }
  });

  // Criar um novo combo
  app.post('/api/combos', requireAuth, async (req: Request, res: Response) => {
    try {
      const { nome, base, guarda, etapas } = req.body;

      if (!nome || !base || !guarda || !etapas) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      const combo = await prisma.combo.create({
        data: {
          userId: req.user.id,
          name: nome,
          base,
          guarda,
          etapas: typeof etapas === 'string' ? etapas : JSON.stringify(etapas),
          dataModificacao: new Date(),
        },
      });

      // Transformar o campo etapas de JSON string para objeto
      const formattedCombo = {
        ...combo,
        etapas: JSON.parse(combo.etapas),
      };

      res.status(201).json(formattedCombo);
    } catch (error) {
      console.error('Erro ao criar combo:', error);
      res.status(500).json({ message: 'Erro ao criar combo' });
    }
  });

  // Atualizar um combo
  app.put('/api/combos/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const comboId = parseInt(req.params.id);
      const { nome, base, guarda, etapas } = req.body;

      // Verificar se o combo pertence ao usuário
      const existingCombo = await prisma.combo.findUnique({
        where: { id: comboId },
      });

      if (!existingCombo) {
        return res.status(404).json({ message: 'Combo não encontrado' });
      }

      if (existingCombo.userId !== req.user.id) {
        return res.status(403).json({ message: 'Não autorizado' });
      }

      // Atualizar o combo
      const combo = await prisma.combo.update({
        where: { id: comboId },
        data: {
          name: nome || undefined,
          base: base || undefined,
          guarda: guarda || undefined,
          etapas: etapas ? (typeof etapas === 'string' ? etapas : JSON.stringify(etapas)) : undefined,
          dataModificacao: new Date(),
        },
      });

      // Transformar o campo etapas de JSON string para objeto
      const formattedCombo = {
        ...combo,
        etapas: JSON.parse(combo.etapas),
      };

      res.json(formattedCombo);
    } catch (error) {
      console.error('Erro ao atualizar combo:', error);
      res.status(500).json({ message: 'Erro ao atualizar combo' });
    }
  });

  // Excluir um combo
  app.delete('/api/combos/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const comboId = parseInt(req.params.id);

      // Verificar se o combo pertence ao usuário
      const existingCombo = await prisma.combo.findUnique({
        where: { id: comboId },
      });

      if (!existingCombo) {
        return res.status(404).json({ message: 'Combo não encontrado' });
      }

      if (existingCombo.userId !== req.user.id) {
        return res.status(403).json({ message: 'Não autorizado' });
      }

      // Excluir o combo
      await prisma.combo.delete({
        where: { id: comboId },
      });

      res.json({ message: 'Combo excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir combo:', error);
      res.status(500).json({ message: 'Erro ao excluir combo' });
    }
  });
}