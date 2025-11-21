// /app/api/upload/route.js
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { zipSync } from "fflate";
import slugify from "slugify";
//import {pdf} from "pdf-parse";
import { Upload } from "@aws-sdk/lib-storage";
import { makeS3Client } from "@/app/lib/s3Client"; // doit retourner un S3Client configuré
import { prisma } from "@/app/lib/prisma"; // ton client prisma
import { OnlineFormations } from "@/app/data_restructured.js"; // ton tableau existant

import fs from "fs";
import path from "path";

// --- Nouvelle fonction utilitaire : cherche et upload une image locale associée ---
async function findAndUploadLocalImage(originalName, userId, reference) {
    try {
        // Retirer .pdf et normaliser le nom
        const baseName = path.basename(originalName, path.extname(originalName));
        const searchDir = path.join(process.cwd(), "public", "assets", "formations");

        // Extensions possibles
        const exts = [".jpg", ".jpeg", ".png", ".webp"];
        let foundPath = null;

        for (const ext of exts) {
            const candidate = path.join(searchDir, `${baseName}${ext}`);
            if (fs.existsSync(candidate)) {
                foundPath = candidate;
                break;
            }
        }

        if (!foundPath) {
            console.log(`🖼️ Aucune image trouvée localement pour ${baseName}`);
            return null;
        }

        // Lire le fichier en Buffer
        const imgBuffer = fs.readFileSync(foundPath);
        const mimeType = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
        }[path.extname(foundPath).toLowerCase()] || "image/jpeg";

        // Créer le chemin distant
        const imgPath = makeImagePathFor(originalName, userId, reference) + path.extname(foundPath);
        await multipartUploadBufferToS3(imgBuffer, imgPath, mimeType, "images");

        const imagePublicUrl = getPublicUrlFromSupabase(imgPath);

        console.log(`✅ Image locale trouvée et uploadée pour ${baseName} → ${imgPath}`);

        return { imgPath, imagePublicUrl };
    } catch (err) {
        console.error(`❌ Erreur dans findAndUploadLocalImage(${originalName}):`, err);
        return null;
    }
}


// --- Configuration Supabase / Bucket ---
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY
);
const BUCKET = process.env.SUPABASE_BUCKET || "documents";

// --- Helpers utilitaires ---


/** Génère un title lisible depuis un filename (inspiré de ton script Python) */
function generateTitleFromFilename(filename = "") {
    if (!filename) return "Inconnu";
    let base = filename.split("/").pop();
    base = base.replace(/\.pdf$/i, "");
    base = base.replace(/divlab[_-]*/i, "");
    base = base.replace(/[_-]+/g, " ");
    base = base.replace(/\b(premium|free)\b/ig, "");
    base = base.replace(/\s+/g, " ").trim();
    // capitalise chaque mot
    return base
        .split(" ")
        .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : ""))
        .join(" ");
}

/** Extrait metadata PDF (pages, author) à partir d'un Buffer */
// async function extractPdfMetadata(input) {
//     try {
//         const mod = await import("pdf-parse");
//         const pdf = mod.default || mod;
//         // --- Lecture du PDF ---
//         const data = await pdf(input);

//         // --- Extraction métadonnées ---
//         const pages = Number(data?.numpages ?? data?.numPages ?? 0);
//         const author =
//             data?.info?.Author ??
//             data?.info?.author ??
//             data?.metadata?.Author ??
//             data?.metadata?.author ??
//             "Inconnu";

//         return {
//             pages: pages || 0,
//             author: author ? String(author).trim() : "Inconnu",
//         };
//     } catch (err) {
//         console.error("extractPdfMetadata error:", err);
//         return { pages: 0, author: "Inconnu" };
//     }
// }

/** upload via multipart (Upload from @aws-sdk/lib-storage) - accepte Buffer */
async function multipartUploadBufferToS3(bufferOrStream, key, contentType = "application/zip", bucket = BUCKET) {
    const client = makeS3Client(); // doit utiliser les env S3 (voir lib)
    const upload = new Upload({
        client,
        params: {
            Bucket: bucket,
            Key: key,
            Body: bufferOrStream,
            ContentType: contentType,
        },
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
    });

    await upload.done();
    return true;
}

/** Récupère public url depuis Supabase Storage (getPublicUrl) */
function getPublicUrlFromSupabase(path) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data?.publicUrl ?? null;
}

/** Nettoyage safe du nom d'image pour le chemin */
function makeImagePathFor(fileName, userId, reference) {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const slug = slugify(fileName, { lower: true, strict: true }).slice(0, 60);
    const timestamp = Date.now();
    return `images/client/${userId}/${year}/${month}/${reference}/${timestamp}_${slug}`;
}

/** Crée un filepath pour le zip */
function makeZipPath(fileName, userId, reference) {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const slug = slugify(fileName, { lower: true, strict: true }).slice(0, 60);
    const timestamp = Date.now();
    return `uploads/client/${userId}/${year}/${month}/${reference}/${timestamp}_${slug}.zip`;
}

// --- Route handler --- //
export async function POST(req) {
    try {
        const form = await req.formData();

        // Accept multiple 'files' fields (client must append('files', file) for each)
        const files = form.getAll("files");
        const userId = form.get("userId") || `guest-${Date.now()}`;
        const reference = form.get("reference") || `ref-${Date.now()}`;

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "Aucun fichier fourni (champ 'files')" }, { status: 400 });
        }

        const results = [];

        // Traitement en série ou en parallèle selon ton besoin. Ici on fait série pour limiter charge.
        for (const file of files) {
            try {
                // --- validations basiques ---
                if (!file || typeof file.arrayBuffer !== "function") {
                    results.push({ fileName: file?.name ?? "unknown", ok: false, error: "Invalid file object" });
                    continue;
                }

                const originalName = file.name;
                const title = generateTitleFromFilename(originalName);
                const id = "divlab" + `_${Math.floor(Math.random() * 1000)}_` + slugify(title, { lower: true, strict: true }) + `_${Date.now()}`;

                const existing = await prisma.formation.findUnique({ where: { title } });
                if (existing) {
                    console.log(`⚠️ Formation avec le titre "${title}" existe déjà (ID: ${existing.id}), on va mettre à jour l'entrée.`);
                }

                // // chercher dans OnlineFormations (tableau local)
                // const staticEntry = OnlineFormations.find((f) => {
                //     // supporte Title ou title selon ta structure ; on compare insensiblement
                //     const t1 = (f.location  || "").toString().trim().toLowerCase().split("/").pop();
                //     return t1 && t1 === originalName.trim().toLowerCase();
                // });

                // trouver entrée statique en comparant le nom du fichier (normalize)
                const normalizedOriginal = originalName.toLowerCase();
                const staticEntry = OnlineFormations.find((f) => {
                    const loc = (f.Location).toString();
                    const locBase = (loc.split("/").pop() || "").toLowerCase();
                    return locBase === normalizedOriginal;
                });

                console.log(`Processing file: ${originalName} | matched static entry:`, staticEntry ? staticEntry.title || staticEntry.Title : "none");

                // lire buffer complet
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                // extraire métadonnées PDF
                // const { pages, author } = await extractPdfMetadata(buffer);

                const pages = 0
                const author = "Inconnu"
                // ---------------- ZIP the PDF ----------------
                // On zippe le buffer sous la forme filename.pdf -> filename.zip
                const zipped = zipSync({ [originalName]: new Uint8Array(buffer) }); // zipSync renvoie Uint8Array
                const zipBuffer = Buffer.from(zipped);

                // create paths
                const zipPath = makeZipPath(originalName, userId, reference); // ex: uploads/...
                // upload zip multipart to S3 (Supabase)
                await multipartUploadBufferToS3(zipBuffer, zipPath, "application/zip");

                // public URL for the PDF zip
                const publicZipUrl = getPublicUrlFromSupabase(zipPath);

                // -------- image handling ----------
                // Priority: form image field per file: name should be "image_<originalName>" or "image" for single
                // We try several strategies: 1) form has image for this file, 2) staticEntry?.Img exists, 3) placeholder
                let imagePublicUrl = null;
                let imgPath = ""
                // 1) try an image field matching this file (client may send `image` for each file)
                const imageField = form.get(`image_${originalName}`) || form.get("image"); // permissive
                if (imageField && typeof imageField.arrayBuffer === "function") {
                    const imgBuffer = Buffer.from(await imageField.arrayBuffer());
                    imgPath = makeImagePathFor(originalName, userId, reference) + ".jpg"; // assume jpg
                    await multipartUploadBufferToS3(imgBuffer, imgPath, imageField.type || "image/jpeg");
                    imagePublicUrl = getPublicUrlFromSupabase(imgPath);
                } else if (staticEntry && (staticEntry.Img || staticEntry.img)) {
                    // 2) use static entry image path (likely local path). If it's a public URL we can keep it, else leave null.
                    const localImage = await findAndUploadLocalImage(originalName, userId, reference);
                    if (localImage) {
                        imagePublicUrl = localImage.imagePublicUrl;
                        imgPath = localImage.imgPath;
                    } else {
                        imagePublicUrl = staticEntry.Img || staticEntry.img || null; // ou placeholder
                    }
                } else {
                    // 3) placeholder (optionnel): set null or a default placeholder URL
                    const localImage = await findAndUploadLocalImage(originalName, userId, reference);
                    if (localImage) {
                        imagePublicUrl = localImage.imagePublicUrl;
                        imgPath = localImage.imgPath;
                    } else {
                        imagePublicUrl = null; // ou placeholder
                    }
                    // imagePublicUrl = null; // ou `${process.env.NEXT_PUBLIC_BASE_URL}/placeholder.jpg`
                }

                // ---------- Build DB data ----------
                const description = staticEntry?.Description || staticEntry?.description || form.get("description") || "";
                const format = (originalName.split(".").pop() || "pdf").toLowerCase();
                const classType = (staticEntry?.Class || staticEntry?.class || "free").toString();
                const group = staticEntry?.Group || staticEntry?.group || "Formations";
                const category = staticEntry?.Category || staticEntry?.category || "Autres";
                const staticPage = staticEntry?.Pages || staticEntry?.pages || 0;
                const StaticAuthor = staticEntry?.Author || staticEntry?.author || "Inconnu";

                // Upsert into Prisma (title must be unique in schema)
                const upsertData = await prisma.formation.upsert({
                    where: { title }, // requires title @unique in schema.prisma
                    update: {
                        location: zipPath,
                        img: imgPath,
                        pages,
                        author,
                        format,
                        classe: classType,
                        description,
                        group,
                        category,
                    },
                    create: {
                        id,
                        title,
                        location: zipPath,
                        img: imgPath,
                        pages: staticPage || pages,
                        author: StaticAuthor || author,
                        format,
                        classe: classType,
                        description,
                        group,
                        category,
                    },
                });

                results.push({
                    fileName: originalName,
                    title,
                    ok: true,
                    publicZipUrl,
                    zipPath,
                    imagePublicUrl,
                    upsert: { id: upsertData.id, title: upsertData.title },
                });
            } catch (innerErr) {
                console.error("Erreur traitement fichier :", innerErr);
                results.push({ fileName: file?.name || "unknown", ok: false, error: innerErr?.message || String(innerErr) });
            }
        } // end for files

        return NextResponse.json({ success: true, results });
    } catch (err) {
        console.error("❌ upload route error:", err);
        return NextResponse.json({ success: false, error: err?.message || String(err) }, { status: 500 });
    }
}
