import { PrismaClient } from '@prisma/client';

// Inicializa uma única instância do PrismaClient para usar em toda a aplicação
const prisma = new PrismaClient();

export default prisma;