// app/api/initOrder/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; // Assure-toi d'avoir un loader Prisma
import { publishOrderChanged } from "@/app/lib/orderRealtime.server";

const formspreeOrderFormId = process.env.FORMSPREE_ORDER_FORM_ID || "mvgbzjer";

async function notifyDivlabOfOrder(order: {
    id: string;
    command_id: string | null;
    name: string;
    email: string;
    contact: string | null;
    country: string;
    projectType: string;
    description: string | null;
    budget: string | null;
    template: string | null;
}) {
    const response = await fetch(`https://formspree.io/f/${formspreeOrderFormId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            _subject: `Nouvelle commande Divlab - ${order.projectType}`,
            order_id: order.id,
            command_id: order.command_id ?? "Non renseigne",
            name: order.name,
            email: order.email,
            contact: order.contact ?? "Non renseigne",
            country: order.country,
            project_type: order.projectType,
            budget: order.budget ?? "Non renseigne",
            description: order.description ?? "Aucune description",
            template: order.template ?? "Aucun template",
        }),
        signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
        throw new Error(`Formspree a retourne le statut ${response.status}`);
    }
}

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

        const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
        const safeName = clean(name, 120);
        const safeEmail = clean(email, 254).toLowerCase();
        const safeCountry = clean(country, 100);
        const safeProjectType = clean(projectType, 80);
        if (!safeName || !safeEmail || !safeCountry || !safeProjectType || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        `Les champs name :${name}, email : ${email},country :  ${country} et projecType : ${projectType} sont obligatoires.`,
                },
                { status: 400 }
            );
        }

        const orderId = `order_${crypto.randomUUID()}`;

        // ---- Insert in DB ---- //
        const order = await prisma.order.create({
            data: {
                id: orderId,
                command_id: clean(command_id, 80) || null,
                name: safeName,
                contact: clean(contact, 40) || null,
                email: safeEmail,
                country: safeCountry,
                projectType: safeProjectType,
                description: clean(description, 5000) || null,
                budget: clean(String(budget ?? ""), 100) || null,
                status: "pending",
                template: clean(template, 1000) || null,
                sessionId: clean(sessionId, 200) || null,
            },
        });

        let emailSent = false;
        let channelNotified = false;

        try {
            await notifyDivlabOfOrder(order);
            emailSent = true;
        } catch (emailError) {
            // La commande reste enregistree si le service d'e-mail est indisponible.
            console.error("Error sending order notification:", emailError);
        }

        try {
            channelNotified = await publishOrderChanged(order.id);
        } catch (channelError) {
            console.error("Error broadcasting order:", channelError);
        }

        return NextResponse.json(
            {
                success: true,
                orderId,
                emailSent,
                channelNotified,
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
