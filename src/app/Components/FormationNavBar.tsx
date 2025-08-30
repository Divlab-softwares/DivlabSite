"use client"

import { Button } from "@/app/Components/lightswind/button"
import Image from "next/image"
// import Link from "next/link"
import TextScrollMarquee from '@/app/Components/lightswind/TextScrollMarquee';
import { ChevronLeft } from "lucide-react"
import {useRouter} from "next/navigation";
const FormationNavBar = () => {
    const router = useRouter();
    return (
        <nav className="h-1/10 w-full flex flex-col relative bg-black text-white  ">
            <div className="flex justify-between flex-row w-full items-center">
                <Button className="w-fit h-full flex items-center justify-center p-0  bg-transparent" >
                    <a
                        href="/"
                        onClick={() => {
                            if ("/".startsWith("/")) {
                                window.scrollTo(0, 0);
                            }
                        }}
                        className="w-full h-full flex flex-row items-center space-x-2 p-4 justify-center  "
                    >
                        <ChevronLeft /> <span>retour</span>

                    </a>

                </Button>
                <div className="flex flex-row justify-center items-center mx-5 gap-2">
                    <Image height={50} width={50} alt="logo" src="/assets/logo.jpg" className="w-10 h-10 rounded-full"></Image>
                    Services
                </div>
                <div className="space-x-3 h-full items-center hidden md:flex px-4 mr-6">
                    <a href="#formations" className="hover:text-info"><span>Formations </span></a>
                    <a href="#solutions web" className="hover:text-info"><span>Web</span></a>
                    <a href="#ia" className="hover:text-info"><span>IA</span></a>
                    <a href="#design" className="hover:text-info"><span>Design</span></a>
                </div>
            </div>

            <TextScrollMarquee
                baseVelocity={1}
                direction="right"
                className="text-sm font-bold  text-blue-500  w-full"
                scrollDependent={false}
                delay={300}
            >
                🚀 Super promotion actuellement sur la conception des sites web, valable jusqu'au 10 septembre ! Venez en profiter 🚀
            </TextScrollMarquee>
        </nav>
    );
}

export default FormationNavBar;