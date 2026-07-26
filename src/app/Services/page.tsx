import { Suspense } from "react";
import Services from "./Services"
import MagicLoader from "@/app/Components/magic-loader"
import { Metadata } from "next";
import { getRankedCourses } from "@/app/Components/lib/db-queries";
export const metadata: Metadata = {
  title: "Services digitaux et développement sur mesure",
  description:
    "Découvrez les services DIVLAB : sites web professionnels, applications métier, plateformes SaaS, automatisation, solutions IA, UI/UX et formations technologiques.",
  alternates: {
    canonical: "/Services",
  },
  openGraph: {
    title: "Services digitaux et développement sur mesure | DIVLAB",
    description:
      "DIVLAB transforme vos besoins métier en sites web, applications, plateformes SaaS et solutions IA utiles et performantes.",
    url: "https://divlabs-tech.com/Services",
    type: "website",
  },
};

export default async function ServicesPage() {

  const rankedCourses = await getRankedCourses()

  return (
    <Suspense fallback={<h1 className="items-center justify-center flex flex-col">Services DIVLAB <MagicLoader /></h1>}>
      <Services initialRankedCourses={rankedCourses} />
    </Suspense>
  );
}
