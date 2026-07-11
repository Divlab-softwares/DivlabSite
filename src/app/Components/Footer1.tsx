import { Facebook, Youtube } from "lucide-react"
import { Instagram } from "lucide-react"
import Link from "next/link";
import Whatsapp from "../../../public/assets/Whatsapp3.png";
import Whatsapp1 from "../../../public/assets/Whatsapp2.svg";

import DIVLABLogo from "../../../public/assets/logo.jpg";

interface Footer1props {
    className?: string;
}

const Footer1 = ({ className }: Footer1props) => {
    return (
        <footer className={`footer sm:footer-horizontal bg-base-200 text-base-content p-20 md:p-10 ${className} relative`} id="footer">
            <aside>
                <a href="#home" className="flex items-center font-bold text-2xl md:text-xl text-white flex-col space-y-3">
                    <img src={DIVLABLogo.src} alt="" className="w-16 h-16 rounded-full  border border-info shadow-[0_5px_20px_rgba(0,200,255,0.6)]" />
                    <p className="font-bold">
                        DIVLAB
                    </p>
                </a>
                <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                <p>Made by DIVLAB</p>
            </aside>
            <nav>
                <div className="grid grid-flow-col gap-4">
                    <Link href="https://www.facebook.com/share/16wnRmhYcd" target="_blank"><Facebook /></Link>
                    {/* <Link href=""><Instagram /></Link>
                    <a href="#"><X /></a> 
                    <Link href=""><Youtube /></Link> */}
                    <Link href="whatsapp://send?phone=237652509674" target="_blank" className="">
                        <img src={Whatsapp.src} alt="" className="w-7 h-7  mr-2" />
                    </Link>
                </div>

            </nav>
            <nav>
                <h6 className="footer-title">Services</h6>
                <a className="link link-hover" href="/Services" target="_blank">Formations</a>
                <a className="link link-hover" href="/Services#design" target="_blank">Design</a>
                <a className="link link-hover" href="/Services#ia" target="_blank">IA (Intelligence artificielle)</a>
                <a className="link link-hover" href="/Services#solutions web" target="_blank">Solutions Web & cloud</a>
            </nav>
            <nav>
                <h6 className="footer-title">Company</h6>
                <a className="link link-hover" href="#about">A propos</a>
                <a className="link link-hover" href="#realisations">Realisations</a>
                <a className="link link-hover" href="#contact">Formulaire de contact</a>
                {/* <a className="link link-hover">Press kit</a> */}
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <a className="link link-hover" href="/cgv" target="_blank">CGV</a>
                <a className="link link-hover" href="/privacy-policy" target="_blank">Privacy policy</a>
                {/* <a className="link link-hover">Cookie policy</a> */}
            </nav>
        </footer>
    );
}

export default Footer1;
