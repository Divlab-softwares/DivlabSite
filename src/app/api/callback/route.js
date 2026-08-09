import { NextResponse } from "next/server";
import { prisma } from '../../lib/prisma';
import { createClient } from "@supabase/supabase-js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY);


async function getPresignedGetUrl(bucket, key, expires = 60 * 10) {
    const client = makeS3Client();
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    const url = await getSignedUrl(client, cmd, { expiresIn: expires });
    return url;
}

// Monetbil enverra ici le statut du paiement
export async function POST(req) {
    const payload = await req.json();

    // Optionnel: vérifier signature via headers
    // const sig = req.headers.get("x-signature"); validate...

    console.log("Callback paiement reçu :", payload);

    const ref = payload.data.trxref;
    if (!ref) return NextResponse.json({ ok: false, msg: "no reference" }, { status: 400 });

    // Récupérer payment local
    const existing = await prisma.payment.findUnique({ where: { reference: ref } });

    if (!existing) {
        // Si tu n'as pas créé d'enregistrement avant, tu peux upsert via metadata
        // Mais recommandé : création locale avant paiement.
        await prisma.payment.create({
            data: {
                reference: ref,
                amount: payload.data.amount ?? 0,
                currency: payload.data.currency ?? "XAF",
                status: payload.data.status,
                merchantReference: payload.data.merchant_reference ?? null,
                trxref: payload.data.trxref ?? null,
                paymentMethod: payload.data.payment_method ?? null,
                metadata: payload.data.metadata ?? {},
                filePath: payload.data.filePath ?? null, // si envoyée
                fileName: payload.data.fileName ?? null,
            },
        });
    } else {
        // On met à jour l'enregistrement existant
        await prisma.payment.update({
            where: { reference: ref },
            data: {
                // reference: payload.data.reference ?? existing.reference,
                status: payload.data.status,
                merchantReference: payload.data.merchant_reference ?? existing.merchantReference,
                trxref: payload.data.reference ?? existing.reference,
                paymentMethod: payload.data.payment_method ?? existing.paymentMethod,
                metadata: payload.data.metadata ? payload.data.metadata : existing.metadata,
            },
        });
    }

    // Si statut complete : générer signed URL et le stocker / envoyer
    if (payload.status === "complete") {
        const payment = await prisma.payment.findUnique({ where: { reference: ref } });

        if (payment?.filePath) {
            // Générer un URL signé (Supabase storage)
            const url = await getPresignedGetUrl(process.env.SUPABASE_BUCKET, payment.filePath, 60 * 10);

            if (error) {
                console.error("Erreur signed url supabase:", error);
            } else {
                // Optionnel: stocker l'URL d'accès temporaire ou son expiration
                await prisma.payment.update({
                    where: { reference: ref },
                    data: {
                        metadata: { ...payment.metadata, downloadUrl: url, urlExpiresAt: Date.now() + 60 * 10 * 1000 },
                    },
                });
                // Tu peux aussi notifier l'utilisateur (email) avec ce signed URL.
            }
        }
    }

    return NextResponse.json({ ok: true });
}