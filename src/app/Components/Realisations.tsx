import Title from "./Title";
import Image from "next/image";
import { ArrowUpRight, Layers } from "lucide-react";
import { motion } from "motion/react";

const items = [
    {
        id: 1,
        title: "DIVLAB TRAIN",
        brand: "FORMATIONS",
        description: "DIVLAB Train est une plateforme de formation en ligne pensée pour les formateurs, éducateurs et créateurs de cours. Elle centralise la visioconférence, les inscriptions, les paiements Mobile Money, le suivi de l'audience et des revenus afin de simplifier la gestion et développer l'activité de formation.",
        tags: ["EdTech", "Mobile Money", "Visioconférence"],
        imageUrl: "/assets/projects/divlabTrain.png",
        url: "https://train.divlabs-tech.com/"
    }, {
        id: 2,
        title: "DIVLAB AI",
        brand: "Machine Learning",
        description: "Projet de recherche appliquée DIVLAB autour des modèles de langage, de l'orchestration IA et de la création d'assistants adaptés à des besoins métier.",
        tags: ["IA", "LLM", "Python"],
        imageUrl: "/assets/projects/divlabAi.png",
        url: "https://github.com/Divlab-softwares/Divlab-AI"
    },
    {
        id: 3,
        title: "Portfolios modernes",
        brand: "Portfolio",
        description: "Conception de portfolios professionnels sur mesure pour présenter une expertise, renforcer une marque personnelle et convertir les visiteurs en prises de contact.",
        tags: ["Portfolio", "UX", "UI"],
        imageUrl: "/assets/projects/5.png",
        url: "https://github.com/Divlab-softwares"
    },
    {
        id: 4,
        title: "Site web deal flow",
        brand: "Developpement web",
        description: "Plateforme de presentation et vente d'articles recommandes par des restaurants.",
        tags: ["React", "Commerce", "UX"],
        imageUrl: "/assets/projects/dealFlow.png",
        url: "https://github.com/Divlab-softwares"
    },
    {
        id: 5,
        title: "Ecosystem Divlab",
        brand: "Plateforme multi outils",
        description: "Plateforme locale de mini-outils web organisés par collections DIVLAB. Le projet est volontairement statique, rapide et compatible avec GitHub Pages ou tout hébergeur relié à GitHub.",
        tags: ["Dashboard", "React", "Outils rapides"],
        imageUrl: "/assets/projects/ecosystemDivlab.png",
        url: "https://ecosystem.divlabs-tech.com/"
    },
    {
        id: 6,
        title: "Site vitrine DIVLAB",
        brand: "Developpement Web",
        description: "Site institutionnel conçu pour présenter les expertises, formations et produits DIVLAB, valoriser les réalisations et faciliter la prise de contact.",
        tags: ["React", "Next.js", "Tailwind"],
        imageUrl: "/assets/projects/siteVitrine.png",
        url: "https://divlabs-tech.com"
    },
    {
        id: 7,
        title: "Genuka trust",
        brand: "Dashboard (projet due a un hackathon)",
        description: "Genuka Trust est une application intelligente qui devrait etre connectée à la plateforme Genuka, conçue pour automatiser entièrement la collecte, la gestion et la valorisation des avis clients.\nCe projet resulte de la participation de DIVLAB au hackathon lance par Genuka. \n Nous n'avons aucun droit de propriete sur la PME Genuka, ce projet est presente a titre d'exemple et de demonstration de nos competences en developpement web et mobile",
        tags: ["Hackathon", "Genuka", "Solutions PME"],
        imageUrl: "/assets/projects/genukaTrust.png",
        url: "https://genuka-trust.vercel.app/"
    },
    {
        id: 8,
        title: "Mobile Zone AR Dashboard",
        brand: "Version mobile WebXR du dashboard AR, sans marqueur ArUco.",
        description: "Le telephone utilise le tracking AR natif du navigateur pour reconnaitre l'espace. L'utilisateur vise une surface, touche l'ecran, et le dashboard est ancre dans le monde reel.",
        tags: ["Realite augmente", "Mobile", "Capteur ArUCo"],
        imageUrl: "/assets/projects/capteurMobile.png",
        url: "https://mobilera.divlabs-tech.com/"
    },
    {
        id: 9,
        title: "Echo-local",
        brand: "Combating misinformation in cameroon",
        description: "Projet qui resulte de l'hackathon lance par l'UNESCO en 2025 visant a reduire l'evolution des fakes new dans l'espace camerounais.",
        tags: ["Desinformation", "Solution numerique", "hackathon"],
        imageUrl: "/assets/projects/echoLocal.png",
        url: "https://github.com/Divlab-softwares/Echo-local"
    },
];

type realisationsProps = {
    themeRealisations: string;
    cardColor: string;
};

const Realisations = ({ themeRealisations }: realisationsProps) => {
    const featured = items[0];
    const rest = items.slice(1);

    return (
        <div className="divlab-section-shell h-auto overflow-x-hidden" data-theme={themeRealisations} id="realisations">
            <div className="relative overflow-hidden px-5 py-20 md:px-12">
                <div className="divlab-grid-mask absolute inset-0 opacity-30" />
                <div className="relative z-10 mx-auto max-w-7xl">
                    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <Title className="mb-4" title="Nos Realisations" />
                            <p className="max-w-2xl text-[var(--divlab-muted)]" data-aos="fade-right">
                                Des projets visibles d'un seul regard, avec les choix techniques et le contexte de chaque livraison.
                            </p>
                        </div>
                        <div className="divlab-glass flex w-fit items-center gap-3 rounded-full px-4 py-3 text-sm font-bold">
                            <Layers size={18} className="text-cyan-300" /> {items.length} projets exposes
                        </div>
                    </div>

                    <motion.a
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.6 }}
                        href={featured.url}
                        target="_blank"
                        className="divlab-glass divlab-card-hover group overflow-hidden rounded-[2rem]"
                    >
                        <div className="relative h-[360px] overflow-hidden md:h-[520px]">
                            <Image src={featured.imageUrl} alt={featured.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
                                <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-bold uppercase text-[#071421]">{featured.brand}</span>
                                <h3 className="mt-4 text-3xl font-bold md:text-5xl">{featured.title}</h3>
                                <p className="mt-3 max-w-2xl text-white/78 whitespace-pre-line text-md">{featured.description}</p>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {featured.tags.map((tag) => (
                                        <span key={tag} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.a>

                    <div className="">


                        <div className=" mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-2">
                            {rest.map((item, index) => (
                                <motion.a
                                    key={item.id}
                                    initial={{ opacity: 0, x: 24 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.25 }}
                                    transition={{ duration: 0.45, delay: index * 0.08 }}
                                    href={item.url}
                                    target="_blank"
                                    className="divlab-glass divlab-card-hover group grid overflow-hidden rounded-[1.6rem] md:grid-cols-[160px_1fr]"
                                >
                                    <div className="relative h-44 overflow-hidden md:h-full">
                                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover transition duration-700 group-hover:scale-110" />
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-bold uppercase text-cyan-300">{item.brand}</p>
                                                <h3 className="mt-1 text-xl font-bold">{item.title}</h3>
                                            </div>
                                            <ArrowUpRight className="h-5 w-5 text-[var(--divlab-muted)] transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cyan-300" />
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-[var(--divlab-muted)] whitespace-pre-line">{item.description}</p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {item.tags.map((tag) => (
                                                <span key={tag} className="rounded-full bg-white/8 px-2.5 py-1 text-xs">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Realisations;
