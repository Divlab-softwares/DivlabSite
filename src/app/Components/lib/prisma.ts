import { PrismaClient } from "@prisma/client";

declare global {
    // permet d’éviter de recréer le client en dev
    var prisma: PrismaClient | undefined;
}

export const prisma =
    global.prisma ||
    new PrismaClient({
        log: ["query"], // utile pour voir les requêtes
    });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;