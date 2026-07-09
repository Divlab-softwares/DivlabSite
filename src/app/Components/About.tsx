import AboutQuestions from "./AboutQuestions";
import Title from "./Title";
import Aos from "aos";
import { useEffect, useState } from "react";
import "aos/dist/aos.css";
import "./scroll.css"
import RippleGrid from '@/app/Components/RippleGrid';
import { X, ChevronUp, BrainCircuit, Code2, GraduationCap } from "lucide-react"
import Image from "next/image";
import { Button } from "./lightswind/button";
import img from "../../../public/assets/Group.webp";
import img1 from "../../../public/assets/formations/DIVLAB_30-days-of-react-ebook_free.jpeg";
import img2 from "../../../public/assets/Blog.jpeg";
import img3 from "../../../public/assets/IaPremium.jpeg";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { DotBackground } from "./lightswind/grid-dot-background";
// import ImgCarousel_1 from "@/app/assets/ImgCarousel/1.jpg";
// import ImgCarousel_2 from "@/app/assets/ImgCarousel/2.jpg";
// import ImgCarousel_3 from "@/app/assets/ImgCarousel/3.jpg";
// import ImgCarousel_4 from "@/app/assets/ImgCarousel/4.jpg";

const Questions = [
    {
        id: 1,
        value: "Qui sommes-nous ?",
        answer: `DIVLAB est un laboratoire de solutions numériques spécialisé dans le développement web, l'intelligence artificielle, la data science et la transformation digitale.

Notre objectif est d'accompagner les particuliers, les entreprises, les étudiants et les organisations dans la conception de solutions technologiques modernes, performantes et adaptées à leurs besoins.

Au-delà de la réalisation de projets, nous accordons une grande importance à la transmission des compétences grâce à nos formations, masterclass et programmes d'accompagnement.

Notre mission est de rendre les technologies numériques et l'intelligence artificielle accessibles, utiles et créatrices de valeur, afin d'aider chacun à innover, gagner en productivité et concrétiser ses idées.`,
        img: "/assets/ImgCarousel/1.jpg"
    },

    {
        id: 2,
        value: "Quels services proposons-nous ?",
        answer: `DIVLAB met à votre disposition une large gamme de services numériques pour répondre aux besoins des particuliers, des startups, des entreprises et des établissements de formation.

Nos principaux domaines d'expertise sont :

• Développement de sites web modernes, applications web et plateformes sur mesure.

• Conception de solutions basées sur l'intelligence artificielle et la data science (Machine Learning, Deep Learning, automatisation, analyse de données...).

• Formations, masterclass et accompagnement en développement web, programmation, Python, R, Intelligence Artificielle, Data Science, Excel avancé et outils numériques.

• Conseil, assistance technique et accompagnement dans vos projets numériques ou de recherche.

• Maintenance, optimisation, sécurisation et dépannage de systèmes informatiques.

• Accompagnement des entrepreneurs, étudiants et porteurs de projets dans la réalisation de leurs idées technologiques.

Chaque solution est conçue en tenant compte de vos objectifs, de votre budget et de vos besoins spécifiques.`,
        img: "/assets/ImgCarousel/2.png"
    },

    {
        id: 3,
        value: "Pourquoi choisir DIVLAB ?",
        answer: `Choisir DIVLAB, c'est bénéficier d'un partenaire qui privilégie la qualité, l'innovation et l'accompagnement.

Nous nous distinguons par :

• Une expertise en développement web, intelligence artificielle et data science.

• Des solutions entièrement personnalisées selon vos besoins.

• Une approche pratique, orientée vers des résultats concrets et mesurables.

• Un accompagnement complet, depuis l'étude du projet jusqu'au déploiement et au suivi.

• Des formations accessibles aussi bien aux débutants qu'aux professionnels souhaitant renforcer leurs compétences.

• Une écoute permanente afin de proposer les technologies les plus adaptées à chaque projet.

Notre ambition est de construire des solutions fiables, évolutives et durables qui contribuent réellement à votre réussite.`,
        img: "/assets/ImgCarousel/5.jpeg"
    },

    {
        id: 4,
        value: "Comment pouvons-nous vous accompagner ?",
        answer: `Que vous soyez étudiant, entrepreneur, chercheur, startup, PME ou grande entreprise, DIVLAB vous accompagne à chaque étape de votre projet.

Nous pouvons intervenir pour :

• Transformer une idée en projet concret.

• Développer une application ou un site web professionnel.

• Intégrer des solutions d'intelligence artificielle à vos activités.

• Former vos équipes ou développer vos compétences techniques.

• Vous conseiller dans le choix des meilleures technologies.

Nous adaptons notre accompagnement selon votre niveau d'avancement, vos objectifs et vos contraintes afin de garantir une collaboration efficace.`,
        img: "/assets/ImgCarousel/14.webp"
    },

    {
        id: 5,
        value: "Comment nous contacter ?",
        answer: `Notre équipe est disponible pour répondre à toutes vos questions, discuter de votre projet ou vous orienter vers la solution la plus adaptée.

Vous pouvez nous contacter par :

• WhatsApp : +237 652 50 96 74

• E-mail : divlabsoftware@gmail.com

• Le formulaire de contact disponible sur ce site.

Nous nous engageons à répondre dans les meilleurs délais et à vous accompagner tout au long de votre projet.`,
        img: "/assets/ImgCarousel/14.webp"
    },

    {
        id: 6,
        value: "Où sommes-nous situés ?",
        answer: `DIVLAB est basé au Cameroun et accompagne également des clients à distance dans plusieurs pays.

Grâce à nos outils de collaboration en ligne, nous pouvons assurer le suivi de vos projets, organiser des réunions, dispenser des formations et fournir une assistance technique où que vous soyez.

Des rencontres en présentiel peuvent également être organisées sur rendez-vous lorsque cela est nécessaire.`,
        img: "/assets/ImgCarousel/6.jpeg"
    },

    {
        id: 7,
        value: "À qui s'adressent nos services ?",
        answer: `Nos services sont destinés à un large public :

• Étudiants souhaitant acquérir des compétences en développement web, intelligence artificielle ou data science.

• Entrepreneurs et startups désirant créer ou développer leurs solutions numériques.

• Entreprises recherchant des outils sur mesure, des solutions d'automatisation ou des formations pour leurs collaborateurs.

• Chercheurs et porteurs de projets innovants nécessitant un accompagnement technique.

Quel que soit votre niveau ou votre secteur d'activité, nous vous aidons à concrétiser vos objectifs numériques.`,
        img: "/assets/ImgCarousel/8.jpg"
    },

    {
        id: 8,
        value: "Proposez-vous des formations en ligne ?",
        answer: `Oui.

DIVLAB propose des formations accessibles en ligne afin de permettre à chacun d'apprendre où qu'il se trouve.

Nos formations privilégient la pratique à travers des exercices, des projets réels, des études de cas et un accompagnement personnalisé.

Les participants peuvent progresser à leur rythme tout en bénéficiant d'un suivi par nos formateurs.`,
        img: "/assets/ImgCarousel/10.jpg"
    }
]

const QuestionsHome = {
    id: -1,
    value: "Accueil",
    answer: "Nous sommes une agence de developpement web et mobile qui se concentre sur la creation de solutions innovantes et sur mesure pour nos clients, BIENVENU !.",
    img: ""

}

type AboutProps = {
    themeAbout: string;
    sepColor: string;
    textCol: string
};

const About = ({ themeAbout, sepColor, textCol }: AboutProps) => {
    useEffect(() => {
        Aos.init({
            duration: 800,
            once: true,
        });
    });

    const encodeMessage = encodeURIComponent("Bonjour/Bonsoir, je vous ecrit car je voudrais beneficier de la promotion DIVLAB portfolio, ouvez vous me donner olus de details sur celle si?");

    const [closeEv, setCloseEv] = useState("hidden")


    // const location = useLocation();
    // const [show, setShow] = useState(true);

    // useEffect(() => {
    //     setShow(false);
    //     const timer = setTimeout(() => setShow(true), 50); // recrée le composant
    //     return () => clearTimeout(timer);
    // }, [location]);

    return (
        <div className="divlab-section-shell relative z-20" data-theme={themeAbout} id="about" >
            <AnimatePresence>
                {(closeEv == "hidden") && (
                    <motion.button
                        initial={{ opacity: 0, width: "20%" }}
                        animate={{ opacity: 1, width: "100%" }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                        onClick={() => { setCloseEv("open") }}
                        className="text-left text-sm h-fit w-full backdrop-blur-lg bg-gray-900 rounded-full px-[10px] text-gray-400 -top-6 absolute z-45 cursor-pointer">
                        Voir les Evenements
                    </motion.button>)}
            </AnimatePresence>

            <AnimatePresence>
                {(closeEv != "hidden") && (

                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
                        className={`h-80 w-full backdrop-blur-lg shadow-[inset_3px_3px_30px_rgba(0,0,0,0.7)] -top-70 absolute z-45  `}>
                        <div className="relative w-full h-full">
                            <Button onClick={() => { setCloseEv("hidden") }} className="rounded-full w-fit h-fit p-2 bg-gray-600/50 absolute -top-9 left-1 hover:bg-red-500">
                                < X />
                            </Button>
                            <div className="overflow-hidden  flex flex-col h-full justify-between pb-3 pt-1">
                                <div className="flex flex-row justify-between w-full h-fit pl-2">

                                    <span >Evenements </span>

                                </div>
                                <AnimatePresence >
                                    <motion.hr
                                        initial={{ opacity: 1, width: "0%" }}
                                        animate={{ opacity: 1, width: "100%" }}
                                        exit={{ width: "20%", opacity: 0 }}
                                        transition={{ duration: 0.7, delay: 0.8, ease: "easeInOut" }}
                                    />
                                </AnimatePresence>
                                <div className=" flex flex-row items-center rounded-xl mx-15 h-fit  overflow-hidden   backdrop-blur-lg bg-black/5 shadow-[inset_3px_3px_30px_rgba(0,0,0,0.7)] gap-0 ">

                                    {/* <DotBackground dotSize={1} dotColor="#404040" darkDotColor="#404040" spacing={15} showFade={true} fadeIntensity={40} className="h-full" /> */}

                                    <div className=" marquee-content w-fit h-fit  items-center justify-center flex flex-row text-white py-3  animate-marquee ">
                                        <Link
                                            href={`whatsapp://send?phone=237652509674&text=${encodeMessage}`}
                                            target="_blank"
                                            onClick={() => {
                                                if ("/Evenements".startsWith("/")) {
                                                    window.scrollTo(0, 0);
                                                }
                                            }} className=" relative flex h-fit w-130 flex-row ml-10 bg-gray-300 justify-between rounded-xl  bg-linear-to-br  from-purple-900 to-black/30 ">
                                            <div className="  w-full flex flex-col justify-between  px-5 pt-5 pb-2 gap-5">
                                                <h1 className="text-3xl font-bold ">Divlab portfolio<hr /></h1>
                                                <div className="flex flex-row justify-center items-align">
                                                    <div className=" relative flex flex-col justify-between gap-4">
                                                        <p className="text-md">
                                                            Obtenez votre portfolio <span className="text-red-500 text-xl font-bold  antialiased">gratuitement</span>  Dès aujourd'hui
                                                        </p>
                                                        <span className="text-sm">Valable jusqu'au 25 septembre</span>
                                                        <span className="text-sm text-right flex flex-col items-center justify-center animate-bounce"> <ChevronUp className="m-0 p-0 w-5 h-5 " /> cliquez pour acceder</span>

                                                    </div>
                                                    <div className=" h-full w-75">
                                                        <Image src={img} width={500} height={500} alt="Portfolio Image" className=" absolute top-2 right-0 w-70 h-70  " />

                                                    </div>



                                                </div>


                                            </div>


                                        </Link>

                                        <Link
                                            href="/Services"
                                            onClick={() => {
                                                if ("/Services".startsWith("/")) {
                                                    window.scrollTo(0, 0);
                                                }
                                            }} className=" relative flex h-fit w-130 flex-row ml-80 bg-gray-300 justify-between rounded-xl  bg-linear-to-b  from-yellow-700 via-yellow-500 to-black/10 ">
                                            <div className="  w-full flex flex-col justify-between  px-5 pt-5 pb-2 gap-5">
                                                <h1 className="text-3xl font-bold ">Formations ( ebooks )<hr /></h1>
                                                <div className=" rounded-2xl flex flex-row justify-between items-align">
                                                    <div className="relative h-full w-80">
                                                        <Image src={img1} width={500} height={500} alt="Formations Image" className="absolute left-10 -top-3 w-32 h-38 rounded-xl shadow-[-10px_8px_9px_rgba(0,0,0,0.8)]" />
                                                    </div>
                                                    <div className="text-black w-120 relative flex flex-col justify-between gap-4 items-start">
                                                        <p className="text-md">
                                                            Nos formations sur mesures adaptées a la lecture et la comprehension facile
                                                        </p>
                                                        {/* <span className="text-[13px] text-red-800">Les formations sont adaptées à ceux ayant peu de budget, donc nous avons mis sur pied des formations à bas prix et d'autres gratuites </span> */}
                                                        <span className="text-sm text-right flex flex-col items-center justify-center animate-bounce"> <ChevronUp className="m-0 p-0 w-5 h-5 " /> cliquez pour acceder</span>

                                                    </div>




                                                </div>


                                            </div>


                                        </Link>

                                        <Link
                                            href="/Services#solutions web"
                                            onClick={() => {
                                                if ("/Services#solutions web".startsWith("/")) {
                                                    window.scrollTo(0, 0);
                                                }
                                            }} className=" relative flex h-fit w-130 flex-row ml-80 bg-gray-300 justify-between rounded-xl  bg-linear-to-t  from-green-700 via-green-500 to-black/20 ">
                                            <div className="  w-full flex flex-col justify-between  px-5 pt-5 pb-2 gap-5">
                                                <h1 className="text-3xl font-bold text-right ">Conception de sites web<hr /></h1>
                                                <div className="text-black  rounded-xl flex flex-row justify-between items-align">
                                                    <div className="relative h-full w-60">
                                                        <Image src={img2} width={500} height={500} alt="Websites presentation Image" className="object-cover rounded-xl absolute -top-10 left-2 w-35 h-50 rotate-15 shadow-[-10px_8px_9px_rgba(0,0,0,0.8)] " />

                                                    </div>
                                                    <div className="w-100 relative flex flex-col justify-between gap-4">
                                                        <p className="text-md">
                                                            Des sites web conҫus sur des délais bref et respectant vos attentes et choix. conҫus par nos experts, offrant une architecture scalable et customizable.
                                                        </p>
                                                        {/* <span className="text-sm text-red-600">Vous avez besoin d'un site web fait sur mesure pour votre structure ? </span> */}
                                                        <span className="text-sm text-right flex flex-col items-center justify-center animate-bounce"> <ChevronUp className="m-0 p-0 w-5 h-5 " /> cliquez pour acceder</span>

                                                    </div>

                                                </div>


                                            </div>


                                        </Link>

                                        <Link
                                            href="/Services#ia"
                                            onClick={() => {
                                                if ("/Services#ia".startsWith("/")) {
                                                    window.scrollTo(0, 0);
                                                }
                                            }} className=" relative flex h-fit w-130 flex-row ml-60 bg-gray-300 justify-between rounded-xl bg-linear-to-br  from-blue-900 via-blue-800 to-black/20 ">
                                            <div className="  w-full flex flex-col justify-between  px-5 pt-5 pb-2 gap-5">
                                                <h1 className="text-3xl font-bold ">Modeles IA <hr /></h1>
                                                <div className="flex flex-row justify-center items-align">
                                                    <div className="w-100 relative flex flex-col justify-between gap-4">
                                                        <p className="text-md">
                                                            Les IA sont des outils actuellements tres utilisés, grâce à leur aide et le gain de temps qu'ils apportent
                                                        </p>
                                                        {/* <span className="text-sm">Nous conҫevons des modèles d'IA adaptés à vos besoins et critères de perfectionnement.</span> */}
                                                        <span className="text-sm text-right flex flex-col items-center justify-center animate-bounce"> <ChevronUp className="m-0 p-0 w-5 h-5 " /> cliquez pour acceder</span>

                                                    </div>
                                                    <div className="relative h-full w-80">
                                                        <Image src={img3} width={500} height={500} alt="AI PRESENTATION IMAGE" className="object-cover rounded-xl absolute -top-15 right-3 w-50 h-60  rotate-[-7deg] shadow-[10px_8px_20px_rgba(0,0,0,0.8)] animate-" />

                                                    </div>



                                                </div>


                                            </div>


                                        </Link>

                                    </div>


                                </div>

                            </div>

                        </div>

                    </motion.div>)}
            </AnimatePresence>

            <div className=" h-auto flex flex-col overflow-hidden relative " id="about">
                {/* <Separator /> */}
                <div className={`w-full h-24 absolute ${sepColor} border-none opacity-80`} >

                </div>


                <div className="relative z-10 mx-auto max-w-6xl px-5 pt-20 text-center">
                    <Title title="A Propos" className="mb-5" dataAos="fade-down" />
                    <p className="mx-auto max-w-2xl text-base leading-7 text-[var(--divlab-muted)]" data-aos="fade-up">
                        DIVLAB transforme les idees techniques en experiences utiles: apprendre, lancer, automatiser et faire grandir des projets avec une execution propre.
                    </p>
                    <div className="mt-8 grid gap-3 md:grid-cols-3">
                        {[
                            { icon: Code2, label: "Web & Cloud", value: "produits scalables" },
                            { icon: BrainCircuit, label: "IA appliquee", value: "modeles utiles" },
                            { icon: GraduationCap, label: "Training", value: "competences mesurables" },
                        ].map((item) => (
                            <div key={item.label} className="divlab-glass divlab-card-hover flex items-center gap-3 rounded-2xl p-4 text-left">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                                    <item.icon size={22} />
                                </div>
                                <div>
                                    <p className="text-sm uppercase text-[var(--divlab-muted)]">{item.label}</p>
                                    <p className="font-bold">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute h-full w-full overflow-hidden" >
                    <RippleGrid
                        enableRainbow={false}
                        gridColor="#0074D9"
                        rippleIntensity={0.05}
                        gridSize={25}
                        gridThickness={25}
                        mouseInteraction={true}
                        mouseInteractionRadius={1.4}
                        opacity={0.8}
                        fadeDistance={4}
                        vignetteStrength={3}

                    />
                </div>
                <div className="relative z-10 mb-36 px-5 pt-14 md:px-15">
                    <AboutQuestions questions={Questions} questionHome={QuestionsHome} textCol={textCol} />
                </div>
            </div>
        </div>
    );
}

export default About;
