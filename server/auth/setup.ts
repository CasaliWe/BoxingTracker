import { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import prisma from '../../prisma/prisma-client';
import { comparePasswords, hashPassword } from './utils';

// Definir o usuário para Express Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Extender SessionData para incluir userId
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

export function setupAuth(app: Express) {
  // Configurar sessão
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'vibeboxing-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semana
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    })
  );

  // Middleware para verificar autenticação
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.userId) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: req.session.userId },
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            age: true,
            city: true,
            state: true,
            weight: true,
            height: true,
            gym: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        
        if (user) {
          req.user = user;
        }
      } catch (error) {
        console.error('Erro ao buscar usuário da sessão:', error);
      }
    }
    next();
  });

  // Rota de registro
  app.post('/api/register', async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' });
      }

      // Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Este email já está em uso' });
      }

      // Criar novo usuário
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          age: true,
          city: true,
          state: true,
          weight: true,
          height: true,
          gym: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Autenticar o usuário após o registro
      req.session.userId = user.id;
      res.status(201).json(user);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ message: 'Erro ao criar conta' });
    }
  });

  // Rota de login
  app.post('/api/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !(await comparePasswords(password, user.password))) {
        return res.status(401).json({ message: 'Email ou senha incorretos' });
      }

      // Autenticar o usuário
      req.session.userId = user.id;

      // Retornar dados do usuário (exceto a senha)
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        age: user.age,
        city: user.city,
        state: user.state,
        weight: user.weight,
        height: user.height,
        gym: user.gym,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      res.status(200).json(userData);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ message: 'Erro ao fazer login' });
    }
  });

  // Rota de logout
  app.post('/api/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erro ao fazer logout:', err);
        return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logout realizado com sucesso' });
    });
  });

  // Rota para obter informações do usuário autenticado
  app.get('/api/user', (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    res.status(200).json(req.user);
  });

  // Rota para atualizar perfil do usuário
  app.put('/api/user', async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    try {
      const {
        name,
        phone,
        age,
        city,
        state,
        weight,
        height,
        gym,
        profileImage,
      } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          name: name || undefined,
          phone: phone || undefined,
          age: age ? parseInt(age) : undefined,
          city: city || undefined,
          state: state || undefined,
          weight: weight ? parseFloat(weight) : undefined,
          height: height ? parseFloat(height) : undefined,
          gym: gym || undefined,
          profileImage: profileImage || undefined,
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          age: true,
          city: true,
          state: true,
          weight: true,
          height: true,
          gym: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
  });

  // Rota para alterar senha
  app.post('/api/change-password', async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
      }

      // Buscar usuário com senha
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!user || !(await comparePasswords(currentPassword, user.password))) {
        return res.status(401).json({ message: 'Senha atual incorreta' });
      }

      // Atualizar senha
      const hashedPassword = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashedPassword },
      });

      res.status(200).json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      res.status(500).json({ message: 'Erro ao alterar senha' });
    }
  });

  // Rota para excluir conta
  app.delete('/api/user', async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    try {
      await prisma.user.delete({
        where: { id: req.user.id },
      });

      req.session.destroy((err) => {
        if (err) {
          console.error('Erro ao destruir sessão após excluir conta:', err);
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Conta excluída com sucesso' });
      });
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      res.status(500).json({ message: 'Erro ao excluir conta' });
    }
  });
}