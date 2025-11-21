import { Suspense } from "react";
import ServicesClient from "./ServicesClient";
import MagicLoader from "@/app/Components/magic-loader"

export default function ServicesPage() {
  return (
    <Suspense fallback={<p className="items-center justify-center"><MagicLoader /></p>}>
      <ServicesClient />
    </Suspense>
  );
}
