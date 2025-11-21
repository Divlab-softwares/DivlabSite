// app/api/initOrder/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; // Assure-toi d'avoir un loader Prisma

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            subscription_id,
            name,
            email,
            contact,
            country,
            description,
            price,
            sessionId,
        } = body;

        // ---- Validations ---- //
        if (!name || !email || !contact) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        `Les champs name :${name}, email : ${email},country :  ${country} sont obligatoires.`,
                },
                { status: 400 }
            );
        }

        const subscriptionId = `order_${Date.now()}_${Math.random()
            .toString(16)
            .slice(2)}`;

        // ---- Insert in DB ---- //
        const order = await prisma.subscription.create({
            data: {
                id: subscriptionId,
                subscription_id,
                name,
                contact,
                email,
                country,
                description: description ?? null,
                price: price ?? null,
                status: "pending",
                sessionId: sessionId ?? null,
            },
        });

        return NextResponse.json(
            {
                success: true,
                subscriptionId,
                message: "abonnement initialisée avec succès. Veuillez contacter le service client pour finaliser l'operation",
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error initOrder:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Erreur interne. Impossible d'initier la commande. Veuillez reesayer",
            },
            { status: 500 }
        );
    }
}
