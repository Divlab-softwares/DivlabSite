import DIVLABLogo from "../../../public/assets/logo.jpg";
import Aos from "aos";

import { Ref, useEffect, useRef, useState } from "react";
import "aos/dist/aos.css";

type NavbarProps = {
    translateY: number;
};


const Navbar = ({ translateY }: NavbarProps) => {

    useEffect(() => {
        Aos.init({
            duration: 800,
            once: true,
        });
    }, []);
    return (
        <div
            style={{
                transform: `translate(0%, ${translateY - 12}px)`
            }}
            className={` rounded-full   md:bg-white/5 z-50 backdrop-blur-lg flex flex-row justify-center md:justify-between items-center  fixed top-5 md:left-1/5 left-0 transform md:w-[60%] w-full max-w-6xl  text-white
        px-6 py-3 rounded-full transition-transform duration-300 ease-in-out `} data-aos="fade-down">
            <a href="#footer" className="flex items-center font-bold text-2xl md:text-xl text-black"><img src={DIVLABLogo.src} alt="" className="w-9 h-9 rounded-full mr-1" />DIV<span className="text-info ">LAB</span></a>
            <ul className="flex flex-row  hidden md:flex space-x-4 ">
                <li><a href="#about">A propos</a></li>
                <li><a href="#services">Nos services</a></li>
                <li><a href="#realisations">Nos réalisations</a></li>

            </ul>

        </div>


    )

}

export default Navbar;