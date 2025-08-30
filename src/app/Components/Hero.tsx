
import Silk from "./SilkBg";
import "aos/dist/aos.css";
import Whatsapp from "../../../public/whatsapp.svg";


const Hero = () => {
    // const homeRef = useRef<HTMLElement>(null);
    // const [navbarTranslateY, setNavbarTranslateY] = useState(0);
    // const lastScrollY = useRef(0);

    // useEffect(() => {
    //     Aos.init({
    //         duration: 800,
    //         once: true,
    //     });
    //     const handleScroll = () => {
    //         const currentScrollY = window.scrollY;
    //         const scrollDelta = currentScrollY - lastScrollY.current;

    //         if (scrollDelta > 0) {
    //             // Scroll vers le bas
    //             setNavbarTranslateY((prev) => Math.min(prev + scrollDelta, 0));
    //         } else {
    //             // Scroll vers le haut
    //             setNavbarTranslateY((prev) => Math.max(prev + scrollDelta, -64));
    //         }

    //         lastScrollY.current = currentScrollY;
    //     };

    //     window.addEventListener('scroll', handleScroll);

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);


    // pages/index.tsx

    



    return (
        <div className="top-0  h-auto md:px-[15%] z-10 sticky" id="home" >
            <div className="w-100% h-100% " >
                <div className="absolute inset-0 z-[-1] top-0 w-100% h-100%" data-aos="fade">
                    <Silk
                        speed={5}
                        scale={1}
                        color="#0074D9"
                        noiseIntensity={1.5}
                        rotation={0}
                    />
                </div>
                
                <div className=" flex flex-col md:flex-row items-center  justify-center  md:mb-10 md:my-0 h-screen md:w-1/2" >

                    <div className=" rounded-xl h-auto border border-transparent shadow-sm backdrop-blur-lg flex flex-col items-center md:items-start mt-20 md:mt-0  md:ml-20 p-9" data-aos="fade-up" >

                        <span className="hidden md:flex text-xl">Bienvenu chez <br /></span>
                        <h1 className="text-5xl md:text-6xl font-bold text-center md:text-left  text-black ">
                            <i>DIV</i>
                            <span className="text-info">
                                LAB
                            </span>
                        </h1>
                        <p className="my-2 text-md md:text-lg text-center md:text-left">
                            Nous fesons l'impossible avec maitrise
                        </p>
                        <a href="whatsapp://send?phone=237652509674" target="_blank"className="btn  shadow-[5-5-0-[0,0,0,0.6]] shadow-3xl hover:shadow-lg bg-gradient-to-br from-white/50 via-white to-white/60 border-none transition-transform duration-300 hover:-translate-y-1 hover:scale-105 text-black rounded-4xl w-50 md:w-fit">
                            <img src={Whatsapp.src} alt="" className="w-6 h-6 rounded-full mr-2" />Discuter sur Whatsapp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;