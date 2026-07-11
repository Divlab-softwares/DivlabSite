"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Dès que la route change → active le loader
        setLoading(true);

        // Simule un délai pour laisser l’animation visible
        const timer = setTimeout(() => setLoading(false), 600);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-full shadow-lg"
                >
                    Divlab
                </motion.div>
            )}
        </AnimatePresence>
    );
}