import { createClient } from "@supabase/supabase-js";
import { getSupabaseSignedLink } from "./getSupabaseSignedLink";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Retourne un lien public Supabase correct à partir d’un chemin ou lien.
 *
 * @param {string} path - Le lien ou le chemin du fichier (ex: "uploads/myfile.zip" ou "https://xyz.supabase.co/storage/v1/object/public/uploads/myfile.zip")
 * @param {string} [bucket="documents"] - Nom du bucket Supabase
 * @returns {string|null} L’URL publique complète du fichier
 */
export async function getSupabasePublicLink(path, bucket = "documents") {
    if (!path || typeof path !== "string") return null;

    // 1️⃣ Si c’est déjà un lien complet (ex: https://xyz.supabase.co/...)
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    // 2️⃣ Si c’est un chemin relatif (ex: "uploads/file.pdf")
    // On reconstruit l’URL publique depuis Supabase
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    let Url = data.publicUrl;

    return Url ?? null;
}
