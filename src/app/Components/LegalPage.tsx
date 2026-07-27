import Link from "next/link";
import type { ReactNode } from "react";

export const LAST_LEGAL_UPDATE = "27 juillet 2026";
export const DIVLAB_EMAIL = "divlabsoftware@gmail.com";
export const DIVLAB_PHONE = "+237 652 509 674";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-14 text-slate-800" data-theme="garden">
      <article className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <Link href="/" className="text-sm font-semibold text-sky-700 hover:underline">
          ← Retour à DIVLAB
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{intro}</p>
        <p className="mt-4 text-sm text-slate-500">Dernière mise à jour : {LAST_LEGAL_UPDATE}</p>
        <div className="mt-10 space-y-9 leading-7 [&_a]:font-semibold [&_a]:text-sky-700 [&_a]:underline [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-950 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_ul]:mt-3">
          {children}
        </div>
        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600">
          <p>Contact : <a href={`mailto:${DIVLAB_EMAIL}`}>{DIVLAB_EMAIL}</a> · <a href="tel:+237652509674">{DIVLAB_PHONE}</a></p>
          <p className="mt-2">© {new Date().getFullYear()} DIVLAB — Tous droits réservés.</p>
        </footer>
      </article>
    </main>
  );
}
