import { Suspense } from "react";
import CommandeClient from "./CommandeClient";

export default function CommandePage(props: any) {
    const searchParams = props.searchParams as Record<
        string,
        string | string[] | undefined
    >;
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <CommandeClient searchParams={searchParams} />
    </Suspense>
  );
}
