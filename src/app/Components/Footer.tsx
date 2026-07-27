import {Facebook, Youtube} from "lucide-react"
import {Instagram} from "lucide-react"
import Link from "next/link";
import Whatsapp from "../../../public/assets/Whatsapp3.png";
import Whatsapp1 from "../../../public/assets/Whatsapp2.svg";

import DIVLABLogo from "../../../public/assets/logo.jpg";

interface Footerprops {
className?: string;
}

const Footer=({ className } : Footerprops)=> {
    return ( 
        <footer className={`footer footer-horizontal footer-center  relative  p-10 ${className}`} id="footer">
            {/* <SmokeyCursor /> */}
            <aside className="flex items-center justify-center flex-col">
                <a href="#home" className="gap-2"><img src={DIVLABLogo.src} alt="" className="w-16 h-16 rounded-full mt-1" />
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
                        <img src={Whatsapp1.src} alt="" className="w-7 h-7  mr-2" />
                    </Link>
                </div>
                
            </nav>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                <Link href="/centre-de-confiance">Centre de confiance</Link>
                <Link href="/cgv">CGV</Link>
                <Link href="/conditions-utilisation">Conditions d’utilisation</Link>
                <Link href="/politique-remboursement">Remboursements</Link>
                <Link href="/privacy-policy">Confidentialité</Link>
                <Link href="/reclamations">Réclamations</Link>
                <Link href="/mentions-legales">Mentions légales</Link>
            </nav>
            
        </footer>
     );
}

export default Footer;
