import { unzipSync } from "fflate";
// import { createClient } from "@supabase/supabase-js";
import { getSupabaseSignedLink } from "./getSupabaseSignedLink.ts";

async function downloadAndDecompress(url , title) {


    let signedUrl = await getSupabaseSignedLink("documents", url, 600);


    if (url.startsWith("http://") || url.startsWith("https://") === true) {
        signedUrl = url
    }

    if (!signedUrl) {
        throw new Error("Impossible d’obtenir l’URL publique du fichier.");
    }
    const res = await fetch(signedUrl);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    // Vérifie le type MIME
    const contentType = res.headers.get("Content-Type");
    console.log("Content-Type reçu :", contentType);


    const arrayBuffer = await res.arrayBuffer();

    // Si le fichier ne commence pas par la signature ZIP (PK)
    const signature = new TextDecoder().decode(new Uint8Array(arrayBuffer.slice(0, 2)));
    if (signature !== "PK") {
        throw new Error("Le fichier téléchargé n’est pas un ZIP valide (signature manquante)");
    }

    const files = unzipSync(new Uint8Array(arrayBuffer));

    for (const [name, content] of Object.entries(files)) {

        // Détecter l’extension réelle (par ex: .pdf)
        const ext = name.split('.').pop() || 'pdf';
        const fileName = `${title}.${ext}`;

        // // Créer un blob du fichier décompressé (binaire pur)
        // const blob = new Blob([content], { type: "application/pdf" });

        // On crée un blob du fichier décompressé
        const blob = new Blob([content]);
        const fileUrl = URL.createObjectURL(blob);

        // On simule le téléchargement
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // On libère la mémoire du blob
        URL.revokeObjectURL(fileUrl);
    }
}
export default downloadAndDecompress;