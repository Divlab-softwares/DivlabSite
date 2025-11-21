export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const data = req.body; // Monetbil envoie JSON

    if (data && data.transaction && data.transaction.status === 'success') {
        const itemRef = data.transaction.item_ref;
        const amount = data.transaction.amount;

        // TODO : mettre à jour ta base de données (MongoDB, MySQL, etc.)
        console.log(`Paiement réussi : ${itemRef} - ${amount} FCFA`);
    }

    // Monetbil attend un 200 pour considérer le webhook reçu
    res.status(200).send('OK');
}
