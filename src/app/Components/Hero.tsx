import Silk from "./SilkBg";
import "aos/dist/aos.css";
import Whatsapp from "../../../public/assets/Whatsapp.svg";
import { ArrowDown, Sparkles } from "lucide-react";

const Hero = () => {
    return (
        <div className="sticky top-0 z-10 h-auto overflow-hidden md:px-[2%]" id="home" data-theme="dark">
            <div className="relative h-full w-full">
                <div className="absolute inset-0 top-0 z-[-1] h-full w-full" data-aos="fade">
                    <Silk
                        speed={8}
                        scale={1.2}
                        color="#0074D9"
                        noiseIntensity={1.5}
                        rotation={0}
                    />
                </div>
                <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_75%_18%,rgba(245,197,66,0.18),transparent_22%),linear-gradient(90deg,rgba(5,12,20,0.28),rgba(5,12,20,0.02))]" />

                <div className="flex h-screen flex-col items-center justify-center md:my-0 md:w-3/5 md:items-start">
                    <div className="divlab-glass relative flex h-auto max-w-2xl flex-col items-center overflow-hidden rounded-[2rem] p-7 text-[var(--divlab-text)] md:ml-20 md:items-start md:p-10" data-aos="fade-up">
                        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-cyan-300 via-blue-500 to-amber-300" />

                        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold uppercase text-cyan-100">
                            <Sparkles size={16} /> Studio de produits digitaux
                        </span>
                        <h1 className="text-center text-5xl font-bold leading-none divlab-text md:text-left md:text-7xl">
                            DIV<span className="text-cyan-300">LAB</span>
                        </h1>
                        <p className="my-5 max-w-xl text-center text-base leading-7 text-cyan-50/85 divlab-text md:text-left md:text-lg">
                            Applications web, plateformes SaaS et solutions IA conçues pour transformer vos idées et processus métier.<br /> <i className="font-bold">De l'idée au produit digital.</i>
                        </p>
                        <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
                            <a href="#services" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 font-bold text-[#071421] shadow-[0_16px_45px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1">
                                Commencer par les services <ArrowDown className="ml-2 h-4 w-4" />
                            </a>
                            <a href="whatsapp://send?phone=237652509674" target="_blank" className="inline-flex divlab-text h-12 items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/18">
                                <img src={Whatsapp.src} alt="" className="mr-2 h-7 w-7 rounded-full" /> Whatsapp
                            </a>
                        </div>
                        <div className="mt-6 grid w-full grid-cols-3 gap-2 text-center text-xs text-cyan-50/80">
                            {["Applications web", "SaaS & IA", "Formations"].map((item) => (
                                <span key={item} className="rounded-full border border-white/10 bg-white/8 px-3 py-2">{item}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
