// Condition generale de vente
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions generales de vente - CGV",
  description:
    "Conditions generales de vente pour les services de formation en data science, IA, création de sites web et support informatique proposés par DIVLAB au Cameroun.",
};
// app/cgv/page.tsx
export default function CGVPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 leading-relaxed" data-theme="garden">

            <h1 className="text-4xl font-bold mb-10 text-center">Conditions Générales de Vente (CGV)</h1>

            <p className="mb-6 text-sm text-gray-500">
                Dernière mise à jour : {new Date().getFullYear()}
            </p>

            {/* Introduction */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-3">1. Objet</h2>
                <p>
                    Les présentes Conditions Générales de Vente (CGV) encadrent la vente
                    des services proposés par <strong>DIVLAB</strong>, une structure
                    spécialisée dans la Data Science, l’Intelligence Artificielle,
                    la création de sites web, le support informatique et
                    l’accompagnement académique.
                </p>
            </section>

            {/* Nature des services */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-3">2. Nature des services fournis</h2>
                <p>DIVLAB propose notamment :</p>
                <ul className="list-disc ml-6 mt-2">
                    <li>Formations en Data Science, IA, R, Excel, Python, Deep Learning…</li>
                    <li>Développement de sites web et applications.</li>
                    <li>Maintenance informatique et optimisation d’équipements.</li>
                    <li>Création et entraînement de modèles d’apprentissage automatique.</li>
                    <li>Assistance à projets académiques (mémoire, thèse, mini-projets…).</li>
                    <li>Accompagnement à la recherche et rédaction scientifique.</li>
                </ul>
            </section>

            {/* Commande */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-3">3. Processus de commande</h2>
                <p>
                    Pour passer une commande, le client peut utiliser la plateforme DIVLAB,
                    contacter l’équipe via les réseaux officiels ou échanger directement
                    avec un conseiller DIVLAB. Une commande n’est validée qu’après confirmation
                    écrite (courriel, message ou facture électronique).
                </p>
            </section>

            {/* Politique des prix */}
            <section className="mb-10" id="politique_prix">
                <h2 className="text-2xl font-bold mb-3">4. Politique tarifaire</h2>
                <p>
                    Les prix affichés sur la plateforme ou les supports DIVLAB sont fournis
                    à titre indicatif et représentent une <strong>base de discussion</strong>.
                    Les tarifs finaux peuvent varier selon :
                </p>
                <ul className="list-disc ml-6 mt-2">
                    <li>la complexité du projet ;</li>
                    <li>la durée estimée du travail ;</li>
                    <li>le niveau d’expertise requis ;</li>
                    <li>les délais demandés par le client ;</li>
                    <li>les exigences techniques spécifiques.</li>
                </ul>

                <p className="mt-4">
                    Le prix définitif est fixé uniquement après un échange avec le client
                    et l’établissement d’un <strong>devis personnalisé</strong>. Ce devis
                    prévaut sur tout prix affiché publiquement.
                </p>

                <p className="mt-3">
                    Les promotions, tarifs spéciaux ou réductions sont appliqués à la
                    discrétion de DIVLAB.
                </p>
            </section>

            {/* Paiement */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-3">5. Modalités de paiement</h2>
                <p>
                    Le paiement peut s’effectuer via les moyens suivants :
                </p>
                <ul className="list-disc ml-6 mt-2">
                    <li>Mobile Money (MTN, Orange Money) via les passerelles partenaires.</li>
                    <li>Carte bancaire via les API sécurisées (ex : NotchPay, Lygos).</li>
                    <li>Paiement en espèces lorsque applicable.</li>
                </ul>

                <p className="mt-4">
                    Aucun service ne débute tant que le paiement n’a pas été validé,
                    sauf accord exceptionnel mentionné explicitement par DIVLAB.
                </p>
            </section>

            {/* Livraison des services */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-3">6. Livraison des services</h2>
                <p>
                    La livraison dépend du type de service : cours PDF, développement,
                    scripts IA, logiciels, corrections académiques…
                    Les délais sont communiqués au client avant la validation du devis
                    et peuvent être ajustés selon les besoins.
                </p>
            </section>

            {/* Rétractation */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-3">7. Droit de rétractation</h2>
                <p>
                    Conformément aux usages des prestations numériques et personnalisées,
                    aucun remboursement n’est possible une fois le service entamé ou le
                    document livré.
                    Toutefois, une résolution amiable peut être proposée en cas de
                    problème majeur.
                </p>
            </section>

            {/* Responsabilités */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-3">8. Responsabilités</h2>
                <p>
                    DIVLAB s’engage à fournir des services professionnels et conformes
                    aux attentes convenues.
                    Le client est tenu de fournir des informations exactes, complètes
                    et à jour pour permettre une réalisation optimale du service.
                </p>
            </section>

            {/* Confidentialité */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-3">9. Confidentialité</h2>
                <p>
                    DIVLAB garantit la confidentialité des données et documents transmis
                    dans le cadre d’un projet.
                    Cette section concerne les engagements liés au projet, tandis que
                    la Politique de Confidentialité (page séparée) traite de la gestion
                    des données personnelles.
                </p>
            </section>

            {/* Propriété intellectuelle */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-3">10. Propriété intellectuelle</h2>
                <p>
                    Sauf mention contraire dans un contrat spécifique, tous les supports
                    fournis (scripts, codes, modèles IA, documents, plans…) restent la
                    propriété intellectuelle de DIVLAB jusqu’au paiement intégral du service.
                </p>
            </section>

            {/* Litiges */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-3">11. Loi applicable et litiges</h2>
                <p>
                    Les présentes CGV sont régies par le droit du Cameroun.
                    Tout litige non résolu à l’amiable sera porté devant les tribunaux
                    compétents de Douala.
                </p>
            </section>

            {/* Contact */}
            <section>
                <h2 className="text-2xl font-bold mb-3">12. Contact</h2>
                <p>
                    Pour toute question concernant les présentes CGV :
                    <br />
                    <strong>Email :</strong> divlabsoftware@gmail.com
                    <br />
                    <strong>Téléphone :</strong> +237 652509674
                </p>
            </section>

            <div className="mt-16 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} DIVLAB — Tous droits réservés.
            </div>

        </div>
    );
}
