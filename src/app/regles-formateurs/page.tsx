import type { Metadata } from "next";
import { LegalPage } from "../Components/LegalPage";

export const metadata: Metadata = { title: "Règles applicables aux formateurs" };

export default function TrainerRulesPage() {
  return (
    <LegalPage title="Règles applicables aux formateurs" intro="Le badge vérifié représente un contrôle DIVLAB, pas une certification de l’État.">
      <section><h2>1. Vérification</h2><p>Pour obtenir le statut vérifié, le formateur fournit une identité, des coordonnées, une pièce justificative et des éléments de compétence. DIVLAB examine le dossier avant d’activer le statut. Les documents ne sont pas rendus publics.</p></section>
      <section><h2>2. Signification du badge</h2><p>« Formateur vérifié » signifie que le compte et les justificatifs demandés ont été examinés par DIVLAB. Ce badge ne constitue ni un agrément public, ni une certification professionnelle, ni une garantie absolue sur chaque déclaration.</p></section>
      <section><h2>3. Obligations pédagogiques</h2><p>Le formateur doit décrire honnêtement son offre, respecter les horaires annoncés, fournir le contenu promis, répondre aux difficultés d’accès et ne pas promettre de diplôme, emploi, revenu ou résultat non démontrable.</p></section>
      <section><h2>4. Paiements et annulations</h2><p>Le formateur accepte les contrôles nécessaires avant versement et coopère aux demandes de remboursement couvertes par la garantie apprenant. Toute annulation doit être signalée immédiatement avec une proposition de reprogrammation.</p></section>
      <section><h2>5. Retrait du statut</h2><p>DIVLAB peut réexaminer ou retirer le badge en cas de document expiré, fausse déclaration, plainte sérieuse, manquement pédagogique ou risque de sécurité. Le formateur peut fournir ses observations, sauf mesure conservatoire urgente.</p></section>
    </LegalPage>
  );
}
