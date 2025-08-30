import {Facebook, Youtube} from "lucide-react"
import {Instagram} from "lucide-react"
import Link from "next/link";
import Whatsapp from "../../../public/whatsapp.svg";
import DIVLABLogo from "../../../public/assets/logo.jpg";

interface Footerprops {
className?: string;
}

const Footer=({ className } : Footerprops)=> {
    return ( 
        <footer className={`footer footer-horizontal footer-center  relative text-primary-content p-10 ${className}`} id="footer">
            {/* <SmokeyCursor /> */}
            <aside>
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
                    <Link href=""><Instagram /></Link>
                    {/* <a href="#"><X /></a> */}
                    <Link href=""><Youtube /></Link>
                    <Link href="whatsapp://send?phone=237652509674" target="_blank" className="">
                        <img src={Whatsapp.src} alt="" className="w-6 h-6 rounded-full mr-2" />
                    </Link>
                </div>
                
            </nav>
            
        </footer>
     );
}

export default Footer;
