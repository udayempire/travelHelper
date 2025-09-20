// db.ts
import { PrismaClient } from '@prisma/client'

export const getDb = (databaseUrl: string) => {
  return new PrismaClient({ datasourceUrl: databaseUrl })
}
