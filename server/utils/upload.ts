import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Configurar o diretório de uploads
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const PROFILE_DIR = path.join(UPLOAD_DIR, 'profile');

// Garantir que os diretórios existam
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

if (!fs.existsSync(PROFILE_DIR)) {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
}

// Interface para estender o Request com o objeto user
interface UserRequest extends Request {
  user?: {
    id: number | string;
    [key: string]: any;
  };
}

// Configuração de armazenamento para o multer
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, PROFILE_DIR);
  },
  filename: function (req: UserRequest, file, cb) {
    // Gerar um nome de arquivo único baseado no ID do usuário e timestamp
    const userId = req.user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `profile_${userId}_${timestamp}${ext}`);
  }
});

// Função para filtrar arquivos não permitidos
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Permitir apenas arquivos de imagem
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos'));
  }
};

// Configuração do multer para upload de imagens de perfil
export const profileUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
  fileFilter: fileFilter
});

// Função para excluir uma imagem de perfil
export function deleteProfileImage(filename: string | null | undefined): Promise<boolean> {
  return new Promise((resolve) => {
    if (!filename) {
      resolve(false);
      return;
    }

    const filePath = path.join(PROFILE_DIR, filename);
    
    // Verificar se o arquivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`Arquivo não encontrado: ${filePath}`);
        resolve(false);
        return;
      }
      
      // Excluir o arquivo
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Erro ao excluir arquivo: ${filePath}`, err);
          resolve(false);
          return;
        }
        
        console.log(`Arquivo excluído com sucesso: ${filePath}`);
        resolve(true);
      });
    });
  });
}

// Função para obter o URL completo para uma imagem de perfil
export function getProfileImageUrl(filename: string | null | undefined): string | null {
  if (!filename) return null;
  return `/uploads/profile/${filename}`;
}