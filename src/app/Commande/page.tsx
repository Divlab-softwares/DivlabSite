import { Suspense } from "react";
import CommandeClient from "./CommandeClient";
import MagicLoader from "@/app/Components/magic-loader"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Passation de commande - DIVLAB",
  description:
    "Page de passation de commande pour les services de formation en data science, IA, création de sites web et support informatique proposés par DIVLAB au Cameroun.",
};

export default function CommandePage(props: any) {
    const searchParams = props.searchParams as Record<
        string,
        string | string[] | undefined
    >;
  return (
    <Suspense fallback={<h1 className="items-center justify-center">Votre commande<MagicLoader /></h1>}>
      <CommandeClient searchParams={searchParams} />
    </Suspense>
  );
}
