import { Suspense } from "react";
import Services from "./Services"
import MagicLoader from "@/app/Components/magic-loader"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formations en Data Science et IA",
  description:
    "Découvrez les Services pratiques offerts par DIVLAB dont les formations en data science, machine learning, intelligence artificielle et autres solutions tech adaptées aux étudiants et professionnels., Conception de sites web professionnels , Conception et recherche sur les modeles d'IA ",
};

export default function ServicesPage() {
  return (
    <Suspense fallback={<h1 className="items-center justify-center flex flex-col">Services DIVLAB <MagicLoader /></h1>}>
      <Services />
    </Suspense>
  );
}
