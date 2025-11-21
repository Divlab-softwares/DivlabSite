import AboutQuestions from "./AboutQuestions";
import Title from "./Title";
import Aos from "aos";
import { useEffect, useState } from "react";
import "aos/dist/aos.css";
import "./scroll.css"
import RippleGrid from '@/app/Components/RippleGrid';
import { ChevronUpCircle, X, ChevronUp } from "lucide-react"
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
    { id: 1, value: "Qui sommes  nous ?", answer: "DivLab est un laboratoire de solutions numériques et d’intelligence artificielle. Nous accompagnons les entreprises et les particuliers dans la création de sites web, le développement de modèles IA, la formation en data science et la maintenance informatique. Notre mission est de rendre la technologie accessible, efficace et rentable pour tous.", img: "/assets/ImgCarousel/1.jpg" },
    {
        id: 2, value: "Quels services offrons nous ?", answer: "Nous proposons principalement :\n * Formation en Data Science et Intelligence Artificielle(Python, R, Machine Learning, Deep Learning, Excel avancé…).\n  * Développement de sites web et applications sur mesure.\n * Assistance à projets IA et consulting technique.\n  * Maintenance et dépannage informatique pour particuliers et entreprises.\n  * Exposition et accompagnement pour vos projets technologiques et idées de recherche.", img: "/assets/ImgCarousel/2.png"
    },
    {
        id: 3, value: "Pourquoi nous choisir ?", answer: "Expertise en data science, IA et développement web. Approche pratique et adaptée aux besoins réels des clients. Accompagnement de A à Z pour les projets, de la conception à la mise en production. Service rapide, fiable et accessible même pour les débutants.", img: "/assets/ImgCarousel/5.jpeg"
    },
    {
        id: 4, value: "Comment nous contacter ?", answer: "Vous pouvez nous joindre via : WhatsApp: 237652509674  \nEmail: divlabsoftware@gmail.com \nVia notre formulaire de contact sur ce site web", img: "/assets/ImgCarousel/14.webp"
    },
    {
        id: 5, value: "Ou sommes nous situes ?", answer: "DivLab est basé au Cameroun, mais nous intervenons également en ligne pour les clients internationaux.\nVous pouvez nous rencontrer sur rendez- vous dans nos locaux ou échanger à distance via nos plateformes numériques.", img: "/assets/ImgCarousel/6.jpeg"
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

    const [closeEv, setCloseEv] = useState("")


    // const location = useLocation();
    // const [show, setShow] = useState(true);

    // useEffect(() => {
    //     setShow(false);
    //     const timer = setTimeout(() => setShow(true), 50); // recrée le composant
    //     return () => clearTimeout(timer);
    // }, [location]);

    return (
        <div className=" relative   z-20" data-theme={themeAbout} id="about" >
            <AnimatePresence>
                {(closeEv == "hidden") && (
                    <motion.button
                        initial={{ opacity: 0, width: "20%" }}
                        animate={{ opacity: 1, width: "100%" }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                        onClick={() => { setCloseEv("open") }}
                        className="text-left text-sm h-fit w-full backdrop-blur-lg bg-gray-900 rounded-full px-[10px] text-gray-400 -top-6 absolute z-45 ">
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
                                                        <Image src={img} width={500} height={500} alt="image" className=" absolute top-2 right-0 w-70 h-70  " />

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
                                                        <Image src={img1} width={500} height={500} alt="image" className="absolute left-10 -top-3 w-32 h-38 rounded-xl shadow-[-10px_8px_9px_rgba(0,0,0,0.8)]" />
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
                                                        <Image src={img2} width={500} height={500} alt="image" className="object-cover rounded-xl absolute -top-10 left-2 w-35 h-50 rotate-15 shadow-[-10px_8px_9px_rgba(0,0,0,0.8)] " />

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
                                                        <Image src={img3} width={500} height={500} alt="image" className="object-cover rounded-xl absolute -top-15 right-3 w-50 h-60  rotate-[-7deg] shadow-[10px_8px_20px_rgba(0,0,0,0.8)] animate-" />

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
                <div className={`w-full h-20 absolute  ${sepColor} border-none`} >

                </div>


                <Title title="A Propos" className="mb-50 mt-20" dataAos="fade-down" />

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
                <div className="mb-50 px-5 md:px-15">
                    <AboutQuestions questions={Questions} questionHome={QuestionsHome} textCol={textCol} />
                </div>
            </div>
        </div>
    );
}

export default About;