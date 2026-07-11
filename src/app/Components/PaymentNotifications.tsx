'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface PayNotifProps {
    notifications: {
        id: string;
        message: string;
        type: 'success' | 'failed' | 'cancelled';
        date: number;
    }[];
    removeNotification: (id: string) => void;
}

export default function PaymentNotifications({ notifications, removeNotification }: PayNotifProps) {
    return (
        <div className="fixed bottom-20 right-6 flex flex-col gap-3 z-60">
            <AnimatePresence>
                {notifications.map((notif) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.4 }}
                        className={`rounded-xl shadow-xl text-white font-bold overflow-hidden
                        ${notif.type === 'success' ? 'bg-green-800' :
                                notif.type === 'failed' ? 'bg-red-600' : 'bg-yellow-600'}`}
                    >
                        <NotificationItem
                            notif={notif}
                            onClose={() => removeNotification(notif.id)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

function NotificationItem({
    notif,
    onClose,
}: {
    notif: { id: string; message: string; type: string; date: number };
    onClose: () => void;
}) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(() => onClose(), 400); // laisse l'animation se terminer
        }, 8000);
        return () => clearTimeout(timer);
    }, [notif.id]);

    if (!show) return null;

    const prefix =
        notif.type === 'success'
            ? '✅ Opération réussie ! '
            : notif.type === 'failed'
                ? '❌ Échec : '
                : '🛑 Annulée : ';

    return (
        <div className="px-6 py-5 relative flex items-center justify-between min-w-[280px] ">
            <span>{prefix + notif.message}</span>
            <span className="absolute bottom-1 right-2 text-xs opacity-80">
                {new Date().toLocaleTimeString()}
            </span>
        </div>
    );
}
