import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../Components/LegalPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Traitement et protection des données personnelles par DIVLAB.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      intro="Cette politique décrit de façon transparente les données traitées par DIVLAB, leurs usages et les choix dont disposent les utilisateurs."
    >
      <section>
        <h2>1. Responsable du traitement</h2>
        <p>DIVLAB, joignable à divlabsoftware@gmail.com et au +237 652 509 674, détermine les finalités principales des traitements liés à son site, à DIVLAB Training et à ses services.</p>
      </section>
      <section>
        <h2>2. Données collectées</h2>
        <ul>
          <li>identité, coordonnées, pays, ville et informations de profil ;</li>
          <li>données de compte, de connexion, de sécurité et de session ;</li>
          <li>commandes, références et statuts de paiement, sans conservation par DIVLAB de votre code secret Mobile Money ;</li>
          <li>formations suivies, accès, présences, interactions pédagogiques et messages ;</li>
          <li>pour les formateurs : parcours, justificatifs de compétence, pièce d’identité et moyen de versement ;</li>
          <li>informations techniques nécessaires à la sécurité : adresse IP, navigateur, appareil, dates et journaux d’événements.</li>
        </ul>
      </section>
      <section>
        <h2>3. Finalités et fondements</h2>
        <p>Les données servent à créer et sécuriser les comptes, exécuter les commandes, donner accès aux formations, confirmer les paiements, produire les reçus, vérifier les formateurs, assister les utilisateurs, prévenir la fraude, respecter les obligations légales et améliorer le service.</p>
        <p>Selon le traitement, DIVLAB s’appuie sur l’exécution du contrat, le respect d’une obligation légale, l’intérêt légitime de sécuriser et améliorer la plateforme, ou le consentement lorsque celui-ci est requis.</p>
      </section>
      <section>
        <h2>4. Destinataires et prestataires</h2>
        <p>L’accès est limité aux personnes autorisées de DIVLAB et aux prestataires nécessaires au service, notamment l’hébergement et la base de données, le stockage de médias, le paiement, l’envoi d’e-mails, la visioconférence et la diffusion vidéo.</p>
        <p>Les services effectivement observés sur DIVLAB Training incluent notamment Supabase, NotchPay, Resend, JaaS/8x8 et YouTube selon la fonctionnalité utilisée. Chaque prestataire traite uniquement les données nécessaires à sa mission et selon ses propres engagements contractuels.</p>
        <p>DIVLAB ne vend pas les données personnelles.</p>
      </section>
      <section>
        <h2>5. Transferts et hébergement</h2>
        <p>Certains prestataires peuvent héberger ou traiter des données hors du Cameroun. DIVLAB sélectionne des prestataires reconnus et limite les informations transmises. Lorsque la loi l’exige, des garanties adaptées doivent encadrer ces transferts.</p>
      </section>
      <section>
        <h2>6. Durées de conservation</h2>
        <ul>
          <li>compte actif : pendant la relation avec l’utilisateur, puis le temps nécessaire au traitement des demandes et obligations ;</li>
          <li>transactions et reçus : pendant la durée nécessaire aux obligations comptables, fiscales, contractuelles et à la gestion des contestations ;</li>
          <li>dossier formateur refusé ou retiré : suppression ou archivage restreint dès que sa conservation n’est plus nécessaire ;</li>
          <li>journaux de sécurité : durée proportionnée au diagnostic, à la prévention de la fraude et à la défense des droits.</li>
        </ul>
        <p>Une durée précise peut varier si une loi, une contestation ou une obligation de preuve impose une conservation plus longue.</p>
      </section>
      <section>
        <h2>7. Sécurité</h2>
        <p>DIVLAB applique des contrôles d’accès, une authentification, une vérification des paiements côté serveur, des limitations contre les abus, des journaux techniques et des restrictions sur les documents sensibles. Aucun système ne pouvant garantir un risque nul, les incidents sont analysés et traités selon leur gravité.</p>
      </section>
      <section>
        <h2>8. Vos droits</h2>
        <p>Vous pouvez demander l’accès, la rectification, la suppression ou la limitation de vos données, vous opposer à certains traitements et retirer un consentement lorsqu’il en constitue le fondement. La portabilité peut être proposée lorsque les conditions techniques et légales sont réunies.</p>
        <p>Écrivez à divlabsoftware@gmail.com en précisant votre demande. Une preuve d’identité limitée au nécessaire peut être demandée pour éviter la divulgation à un tiers.</p>
      </section>
      <section>
        <h2>9. Mineurs</h2>
        <p>La création autonome d’un compte et l’achat sont réservés aux personnes ayant la capacité juridique nécessaire. Pour un mineur, l’autorisation et l’accompagnement de son représentant légal sont requis.</p>
      </section>
      <section>
        <h2>10. Cookies</h2>
        <p>Les cookies nécessaires maintiennent la session, la sécurité et les préférences. Les usages non essentiels sont expliqués dans la <Link href="/politique-cookies">politique relative aux cookies</Link>.</p>
      </section>
      <section>
        <h2>11. Réclamation et évolution</h2>
        <p>Une demande relative aux données peut suivre la <Link href="/reclamations">procédure de réclamation</Link>. Cette politique peut évoluer pour refléter la loi ou les fonctionnalités. Les changements importants seront signalés de façon appropriée.</p>
      </section>
    </LegalPage>
  );
}
