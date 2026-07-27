import type { Metadata } from "next";
import { LegalPage } from "../Components/LegalPage";

export const metadata: Metadata = { title: "Réclamations" };

export default function ComplaintsPage() {
  return (
    <LegalPage title="Réclamations et assistance" intro="Un parcours clair pour signaler un paiement, un accès, une formation ou un problème de données personnelles.">
      <section><h2>1. Envoyer une réclamation</h2><p>Écrivez à divlabsoftware@gmail.com avec l’objet « Réclamation », l’adresse de votre compte, la formation ou le service concerné, la référence de paiement si applicable, les faits, la solution demandée et les justificatifs utiles. Ne transmettez jamais votre code secret Mobile Money.</p></section>
      <section><h2>2. Délais de traitement</h2><p>DIVLAB accuse réception sous 2 jours ouvrés et vise une réponse motivée sous 7 jours ouvrés après réception des informations nécessaires. Une enquête auprès d’un formateur ou prestataire peut prolonger ce délai ; l’utilisateur en est informé.</p></section>
      <section><h2>3. Escalade</h2><p>Si la première réponse ne résout pas le problème, l’utilisateur peut demander un réexamen en rappelant le numéro ou la date de sa première demande. DIVLAB privilégie une solution amiable sans limiter le droit de saisir l’autorité ou la juridiction compétente.</p></section>
      <section><h2>4. Urgence de sécurité</h2><p>Pour un compte compromis, une fraude ou une divulgation de données, indiquez « URGENT SÉCURITÉ » dans l’objet et décrivez uniquement les éléments nécessaires. Changez immédiatement votre mot de passe si vous y avez encore accès.</p></section>
    </LegalPage>
  );
}
