import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'vibeboxing-jwt-secret-key';
const TOKEN_EXPIRY = '7d'; // Token expira em 7 dias

export interface TokenPayload {
  userId: number;
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}