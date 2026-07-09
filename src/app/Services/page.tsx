import { Suspense } from "react";
import Services from "./Services"
import MagicLoader from "@/app/Components/magic-loader"
import { Metadata } from "next";
import { getRankedCourses } from "@/app/Components/lib/db-queries";
export const metadata: Metadata = {
  title: "Services",
  description:
    "Découvrez les Services pratiques offerts par DIVLAB dont les formations en data science, machine learning, intelligence artificielle et autres solutions tech adaptées aux étudiants et professionnels., Conception de sites web professionnels , Conception et recherche sur les modeles d'IA ",
};

export default async function ServicesPage() {

  const rankedCourses = await getRankedCourses()

  return (
    <Suspense fallback={<h1 className="items-center justify-center flex flex-col">Services DIVLAB <MagicLoader /></h1>}>
      <Services initialRankedCourses={rankedCourses} />
    </Suspense>
  );
}
