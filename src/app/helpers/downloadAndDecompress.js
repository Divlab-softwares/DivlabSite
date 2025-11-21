import { unzipSync } from "fflate";
// import { createClient } from "@supabase/supabase-js";
import { getSupabaseSignedLink } from "./getSupabaseSignedLink.ts";

function blobToDataURL(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

function getMimeType(ext) {
    const types = {
        pdf: "application/pdf",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        doc: "application/msword",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        txt: "text/plain",
        zip: "application/zip",
    };
    return types[ext.toLowerCase()] || "application/octet-stream";
}

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
        const mime = getMimeType(ext);
        const fileName = `${title}.${ext}`;

        // // Créer un blob du fichier décompressé (binaire pur)
        // const blob = new Blob([content], { type: "application/pdf" });

        // On crée un blob du fichier décompressé
        const blob = new Blob([content], {type: mime});
        // const fileUrl = URL.createObjectURL(blob);

       


        // Convertir en DataURL (OBLIGATOIRE POUR MOBILE)
        const dataUrl = await blobToDataURL(blob);

        // On simule le téléchargement
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Mise du PDF dans le nouvel onglet
        // if (ext === "pdf") {
        //     const newTab = window.open(dataUrl, "_blank"); // doit être avant tout fetch

        // }

        // On libère la mémoire du blob
        URL.revokeObjectURL(dataUrl);
    }
}
export default downloadAndDecompress;