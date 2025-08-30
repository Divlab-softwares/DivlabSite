
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from './Spotlight';
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from "@/app/Components/lightswind/collapsible";
import { Button } from "@/app/Components/lightswind/button";
import { ChevronDown } from "lucide-react";
import MyCarousel from "./MyCarousel";
import { useMediaQuery } from "react-responsive"
import Aos from "aos";
import "aos/dist/aos.css";


interface Question {
    id: number;
    value: string;
    answer: string;
    img: string;  // Optional image property as string
}

interface AboutQuestionsProps {
    questions: Question[];
    questionHome: Question;
}





function FAQ({ questions, questionHome }: AboutQuestionsProps) {
    useEffect(() => {
        Aos.init({
            duration: 800,
            once: true,
        });
    });
    const [selected, setSelected] = useState(-1);
    const [openCollapse, setOpenCollapse] = useState(-1);
    const [openId, setOpenId] = useState<string | null>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(openId === id ? null : id)

    }

    const [ind, setInd] = useState(0);

    const isMd = useMediaQuery({ query: "(min-width: 768)" })

    const handleIndexToggle = (id: number) => {

        if (openCollapse == -1) {
            setOpenCollapse(-2);
        }

        if (openIndex === id) {
            setSelected(-1);
            setOpenIndex(null);
            setOpenCollapse(-1);

        } else {
            setSelected(id);
            setOpenIndex(id);

        }


        setInd(id);


    }





    return (


        <div className="flex md:flex-row flex-col-reverse  justify-between text-white w-full">
            <div className="flex" data-aos="fade-right">
                <MyCarousel questions={questions} questionHome={questionHome} index={ind} setIndex={setInd} />
            </div>


            <div className="flex flex-row flex-start h-fit md:pl-4 relative" data-aos="fade-left">
                {/* Colonne des questions */}
                <motion.div
                    className=" flex-row hidden md:flex "
                    animate={{ x: selected != -1 && !isMd ? "-100%" : "0%" }}
                    transition={isMd ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 15 }}>
                    <div className={`flex flex-col  items-center space-y-3 z-1 md:space-y-4 ${selected != -1 ? " md:transform  md:duration-500" : ""}`}>

                        {questions.map((item, index) => (
                            <div key={item.id} className="w-full" onClick={() => handleIndexToggle(index)}>
                                <Collapsible className=" " open={openId === item.id.toString()} onOpenChange={() => handleToggle(item.id.toString())}>

                                    <CollapsibleTrigger asChild className="">
                                        <div className={` flex justify-between shadow-lg  hover:shadow-lg items-center  font-medium rounded-4xl w-full  text-md  ${selected == index ? "bg-gradient-to-br  from-blue-600 to-blue-500 to-gray-900 transform transition-transform duration-300 scale-98 " : "bg-gradient-to-br  from-gray-600 to-gray-900 transform transition-transform duration-300 hover:scale-106"}   `} >
                                            <div className={`  hover:bg-white/10   w-full rounded-4xl px-4 py-2 `}>
                                                {item.value}
                                                <Button variant="perso" size="sm" >

                                                    <ChevronDown className="h-4 w-4 md:rotate-270" />
                                                    <span className="sr-only">Toggle</span>

                                                </Button>

                                            </div>
                                        </div>

                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="block md:hidden  ">

                                        {/* Zone de réponse */}
                                        <motion.div
                                            key={selected}
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 10 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className=" h-60 bg-gradient-to-br  from-gray-700 to-gray-800 rounded-2xl shadow-lg "
                                        >
                                            <SpotlightCard className="custom-spotlight-card whitespace-normal h-full rounded-2xl w-auto" spotlightColor="rgba(0, 17, 255, 0.2)">
                                                <h2 className="text-xl font-bold mb-2">{selected == -1 ? questionHome.value : questions[selected].value}</h2>
                                                <p className="text-gray-200 text-md whitespace-pre-line">{selected == -1 ? questionHome.answer : questions[selected].answer}</p>
                                            </SpotlightCard>
                                        </motion.div>
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>


                        ))}
                        {/* <div className="flex  rounded-4xl border-4 border-info text-black  text-md  bg-white hover:bg-gray-100 flex justify-between w-full items-center  font-medium ">
                            <input type="text" placeholder="Ajoutez votre question/preocupation" className="w-full pl-4 py-3  h-full bg-transparent outline-none" />

                            <button className=" btn bg-gray-100 rounded-r-full hover:bg-gray-300 text-black border-0 h-full  pl-5">
                                <ChevronDown className="h-4 w-4 rotate-270" />
                                <span className="sr-only">Toggle</span>
                            </button>
                        </div> */}




                    </div>
                    <div className=" mx-3 w-3 h-auto flex bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full">

                    </div>
                </motion.div>



                {/*On small screens*/}
                <div className="flex justify-center md:hidden items-center w-full">
                    <div className="flex flex-row  justify-center  w-full ">

                        <div className={`flex flex-col  items-center w-full space-y-3 z-1 md:space-y-4 ${selected != -1 ? " md:transform  md:duration-500" : ""}`}>

                            {questions.map((item, index) => (
                                <div key={item.id} className="w-full " onClick={() => handleIndexToggle(index)}>
                                    <Collapsible className="w-full " open={openId === item.id.toString()} onOpenChange={() => handleToggle(item.id.toString())}>

                                        <CollapsibleTrigger asChild className="">
                                            <div className={` flex justify-between   shadow-lg  hover:shadow-lg items-center  font-medium rounded-4xl text-md  ${selected == index ? "bg-gradient-to-br  from-blue-600 to-blue-500 to-gray-900 transform transition-transform duration-300 scale-98 " : "bg-gradient-to-br  from-gray-600 to-gray-900 transform transition-transform duration-300 hover:scale-106"}   `} >
                                                <div className={`   flex justify-between hover:bg-white/10 items-center pl-4 py-3 w-full h-full rounded-4xl `}>
                                                    {item.value}
                                                    <Button variant="perso" size="sm" >

                                                        <ChevronDown className="h-4 w-4 md:rotate-270" />
                                                        <span className="sr-only">Toggle</span>

                                                    </Button>

                                                </div>
                                            </div>

                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="block md:hidden ">

                                            {/* Zone de réponse */}
                                            <motion.div
                                                key={selected}
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 10 }}
                                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                                className=" h-fit bg-gradient-to-br  from-gray-700 to-gray-800 pl-4 py-3 rounded-2xl shadow-lg "
                                            >
                                                <SpotlightCard className="custom-spotlight-card  h-full rounded-2xl " spotlightColor="rgba(0, 17, 255, 0.2)">
                                                    <h2 className="text-xl font-bold mb-2">{selected == -1 ? questionHome.value : questions[selected].value}</h2>
                                                    <p className="text-gray-300">{selected == -1 ? questionHome.answer : questions[selected].answer}</p>
                                                </SpotlightCard>
                                            </motion.div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>


                            ))}
                            <div className="flex  rounded-4xl border-4 border-info text-black  text-md  bg-white hover:bg-gray-100 flex justify-between w-full items-center  font-medium ">
                                <input type="text" placeholder="Ajoutez votre question/preocupation" className="w-full pl-4 py-3  h-full bg-transparent outline-none" />

                                <button className=" btn bg-gray-100 rounded-r-full hover:bg-gray-300 text-black border-0 h-full  pl-5">
                                    <ChevronDown className="h-4 w-4 rotate-270" />
                                    <span className="sr-only">Toggle</span>
                                </button>
                            </div>




                        </div>
                        <div className=" mx-3 w-5 md:w-2 h-auto flex bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full">

                        </div>
                    </div>
                </div>
                


                {/* Zone de réponse */}
                <AnimatePresence>
                    {(selected != -1) && (

                        <motion.div
                            className={`absolute h-fit w-full -z-0 md:block hidden`}
                            // initial={{ x: openCollapse == -5 ? "0%" : (openCollapse == -2 ? "50%" : "0%"), opacity: openCollapse == -5 ? 1 : (openCollapse == -2 ? 0 : 1) }}
                            // animate={{ x: openCollapse == -5 ? "50%" : (openCollapse == -2 ? "0%" : "0%"), opacity: openCollapse == -5 ? 0 : (openCollapse == -2 ? 1 : 1) }}
                            initial={{ x: "-5%", opacity: 0 }}
                            animate={{ x: "0%", opacity: 1 }}
                            exit={{ opacity: 0, x: "-10%" }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}>

                            <div className=" w-full h-150  ">
                                <SpotlightCard data-theme="night" className="custom-spotlight-cardrelative  backdrop-blur-md bg-white/5 p-0 relative w-full h-full  rounded-2xl " spotlightColor="rgba(0, 116, 217, 1)">
                                    <AnimatePresence mode="sync">
                                        <motion.div

                                            key={selected}
                                            initial={{ opacity: 0, x: "-10%" }}
                                            animate={{ opacity: 1, x: "0%" }}
                                            exit={{ opacity: 0, x: "-10%" }}
                                            transition={{ type: "spring", stiffness: 70, damping: 15 }}

                                            className={`w-full h-50   rounded-2xl  absolute `}
                                        >
                                            {/* <InteractiveCard > */}
                                            <div className="h-full relative  p-4">
                                                <h2 className="text-2xl font-bold ml-2 mb-3">{selected == -1 ? questionHome.value : questions[selected].value}</h2>
                                                <hr />
                                                <p className={`text-gray-200 text-md p-2 whitespace-pre-wrap `}>{selected == -1 ? questionHome.answer : questions[selected].answer} </p>

                                            </div>


                                            {/* </InteractiveCard> */}
                                        </motion.div>
                                    </AnimatePresence>
                                </SpotlightCard>
                            </div>
                        </motion.div>)}
                </AnimatePresence>
            </div>

        </div >

    );
}


export default FAQ;