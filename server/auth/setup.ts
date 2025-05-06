import { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import prisma from '../../prisma/prisma-client';
import { comparePasswords, hashPassword } from './utils';
import memorystore from 'memorystore';
import { sendPasswordResetEmail, generateRandomPassword } from '../utils/email';
import { generateToken, verifyToken } from './token';
import { profileUpload, deleteProfileImage, getProfileImageUrl } from '../utils/upload';

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
  // Configurar sessão com MemoryStore
  const MemoryStore = memorystore(session);
  
  // Configurar proxy para confiança no header X-Forwarded-* (importante no ambiente Replit)
  // Configuração importante para funcionamento em ambiente Replit
  app.set('trust proxy', 1);
  app.enable('trust proxy');
  
  app.use(
    session({
      store: new MemoryStore({
        checkPeriod: 86400000 // limpar sessões expiradas a cada 24h
      }),
      name: 'vibeboxing.sid', // Nome personalizado do cookie
      secret: process.env.SESSION_SECRET || 'vibeboxing-secret-key',
      resave: true, // Salva a sessão mesmo se não modificada
      saveUninitialized: true, // Cria a sessão para todos os visitantes
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
        httpOnly: true,
        // sameSite deve ser 'none' quando secure é true, mas no Replit é melhor usar 'lax' com secure=false
        secure: false, // NÃO mudar para true
        sameSite: 'lax', 
        path: '/', 
      },
      rolling: true, // Renova o cookie a cada requisição
    })
  );
  
  // Log para debug de sessão (comentado para não poluir o console)
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.path === '/api/login' || req.path === '/api/user') {
      console.log('Session ID:', req.sessionID);
      console.log('Session data:', req.session);
    }
    next();
  });

  // Middleware para verificar autenticação (usando token JWT ou sessão como fallback)
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Primeiro tenta verificar pelo token JWT no cabeçalho Authorization (enviado pelo cliente)
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const payload = verifyToken(token);
        
        if (payload && payload.userId) {
          const user = await prisma.user.findUnique({
            where: { id: payload.userId },
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
            // Adicionar token ao usuário para que o cliente possa armazenar
            const userData = {
              ...user,
              token
            };
            req.user = userData;
            return next();
          }
        }
      }
      
      // Se não houver token ou se o token for inválido, tenta verificar a sessão
      if (req.session && req.session.userId) {
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
          // Gerar um novo token para o usuário a partir da sessão
          const token = generateToken(user.id);
          
          // Adicionar token ao usuário para que o cliente possa armazenar
          const userData = {
            ...user,
            token
          };
          req.user = userData;
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
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

      // Gerar token JWT
      const token = generateToken(user.id);

      // Também manter a sessão como backup
      req.session.userId = user.id;
      
      // Salvar sessão explicitamente
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('Erro ao salvar sessão durante registro:', err);
            reject(err);
          } else {
            console.log('Sessão salva com sucesso durante registro. Session ID:', req.sessionID);
            resolve();
          }
        });
      });
      
      // Retornar dados do usuário e o token de autenticação
      const userData = {
        ...user,
        token
      };
      
      res.status(201).json(userData);
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

      // Gerar token JWT
      const token = generateToken(user.id);

      // Também manter a sessão como backup
      req.session.userId = user.id;
      
      // Salvar sessão como backup
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('Erro ao salvar sessão:', err);
            reject(err);
          } else {
            console.log('Sessão salva com sucesso. Session ID:', req.sessionID);
            resolve();
          }
        });
      });

      // Retornar dados do usuário e o token
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
        token: token // Incluir o token JWT na resposta
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
      res.clearCookie('vibeboxing.sid', { path: '/' });
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
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres' });
      }

      // Buscar usuário com senha
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Verificar se a senha atual está correta
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      if (!isPasswordValid) {
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
        res.clearCookie('vibeboxing.sid', { path: '/' });
        res.status(200).json({ message: 'Conta excluída com sucesso' });
      });
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      res.status(500).json({ message: 'Erro ao excluir conta' });
    }
  });
  
  // Rota para recuperação de senha
  app.post('/api/forgot-password', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório' });
      }
      
      if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ message: 'Por favor, forneça um email válido' });
      }
      
      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Email não encontrado no sistema' });
      }
      
      // Gerar nova senha aleatória
      const newPassword = generateRandomPassword(8);
      const hashedPassword = await hashPassword(newPassword);
      
      try {
        // Atualizar senha do usuário
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });
      } catch (updateError) {
        console.error('Erro ao atualizar senha do usuário:', updateError);
        return res.status(500).json({ message: 'Erro ao atualizar senha. Por favor, tente novamente mais tarde.' });
      }
      
      // Tenta enviar email, mas com fallback para mostrar a senha diretamente em ambiente de desenvolvimento
      try {
        console.log('Tentando enviar email para:', email);
        const emailSent = await sendPasswordResetEmail(email, newPassword);
        
        if (!emailSent) {
          console.log('Falha ao enviar email, mas retornaremos a senha em modo de desenvolvimento');
          
          // Em ambiente de desenvolvimento, retornamos a senha no response
          if (process.env.NODE_ENV !== 'production') {
            return res.status(200).json({ 
              message: 'Modo de desenvolvimento: Não foi possível enviar o email. Use a senha abaixo para login.',
              tempPassword: newPassword 
            });
          } else {
            return res.status(500).json({ message: 'Erro ao enviar email de recuperação. Por favor, tente novamente mais tarde.' });
          }
        }
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        
        // Em ambiente de desenvolvimento, retornamos a senha no response
        if (process.env.NODE_ENV !== 'production') {
          return res.status(200).json({ 
            message: 'Modo de desenvolvimento: Não foi possível enviar o email. Use a senha abaixo para login.',
            tempPassword: newPassword 
          });
        } else {
          return res.status(500).json({ message: 'Serviço de email temporariamente indisponível. Por favor, tente novamente mais tarde.' });
        }
      }
      
      res.status(200).json({ message: 'Email de recuperação enviado com sucesso. Verifique sua caixa de entrada.' });
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      res.status(500).json({ message: 'Erro ao processar a recuperação de senha' });
    }
  });
}