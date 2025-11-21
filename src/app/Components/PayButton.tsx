'use client';

import { useState } from 'react';
import { Button } from './lightswind/button';
import Orange from "../../../public/assets/Orange.svg";
import Mtn from "../../../public/assets/MTN.jpg";

interface PayButtonProps {
    amount: number;
    filePath: string;
    fileName: string;
    currency?: string;
    userId?: string;
    theme?: string;
}


export default function PayButton({ amount, filePath, fileName, currency, userId, theme }:PayButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        //startPaymentCheck();
        setLoading(true);
        try {
            const res = await fetch('/api/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amount,
                    currency: currency,
                    filePath: filePath,
                    fileName: fileName,
                    userId: userId
                })
            });

            const data = await res.json();
            if (data.link) {
                // Redirige directement vers la page de paiement Monetbil
                // window.location.href = data.link;
                // Ou ouvre dans un nouvel onglet
                //

                console.log("reponse  :", data);
                window.open(data.link, "_blank");
                // redirection Monetbil
            } else {
                console.error("Erreur :", data);
                alert(data.error || 'Erreur paiement');
            }
        } catch (err) {
            alert('Erreur serveur');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
            <Button type='submit' onClick={handlePay} disabled={loading} className="w-auto h-12 hover:h-15  shadow-4xl transition-all duration-400 bg-linear-to-tr from-white/30 via-yellow-400 to-orange-500 flex flex-col justify-start items-center" data-theme={theme ? theme : "light"}>
                <div className='w-full h-full flex flex-row items-center justify-center'> <img src={Orange.src} alt="" className="w-20 " />  <img src={Mtn.src} alt="" className="w-20 rounded-md" /> </div>
                <p>{loading ? 'Chargement, veuillez patienter...' : 'Payer via Mobile Money / OM'}</p>
            </Button>
    );
}
