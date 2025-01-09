import { PrismaClient } from '~/prisma/client.ts'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ||
  new PrismaClient()

if (Deno.env.get('DENO_ENV') !== 'production') globalForPrisma.prisma = prisma
