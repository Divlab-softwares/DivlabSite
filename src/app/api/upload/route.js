import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { zipSync } from "fflate";
import slugify from "slugify"; // npm install slugify
import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { makeS3Client } from "@/app/lib/s3Client";
import { Upload } from "@aws-sdk/lib-storage";


// ⚠️ Utiliser la clé SERVEUR (pas la clé publique)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY
);

// Nom du bucket défini dans ton tableau de bord Supabase (ex: "documents")
const BUCKET = process.env.SUPABASE_BUCKET || "documents";

export async function POST(req) {
    try {
        const form = await req.formData();
        const file = form.get("file");
        const reference = form.get("reference") || `ref-${Date.now()}`;
        const userId = form.get("userId") || `guest-${Date.now()}`;
        const originalName = form.get("fileName") || (file && file.name) || "file";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 1️⃣ Lire le fichier en ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // 2️⃣ Créer une archive ZIP contenant ce fichier
        const zipped = zipSync({ [file.name]: uint8Array });

        // 3️⃣ Créer un blob à partir du zip
        const blob = new Blob([zipped], { type: "application/zip" });

        // 4️⃣ Créer un chemin logique pour ton fichier
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, "0");
        const slug = slugify(originalName, { lower: true, strict: true }).slice(0, 60);
        const timestamp = Date.now();

        // L’extension finale est .zip, pas celle du fichier original
        const filepath = `uploads/${userId}/${year}/${month}/${reference}/${timestamp}_${slug}.zip`;

        // 5️⃣ Upload vers Supabase Storage
        const client = makeS3Client();
       // const fileStream = fs.createReadStream(localPath);

        const parallelUpload = new Upload({
            client,
            params: { Bucket: BUCKET, Key: filepath, Body: blob },
            queueSize: 4,       // nombre de parties en parallèle
            partSize: 5 * 1024 * 1024, // 5 MB
        });

        await parallelUpload.done();

        // if (error) {
        //     console.error("❌ Supabase upload error:", error);
        //     return NextResponse.json({ error }, { status: 500 });
        // }

        // 6️⃣ Générer une URL publique
        const { data: publicData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(filepath);

        const publicUrl = publicData.publicUrl;

        console.log("✅ Fichier uploadé :", publicUrl);
        return NextResponse.json({ success: true, publicUrl, path: filepath });
    } catch (err) {
        console.error("❌ Unexpected error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
