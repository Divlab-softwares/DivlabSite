"use client"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/app/Components/lightswind/hover-card";

import Link from "next/link"
import { useState } from "react";
import "../globals.css";
import { Button } from "@/app/Components/lightswind/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/app/Components/lightswind/card"
import FormationNavBar from "@/app/Components/FormationNavBar"
import Footer from "../Components/Footer";
import Image from "next/image"
import { motion } from "framer-motion"
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from "@/app/Components/lightswind/collapsible";
import { X } from "lucide-react"
import Title from "@/app/Components/Title";

import StripesBackground from '@/app/Components/lightswind/StripesBackground';
import { OnlineFormations, Websites, IA, design } from '@/app/data.js'



const Formations = () => {

    const [IdOpen, setIdOpen] = useState<number>(-1)

    const [openCollapse, setOpenCollapse] = useState<number>(0)

    const handleOpenCollapse = () => {
        if (openCollapse == 0) {
            setOpenCollapse(1)
        } else {
            setOpenCollapse(0)
        }
    }

    const handleCilck = (id: number) => {
        window.scrollTo(0, 0);
        if (openCollapse == 0) {
            setOpenCollapse(1)
        } else (
            setOpenCollapse(0)
        )

        setIdOpen(id)
    }
    return (
        <article className="flex flex-col h-screen" >
            <FormationNavBar />
            <div className="flex flex-row justify-between  h-9/10 w-full  gap-3   ">

                <div className="flex flex-col w-full md:w-3/4 justify-center  h-full flex-wrap md:flex-nowrap  ">

                    <div className="h-full w-full overflow-auto space-y-4  scroll-smooth">
                        <hr className="my-4" />
                        <u><Title title="FORMATIONS" className="text-4xl pt-2" id="formations" /></u>
                        <div
                            className="flex flex-row justify-center p-3 pt-6 rounded-3xl ml-2 h-auto shadow-[inset_7px_-7px_80px_rgba(0,0,0,0.8),-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2),inset_-7px_7px_20px_rgba(255,255,255,0.3)]" data-theme="dark">

                            <div className="flex flex-row w-full justify-between  items-start p-4 md:space-x-10 space-y-7 flex-wrap md:flex-nowrap " >
                                <div className="md:h-full flex flex-col items-start md:w-1/3 w-full ">
                                    <div className="w-full md:w-full relative h-fit  rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                        <StripesBackground
                                            position="right"
                                            width="w-full"
                                            height="h-full"
                                            opacity="opacity-60"
                                            className='rounded-3xl'
                                        />
                                        <motion.div className="w-auto h-fit flex items-center justify-center rounded-xl"
                                            key={IdOpen}
                                            initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                            animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                            exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                            transition={{ duration: 0.5 }}
                                        >

                                            <img src={IdOpen == -1 ? "/assets/formation.webp" : OnlineFormations[IdOpen].img} alt="Formations en ligne" className=" object-cover md:w-full md:h-auto  w-auto h-50  rounded-xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></img>

                                        </motion.div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 h-auto md:w-2/3 w-full">
                                    <Card className="w-100% relative h-full rounded-4xl flex flex-col border-none  justify-between bg-transparent">
                                        <motion.div
                                            key={IdOpen}
                                            initial={{ opacity: "0%", x: "-10%", y: 0 }}
                                            animate={{ opacity: "100%", x: "0%", y: "0%" }}
                                            exit={{ x: "10%", y: "0%", opacity: "0%", scale: 0.8 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className="h-fit w-full border-x rounded-4xl" >
                                            <CardHeader>
                                                <CardTitle className="text-white text-3xl uppercase"> {IdOpen == -1 ? "FORMATIONS" : OnlineFormations[IdOpen].location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</CardTitle>
                                                <hr />
                                                <CardDescription>
                                                    <span className={`${IdOpen == -1 ? "" : "badge badge-info badge-outline  badge-md mr-2 mt-2  rounded-full"}`}><i> {IdOpen == -1 ? "pdf / videos / images / presentations..." : OnlineFormations[IdOpen].format}</i></span>
                                                    <span className={`${IdOpen == -1 ? "" : (`badge  badge-outline rounded-full badge-md mr-2 mt-2   ${OnlineFormations[IdOpen].type == "premium" ? "badge-accent" : "badge-info"} `)}`}>{IdOpen == -1 ? "" : OnlineFormations[IdOpen].type}  </span></CardDescription>

                                            </CardHeader>
                                            <CardContent className="text-white">

                                                <p>{IdOpen == -1 ? "Devenez le meilleur de vous avec les formations sur mesure et adaptés à la lecture et la compréhension facile." : OnlineFormations[IdOpen].description} </p>
                                            </CardContent>
                                        </motion.div>
                                        <CardFooter className="flex md:flex-row flex-col space-y-2 md:space-y-0 items-align md:space-x-2 w-full mt-5">
                                            {IdOpen === -1 ? (
                                                <Button onClick={() => handleOpenCollapse()} className="text-white rounded-xl w-auto md:w-2/3 bg-blue-500  shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0">
                                                    <a className="w-full h-full p-2 ">Lister les formations</a></Button>) : (OnlineFormations[IdOpen].type != "premium" ? (<Button className="text-white rounded-xl w-full md:w-2/3 bg-blue-500  shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0 ">
                                                        <a href={OnlineFormations[IdOpen].location} download={OnlineFormations[IdOpen].location.split("/").pop()} className="w-full h-full p-2">Telecharger</a></Button>) : (<Button className="text-white rounded-xl w-auto md:w-2/3 bg-blue-500  shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1  p-0">
                                                            <Link href="https://layidgpo.mychariow.com" target="_blank" className="w-full h-full p-2">Acheter {"( via chariow )"}</Link></Button>)
                                            )}


                                            <Button className="text-white rounded-xl md:w-1/3 w-fit bg-green-500   shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1 overflow-hidden p-0">
                                                <a href="whatsapp://send?phone=237652509674 " className="w-full h-full p-2">Discuter sur WhatsApp</a></Button>

                                        </CardFooter>
                                    </Card>

                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 md:hidden">
                            <Collapsible open={openCollapse == 1} onOpenChange={() => setOpenCollapse(0)} className=" ">

                                <CollapsibleTrigger asChild className="">


                                </CollapsibleTrigger>
                                <CollapsibleContent className=" ">
                                    <div className=" pt-4  flex flex-col w-full h-auto">
                                        <button onClick={() => { handleOpenCollapse(); handleCilck(-1) }} className="  rounded-full w-10 h-10 bg-black/20 flex items-center justify-center"><X /></button>
                                        <div className="h-auto w-full relative flex flex-row space-y-1 overflow-auto p-2 rounded-xl flex-wrap" data-theme="night">

                                            {OnlineFormations.map((Formations, index) => (
                                                <button onClick={() => { setIdOpen(index) }} key={Formations.id} className="  w-1/2  p-2 rounded-md shadow-[-8px_3px_15px_rgba(0,0,0,0.6)] hover:bg-black/20">
                                                    <Link href="#formations" className=" flex flex-col items-center w-fit h-full ">
                                                        <Image height={80} width={50} src={Formations.img} alt="Formations en ligne" className="object-cover  w-10 h-13  rounded-sm shadow-[-3px_1px_7px_rgba(0,200,255,0.6)] mr-1"></Image>

                                                        <div className="flex flex-col justify-center w-full items-start ">
                                                            <p className="text-sm font-bold"><i>{Formations.location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</i></p>
                                                            <span className="text-sm flex flex-row gap-3"><i>{Formations.format}</i><i className={`${Formations.type == "premium" ? "text-accent" : "text-info"}`} >{Formations.type}</i></span>
                                                        </div>
                                                    </Link>


                                                </button>
                                            )

                                            )}
                                        </div>
                                    </div>

                                </CollapsibleContent>
                            </Collapsible>
                            {/* commentaire */}
                            <div className="  rounded-md shadow-[-8px_3px_15px_rgba(0,0,0,0.6)] h-fit ">

                            </div>
                        </div>
                        <div className="flex flex-row   md:p-4 space-y-4 ">
                            <HoverCard
                                openDelay={100}
                                closeDelay={0}
                                NewClassName="w-full h-fit "
                            >
                                <HoverCardTrigger asChild >
                                    <div
                                        className="flex flex-row relative h-fit  flex-wrap md:flex-nowrap justify-center w-full  rounded-3xl p-4 md:space-x-20 md:ml-2  shadow-[inset_7px_-7px_80px_rgba(0,0,0,0.8),-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2),inset_-7px_7px_20px_rgba(255,255,255,0.3)]"
                                    >
                                        <StripesBackground
                                            position="left"
                                            width="w-full"
                                            height="h-full"
                                            opacity="opacity-40"
                                            className='rounded-3xl'
                                        />
                                        <StripesBackground
                                            position="left"
                                            width="w-full"
                                            height="h-full"
                                            opacity="opacity-40"
                                            className='rounded-3xl '
                                            deg={90}
                                        />
                                        <div className="w-full md:w-1/3 relative h-auto hidden md:flex items-center justify-center rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)] -z-1">
                                            <Image height={40} width={50} src="/assets/indisponible.svg" alt="Formations Presentiel" className=" object-cover w-full h-full shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] rounded-3xl -z-2"></Image>

                                        </div>

                                        <div className="flex flex-col gap-3 h-fit md:w-2/3 w-full ">
                                            <Card className="w-100% relative h-full rounded-4xl border-none flex flex-col justify-center">
                                                <CardHeader>
                                                    <CardTitle className="text-white text-3xl uppercase"> Formation en Ligne</CardTitle>
                                                    <hr />
                                                    <CardDescription><i><b>indisponible pour le moment...</b></i></CardDescription>

                                                </CardHeader>
                                                <CardContent className="text-white">

                                                    <p><i><b>indisponible pour le moment...</b></i></p>
                                                </CardContent>
                                                <CardFooter className="flex flex-row  space-x-2">

                                                    <Button className="-z-2 text-white rounded-xl w-auto md:w-2/3 bg-blue-500  shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1">
                                                        Veuillez patienter...</Button>
                                                    <Button className="text-white rounded-xl w-auto  md:w-1/3 bg-green-500  overflow-hidden  shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1">
                                                        <a href="whatsapp://send?phone=237652509674" className="w-full h-full">Discuter sur WhatsApp</a></Button>

                                                </CardFooter>
                                            </Card>

                                        </div>
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent className=" p-2">
                                    <h4 className="font-medium">Bientot disponible !</h4>
                                </HoverCardContent>
                            </HoverCard>

                        </div>

                        <div className="flex flex-row   md:p-4 space-y-4 ">
                            <HoverCard
                                openDelay={100}
                                closeDelay={0}
                                NewClassName="w-full h-fit "
                            >
                                <HoverCardTrigger asChild >
                                    <div
                                        className="flex flex-row relative h-fit  flex-wrap md:flex-nowrap justify-center w-full  rounded-3xl p-4 md:space-x-20 md:ml-2 shadow-[inset_7px_-7px_80px_rgba(0,0,0,0.8),-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2),inset_-7px_7px_20px_rgba(255,255,255,0.3)]"
                                    >
                                        <StripesBackground
                                            position="left"
                                            width="w-full"
                                            height="h-full"
                                            opacity="opacity-40"
                                            className='rounded-3xl'
                                        />
                                        <StripesBackground
                                            position="left"
                                            width="w-full"
                                            height="h-full"
                                            opacity="opacity-40"
                                            className='rounded-3xl'
                                            deg={90}
                                        />
                                        <div className="w-full md:w-1/3 relative h-auto hidden md:flex items-center justify-center rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)] -z-1">
                                            <Image height={40} width={50} src="/assets/indisponible.svg" alt="Formations Presentiel" className=" object-cover w-full h-full shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] rounded-3xl -z-2"></Image>

                                        </div>

                                        <div className="flex flex-col gap-3 h-fit md:w-2/3 w-full ">
                                            <Card className="w-100% relative h-full rounded-4xl border-none flex flex-col justify-center">
                                                <CardHeader>
                                                    <CardTitle className="text-white text-3xl uppercase"> Formation en Presensiel</CardTitle>
                                                    <hr />
                                                    <CardDescription><i><b>indisponible pour le moment...</b></i></CardDescription>

                                                </CardHeader>
                                                <CardContent className="text-white">

                                                    <p><i><b>indisponible pour le moment...</b></i></p>
                                                </CardContent>
                                                <CardFooter className="flex flex-row  space-x-2">

                                                    <Button className="-z-2 text-white rounded-xl w-auto md:w-2/3 bg-blue-500  shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1">
                                                        Veuillez patienter...</Button>
                                                    <Button className="text-white rounded-xl w-auto  md:w-1/3 bg-green-500  overflow-hidden  shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1">
                                                        <a href="whatsapp://send?phone=237652509674" className="w-full h-full">Discuter sur WhatsApp</a></Button>

                                                </CardFooter>
                                            </Card>

                                        </div>
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent className=" p-2">
                                    <h4 className="font-medium">Bientot disponible !</h4>
                                </HoverCardContent>
                            </HoverCard>

                        </div>
                        <u><Title title="SOLUTIONS WEB" className="text-4xl pt-2" id="solutions web" /></u>
                        {Websites.map((site, index) => (
                            <div className="flex flex-row  justify-center rounded-3xl relative p-2 pt-6 my-7 ml-2 shadow-[inset_7px_-7px_80px_rgba(0,0,0,0.8),-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2),inset_-7px_7px_20px_rgba(255,255,255,0.3)] " key={site.id} data-theme="dark">
                                <Image height={30} width={30} src="/assets/promo.svg" alt="promo" className="absolute w-30 h-30 top-0 right-10 -rotate-10 animate-zoom z-5"></Image>

                                <div className="flex flex-row w-full justify-between flex-wrap md:flex-nowrap  items-center  p-4 md:space-x-10 space-y-7" >

                                    <div className="w-full md:w-1/3 relative h-50 md:h-100  rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                        <StripesBackground
                                            position="right"
                                            width="w-full"
                                            height="h-full"
                                            opacity="opacity-60"
                                            className='rounded-3xl'
                                        />
                                        <motion.div className="w-full h-full  rounded-3xl border border-info"
                                            key={site.id}
                                            initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                            animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                            exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                            transition={{ duration: 0.5 }}
                                        >

                                            <Image height={500} width={500} src={Websites[index].img} alt="Formations en ligne" className="object-cover w-full h-full rounded-2xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></Image>

                                        </motion.div>
                                    </div>

                                    <div className="flex flex-col md:gap-3 h-auto w-full md:w-2/3 ">
                                        <Card className="w-100% relative h-full rounded-4xl border-none space-y-5  flex flex-col justify-between">
                                            <div className="h-fit w-full border-x rounded-4xl" >
                                                <CardHeader>
                                                    <CardTitle className="text-white text-3xl uppercase"> {Websites[index].value}</CardTitle>
                                                    <hr />
                                                    <CardDescription className="flex flex-col gap-2">
                                                        <span className={`text-xl font-bold  text-white `}> {Websites[index].content}</span>
                                                        <span className={`text-md   text-white `}><u className="font-bold">Delai:</u> {Websites[index].Delai}</span>
                                                    </CardDescription>

                                                </CardHeader>
                                                <CardContent className="text-white text-5xl md:ml-15 relative   font-bold space-y-3">

                                                    <p className="line-through decoration-2 text-color-red  text-red-500 -rotate-7">{Websites[index].prixAv} </p>
                                                    <span className="h-fit flex items-center w-full flex-row justify-center"><p className="text-center  w-fit animate-zoom">{Websites[index].prixAp} </p></span>
                                                </CardContent>
                                            </div>
                                            <CardFooter className="flex flex-row space-x-2 ">

                                                <Button className="text-white rounded-xl w-auto md:w-2/3  bg-green-500   shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0">
                                                    <a href="whatsapp://send?phone=237652509674" className="w-full h-full p-2">Continuer sur whatsapp</a></Button>


                                                <HoverCard
                                                    openDelay={100}
                                                    closeDelay={0}
                                                    NewClassName="text-white rounded-xl w-auto md:w-1/3 bg-blue-500  relative shadow-4xl  transition-transform duration-400 hover:scale-99  "
                                                >
                                                    <HoverCardTrigger asChild>
                                                        <Button className="w-full h-full p-0">
                                                            <a className="w-full h-full p-2">Ajouter au panier</a>
                                                            <StripesBackground
                                                                position="right"
                                                                width="w-full"
                                                                height="h-full"
                                                                opacity="opacity-80"
                                                                className='rounded-xl'
                                                            />

                                                        </Button>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className=" p-2">
                                                        <h4 className="font-medium">Bientot !</h4>
                                                    </HoverCardContent>
                                                </HoverCard>


                                            </CardFooter>
                                        </Card>

                                    </div>
                                </div>

                            </div>
                        ))}

                        <u><Title title="INTELLIGENCE ARTIFFICIELLE" className="text-4xl pt-2" id="ia" /></u>
                        {IA.map((ia, index) => (
                            <div className="flex flex-row justify-center rounded-3xl relative p-2 pt-6 ml-2 shadow-[inset_7px_-7px_80px_rgba(0,0,0,0.8),-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2),inset_-7px_7px_20px_rgba(255,255,255,0.3)]  " key={ia.id} data-theme="dark">

                                <div

                                    className="flex flex-row w-full justify-between items-center flex-wrap md:flex-nowrap p-4 space-x-10 space-y-5 md:space-y-0 "
                                >
                                    <div className="w-full md:w-1/3 relative  md:h-100 h-50 rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                        <StripesBackground
                                            position="right"
                                            width="w-full"
                                            height="h-full"
                                            opacity="opacity-60"
                                            className='rounded-3xl'
                                        />
                                        <motion.div className="w-full h-full  rounded-3xl border border-info"
                                            key={ia.id}
                                            initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                            animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                            exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                            transition={{ duration: 0.5 }}
                                        >

                                            <Image height={500} width={500} src={IA[index].img} alt="Formations en ligne" className="object-cover w-full h-full rounded-2xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></Image>

                                        </motion.div>
                                    </div>

                                    <div className="flex flex-col gap-4 h-auto w-full md:w-2/3 ">
                                        <Card className="w-100% relative h-full rounded-4xl border-none  flex flex-col space-y-5 justify-between">
                                            <div className="h-fit w-full border-x rounded-4xl" >
                                                <CardHeader>
                                                    <CardTitle className="text-white  font-bold text-3xl uppercase"> {IA[index].value}</CardTitle>
                                                    <hr />
                                                    <CardDescription className="flex flex-col gap-2">
                                                        <span className={`text-xl font-medium  text-white `}> {IA[index].content}</span>
                                                        <span className={`text-md   text-white `}><u className="font-medium">Delai:</u> {IA[index].Delai}</span>
                                                    </CardDescription>

                                                </CardHeader>
                                                <CardContent className="text-white text-5xl md:ml-15 relative flex flex-col items-center md:block font-bold space-y-3 md:p-6 p-0 mb-5 md:mb-2">

                                                    <p className="   shadow-full underline decoration-1 decoration-double  decoration-gray-300 rotate-3">{IA[index].prixfcfa} </p>
                                                    <p className="text-center md:ml-8  shadow-full underline decoration-1 decoration-double  decoration-gray-300 -rotate-3">{IA[index].prixeur} </p>
                                                </CardContent>
                                            </div>
                                            <CardFooter className="flex flex-row space-x-2 ">

                                                <Button className="text-white rounded-xl w-auto md:w-2/3  bg-green-500   shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0">
                                                    <a href="whatsapp://send?phone=237652509674" className="w-full h-full p-2">Continuer sur whatsapp</a></Button>


                                                <HoverCard
                                                    openDelay={100}
                                                    closeDelay={0}
                                                    NewClassName="text-white rounded-xl w-auto md:w-1/3 bg-blue-500  relative shadow-4xl  transition-transform duration-400 hover:scale-99  "
                                                >
                                                    <HoverCardTrigger asChild>
                                                        <Button className="w-full h-full p-0">
                                                            <a className="w-full h-full p-2">Ajouter au panier</a>
                                                            <StripesBackground
                                                                position="right"
                                                                width="w-full"
                                                                height="h-full"
                                                                opacity="opacity-80"
                                                                className='rounded-xl'
                                                            />

                                                        </Button>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className=" p-2">
                                                        <h4 className="font-medium">Bientot !</h4>
                                                    </HoverCardContent>
                                                </HoverCard>


                                            </CardFooter>
                                        </Card>

                                    </div>
                                </div>



                            </div>
                        ))}
                        <u><Title title="DESIGN ET CREATIVITE" className="text-4xl pt-2" id="design" /></u>
                        {design.map((des, index) => (
                            <div className="flex flex-row justify-center rounded-3xl relative p-2 pt-6 md:ml-2 shadow-[inset_7px_-7px_80px_rgba(0,0,0,0.8),-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2),inset_-7px_7px_20px_rgba(255,255,255,0.3)]  " key={des.id} data-theme="dark">

                                <div className="flex flex-row w-full justify-between flex-wrap md:flex-nowrap p-4 md:space-x-10 space-y-5 md:space-y-0">

                                    {index == 0 ? (
                                        <div className="w-full md:w-1/3 relative h-fit  rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                            <StripesBackground
                                                position="right"
                                                width="w-full"
                                                height="h-full"
                                                opacity="opacity-60"
                                                className='rounded-3xl'
                                            />
                                            <motion.div className="w-auto h-auto  rounded-3xl border border-info"
                                                key={des.id}
                                                initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                                animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                                exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                                transition={{ duration: 0.5 }}
                                            >

                                                <video autoPlay loop muted playsInline className="  rounded-3xl "><source src={design[index].img} type="video/mp4" /></video>

                                            </motion.div>
                                        </div>
                                    ) :

                                        (
                                            <div className="w-full md:w-1/3 relative md:h-100 h-50 rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                                <StripesBackground
                                                    position="right"
                                                    width="w-full"
                                                    height="h-full"
                                                    opacity="opacity-60"
                                                    className='rounded-3xl'
                                                />
                                                <motion.div className="w-full h-full  rounded-3xl border border-info"
                                                    key={des.id}
                                                    initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                                    animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                                    exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <Image height={500} width={500} src={design[index].img} alt="Formations en ligne" className="object-cover w-full h-full rounded-2xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></Image>
                                                </motion.div>
                                            </div>
                                        )

                                    }

                                    <div className="flex flex-col gap-4 h-auto w-full md:w-2/3 ">
                                        <Card className="w-100% relative h-full rounded-4xl border-none space-y-5  flex flex-col justify-between">
                                            <div className="h-fit w-full border-x rounded-4xl " >
                                                <CardHeader>
                                                    <CardTitle className="text-white text-3xl uppercase"> {design[index].value}</CardTitle>
                                                    <hr />
                                                    <CardDescription className="flex flex-col gap-2">
                                                        <span className={`text-xl font-bold  text-white `}> {design[index].content}</span>
                                                        <span className={`text-md   text-white `}><u className="font-bold">Delai:</u> {design[index].Delai}</span>
                                                    </CardDescription>

                                                </CardHeader>
                                                <CardContent className="text-white text-5xl md:ml-15 relative flex flex-col items-center md:block  font-bold space-y-3 md:p-6 p-0 mb-5 md:mb-2">

                                                    <p className="underline decoration-1 decoration-double  decoration-gray-300 -rotate-3 ">{design[index].prixeur} </p>
                                                    <p className="text-center md:ml-8 underline decoration-1 decoration-double  decoration-gray-300 rotate-3 ">{design[index].prixfcfa} </p>
                                                </CardContent>
                                            </div>
                                            <CardFooter className="flex flex-row space-x-2">

                                                <Button className="text-white rounded-xl w-auto md:w-2/3  bg-green-500   shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0">
                                                    <a href="whatsapp://send?phone=237652509674" className="w-full h-full p-2">Continuer sur whatsapp</a></Button>


                                                <HoverCard
                                                    openDelay={100}
                                                    closeDelay={0}
                                                    NewClassName="text-white rounded-xl w-auto md:w-1/3 bg-blue-500  relative shadow-4xl  transition-transform duration-400 hover:scale-99  "
                                                >
                                                    <HoverCardTrigger asChild>
                                                        <Button className="w-full h-full p-0">
                                                            <a className="w-full h-full p-2">Ajouter au panier</a>
                                                            <StripesBackground
                                                                position="right"
                                                                width="w-full"
                                                                height="h-full"
                                                                opacity="opacity-80"
                                                                className='rounded-xl'
                                                            />

                                                        </Button>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className=" px-2 p-2 w-fit">
                                                        <h4 className="font-medium">Bientot !</h4>
                                                    </HoverCardContent>
                                                </HoverCard>


                                            </CardFooter>
                                        </Card>

                                    </div>
                                </div>



                            </div>
                        ))}
                        <Footer />
                    </div>

                </div>
                <div className="md:flex hidden flex-row w-1/4   items-center justify-between space-x-3  pb-5 h-full rounded-sm shadow-[-8px_3px_15px_rgba(0,0,0,0.6),inset_8px_-3px_15px_rgba(0,0,0,0.3),inset_-8px_3px_30px_rgba(255,255,255,0.1)] bg-backdrop-blur  " data-theme="abyss">

                    <div className="flex flex-col  space-y-1 w-full  pt-0 h-full px-2">

                        <div className="h-[12%] ">
                            <div className="h-fit rounded-md w-full bg-black/15 p-1 text-sm">
                                <a className="transparent w-full italic h-full text-info " href=" /fichiers/DIVLAB_MODALITES-GENERALES-POUR-LES-DIFFERENTES-OFFRES-DE-DIVLAB.pdf" download="Grille_des_prix_DIVLAB.pdf" >Telecharger la fiche des prix Divlab</a>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold p-2 uppercase  ">Formations </h1>
                                <hr />
                            </div>
                        </div>
                        <div className="h-[88%] w-full " data-theme="night">

                            <div className="h-full " >
                                <Collapsible open={openCollapse == 1} onOpenChange={() => setOpenCollapse(0)} className=" h-full ">

                                    <CollapsibleTrigger asChild >
                                        <button onClick={() => handleCilck(-1)} className="h-2/14  w-full flex flex-row p-[3px] border-y border-gray space-x-2 rounded-md items-center " data-theme="abyss">
                                            <Image height={80} width={50} src="/assets/ImgCarousel/1.jpg" alt="Formations en ligne" className="object-cover rounded-md w-7 h-10 border-info shadow-[-2px_3px_3px_rgba(0,200,255,0.6)] "></Image>
                                            <div className="flex flex-col  justify-center items-center  ">
                                                <h1 className="text-xl font-bold">Formations </h1>
                                                <span className="text-sm"><i>pdf / e-books / videos / presentations...</i></span>
                                            </div>
                                        </button>

                                    </CollapsibleTrigger>
                                    <div className="h-12/14  overflow-auto w-full">
                                        <CollapsibleContent className=" w-fit ">
                                            <div className="  flex flex-row justify-center w-full   ">
                                                <div className="h-auto w-[2px] bg-white ">

                                                </div>
                                                <div className=" flex flex-col space-y-1  py-2 rounded-xl  h-full " >
                                                    {OnlineFormations.map((Formations, index) => (
                                                        <button onClick={() => { setIdOpen(index) }} key={Formations.id} className="flex flex-row  w-fit space-x-2 p-2 rounded-md shadow-[inset_8px_3px_15px_rgba(0,0,0,0.6)] hover:bg-black/20">
                                                            <Link href="#formations" className=" flex flex-row justify-center items-center ml-2 w-200 h-full ">
                                                                <Image height={80} width={50} src={Formations.img} alt="Formations en ligne" className="object-cover  w-9 h-12  rounded-sm shadow-[-3px_1px_7px_rgba(0,200,255,0.6)] mr-1"></Image>

                                                                <div className="flex flex-col justify-center w-full items-start ">
                                                                    <p className="text-md font-bold"><i>{Formations.location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</i></p>
                                                                    <span className="text-sm flex flex-row gap-3"><i>{Formations.format}</i><i className={`${Formations.type == "premium" ? "text-accent" : "text-info"}`} >{Formations.type}</i></span>
                                                                </div>
                                                            </Link>


                                                        </button>
                                                    )

                                                    )}
                                                </div>
                                            </div>

                                        </CollapsibleContent>
                                    </div>



                                </Collapsible>
                                {/* commentaire */}
                                <div className="  rounded-md shadow-[-8px_3px_15px_rgba(0,0,0,0.6)] h-fit ">

                                </div>
                            </div>

                        </div>

                    </div>



                </div>
            </div>
        </article>

    );
}

export default Formations;