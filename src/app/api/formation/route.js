import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { format } from "path";
import { group } from "console";

/**
 * ✅ Récupère toutes les formations avec Prisma
 * - Trie par date de création décroissante
 * - Inclut les informations de base : titre, description, image, etc.
 */
export async function GET() {
    try {
        const formations = await prisma.formation.findMany({
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                author: true,
                format: true,
                group: true,
                pages: true,
                classe: true,
                img: true,       // Image représentative
                location: true,  // Lien public du fichier
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({ success: true, data: formations });
    } catch (error) {
        console.error("Erreur lors de la récupération des formations :", error);
        return NextResponse.json(
            { success: false, error: "Erreur serveur lors du chargement des formations." },
            { status: 500 }
        );
    }
}
