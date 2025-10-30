// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
    // Evite de créer plusieurs instances de PrismaClient lors du hot reload en dev
    // @ts-ignore
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
