"use client";
import React, { useState } from "react";

type CategoryScore = {
    category: string;
    score: number;
};

export default function UploadFile() {
    const [files, setFiles] = useState<File[]>([]);
    const [displayedFiles, setDispalyedFiles] = useState<File[]>([]);
    const [images, setImages] = useState<{ [key: string]: File | null }>({});
    const [progress, setProgress] = useState<{ [key: string]: number }>({});
    const [uploading, setUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<{ name: string; url: string }[]>([]);
    const [userId, setUserId] = useState("");
    const [category, setCategory] = useState("");
    const [reference, setReference] = useState("");


    function normalizeText(text: string): string {
        if (!text) return "";

        return text
            // 1️⃣ Met tout en minuscule
            .toLowerCase()

            // 2️⃣ Supprime les accents (é → e, ç → c, etc.)
            .normalize("NFD") // décompose les lettres accentuées
            .replace(/[\u0300-\u036f]/g, "") // enlève les diacritiques

            // 3️⃣ Remplace les tirets, underscores et points par des espaces
            .replace(/[-_.]/g, " ")

            // 4️⃣ Supprime tout caractère non alphanumérique (sauf espaces)
            .replace(/[^\w\s]/g, "")

            // 5️⃣ Remplace les espaces multiples par un seul
            .replace(/\s+/g, " ")

            // 6️⃣ Supprime les espaces en début/fin
            .trim();
    }


    function categorize(title: string): CategoryScore[] {
        const t = normalizeText(title);

        // On définit un dictionnaire de catégories avec plusieurs mots-clés
        const categories: Record<string, string[]> = {
            "Programmation Python": ["python", "numpy", "pandas"],
            "Développement Web": ["html", "css", "javascript", "react", "nextjs", "vue", "node", "express", "bootstrap", "tailwind"],
            "Développement Mobile": ["android", "flutter", "kotlin", "swift", "react native", "app inventor"],
            "Intelligence Artificielle": [" ia ", "intelligence artificielle", "machine learning", "deep learning", "neural network", "tensorflow", "pytorch", "keras", "yolo", "vision", "facial", "reconnaissance"],
            "Data Science": ["data", "analyse", "statistique", " ml ", "classification", "régression", "big data", "spark", " r ", "excel", "sql", "hadoop"],
            "Cybersécurité": ["cybersecurite", "cyber", "hacking", "pentest", "securite", "cryptographie", "network security"],
            "Réseaux & Systèmes": ["reseaux", "network", "linux", "windows server", "administration", " tcp ", " ip ", "cloud", "docker", "kubernetes"],
            "Bases de Données": ["mysql", "sql", "postgresql", "mongodb", "firebase", "nosql", "base de donnees", "phpmyadmin"],
            "Bureautique": ["excel", "word", "powerpoint", "office", "bureautique"],
            "Mathématiques & Statistiques": ["mathematique", "statistique", "probabilite", "algèbre", "analyse"],
            "Design & Multimédia": ["design", "figma", "photoshop", "illustrator", " ui ", " ux ", "video", "montage", "graphisme"],
            "Entrepreneuriat & Business": ["entrepreneuriat", "startup", "marketing", "gestion", "finance", "business", "vente", "ecommerce"],
            "Formation Académique": ["cours", " td ", " tp ", "examen", "universite", "lycee"],
        };

        const results: CategoryScore[] = [];
        // Parcourt toutes les catégories et détecte les mots-clés correspondants
        for (const [category, keywords] of Object.entries(categories)) {
            let score = 0;
            for (const keyword of keywords) {
                if (t.includes(keyword)) { score += 1; }

            }
            if (score > 0) results.push({ category, score });
        }

        // On trie les catégories les plus pertinentes en premier
        return results.sort((a, b) => b.score - a.score);
    }

    // Sélection de fichiers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);
            setDispalyedFiles(selectedFiles);
            // Initialize images state for each file
            const initImages: { [key: string]: File | null } = {};
            selectedFiles.forEach((f) => {
                if (!images[f.name]) initImages[f.name] = null;
            });
            setImages((prev) => ({ ...initImages, ...prev }));
        }
    };

    // Sélection d'image associée à un fichier
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fileName: string) => {
        if (e.target.files && e.target.files[0]) {
            const img = e.target.files[0];
            setImages((prev) => ({ ...prev, [fileName]: img }));
        }
    };

    // Upload parallèle
    async function handleUpload() {
        if (files.length === 0) return alert("Choisis au moins un fichier !");
        if (!userId) return alert("Renseigne ton identifiant utilisateur.");
        if (!category) {
            setCategory(categorize(files[0].name)[0]?.category || "Non catégorisé");
        }
        setUploading(true);

        const uploads = files.map((file) => uploadSingleFile(file, images[file.name] || null));
        await Promise.all(uploads);

        setUploading(false);
        setFiles([]);
        alert("✅ Tous les fichiers ont été uploadés !");
    }

    // Upload d’un fichier individuel avec image
    const uploadSingleFile = (file: File, image: File | null) => {
        return new Promise<void>((resolve, reject) => {
            const form = new FormData();
            form.append("files", file);
            form.append("fileName", file.name);
            form.append("userId", userId);
            form.append("category", category);
            form.append("reference", reference || `ref-${Date.now()}`);
            if (image) form.append(`image_${file.name}`, image); // IMPORTANT : le champ correspond à ce que ton API attend

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/uploader");

            // 🔹 Suivi de progression
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setProgress((prev) => ({ ...prev, [file.name]: percent }));
                }
            };

            // 🔹 Réponse finale
            xhr.onload = () => {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        if (data.success) {
                            // On récupère le zip et l'image si présents
                            const result = data.results?.[0] || {};
                            setUploadedUrls((prev) => [
                                ...prev,
                                { name: file.name, url: result.publicZipUrl || "#" },
                            ]);
                            resolve();
                        } else {
                            console.error(`Erreur upload ${file.name}:`, data.error);
                            reject(data.error);
                        }
                    } catch (err) {
                        console.error(`Erreur parsing ${file.name}:`, err);
                        reject(err);
                    }
                } else {
                    reject(`Erreur HTTP ${xhr.status}`);
                }
            };

            xhr.onerror = () => {
                reject(`Erreur réseau pour ${file.name}`);
            };

            xhr.send(form);
        });
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-gray-900 text-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">
                Uploader plusieurs fichiers compressés
            </h2>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpload();
                }}
            >
                <input
                    type="text"
                    placeholder="Ton identifiant utilisateur"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full mb-3 bg-gray-800 p-2 rounded"
                />
                {/* <input
                    type="text"
                    placeholder="Catégorie (ex: Data Science, Web...)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mb-3 bg-gray-800 p-2 rounded"
                /> */}
                <input
                    type="text"
                    placeholder="Référence (optionnelle)"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full mb-3 bg-gray-800 p-2 rounded"
                />

                {/* Fichiers */}
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full mb-4 bg-gray-800 p-2 rounded"
                />

                {/* Inputs image par fichier */}
                {files.map((file) => (
                    <div key={file.name} className="mb-3">
                        <label className="text-sm block mb-1">{`Image pour ${file.name} (optionnel)`}</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, file.name)}
                            className="w-full bg-gray-700 p-2 rounded text-sm hover:bg-blue-500 transition"
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={uploading}
                    className={`w-full py-2 rounded font-semibold transition ${uploading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {uploading ? "Compression & Upload..." : "Uploader"}
                </button>
            </form>

            {/* Progression */}
            {displayedFiles.length > 0 && (
                <div className="mt-5 space-y-3">
                    {files.map((file) => (
                        <div key={file.name}>
                            <div className="flex justify-between text-sm mb-1">
                                <span>{file.name}</span>
                                <span>{progress[file.name] || 0}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-2 bg-green-500 transition-all"
                                    style={{ width: `${progress[file.name] || 0}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Fichiers uploadés */}
            {uploadedUrls.length > 0 && (
                <div className="mt-6  gap-2 flex items-center flex-col">
                    <h3 className="text-lg font-semibold mb-2">📁 Fichiers uploadés :</h3>
                    <ul className="space-y-2">
                        {uploadedUrls.map((item, i) => (
                            <li
                                key={i}
                                className="bg-gray-800 p-2 rounded flex items-center justify-between text-sm"
                            >
                                <span>{item.name}</span>
                                {/* <a
                                    href={item.url}
                                    target="_blank"
                                    className="text-blue-400 hover:underline"
                                    rel="noreferrer"
                                >
                                    Télécharger
                                </a> */}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 p-3 bg-green-800 rounded gap-2">
                        <p>Vos fichiers ont été uploadés avec succès et seront bientôt disponibles. </p>
                        <p>Vous pouvez continuer à uploader d'autres fichiers si vous le souhaitez.</p>
                    </div>
                </div>

                
            )}
        </div>
    );
}
