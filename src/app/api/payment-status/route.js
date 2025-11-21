import { NextResponse } from "next/server";
//import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/lib/authOption";
import { prisma } from '../../lib/prisma';
import { createClient } from "@supabase/supabase-js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSupabaseSignedLink } from "../../helpers/getSupabaseSignedLink.ts";


// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ACCESS_KEY);
// const BUCKET = process.env.SUPABASE_BUCKET;
// Vérifier le statut du paiement via sa référence

export async function GET(req) {

    const reference = req.nextUrl.searchParams.get("reference");

    console.log("Recherche statut paiement pour ref:", reference);

    // Vérifier la session (facultatif si paiement invité)
    const session = await getServerSession(authOptions);

    if (!session && !reference) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        // return res.status(401).json({ error: 'Non autorisé' });
    }

    //const { reference } = req.query;
    if (typeof reference !== 'string') {
        return NextResponse.json({ error: 'Référence de payment manquante' }, { status: 400 });
    }


    // if (!ref) return NextResponse.json({ error: "reference manquant" }, { status: 400 });


    // Rechercher le paiement par référence
    const payment = await prisma.payment.findUnique({
        //findFirst: { orderBy: { createdAt: 'desc' } },
        where: { reference: reference },
    });

    if (!payment) {
        return NextResponse.json({ error: 'Paiement introuvable' }, { status: 404 });
    }

    console.log("Paiement trouvé:", payment);


    if (payment.status !== "complete") {
        return NextResponse.json({ status: payment.status });
    }

    // Générer signed URL au moment de la requête (ne pas stocker URL permanente)
    if (!payment.filePath) return NextResponse.json({ error: "no filePath" }, { status: 500 });


    // const client = makeS3Client();
    // const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: payment.filePath });
    // const url = await getSignedUrl(client, cmd, { expiresIn: 60 * 10 });

    const signedUrl = await getSupabaseSignedLink("documents", payment.filePath, 600);

    console.log("Signed URL générée:", signedUrl);

    // if (error) {
    //     console.error("Signed URL error", error);
    //     return NextResponse.json({ error: "signed url error" }, { status: 500 });
    // }


    // Si l'utilisateur est connecté, on peut vérifier qu'il possède ce paiement
    if (session && payment.userId !== session.user.id) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Notch retourne un champ data.status ou similar
    return NextResponse.json({
        reference: payment.reference,
        status: payment.status,
        amount: payment.amount,
        fileName: payment.fileName,
        downloadUrl: signedUrl,
    }, { status: 200 });

    // // Sinon tu peux interroger directement Notch:
    // const res = await fetch(`https://api.notchpay.co/payments/${ref}`, {
    //     method: "GET",
    //     headers: { "Authorization": `${process.env.NOTCH_SECRET_API_KEY}` }
    // });
    // const data = await res.json();

    // // Notch retourne un champ data.status ou similar
    // return NextResponse.json({ status: data.status || data.payment_status || "unknown", raw: data });
}
