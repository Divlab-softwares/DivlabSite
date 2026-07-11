import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - DIVLAB",
  description:
    "Politique de confidentialité pour les services de formation en data science, IA, création de sites web et support informatique proposés par DIVLAB au Cameroun.",
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6 md:px-20 lg:px-40 text-gray-800" data-theme="garden">

            <h1 className="text-4xl font-bold mb-6 text-gray-900">
                Politique de Confidentialité – DIVLAB
            </h1>

            <p className="mb-8 text-lg text-gray-700">
                Chez <strong>DIVLAB</strong>, nous accordons une grande importance à la protection
                de vos données personnelles. Cette politique explique comment vos informations
                sont collectées, utilisées, stockées et protégées lorsque vous utilisez nos
                services, formations et solutions basées sur l’intelligence artificielle.
            </p>

            {/* SECTION */}
            <Section title="1. Données que nous collectons">
                <SubTitle>Données que vous fournissez volontairement :</SubTitle>
                <ul className="list-disc ml-6 mb-4">
                    <li>Nom, prénom</li>
                    <li>Adresse email et informations de contact</li>
                    <li>Données de paiement (traitées via des prestataires sécurisés)</li>
                    <li>Vos messages, retours ou fichiers envoyés lors d’une assistance</li>
                </ul>

                <SubTitle>Données collectées automatiquement :</SubTitle>
                <ul className="list-disc ml-6 mb-4">
                    <li>Adresse IP</li>
                    <li>Données de navigation</li>
                    <li>Type d'appareil, système d'exploitation, navigateur</li>
                </ul>

                <SubTitle>Cookies et technologies similaires :</SubTitle>
                <p className="mb-4">
                    Nous utilisons des cookies pour améliorer l’expérience utilisateur,
                    analyser l’audience et sécuriser les sessions.
                </p>
            </Section>

            <Section title="2. Utilisation des données">
                <p className="mb-4">Vos informations sont utilisées pour :</p>
                <ul className="list-disc ml-6">
                    <li>Créer et gérer votre compte utilisateur</li>
                    <li>Fournir nos services de formation et d’assistance</li>
                    <li>Améliorer nos plateformes et produits IA</li>
                    <li>Assurer la sécurité et prévenir la fraude</li>
                    <li>Effectuer les paiements via des plateformes sécurisées</li>
                    <li>Vous envoyer des notifications utiles (paiement, accès, alertes…)</li>
                </ul>
            </Section>

            <Section title="3. Partage des données">
                <p className="mb-4">
                    Nous ne vendons jamais vos données. Toutefois, certaines informations peuvent
                    être partagées avec :
                </p>
                <ul className="list-disc ml-6">
                    <li>Nos prestataires techniques (Ex : Supabase, AWS, Stripe…)</li>
                    <li>Nos outils analytiques (Ex : Google Analytics)</li>
                    <li>Les autorités compétentes si la loi l’exige</li>
                </ul>
            </Section>

            <Section title="4. Stockage et sécurité des données">
                <p>
                    Vos données sont stockées dans des environnements sécurisés. Nous appliquons
                    des mesures de sécurité physiques, techniques et organisationnelles pour
                    prévenir tout accès non autorisé.
                </p>
            </Section>

            <Section title="5. Services tiers utilisés">
                <p className="mb-4">DIVLAB peut utiliser les services suivants :</p>
                <ul className="list-disc ml-6">
                    <li><strong>Supabase</strong> – stockage, authentification, base de données</li>
                    <li><strong>AWS S3</strong> – stockage des fichiers</li>
                    <li><strong>Stripe</strong> – paiements sécurisés</li>
                    <li><strong>Google</strong> – outils analytiques</li>
                </ul>
            </Section>

            <Section title="6. Durée de conservation">
                <p>
                    Nous conservons vos données uniquement durant la période nécessaire pour
                    fournir les services ou conformément aux obligations légales.
                </p>
            </Section>

            <Section title="7. Vos droits">
                <p className="mb-4">Vous disposez des droits suivants :</p>
                <ul className="list-disc ml-6 mb-4">
                    <li>Droit d’accès à vos données</li>
                    <li>Droit de rectification</li>
                    <li>Droit à la suppression (droit à l’oubli)</li>
                    <li>Droit d’opposition et de limitation</li>
                    <li>Droit à la portabilité</li>
                </ul>
                <p>
                    Pour exercer vos droits, contactez-nous via l'adresse ci-dessous.
                </p>
            </Section>

            <Section title="8. Confidentialité des mineurs">
                <p>
                    Nos services ne sont pas destinés aux mineurs de moins de 16 ans.
                    Nous ne collectons pas volontairement leurs données.
                </p>
            </Section>

            <Section title="9. Modifications de cette politique">
                <p>
                    DIVLAB peut mettre à jour cette politique si nécessaire.
                    La date de mise à jour sera indiquée en bas de la page.
                </p>
            </Section>

            <Section title="10. Contact">
                <p className="mb-4">Pour toute question concernant la confidentialité :</p>
                <p>Email : <strong>divlabsoftware@gmail.com</strong></p>
                <p>Téléphone : <strong>+237 652509674</strong></p>
                <p className="mt-6 text-sm text-gray-500">Dernière mise à jour : 2025</p>
            </Section>

        </div>
    );
}


/* --- Sub Components --- */
function Section({ title, children }: any) {
    return (
        <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">{title}</h2>
            <div className="text-gray-700 leading-relaxed">{children}</div>
        </section>
    );
}

function SubTitle({ children }: any) {
    return <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>;
}
