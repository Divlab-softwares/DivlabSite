import { zipSync, strToU8 } from "fflate";
import { supabase } from "@/lib/supabaseClient";

/**
 * zipAndUpload
 * Compresse un fichier en mémoire et l'upload dans Supabase Storage.
 *
 * @param {File} file - Fichier sélectionné par l'utilisateur.
 * @param {string} bucket - Nom du bucket Supabase.
 * @param {string} path - Chemin où stocker le fichier (ex: "uploads/").
 * @returns {Promise<{success: boolean, publicUrl?: string, error?: string}>}
 */
export async function zipAndUpload(file, bucket = "divlab-files", path = "uploads/") {
    try {
        // 1️⃣ Lire le fichier en ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // 2️⃣ Créer une archive zip contenant ce fichier
        const zipped = zipSync({ [file.name]: uint8Array });

        // 3️⃣ Créer un blob à partir du zip
        const blob = new Blob([zipped], { type: "application/zip" });

        // 4️⃣ Générer un nom unique
        const uniqueName = `${Date.now()}-${file.name}.zip`;
        const filePath = `${path}${uniqueName}`;

        // 5️⃣ Upload vers Supabase Storage
        const { data, error } = await supabase.storage.from(bucket).upload(filePath, blob, {
            cacheControl: "3600",
            upsert: false, // ne pas écraser un fichier existant
            contentType: "application/zip"
        });

        if (error) throw error;

        // 6️⃣ Obtenir le lien public
        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        const publicUrl = publicData.publicUrl;

        console.log("✅ Fichier uploadé :", publicUrl);
        return { success: true, publicUrl };
    } catch (err) {
        console.error("❌ Erreur upload :", err.message);
        return { success: false, error: err.message };
    }
}
