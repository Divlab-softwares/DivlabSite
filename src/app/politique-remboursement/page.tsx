import type { Metadata } from "next";
import { LegalPage } from "../Components/LegalPage";

export const metadata: Metadata = { title: "Politique de remboursement" };

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Politique de remboursement" intro="Notre garantie vise à ne pas laisser un apprenant payer pour une formation annulée ou un accès non fourni.">
      <section>
        <h2>1. Cas couverts par la garantie</h2>
        <ul>
          <li>formation annulée par DIVLAB ou par le formateur sans solution équivalente acceptée ;</li>
          <li>accès payé non fourni malgré un paiement confirmé ;</li>
          <li>contenu ou prestation substantiellement différent de la description au moment de l’achat ;</li>
          <li>double débit confirmé pour la même commande.</li>
        </ul>
      </section>
      <section>
        <h2>2. Solutions proposées</h2>
        <p>Selon le problème et le choix raisonnable de l’apprenant, DIVLAB peut rétablir l’accès, reprogrammer la session, proposer une formation équivalente, émettre un avoir accepté ou rembourser tout ou partie du montant concerné.</p>
      </section>
      <section>
        <h2>3. Cas normalement non remboursables</h2>
        <ul>
          <li>changement d’avis après consommation substantielle du contenu numérique ;</li>
          <li>absence volontaire à une session maintenue et correctement annoncée ;</li>
          <li>problème de connexion, d’appareil ou de disponibilité propre à l’apprenant ;</li>
          <li>compte suspendu pour fraude, partage d’accès ou violation grave des règles ;</li>
          <li>résultat personnel ou professionnel non garanti par la fiche de formation.</li>
        </ul>
        <p>Ces exclusions ne s’appliquent pas lorsqu’une garantie légale impérative impose une autre solution.</p>
      </section>
      <section>
        <h2>4. Délai et demande</h2>
        <p>La demande doit être envoyée dès la découverte du problème et, si possible, dans les 7 jours suivant la session annulée, le refus d’accès ou l’anomalie constatée. Elle doit contenir l’adresse du compte, la formation, la référence de paiement, une description et tout justificatif utile.</p>
      </section>
      <section>
        <h2>5. Traitement</h2>
        <p>DIVLAB accuse réception sous 2 jours ouvrés et vise une décision motivée sous 7 jours ouvrés après réception des éléments nécessaires. Si un remboursement est accepté, son affichage sur le compte de paiement dépend ensuite des délais du prestataire et de l’opérateur.</p>
      </section>
      <section>
        <h2>6. Paiement provisoire ou non confirmé</h2>
        <p>Un paiement en vérification n’est pas considéré comme définitivement encaissé. DIVLAB vérifie d’abord la transaction auprès du prestataire. Un débit non confirmé est traité avec le prestataire avant toute décision de remboursement.</p>
      </section>
    </LegalPage>
  );
}
