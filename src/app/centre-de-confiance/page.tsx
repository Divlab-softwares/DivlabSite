import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../Components/LegalPage";

export const metadata: Metadata = { title: "Centre de confiance" };

export default function TrustCenterPage() {
  return (
    <LegalPage title="Centre de confiance" intro="Nos engagements concrets pour permettre à chacun d’acheter et d’apprendre en connaissance de cause.">
      <section><h2>Identité et transparence</h2><p>DIVLAB publie ce qui est vérifié et ne revendique aucune certification ou immatriculation qui n’a pas été confirmée. Consultez les <Link href="/mentions-legales">mentions légales</Link>.</p></section>
      <section><h2>Formateurs vérifiés</h2><p>Le badge bleu est réservé aux comptes dont le dossier formateur a été approuvé. Il décrit une vérification DIVLAB et non une certification publique. Consultez les <Link href="/regles-formateurs">règles de vérification</Link>.</p></section>
      <section><h2>Paiements traçables</h2><p>Chaque transaction confirmée possède une référence et chaque formation payante donne accès à un reçu PDF nominatif. DIVLAB ne demande jamais votre code secret Mobile Money.</p></section>
      <section><h2>Garantie apprenant</h2><p>Une formation annulée ou un accès payé non fourni ouvre droit à une solution conforme à la <Link href="/politique-remboursement">politique de remboursement</Link>.</p></section>
      <section><h2>Protection des données</h2><p>Les accès sont limités, les paiements sont vérifiés côté serveur et les documents formateurs ne sont pas publiés. Consultez notre <Link href="/privacy-policy">politique de confidentialité</Link>.</p></section>
      <section><h2>Recours humain</h2><p>Une procédure documentée permet de contester un paiement, un accès ou une décision. Consultez la page <Link href="/reclamations">Réclamations</Link>.</p></section>
      <section><h2>Ce que DIVLAB ne prétend pas</h2><p>DIVLAB n’affirme pas être un établissement diplômant ou un organisme certifié tant qu’aucune reconnaissance officielle vérifiable ne le permet. Les attestations indiquent leur portée réelle.</p></section>
    </LegalPage>
  );
}
