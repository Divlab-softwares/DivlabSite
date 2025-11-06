'use client';

import { useState } from 'react';
import { Button } from './lightswind/button';
import Orange from "../../../public/assets/Orange.svg";
import Mtn from "../../../public/assets/MTN.jpg";

interface PayButtonProps {
    amount: number;
    item_ref: string;
    startPaymentCheck: () => void;
}

export default function PayButton({ amount, item_ref, startPaymentCheck }:PayButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        startPaymentCheck();
        setLoading(true);
        try {
            const res = await fetch('/api/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amount,
                   // phone: '6XXXXXXXX',
                    item_ref: item_ref
                })
            });

            const data = await res.json();
            if (data.link) {
                // Redirige directement vers la page de paiement Monetbil
                //window.location.href = data.link;
                console.error("Test :", data);
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
        <form action="" method="get" data-monetbil="form" className=''>
            <Button type='submit' onClick={handlePay} disabled={loading} className=" h-12 hover:h-15  hover:w-full  shadow-4xl transition-all duration-400 bg-gradient-to-tr from-white/40 via-yellow-400 to-orange-500 flex flex-col justify-start items-center">
                <div className='w-full h-full flex flex-row items-center justify-center'> <img src={Orange.src} alt="" className="w-20 " />  <img src={Mtn.src} alt="" className="w-20 rounded-md" /> </div>
                <p>{loading ? 'Chargement, veuillez patienter...' : 'Payer via Mobile Money / OM'}</p>
            </Button>
        </form>
    );
}
