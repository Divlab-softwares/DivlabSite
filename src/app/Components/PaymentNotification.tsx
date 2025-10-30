'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface PayNotifProps {
  message: string;
  type: 'success' | 'failed' | 'cancelled';
  onClose: () => void;
}

export default function PaymentNotification({ message, type, onClose }: PayNotifProps) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (!message) return;
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => onClose(), 400); // délai pour l'animation de sortie
    }, 8000); // disparaît après 8s
    return () => clearTimeout(timer);
  }, [message]); // <= quand message change, timer redémarre

  if (!message) return null;

  return (
    <AnimatePresence>
      {show &&  (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.5 }}
        className={`z-60 fixed bottom-20 right-6 rounded-xl shadow-xl h-15  text-white font-bold
          ${type === 'success' ? 'bg-green-800' : 'bg-red-600'}`}
      >
        <div className=' px-6 py-3  relative w-full h-full flex items-center justify-center'>
          {type === 'success'
              ? `✅ Operation réussie ! ${message || 'Téléchargement disponible.'} `
              : type === 'failed' ? `❌ Operation échouée : ${message || 'Veuillez réessayer.'}` : `🛑 Operation annulée : ${message || 'Veuillez réessayer.'}`}

            <span className='absolute bottom-1 right-2 text-xs'>{new Date().toLocaleTimeString()}</span>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
