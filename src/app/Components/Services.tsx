import Title from "./Title";
import { AnimatedOceanWaves } from "@/app/Components/lightswind/AnimatedOceanWaves";
import Link from "next/link";
import Wave from "react-wavify";
import Aos from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import { useEffect } from "react";
import { ArrowRight, BrainCircuit, Code2, GraduationCap, Palette } from "lucide-react";

type servicesProps = {
    waveColor: string;
    textCol: string;
    theme: string;
    cardCol: string;
};

const services = [
    {
        title: "Formations specialisees",
        description: "Programmes pratiques en developpement, data science, IA et outils numeriques.",
        image: "/assets/ImgCarousel/7.jpeg",
        href: "/Services#formations",
        accent: "from-amber-300 to-cyan-300",
        icon: GraduationCap,
    },
    {
        title: "Solutions Web & Cloud",
        description: "Sites, portfolios, applications et architectures evolutives pour lancer proprement.",
        image: "/assets/ImgCarousel/2.png",
        href: "/Services#solutions web",
        accent: "from-cyan-300 to-blue-500",
        icon: Code2,
    },
    {
        title: "Intelligence artificielle",
        description: "Automatisation, prediction, analyse et modeles adaptes aux besoins reels.",
        image: "/assets/ImgCarousel/13.jpg",
        href: "/Services#ia",
        accent: "from-blue-400 to-violet-400",
        icon: BrainCircuit,
    },
    {
        title: "Design & Creativite",
        description: "Interfaces, identites visuelles et supports modernes pour rendre vos idees visibles.",
        image: "/assets/ImgCarousel/4.jpeg",
        href: "/Services#design",
        accent: "from-pink-400 to-amber-300",
        icon: Palette,
    },
];

const Services = ({ waveColor, theme }: servicesProps) => {
    useEffect(() => {
        Aos.init({
            duration: 800,
            once: true,
        });
    });

    return (
        <div className="divlab-section-shell relative flex flex-col items-center justify-center overflow-hidden" id="services" data-theme={theme}>
            <Wave
                fill={waveColor}
                paused={false}
                style={{ display: "flex" }}
                options={{
                    height: 20,
                    amplitude: 60,
                    speed: 0.15,
                    points: 4,
                }}
                className="rotate-180"
            />

            <div className="divlab-grid-mask absolute inset-0 opacity-30" />
            <div className="relative z-10 w-full px-5 py-16 md:px-12">
                <div className="mx-auto max-w-6xl text-center">
                    <Title title="Nos Services" dataAos="fade-down" />
                    <p className="mx-auto mt-3 max-w-2xl text-[var(--divlab-muted)]" data-aos="fade-right">
                        Une entree plus claire vers les poles DIVLAB: apprendre, construire, automatiser et presenter.
                    </p>
                </div>

                <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {services.map((service, index) => (
                        <Link
                            key={service.title}
                            href={service.href}
                            onClick={() => window.scrollTo(0, 0)}
                            className="divlab-glass divlab-card-hover group relative min-h-[430px] overflow-hidden rounded-[2rem]"
                            data-aos={index % 2 === 0 ? "fade-up" : "fade-down"}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    alt={service.title}
                                    width={640}
                                    height={420}
                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                    src={service.image}
                                />
                                <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${service.accent}`} />
                            </div>
                            <div className="flex h-[calc(100%-12rem)] flex-col justify-between p-5">
                                <div>
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                                        <service.icon size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold">{service.title}</h3>
                                    <p className="mt-3 leading-7 text-[var(--divlab-muted)]">{service.description}</p>
                                </div>
                                <span className="mt-6 inline-flex items-center font-bold text-cyan-200">
                                    Explorer <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="relative h-44 w-full overflow-hidden">
                <AnimatedOceanWaves
                    height="50%"
                    oceanBackground={waveColor}
                    frontWaveOpacity={0.7}
                    backWaveOpacity={0.28}
                    waveDuration={10}
                />
            </div>
        </div>
    );
};

export default Services;
