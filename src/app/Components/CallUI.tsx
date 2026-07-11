"use client";
import { useEffect, useRef, useState } from "react";

export default function CallUI() {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    useEffect(() => {
        async function loadDevices() {
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            setDevices(allDevices.filter(d => d.kind === "videoinput"));
        }
        loadDevices();
    }, []);

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const deviceId = e.target.value;
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } },
            audio: true,
        });
        const video = document.querySelector("video") as HTMLVideoElement;
        video.srcObject = stream;
    }

    const startCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            // ✅ Attacher le flux caméra
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                localVideoRef.current.muted = true; // ✅ éviter l’écho local
                await localVideoRef.current.play().catch(err => console.error("Erreur play:", err));
            }
        } catch (err) {
            console.error("Erreur accès caméra/micro :", err);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted   // ✅ très important pour éviter l’écho
                className="w-1/2 rounded-xl border bg-black"
            />
            <select name="Choisssez votre camera" onChange={handleChange}>
                {devices.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Camera ${d.deviceId}`}
                    </option>
                ))}
            </select>
            <button
                onClick={startCall}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
                🎥 Démarrer l'appel
            </button>
        </div>
    );
}
