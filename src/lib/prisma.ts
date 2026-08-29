import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const url = new URL(process.env.DATABASE_URL!);
  // Strip Prisma-CLI-only params; the pg adapter handles TLS via `ssl`.
  url.searchParams.delete("sslmode");
  url.searchParams.delete("pgbouncer");
  url.searchParams.delete("connection_limit");

  // Verify the server certificate when a CA is provided; otherwise the
  // Supabase/Postgres endpoint presents a self-signed chain that Node cannot
  // validate, so we fall back to skipping verification for local/dev/testing.
  const ca = process.env.DATABASE_SSL_CA;
  const ssl = ca
    ? { rejectUnauthorized: true, ca }
    : { rejectUnauthorized: false };

  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: url.toString(),
      ssl,
    }),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;