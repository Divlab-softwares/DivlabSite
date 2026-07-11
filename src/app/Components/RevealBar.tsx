import { Stethoscope, MessageCircle, DownloadIcon, Share } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./lightswind/hover-card";
import { RevealCard, RevealCardContent, RevealCardTrigger } from "./reveal-card";
import Link from "next/link";


interface RevealBarProps  {
    setZoomImage: React.Dispatch<React.SetStateAction<boolean>>;
    handleRequestImage: (id: number) => void ;
    id: number;
    src: string;
}
const RevealBar=({setZoomImage, handleRequestImage, id, src}:RevealBarProps)=> {
    return ( 
        <RevealCard openDelay={100} closeDelay={100} NewClassName=" flex items-end justify-end absolute top-0 left-0 w-full h-full   rounded-md hover:shadow-[inset_0px_-20px_30px_rgba(0,0,0,0.8)]" >
            <RevealCardTrigger asChild >
                <div className={`w-full h-full  absolute  rounded-md hover:shadow-[inset_0px_-20px_30px_rgba(0,0,0,0.8)]`}>

                </div>
            </RevealCardTrigger>
            <RevealCardContent className="w-full " >
                <div className="w-full h-fit flex flex-row justify-between  hover:bg-gradient-to-t from-black via-black/50 to-transparent p-3 text-black hover:text-white ">

                    <HoverCard NewClassName="rounded-full hover:-translate-y-1 transition-all p-2" openDelay={150} closeDelay={150}>
                        <HoverCardTrigger >
                            <div onClick={() => { setZoomImage(true) }} className="w-fit h-fit"><Stethoscope className="w-5 h-5" /></div>
                        </HoverCardTrigger>
                        <HoverCardContent className=" whitespace-nowrap">
                            Aggrandir l'image
                        </HoverCardContent>
                    </HoverCard>

                    <HoverCard NewClassName="rounded-full hover:-translate-y-1 transition-all p-2" openDelay={150} closeDelay={150}>
                        <HoverCardTrigger >
                            <div onClick={() => { handleRequestImage(id) }} className="w-fit h-fit"><MessageCircle className="w-5 h-5" /></div>
                        </HoverCardTrigger>
                        <HoverCardContent className=" whitespace-nowrap">
                            Voir la conversation
                        </HoverCardContent>
                    </HoverCard>


                    <HoverCard NewClassName="rounded-full hover:-translate-y-1 transition-all p-2" openDelay={150} closeDelay={150}>
                        <HoverCardTrigger >
                            <Link  href={src} download={src.split("/").pop()} ><DownloadIcon className="w-5 h-5" /></Link>
                        </HoverCardTrigger>
                        <HoverCardContent className=" whitespace-nowrap">
                            Telecharger l'image
                        </HoverCardContent>
                    </HoverCard>

                    <HoverCard NewClassName="rounded-full hover:-translate-y-1 transition-all p-2" openDelay={150} closeDelay={150} >
                        <HoverCardTrigger >
                            <div onClick={() => { handleRequestImage(id) }} className="w-fit h-fit"><Share className="w-5 h-5" /></div>
                        </HoverCardTrigger>
                        <HoverCardContent className=" whitespace-nowrap">
                            Voir la conversation
                        </HoverCardContent>
                    </HoverCard>
                </div>
            </RevealCardContent>
        </RevealCard>
     );
}

export default RevealBar;


