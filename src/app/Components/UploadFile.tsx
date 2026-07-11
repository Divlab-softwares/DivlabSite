"use client";
import React, { useState } from "react";

export default function UploadFile() {
    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState<{ [key: string]: number }>({});
    const [uploading, setUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<{ name: string; url: string }[]>([]);

    // Sélection de fichiers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    // Fonction d’upload parallèle
    async function handleUpload() {
        if (files.length === 0) return alert("Choisis au moins un fichier !");
        setUploading(true);

        const uploads = files.map((file) => uploadSingleFile(file));
        await Promise.all(uploads);

        setUploading(false);
        alert("✅ Tous les fichiers ont été uploadés !");
    }

    // Upload d’un fichier individuel
    const uploadSingleFile = (file: File) => {
        return new Promise<void>((resolve, reject) => {
            const form = new FormData();
            form.append("file", file);
            form.append("fileName", file.name);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/upload");

            // 🔹 Suivi de la progression
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
                            setUploadedUrls((prev) => [...prev, { name: file.name, url: data.publicUrl }]);
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
            <h2 className="text-2xl font-semibold mb-4 text-center">Uploader plusieurs fichiers compressés</h2>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpload();
                }}
            >
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full mb-4 bg-gray-800 p-2 rounded"
                />

                <button
                    type="submit"
                    disabled={uploading}
                    className={`w-full py-2 rounded font-semibold transition ${uploading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {uploading ? "Compression & Upload..." : "Uploader"}
                </button>
            </form>

            {/* 📊 Affichage de la progression */}
            {files.length > 0 && (
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

            {/* ✅ Liste des fichiers uploadés */}
            {uploadedUrls.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">📁 Fichiers uploadés :</h3>
                    <ul className="space-y-2">
                        {uploadedUrls.map((item, i) => (
                            <li
                                key={i}
                                className="bg-gray-800 p-2 rounded flex items-center justify-between text-sm"
                            >
                                <span>{item.name}</span>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    className="text-blue-400 hover:underline"
                                    rel="noreferrer"
                                >
                                    Télécharger
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
