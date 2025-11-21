import { Suspense } from "react";
import ServicesClient from "./ServicesClient";

export default function ServicesPage() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <ServicesClient />
    </Suspense>
  );
}
