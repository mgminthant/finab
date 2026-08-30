import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const url = new URL(process.env.DATABASE_URL!);
  // Strip Prisma-CLI-only params; the pg adapter handles TLS via `ssl`.
  url.searchParams.delete("sslmode");
  url.searchParams.delete("pgbouncer");
  url.searchParams.delete("connection_limit");

  // Normalize the CA into a well-formed PEM so it works regardless of how the
  // platform stores the value: local dotenv decodes `\n` escapes into real
  // newlines, while Vercel/AWS env vars keep them as literal backslash-n
  // (or mangle whitespace), which would otherwise break TLS verification.
  const caRaw = process.env.DATABASE_SSL_CA;
  const ca = caRaw
    ? (() => {
        const decoded = caRaw.replace(/\\r\\n?|\\n/g, "\n").trim();
        const match = decoded.match(
          /-----BEGIN CERTIFICATE-----([\s\S]*?)-----END CERTIFICATE-----/,
        );
        if (!match) return decoded;
        const base64 = match[1].replace(/\s+/g, "");
        const lines = base64.match(/.{1,64}/g) ?? [];
        return [
          "-----BEGIN CERTIFICATE-----",
          ...lines,
          "-----END CERTIFICATE-----",
        ].join("\n");
      })()
    : undefined;

  // Verify the server certificate when a CA is provided; otherwise the
  // Supabase/Postgres endpoint presents a self-signed chain that Node cannot
  // validate, so we fall back to skipping verification for local/dev/testing.
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