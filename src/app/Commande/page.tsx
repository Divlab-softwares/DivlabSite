import { Suspense } from "react";
import CommandeClient from "./CommandeClient";
import MagicLoader from "@/app/Components/magic-loader"

export default function CommandePage(props: any) {
    const searchParams = props.searchParams as Record<
        string,
        string | string[] | undefined
    >;
  return (
    <Suspense fallback={<p className="items-center justify-center"><MagicLoader /></p>}>
      <CommandeClient searchParams={searchParams} />
    </Suspense>
  );
}
