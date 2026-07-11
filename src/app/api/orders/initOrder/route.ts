// app/api/initOrder/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; // Assure-toi d'avoir un loader Prisma

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            command_id,
            name,
            email,
            contact,
            country,
            projectType,
            description,
            budget,
            sessionId,
            template
        } = body;

        // ---- Validations ---- //
        if (!name || !email || !country || !projectType) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        `Les champs name :${name}, email : ${email},country :  ${country} et projecType : ${projectType} sont obligatoires.`,
                },
                { status: 400 }
            );
        }

        const orderId = `order_${Date.now()}_${Math.random()
            .toString(16)
            .slice(2)}`;

        // ---- Insert in DB ---- //
        const order = await prisma.order.create({
            data: {
                id: orderId,
                command_id,
                name,
                contact,
                email,
                country,
                projectType,
                description: description ?? null,
                budget: budget ?? null,
                status: "pending",
                template,
                sessionId: sessionId ?? null,
            },
        });

        return NextResponse.json(
            {
                success: true,
                orderId,
                message: "Commande initialisée avec succès.",
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
