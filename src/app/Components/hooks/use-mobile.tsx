import { useState, useEffect } from "react";

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Fonction qui vérifie si on est sur mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768); // seuil mobile
        };

        // Vérification au chargement
        checkMobile();

        // Mise à jour quand on resize
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile;
}