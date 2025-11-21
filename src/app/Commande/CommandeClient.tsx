// Updated Commande.tsx with form added inside CardDescription
// Note: Structure preserved, only additions inside CardDescription and small helpers.

"use client";

import { AnimatePresence, motion } from "motion/react";
import FormationNavBar from "../Components/FormationNavBar";
import Footer1 from "../Components/Footer";
import Title from "../Components/Title";
import { BorderBeam } from "../Components/lightswind/border-beam";
import StripesBackground from "../Components/lightswind/StripesBackground";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../Components/lightswind/card";
import { Button } from "../Components/lightswind/button";
import { Website, IA, design, Templates, plans } from '@/app/data_restructured.js';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Cross, Moon, Sun, X } from "lucide-react";
// import { Button } from "@/app/Components/lightswind/button"
import Image from "next/image"
// import Link from "next/link"
import TextScrollMarquee from '@/app/Components/lightswind/TextScrollMarquee';
import { ChevronLeft } from "lucide-react"
import PaymentNotifications from "../Components/PaymentNotifications";
// import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import CountrySelect from "../Components/CountrySelect"

import Link from "next/link";
import DivlabSpaceLogin from "../Components/DivlabSpaceLogin";
import DivlabSpaceSignUp from "../Components/DivlabSpaceSignUp";
import { signOut } from "next-auth/react";
import TemplateCarousel from "../Components/TemplateCarousel";
import { Input } from "../Components/lightswind/input";
import { ShineButton } from "../Components/lightswind/shine-button";
import { TopLoader } from "../Components/lightswind/top-loader";


interface CommandePageProps {
    searchParams: Record<string, string | string[] | undefined>;
}

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface SignResult {
    data: FormData[];
    message: string;
    status: "success" | "failed";
}

const Commande = (props: CommandePageProps) => {

    const router = useRouter();
    const [command, setCommand] = useState({ title: "", content: "", img: "", prixAp: "", delai: "" });

    const cmd = { title: "", content: "", img: "", prixAp: "", delai: "" };
    const sp = useSearchParams();
    const commandId = sp.get("commandId");
    const commandType = sp.get("commandType");
    const sessionName = sp.get("sessionName");
    const sessionEmail = sp.get("sessionEmail");

    const [commandInited, setCommandInited] = useState(false);
    const [subscriptionInited, setSubscriptionInited] = useState(false);

    const [clientName, setClientName] = useState(sessionName);
    const [clientEmail, setClientEmail] = useState(sessionEmail);
    const [clientCountry, setClientCountry] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientDesc, setClientDesc] = useState("");

    const [proposedTemplate, setProposedTemplate] = useState("");
    const [chosenTemplate, setChosenTemplate] = useState("");

    const [country, setCountry] = useState<string>("");

    const [signResult, setSignResult] = useState<SignResult | null>(null);
    /* multiples notifications */

    const [notifications, setNotifications] = useState<
        { id: string; message: string; type: 'success' | 'failed' | 'cancelled'; date: number }[]
    >([]);

    function addNotification(message: string, type: 'success' | 'failed' | 'cancelled', date: number) {
        const newNotif = { id: uuidv4(), message, type, date };
        setNotifications((prev) => [...prev, newNotif]);
    }

    function removeNotification(id: string) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));

    }

    const isPortfolio = command.title.toLowerCase().includes("portfolio");

    useEffect(() => {
        if (commandType === "Website") {
            const found = Website.find((cmd) => cmd.id.toString() === commandId?.toString());
            setCommand(found ? { title: found.value, content: found.content, img: found.img, prixAp: found.prixAp, delai: found.Delai } : cmd);
            if (!found) router.replace("/404");
        } else if (commandType === "IA") {
            const found = IA.find((cmd) => cmd.id.toString() === commandId?.toString());
            setCommand(found ? { title: found.value, content: found.content, img: found.img, prixAp: found.prixfcfa, delai: found.Delai } : cmd);
            if (!found) router.replace("/404");
        } else if (commandType === "Design") {
            const found = design.find((cmd) => cmd.id.toString() === commandId?.toString());
            setCommand(found ? { title: found.value, content: found.content, img: found.img, prixAp: found.prixfcfa, delai: found.Delai } : cmd);
            if (!found) router.replace("/404");
        } else {
            router.replace("/404");
        }
    }, []);

    const [signOutVal, setSignOutVal] = useState<number | undefined>(undefined);
    const [sign, setSign] = useState<number | undefined>(undefined);
    const [theme, setTheme] = useState("garden");
    const setThemes = () => setTheme(theme === "dark" ? "garden" : "dark");
    const [loading, setLoading] = useState(false)




    async function submitForm({ budget, projectType }: { budget?: string | number; projectType?: string | null }) {

        setCommandInited(false);
        const template = proposedTemplate === "" ? chosenTemplate : proposedTemplate;

        if (clientName == "" || clientEmail == "") {
            addNotification("verifiez votre Email et votre nom", "failed", Date.now());
            return
        }

        if (clientCountry == "") {
            addNotification("Renseignez votre pays !", "failed", Date.now());
            return
        }

        if (clientPhone == "") {
            addNotification("Renseignez votre contact !", "failed", Date.now());
            return
        }


        setLoading(true)

        const res = await fetch("/api/orders/initOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                command_id: commandId,
                name: clientName,
                contact: clientPhone,
                email: clientEmail,
                country: clientCountry,
                projectType,
                description: clientDesc,
                template,
                budget,
                sessionId: sp.get("session") ?? null,
            }),
        });

        const data = await res.json();
        setLoading(false)
        if (data.success) {
            setCommandInited(true);

            addNotification(data.message, data.success ? "success" : "failed", Date.now());
            // setSuccess(true);
            // setOrderId(data.orderId);

            // setClientName("")
            // setClientEmail("")
            setClientDesc("")
            // setClientCountry("")
            //setProposedTemplate()

        } else {
            // setCommandInited(true);
            alert(data.error);
            addNotification(data.message, data.success ? "success" : "failed", Date.now());

        }

        // Here you would typically handle form submission, e.g., send data to a server
        console.log({ clientName, clientEmail, clientPhone, clientDesc, chosenTemplate, projectType });
        // alert("Commande envoyée !");
    };

    async function submitSubscription({ price, subscriptionId }: { price?: string | number; subscriptionId?: string | null }) {

        if (clientName == "" || clientEmail == "") {
            addNotification("verifiez votre Email et votre nom", "failed", Date.now());
            return
        }

        if (clientCountry == "") {
            addNotification("Renseignez votre pays !", "failed", Date.now());
            return
        }

        if (clientPhone == "") {
            addNotification("Renseignez votre contact !", "failed", Date.now());
            return
        }


        setLoading(true)
        setSubscriptionInited(false);
        const res = await fetch("/api/subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subscription_id: subscriptionId,
                name: clientName,
                contact: clientPhone,
                email: clientEmail,
                country: clientCountry,
                description: clientDesc,
                price: price?.toString(),
                sessionId: sp.get("session") ?? null,
            }),
        });

        const data = await res.json();
        setLoading(false)
        if (data.success) {
            setSubscriptionInited(true);
            addNotification(data.message, data.success ? "success" : "failed", Date.now());
            // setSuccess(true);
            // setOrderId(data.orderId);

            // setClientName("")
            // setClientEmail("")
            setClientDesc("")
            // setClientCountry("")
            //setProposedTemplate()

        } else {
            // setCommandInited(true);
            alert(data.error);
            addNotification(data.message, data.success ? "success" : "failed", Date.now());

        }
    };

    return (
        <div data-theme={theme}>
            <TopLoader isLoading={loading} color="#33C3F0" height={2} />
            <PaymentNotifications
                notifications={notifications}
                removeNotification={removeNotification}
            />
            <button onClick={() => setThemes()} className="overflow-hidden w-fit fixed bottom-2 right-2 z-50 bg-gray-800 text-white rounded-full shadow-lg transition-all duration-500 hover:scale-106 hover:w-15 border-gray-700 border ">
                {theme === "garden" ? (
                    <motion.div key={theme} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} transition={{ duration: 0.3, ease: "easeIn" }} className="py-[5px] px-2 rounded-full relative w-full flex flex-row justify-start bg-gray-500"><Sun size={18} /></motion.div>
                ) : (
                    <motion.div key={theme} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} transition={{ duration: 0.3, ease: "easeIn" }} className="py-[5px] px-2 rounded-full bg-black relative flex flex-row w-full justify-end"><Moon size={18} /></motion.div>
                )}
            </button>
            <nav className="h-15 w-full flex flex-col relative bg-black text-white  py-1">
                <div className="flex justify-between flex-row w-full items-center h-full">
                    <Button className="w-fit h-full flex items-center justify-center p-0  bg-transparent hover:bg-gray-900 transition-all duration-400" >
                        <a
                            href="/Services"
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
                        Initier votre commande
                    </div>

                    <div className="space-x-3 h-full items-center hidden md:flex px-5 mr-6">
                        <a href="#abonnement" className="hover:text-info"><span>Abonnement </span></a>
                        <div className=" h-1/2 md:h-full rounded-xl flex flex-row items-center justify-end gap-2  px-2">
                            <div className="flex flex-row items-center justify-center h-full  font-medium">
                                {sessionName || sessionEmail ? (
                                    <div className="flex flex-row items-center justify-center gap-1">
                                        <motion.button
                                            initial={{ scale: 1, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}

                                        // onClick={() => setLoad(l => !l)} className="border-r text-black flex flex-col justify-center items-center hover:bg-black/20 cursor-pointer p-2 rounded-l-xl"
                                        >

                                            {/* <a className="text-sm">Publier votre document</a> */}
                                        </motion.button>
                                        <div className=" text-white  flex flex-col justify-center items-end  hover:bg-black/20 cursor-pointer px-2  border-l" onClick={() => setSign(prev => (prev === -1 ? undefined : -1))}>
                                            <p className="font-bold text-xd">{sessionName}</p>
                                            <p className="text-sm">{sessionEmail}</p>
                                        </div>

                                    </div>
                                ) : (
                                    <div className="h-full flex flex-row items-center justify-center gap-2 text-white">

                                        <button className={`text-bold cursor-pointer ${sign == 1 ? "bg-blue-700 " : "hover:bg-blue-300"}    border font-bold rounded-xl h-full text-sm px-2`} onClick={() => { setSign(prev => (prev === 1 ? undefined : 1)) }} >Se connecter</button>
                                        <span> | </span>
                                        <button className={`text-bold cursor-pointer ${sign == 0 ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700"}   font-bold rounded-xl h-full text-sm px-2`} onClick={() => { setSign(prev => (prev === 0 ? undefined : 0)) }}>S'inscrire</button>
                                    </div>
                                )}

                            </div>

                            <div className=" h-full w-10">
                                {/* <Link href="#formations" className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold shadow-xl"><img src={!session?.user?.image ? UserProfile.src : session.user?.image} alt="" className="w-10 h-10 rounded-full " /></Link> */}
                            </div>
                        </div>

                        <AnimatePresence>
                            {sign == 1 && (
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="w-100 h-fit rounded-xl  flex flex-col gap-5 items-center justify-center fixed right-6 md:top-33 top-50 z-50">
                                    <DivlabSpaceLogin setSign={setSign} setSignResult={setSignResult} />
                                </motion.div >
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {sign == 0 && (
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="w-100 h-fit rounded-2xl bg-yellow-600 flex flex-col gap-5 items-center justify-center fixed right-6 md:top-33 top-50 z-50">
                                    <DivlabSpaceSignUp setSignResult={setSignResult} setSign={setSign} />

                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {sign == -1 && (
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="text-black w-100 h-50 rounded-xl bg-white/90 flex flex-col gap-5 items-center justify-center fixed right-6 md:top-15 top-50 z-50">
                                    <Button disabled={signOutVal == 2} onClick={() => { setSignOutVal(2); signOut({ callbackUrl: '/Services' }) }} className="cursor-pointer bg-red-500 hover:bg-red-600">{signOutVal === 2 ? 'Chargement, veuillez patienter...' : 'Se déconnecter'}</Button>
                                </motion.div >
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </nav>
            <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex flex-row justify-between h-82/100 md:h-85/100 w-full gap-3 ">

                    <div className="flex flex-col md:w-full w-full transition-all duration-300 h-full flex-wrap md:flex-nowrap">
                        <div className="h-full w-full overflow-hidden space-y-4 scroll-smooth">
                            {/* <hr className="mb-4" /> */}
                            <u><Title title="Formulaire de validation" className="text-4xl pt-2 mt-8" id="formations" /></u>

                            <div className="min-h-155 transition-all duration-300 ease-in-out flex flex-row justify-center p-3 pt-6 rounded-3xl ">
                                <div className="flex flex-row relative w-full justify-between items-start p-4 md:space-x-10 space-y-7 flex-wrap md:flex-nowrap rounded-3xl mx-2" >

                                    <BorderBeam size={20} duration={5.5} delay={0} colorFrom="#0785ce" colorTo="#0785ce" reverse={false} initialOffset={0} borderThickness={5} opacity={1} glowIntensity={8} beamBorderRadius={45} pauseOnHover={false} speedMultiplier={1.1} />

                                    <div className="md:h-full flex flex-col items-start md:w-1/3 w-full ">
                                        <div className="flex flex-col md:block items-center w-full relative h-fit rounded-xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                            <StripesBackground position="right" width="w-full" height="h-full" opacity="opacity-60" className='rounded-xl' />
                                            <motion.div className="w-full h-full  rounded-3xl md:border border-info md:translate-x-[6%] md:-translate-y-[6%] hover:translate-x-[0%] md:hover:translate-x-[8%] hover:translate-y-[0%] md:hover:-translate-y-[7%] hover:scale-104 md:hover:scale-100 transition-all duration-400"
                                                initial={{ opacity: "0%", scale: 0.8 }}
                                                animate={{ opacity: "100%", scale: 1 }}
                                                exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                                transition={{ duration: 0.5 }}
                                            >

                                                <Image height={500} width={500} src={command.img} alt="Command image" className="transition-all md:transition-none translate-x-[0%] translate-y-[0%] object-cover w-full h-full rounded-2xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></Image>

                                            </motion.div>
                                            {/* <motion.div className="w-auto h-full md:h-fit flex items-center justify-center rounded-xl hover:scale-104 transition-all duration-400" initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }} animate={{ opacity: "100%", x: "5%", y: "-5%", scale: 1 }} exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }} transition={{ duration: 0.5 }}>
                                                <img src={command.img} alt="Commande image" className="transition-all duration-400 object-cover md:w-full md:h-auto w-auto h-80 rounded-xl hover:shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]" />
                                            </motion.div> */}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 h-auto md:w-2/3 w-full">
                                        <Card className="w-100% relative h-full rounded-4xl flex flex-col border-none justify-between items-center bg-transparent">
                                            <motion.div initial={{ opacity: "0%", x: "-10%", y: 0 }} animate={{ opacity: "100%", x: "0%", y: "0%" }} exit={{ x: "10%", y: "0%", opacity: "0%", scale: 0.8 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="h-fit w-full rounded-4xl">

                                                <CardHeader>
                                                    <CardTitle className=" text-3xl whitespace-pre-wrap">{command.title}</CardTitle>
                                                    <hr />

                                                    {/* FORMULAIRE INSÉRÉ ICI */}
                                                    <CardDescription className="flex flex-col gap-4 pt-4">
                                                        <div className="flex flex-col gap-2">
                                                            <p className="flex md:flex-row flex-wrap gap-2 items-center">
                                                                <span className="font-bold text-xl">Prix: ±{command.prixAp}</span>
                                                                <Link href="/cgv#politique_prix" target="_blank" className="text-blue-500 text-sm hover:text-blue-600"><u>savoir plus sur les prix chez divlab?</u></Link>
                                                            </p>
                                                            <p className="mt-3">{command.delai}</p>
                                                            <p>{command.content}</p>
                                                        </div>

                                                        <p>Veuillez remplir ces informations pour initier votre commande : </p>

                                                        <Input type="text" placeholder="Votre nom & prenom" value={clientName || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientName(e.target.value)} className="input input-bordered w-full" required />
                                                        <Input type="email" placeholder="Votre email" value={clientEmail || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientEmail(e.target.value)} className="input input-bordered w-full" required />
                                                        <CountrySelect
                                                            value={clientCountry}
                                                            onChange={(v: string) => setClientCountry(v)}
                                                            className="select select-bordered w-full"
                                                        />

                                                        <Input type="text" placeholder="Téléphone" value={clientPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientPhone(e.target.value)} className="input input-bordered w-full" required />
                                                        <textarea rows={10} placeholder="Description de la commande ( Optionnel )" value={clientDesc} onChange={(e) => setClientDesc(e.target.value)} className="textarea textarea-bordered w-full"></textarea>

                                                        {isPortfolio && (
                                                            <TemplateCarousel
                                                                templates={Templates}
                                                                onSelect={(value) => setChosenTemplate(value)}
                                                            />

                                                        )}
                                                        {commandType == "Website" && (<div>  <p>Proposez votre template <span className="text-gray-500 text-sm">( Optionnel ) </span>:</p>
                                                            <Input type="text" placeholder="Entrez le lien de votre template" value={proposedTemplate} onChange={(e) => setProposedTemplate(e.target.value)} className="input input-bordered w-full" />
                                                        </div>)}
                                                        <ShineButton
                                                            className={`w-full h-full rounded-xl flex items-center justify-center hover:w-full  shadow-4xl transition-all duration-400 ${commandInited ? "opacity-60 pointer-events-none" : ""}`}
                                                            // disable= {downloading}
                                                            label={`${commandInited ? "Initier une nouvelle commande" : "Initier la commande"} `}
                                                            size="lg"
                                                            aria-disabled={commandInited}
                                                            bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)"
                                                            onClick={() => {
                                                                if (commandInited) return;
                                                                submitForm({ budget: command.prixAp, projectType: commandType });
                                                            }}
                                                        />
                                                        {/* <Button onClick={() => submitForm({ budget: command.prixAp, projectType: commandType })} className="bg-blue-500 text-white rounded-xl p-3 hover:scale-105 transition">Initier la commande</Button> */}

                                                        {commandInited &&

                                                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full gap-2 flex flex-col">
                                                                <p className=" mt-2 text-xl font-bold text-green-600">Commande initiée avec succès! </p>
                                                                <p className="mt-1 text-xl font-bold">Vous allez recevoir un message d'ici quelques minutes sur whatsapp et par mail pour completer votre commande.</p>
                                                                <p className=" mt-2">Vous pouvez en attendant :  </p>

                                                                <div className="w-full flex md:flex-row flex-col justify-between items-center md:space-x-5 md:space-y-0 space-y-2">
                                                                    <Link href="#abonnement" className="w-full"> <Button className=" bg-gray-700 text-white rounded-xl p-3 shadow-xl hover:bg-gray-900 hover:shadow-2xl hover:scale-105 transition w-full  "> Voir nos offres d'abonnement ( pour les sites web )</Button></Link>
                                                                    <Link href={{
                                                                        pathname: "/Services",
                                                                        query: {
                                                                            status: "command innited",
                                                                        },
                                                                    }} className="w-full"> <Button className=" bg-slate-600 text-white rounded-xl p-3 shadow-xl hover:shadow-2xl hover:bg-slate-700 hover:scale-105 transition w-full"> Retour aux services</Button></Link>
                                                                </div>

                                                            </motion.div>

                                                        }


                                                    </CardDescription>
                                                </CardHeader>

                                                <CardContent>

                                                </CardContent>
                                            </motion.div>

                                            <CardFooter className="flex md:flex-row flex-col space-y-8 md:space-y-0 md:space-x-8 w-full mt-5"></CardFooter>
                                        </Card>
                                    </div>

                                </div>
                            </div>


                        </div>
                    </div>

                </motion.div>
            </AnimatePresence>
            <u><Title title="Offres d'abonnement" className="text-4xl pt-5 " id="abonnement" /></u>
            <div className="w-full grid md:grid-cols-3 gap-6 py-10 ">
                {plans.map((plan) => (
                    <Card
                        key={plan.id}
                        className="border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl p-4"
                    >
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-center">{plan.name}</CardTitle>
                        </CardHeader>


                        <CardContent>
                            <div className="text-center mb-4">
                                <span className="text-4xl font-extrabold">{plan.price}</span>
                                <span className="text-lg ml-1">{plan.currency}</span>
                                <p className={`${theme == "garden" ? "text-gray-500" : "text-gray-200"}`}>{plan.duration_days} jours</p>
                            </div>


                            <p className={`${theme == "garden" ? "text-gray-600" : "text-gray-100"} text-gray-600 text-center text-sm mb-6`}>{plan.description}</p>


                            <div className="flex flex-col gap-2 mb-6">
                                {plan.plus.map((p, idx) => (
                                    <div key={idx} className={` ${theme == "garden" ? "text-gray-700" : "text-gray-100"} flex items-center gap-2 text-sm `}>
                                        <Check className="w-4 h-4 text-green-600" /> <span>{p}</span>
                                    </div>
                                ))}

                                {plan.moins.map((m, idx) => (
                                    <div key={idx} className={`${theme == "garden" ? "text-gray-700" : "text-gray-100"} flex items-center gap-2 text-sm `}>
                                        <X className="w-4 h-4 text-red-600" /> <span>{m}</span>
                                    </div>
                                ))}
                            </div>


                            <Button
                                variant="default"
                                className="w-full rounded-xl text-white font-semibold py-2 text-md hover:shadow-2xl hover:bg-blue-400 transition-all duration-400"
                                onClick={() => submitSubscription({ price: plan.price, subscriptionId: plan.id })}
                            >
                                Choisir {plan.name}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Footer1 />
        </div>
    );
};

export default Commande;