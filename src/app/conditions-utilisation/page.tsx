import type { Metadata } from "next";
import { LegalPage } from "../Components/LegalPage";

export const metadata: Metadata = { title: "Conditions d’utilisation" };

export default function TermsPage() {
  return (
    <LegalPage title="Conditions d’utilisation" intro="Ces règles protègent les apprenants, les formateurs et le bon fonctionnement de DIVLAB.">
      <section><h2>1. Compte</h2><p>Les informations fournies doivent être exactes. Le compte et les accès sont personnels. L’utilisateur doit protéger ses identifiants et signaler rapidement tout accès suspect.</p></section>
      <section><h2>2. Utilisation acceptable</h2><p>Sont interdits : la fraude, l’usurpation d’identité, le partage ou la revente d’accès, l’atteinte aux systèmes, le harcèlement, les contenus illicites, la collecte non autorisée de données et la reproduction des supports sans autorisation.</p></section>
      <section><h2>3. Formations et attestations</h2><p>Une formation transmet des connaissances et compétences, mais ne garantit pas un emploi, un revenu ou un résultat académique. Une attestation DIVLAB n’est pas un diplôme d’État sauf mention expresse et preuve vérifiable.</p></section>
      <section><h2>4. Contenus des formateurs</h2><p>Les formateurs restent responsables de l’exactitude, de la licéité et des droits sur leurs contenus. DIVLAB peut contrôler, corriger, suspendre ou retirer une offre qui présente un risque pour les utilisateurs.</p></section>
      <section><h2>5. Modération et suspension</h2><p>Une mesure proportionnée peut être prise en cas de violation : avertissement, limitation, retrait de contenu, suspension ou fermeture. Sauf urgence de sécurité ou fraude manifeste, l’utilisateur peut fournir ses observations.</p></section>
      <section><h2>6. Signaler un problème</h2><p>Tout contenu, comportement ou accès suspect peut être signalé à divlabsoftware@gmail.com avec les éléments utiles. Les signalements sont traités de manière confidentielle dans la mesure du possible.</p></section>
    </LegalPage>
  );
}
