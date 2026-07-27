import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../Components/LegalPage";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions applicables aux formations et prestations commandées auprès de DIVLAB.",
};

export default function CGVPage() {
  return (
    <LegalPage
      title="Conditions générales de vente"
      intro="Ces conditions expliquent ce que vous achetez, comment le paiement est confirmé et quels recours sont disponibles."
    >
      <section>
        <h2>1. Vendeur, plateforme et formateurs</h2>
        <p>DIVLAB exploite le site divlabs-tech.com et la plateforme DIVLAB Training depuis le Cameroun. DIVLAB commercialise ses propres prestations et permet également à des formateurs identifiés de proposer des formations.</p>
        <p>Lorsqu’un formateur tiers anime une formation, son identité et son statut de vérification sont indiqués sur la fiche. DIVLAB reste l’interlocuteur de l’apprenant pour le paiement, l’accès et les réclamations traitées par la plateforme.</p>
        <p>Contact : divlabsoftware@gmail.com · +237 652 509 674. Les informations d’immatriculation de la structure doivent être ajoutées à la présente page dès leur disponibilité officielle.</p>
      </section>
      <section>
        <h2>2. Informations avant commande</h2>
        <p>Avant le paiement, le client peut consulter le titre, le programme ou la description, le format, le prix, la devise, le calendrier disponible, l’identité du formateur, les prérequis éventuels et la nature de l’attestation annoncée.</p>
        <p>Une attestation DIVLAB atteste une participation ou un accomplissement sur la plateforme. Elle ne constitue ni un diplôme d’État ni une certification professionnelle reconnue, sauf mention expresse accompagnée d’un justificatif vérifiable.</p>
      </section>
      <section id="politique_prix">
        <h2>3. Prix</h2>
        <p>Le prix d’une formation affiché au moment de la commande est ferme pour cette commande. Pour une prestation personnalisée, le devis accepté prévaut sur toute estimation publique. Les frais éventuels sont communiqués avant validation.</p>
      </section>
      <section>
        <h2>4. Commande et paiement</h2>
        <p>La commande devient définitive après confirmation du paiement par le prestataire de paiement et enregistrement par DIVLAB. L’utilisateur reçoit alors un accès et, pour une formation payante, un reçu PDF téléchargeable dans son espace.</p>
        <p>Les paiements électroniques sont traités par un prestataire spécialisé. DIVLAB ne demande jamais le code secret Mobile Money de l’utilisateur.</p>
      </section>
      <section>
        <h2>5. Garantie apprenant</h2>
        <p>Si la formation est annulée par le formateur ou DIVLAB, ou si l’accès acheté n’est pas fourni et qu’aucune solution équivalente n’est acceptée, l’apprenant peut demander un remboursement selon la <Link href="/politique-remboursement">politique de remboursement</Link>.</p>
        <p>Cette garantie ne couvre pas une simple absence volontaire de l’apprenant, un défaut de matériel ou de connexion qui lui est propre, ni une utilisation contraire aux règles de la plateforme.</p>
      </section>
      <section>
        <h2>6. Accès et obligations du client</h2>
        <p>Les accès sont personnels et ne peuvent être revendus ou partagés. L’apprenant doit fournir des informations exactes, préserver la confidentialité de son compte et respecter les autres participants ainsi que les droits d’auteur.</p>
      </section>
      <section>
        <h2>7. Annulation et remboursement</h2>
        <p>Les conditions, délais, exclusions et justificatifs applicables sont détaillés dans la politique de remboursement. Aucune clause des présentes conditions ne réduit les garanties impératives accordées au consommateur par la loi applicable.</p>
      </section>
      <section>
        <h2>8. Propriété intellectuelle</h2>
        <p>Les supports, vidéos, textes, logiciels et méthodes restent la propriété de leurs titulaires. L’achat donne un droit d’utilisation personnel pour la durée annoncée, et non un droit de reproduction, de diffusion ou de revente.</p>
      </section>
      <section>
        <h2>9. Disponibilité et responsabilité</h2>
        <p>DIVLAB met en œuvre des moyens raisonnables pour assurer la disponibilité du service. Une maintenance, un incident réseau ou un événement extérieur peut toutefois provoquer une interruption. En cas d’indisponibilité imputable à DIVLAB empêchant la prestation, une reprogrammation, un avoir ou un remboursement peut être proposé selon la situation.</p>
      </section>
      <section>
        <h2>10. Réclamations, droit applicable et litiges</h2>
        <p>Le client doit d’abord utiliser la <Link href="/reclamations">procédure de réclamation</Link> afin de permettre une résolution amiable. Les présentes conditions sont régies par le droit camerounais, notamment les règles relatives au commerce électronique et à la protection du consommateur. À défaut d’accord amiable, le litige relève des juridictions compétentes.</p>
      </section>
      <section>
        <h2>11. Acceptation et preuve</h2>
        <p>La validation de la commande implique l’acceptation des conditions présentées avant paiement. Les enregistrements de commande, références de transaction, confirmations du prestataire et journaux d’accès peuvent servir à établir le déroulement de la transaction, sous réserve des règles de preuve applicables.</p>
      </section>
    </LegalPage>
  );
}
