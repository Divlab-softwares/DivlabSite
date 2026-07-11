import { NextResponse } from 'next/server';
import { prisma } from "@/app/lib/prisma";

export async function POST(req) {
    try {

        const { amount, currency = "XAF", filePath, fileName, userId } = await req.json();

        // Génération d'un ID unique
        const orderId = `DIVLAB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        // const serviceKey = process.env.MONETBIL_SERVICE_KEY;
        const lygosApiKey = process.env.LYGOS_API_KEY;

        const lygosSandboxId = process.env.LYGOS_SANDBOX_ID;

        const notchPublicKey = process.env.NOTCH_PUBLIC_API_KEY;

        // Utilisation de l'environnement sandbox pour les petits montants
        const isSandbox = amount < 5000;
        const lygosApiKeyToUse = isSandbox ? lygosSandboxId : lygosApiKey;

        // if (!serviceKey) {
        //     return NextResponse.json({ error: "Clé Monetbil manquante" }, { status: 500 });
        // }

        // ✅ URLs de callback
        // const notifyUrl = `${process.env.NEXTAUTH_URL}/api/callback`;
        // const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/Services`;
        // const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`;
        const success_url = `${process.env.NEXTAUTH_URL}/Services`;
        // const failure_url = `${process.env.NEXTAUTH_URL}/Services`;

        


        // ✅ URL du widget
        const url = `https://api.lygosapp.com/v1/gateway`;


        //  URL du widget
        const notchUrl = `https://api.notchpay.co/payments`;

        //  Données à envoyer
        
        

        const payment = await prisma.payment.create({
            data: {
                reference : orderId,
                amount : amount,
                currency : "XAF",
                status: "created",
                filePath,
                fileName,
                //userId: userId ?? null,
                merchantReference: orderId,
            },
        });

        const notchParams = JSON.stringify({
            amount: amount,
            currency: "XAF",
            customer: {
                name: "Nom Client",
                email: "client@example.com",
                //phone: "+2376XXXXXXXX"
            },
            //channel: "cm.mtn",          // ou "cm.orange"
            metadata: { paymentId: payment.id /* ou fileId */ },
            reference: orderId,
            callback: success_url,
            description: `Paiement commande ${fileName}`,
        });

        //console.log("POST to NOTCH URL:", `);
        console.log("POST payload:", notchParams);

        // 💡 Monetbil attend un POST vers le widget URL
        // const response = await fetch(url, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         "api-key": lygosApiKeyToUse,
        //     },
        //     body: params
        // });

        // 💡 NOTCH attend un POST vers le widget URL
        const response = await fetch(notchUrl, {
            method: 'POST',
            headers: {
                "Authorization": notchPublicKey,
                "Content-Type": "application/json"
            },
            body: notchParams
        });

        const text = await response.text();
        console.log("Réponse Lygos :", text);

        let data;
        try {
            data = JSON.parse(text);
            //console.log("Réponse JSON Lygos :", data);
        } catch {
            return NextResponse.json(
                { error: "Réponse non JSON de Lygos", raw: text },
                { status: 500 }
            );
        }

        // Vérifie si Lygos renvoie bien une URL
        if (!data.authorization_url) {

            return NextResponse.json(
                { error: "Paiement échoué", details: data },
                { status: 400 }
            );
        }

        // ✅ Retourne le lien de paiement
        return NextResponse.json({ link: data.authorization_url });
    } catch (error) {
        console.error("Erreur serveur notch pay :", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
