"use client"

import Hero from "@/app/Components/Hero";
import Realisations from "@/app/Components/Realisations";
import About from "@/app/Components/About";
import Navbar from "./Components/Navbar";
import ContactForm from "./Components/ContactForm";
import { useEffect, useRef, useState } from "react";

import Services from "./Components/Services";
// import Test from "./Components/test";
import Footer from "./Components/Footer";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

// import img1 from "@/app;
//   import img2 from "@/app/assets/ImgCarousel/2.jpg";
// import img3 from "@/app/assets/ImgCarousel/3.jpg";
// import img4 from "@/app/assets/ImgCarousel/4.jpg";
// import img5 from "@/app/assets/ImgCarousel/5.jpg";
// import img6 from "@/app/assets/ImgCarousel/6.jpg";
// import img7 from "@/app/assets/ImgCarousel/7.jpg";




export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  const [navbarTranslateY, setNavbarTranslateY] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (!homeRef.current) return;

      // Vérifie si Accueil est visible ≥30%
      const rect = homeRef.current.getBoundingClientRect();
      const homeVisible = rect.bottom > window.innerHeight * 0;

      if (homeVisible) {
        // Navbar stable dans Accueil
        setNavbarTranslateY(0);
      } else {
        // Navbar réagit au scroll
        setNavbarTranslateY((prev) => {
          if (scrollDelta > 0) {
            // Scroll vers le bas → disparaît progressivement
            return Math.max(prev - scrollDelta, -64); // -64px = hauteur de la navbar
          } else {
            // Scroll vers le haut → réapparaît progressivement
            return Math.min(prev - scrollDelta, 0);
          }
        });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [waveColor, setWaveColor] = useState("#121c22")
  const [theme, setTheme] = useState("business")
  const [themeAbout, setThemeAbout] = useState("sunset")
  const [themeRealisations, setThemeRealisations] = useState("night")
  const [sepColor, setSepColor] = useState("bg-gradient-to-b  to-[#121c22]   from-[#0074D9]/30")
  const [textCol, setTextCol] = useState("text-white")
  const [cardCol, setCardCol] = useState("#151419")
  const [cardColor, setCardColor] = useState("bg-black/80")


const setThemes = () => {

  if (theme === "business") { 
    setThemeAbout("corporate")
    setTheme("garden")
    setSepColor("bg-gradient-to-b  to-rgba(255,255,255,0.7)   from-[#0074D9]/30")
    setWaveColor("rgba(255,255,255,0.8)")
    setTextCol("text-black")
    setCardCol("#ffffff")
    setCardColor("bg-gray-600")
    setThemeRealisations("corporate")
  } else {
    setThemeAbout("sunset")
    setTheme("business")
    setWaveColor("#121c22")
    setSepColor("bg-gradient-to-b  to-[#121c22]   from-[#0074D9]/30")
    setTextCol("text-white")
    setCardCol("#151419")
    setCardColor("bg-black/80")
    setThemeRealisations("night")
  }
}

  return (
    <>
      <div className="App flex  flex-col h-min-screen" data-theme={`${theme}`}>
        {/* <Test /> */}
        <button onClick={() => setThemes()} className="overflow-hidden w-fit fixed bottom-2 right-2 z-50 bg-gray-800 text-white  rounded-full shadow-lg transition-all duration-500 hover:scale-106 hover:w-15 border-gray-700 border-1 ">

          {theme === "garden" ? (
            <motion.div
              key={theme}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              className="py-[5px] px-2 rounded-full relative w-full flex flex-row justify-start bg-gray-500"><Sun size={18} /></motion.div>)
            : (
              <motion.div
                key={theme}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeIn" }}
                className="py-[5px] px-2 rounded-full bg-black relative flex flex-row w-full justify-end"><Moon size={18} /></motion.div>)}

        </button>

        <Navbar translateY={navbarTranslateY} />

        <div className="relative isolate " ref={homeRef}>
          <Hero />

          <About themeAbout={themeAbout} sepColor={sepColor} textCol ={textCol}/>

        </div>


        <Services waveColor={waveColor} textCol={textCol} theme={theme} cardCol={cardCol}/>
        <Realisations themeRealisations={themeRealisations} cardColor={cardColor} />
        <ContactForm/>
        <Footer />
      </div>
    </>
  );
}
