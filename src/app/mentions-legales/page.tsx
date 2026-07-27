import type { Metadata } from "next";
import { LegalPage } from "../Components/LegalPage";

export const metadata: Metadata = { title: "Mentions légales" };

export default function LegalNoticePage() {
  return (
    <LegalPage title="Mentions légales" intro="Informations relatives à l’éditeur et au fonctionnement des services DIVLAB.">
      <section>
        <h2>Éditeur</h2>
        <p>Nom commercial : DIVLAB.</p>
        <p>Activités : services numériques, accompagnement et plateforme de formations.</p>
        <p>Localisation : Douala, Cameroun.</p>
        <p>Contact : divlabsoftware@gmail.com · +237 652 509 674.</p>
        <p><strong>Transparence :</strong> les numéros d’immatriculation, NIU et l’adresse complète ne sont pas publiés ici tant qu’ils n’ont pas été fournis et vérifiés. Ils devront être ajoutés dès leur validation officielle.</p>
      </section>
      <section><h2>Direction de la publication</h2><p>La direction de la publication est assurée par le responsable légal de DIVLAB. Son identité complète doit être ajoutée après validation interne et avant une communication commerciale à grande échelle.</p></section>
      <section><h2>Hébergement et prestataires</h2><p>Les services reposent sur des prestataires d’hébergement, de base de données et de diffusion. Les informations exactes de l’hébergeur de production doivent être complétées à partir du contrat ou du tableau de bord de déploiement, sans approximation.</p></section>
      <section><h2>Propriété intellectuelle</h2><p>Les marques, textes, visuels, logiciels et supports appartiennent à DIVLAB ou à leurs titulaires respectifs. Toute réutilisation au-delà des exceptions légales nécessite une autorisation.</p></section>
    </LegalPage>
  );
}
