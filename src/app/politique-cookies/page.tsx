import type { Metadata } from "next";
import { LegalPage } from "../Components/LegalPage";

export const metadata: Metadata = { title: "Politique relative aux cookies" };

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Politique relative aux cookies" intro="Cette page explique les traceurs utilisés pour faire fonctionner, sécuriser et, le cas échéant, mesurer nos services.">
      <section><h2>1. Cookies nécessaires</h2><p>Ils permettent l’authentification, la sécurité, le maintien de session, la mémorisation de préférences essentielles et l’équilibrage technique. Leur désactivation peut empêcher certaines fonctions.</p></section>
      <section><h2>2. Mesure d’audience et contenus tiers</h2><p>Des services vidéo, de visioconférence ou de mesure peuvent déposer leurs propres traceurs lors de leur utilisation. Les traceurs non nécessaires ne doivent être activés qu’après information et, lorsque requis, consentement.</p></section>
      <section><h2>3. Vos choix</h2><p>Vous pouvez supprimer ou bloquer les cookies depuis votre navigateur. DIVLAB ajoutera un gestionnaire de consentement avant toute activation de traceurs publicitaires ou de mesure non strictement nécessaires.</p></section>
      <section><h2>4. Durée</h2><p>La durée dépend de la finalité : certains cookies expirent à la fermeture du navigateur, d’autres conservent une préférence pendant une durée limitée et proportionnée.</p></section>
    </LegalPage>
  );
}
