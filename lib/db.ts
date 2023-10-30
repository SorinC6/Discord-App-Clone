import { PrismaClient } from "@prisma/client";

// add hack for hot relload to not initiating to many prima client in development env

declare global {
  var prismadb: PrismaClient | undefined;
}

export const db = globalThis.prismadb ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismadb = db;
}
