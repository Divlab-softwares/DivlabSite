import AboutQuestions from "./AboutQuestions";
import Title from "./Title";
import Aos from "aos";
import { useEffect } from "react";
import "aos/dist/aos.css";
import RippleGrid from '@/app/Components/RippleGrid';
// import ImgCarousel_1 from "@/app/assets/ImgCarousel/1.jpg";
// import ImgCarousel_2 from "@/app/assets/ImgCarousel/2.jpg";
// import ImgCarousel_3 from "@/app/assets/ImgCarousel/3.jpg";
// import ImgCarousel_4 from "@/app/assets/ImgCarousel/4.jpg";


const Questions = [
    { id: 1, value: "Qui sommes  nous ?", answer: "DivLab est un laboratoire de solutions numériques et d’intelligence artificielle. Nous accompagnons les entreprises et les particuliers dans la création de sites web, le développement de modèles IA, la formation en data science et la maintenance informatique. Notre mission est de rendre la technologie accessible, efficace et rentable pour tous.", img: "/assets/ImgCarousel/1.jpg" },
    {
        id: 2, value: "Quels services offrons nous ?", answer: "Nous proposons principalement :\n * Formation en Data Science et Intelligence Artificielle(Python, R, Machine Learning, Deep Learning, Excel avancé…).\n  * Développement de sites web et applications sur mesure.\n * Assistance à projets IA et consulting technique.\n  * Maintenance et dépannage informatique pour particuliers et entreprises.\n  * Exposition et accompagnement pour vos projets technologiques et idées de recherche.", img: "/assets/ImgCarousel/2.png" },
    {
        id: 3, value: "Pourquoi nous choisir ?", answer: "Expertise en data science, IA et développement web. Approche pratique et adaptée aux besoins réels des clients. Accompagnement de A à Z pour les projets, de la conception à la mise en production. Service rapide, fiable et accessible même pour les débutants.", img: "/assets/ImgCarousel/5.jpeg" },
    {
        id: 4, value: "Comment nous contacter ?", answer: "Vous pouvez nous joindre via : WhatsApp: 237652509674  \nEmail: divlabsoftware@gmail.com \nVia notre formulaire de contact sur ce site web", img: "/assets/ImgCarousel/14.webp" },
    {
        id: 5, value: "Ou sommes nous situes ?", answer: "DivLab est basé au Cameroun, mais nous intervenons également en ligne pour les clients internationaux.\nVous pouvez nous rencontrer sur rendez- vous dans nos locaux ou échanger à distance via nos plateformes numériques.", img: "/assets/ImgCarousel/6.jpeg"}
]

const QuestionsHome = {
    id: -1,
    value: "Accueil",
    answer: "Nous sommes une agence de developpement web et mobile qui se concentre sur la creation de solutions innovantes et sur mesure pour nos clients, BIENVENU !.",
    img: ""

}

const About = () => {
    useEffect(() => {
        Aos.init({
            duration: 800,
            once: true,
        });
    });


    // const location = useLocation();
    // const [show, setShow] = useState(true);

    // useEffect(() => {
    //     setShow(false);
    //     const timer = setTimeout(() => setShow(true), 50); // recrée le composant
    //     return () => clearTimeout(timer);
    // }, [location]);

    return (
        <div className="  md:px-[0%] relative top-0  z-20" data-theme="sunset" id="about" >
        <div className=" h-auto flex flex-col overflow-hidden relative " id="about">
            {/* <Separator /> */}
            <div className="w-full h-20 absolute   bg-gradient-to-b  to-[#121c22] border-none  from-[#0074D9]/30" >

            </div>
            

            <Title title="A Propos" className="mb-50 mt-20" dataAos="fade-down"/>

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
                <AboutQuestions questions={Questions} questionHome={QuestionsHome} />
            </div>
        </div>
        </div>
    );
}

export default About;