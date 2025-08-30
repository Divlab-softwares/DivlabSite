"use client"

import Hero from "@/app/Components/Hero";
import Realisations from "@/app/Components/Realisations";
import About from "@/app/Components/About";
import Navbar from "./Components/Navbar";
// import ContactForm from "./Components/ContactForm";
import { useEffect,useRef, useState } from "react";

import Services from "./Components/Services";
import Footer from "./Components/Footer";

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
  return (
    <>
      <div className="App flex  flex-col h-min-screen">

        <Navbar translateY={navbarTranslateY} />

        <div className="relative isolate " ref={homeRef}>
          <Hero />
          <About/>
          
        </div>


        <Services />
        <Realisations />
{/* <ContactForm/> */}
        <Footer />
      </div>
    </>
  );
}
