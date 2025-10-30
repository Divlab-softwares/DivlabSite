"use client"
import { useSession, signOut } from "next-auth/react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/app/Components/lightswind/hover-card";

import Link from "next/link"
import { useEffect, useRef, useState } from "react";
import { Button } from "@/app/Components/lightswind/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/app/Components/lightswind/card"
import FormationNavBar from "@/app/Components/FormationNavBar"
import Footer from "../Components/Footer";
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from "@/app/Components/lightswind/collapsible";
import { ChevronLeft, ClosedCaption, Moon, Search, SearchX, Sun, User, UserCircle, X } from "lucide-react"
import Title from "@/app/Components/Title";
import StripesBackground from '@/app/Components/lightswind/StripesBackground';
import { OnlineFormations, Websites, IA, design } from '@/app/data.js'
import PayButton from "../Components/PayButton";
import AnimatedNotification from "../Components/lightswind/animated-notification";
import PaymentNotification from "../Components/PaymentNotification";
import Whatsapp from "../../../public/assets/Whatsapp.svg";
import UserProfile from "../../../public/assets/UserProfile.png";
import { Input } from "../Components/lightswind/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/Components/lightswind/select";
import InteractiveGradient from "@/app/Components/lightswind/interactive-gradient-card";
import DivlabSpaceSignUp from "../Components/DivlabSpaceSignUp";
import DivlabSpaceLogin from "../Components/DivlabSpaceLogin";


const Formations = () => {

    const { data: session } = useSession();
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

    const PromPrice = 2000
    const [IdOpen, setIdOpen] = useState<number>(-1)
    const [changeCourseHeight, setChangeCourseHeight] = useState<number>(0)
    const serviceKey = process.env.MONETBIL_SERVICE_KEY;
    const [openCollapse, setOpenCollapse] = useState<number>(0)
    const [theme, setTheme] = useState("garden")
    const [sideBar, setSideBar] = useState<boolean>(false)
    const [searchData, setSearchData] = useState<string>("")
    const [searchDataValue, setSearchDataValue] = useState<string>("")
    const [themeAbout, setThemeAbout] = useState("sunset")
    const [themeRealisations, setThemeRealisations] = useState("night")
    const [sepColor, setSepColor] = useState("bg-gradient-to-b  to-[#121c22]   from-[#0074D9]/30")
    const [textCol, setTextCol] = useState("text-white")
    const [cardCol, setCardCol] = useState("#151419")
    const [cardColor, setCardColor] = useState("bg-black/80")

    const [sign, setSign] = useState<number | undefined>(undefined);
    const [signOutVal, setSignOutVal] = useState<number | undefined>(undefined);

    const [searchCoursesResult, setSearchCoursesResult] = useState<typeof OnlineFormations>(OnlineFormations.map(course => ({
        ...course,
        _normTitle: normalizeText(course.location)
    })));
    const [searchCoursesResultCurrent, setSearchCoursesResultCurrent] = useState<typeof OnlineFormations>(OnlineFormations)
    type PaymentStatus = { status: 'success' | 'failed' | string; message?: string };
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
    interface NotifState {
        message: string;
        type: 'success' | 'failed' | 'cancelled';
        key: number;
    }
    const [notif, setNotif] = useState<NotifState | null>(null);
    let interval: ReturnType<typeof setInterval> | undefined; // on le déclare pour y avoir accès plus bas
    let hasNotified = false;
    const [isChecking, setIsChecking] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const [displayedFormations, setDisplayedFormations] = useState(searchCoursesResult.slice(startIndex, startIndex + itemsPerPage));
    const totalPages = Math.ceil(searchCoursesResult.length / itemsPerPage);
    const [signResult, setSignResult] = useState<SignResult | null>(null);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const newStartIndex = (page - 1) * itemsPerPage;
        setDisplayedFormations(searchCoursesResult.slice(newStartIndex, newStartIndex + itemsPerPage));
    };

    // Verification du statut de connexion
    useEffect(() => {

        if (signResult?.status === "success") {
            setNotif({
                message: `${signResult.message}, bienvenu ${signResult.data[0]?.name}` || "Operation traitée avec succès",
                type: signResult.status,
                key: Date.now() // <- très important pour réafficher à chaque fois
            });
        } else if (signResult?.status === "failed") {
            setNotif({
                message: signResult.message || "Operation echouee, veuillez réessayer.",
                type: signResult.status,
                key: Date.now() // <- très important pour réafficher à chaque fois
            });
        }

        console.log(signResult)
    }, [signResult]);

    // 🔹 Vérifie si un paiement est en cours au chargement
    useEffect(() => {
        if (!localStorage.getItem('monetbilPaymentInProgress')) {
            localStorage.setItem('monetbilPaymentInProgress', 'false');
        }
        const inProgress = localStorage.getItem('monetbilPaymentInProgress');
        if (inProgress === 'true') startPaymentCheck();
        console.log("test du local", localStorage.getItem('monetbilPaymentInProgress'))
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // 🔹 Fonction appelée quand on lance une transaction
    const startPaymentCheck = () => {
        //if (isChecking) return;// déjà en cours
        if (hasNotified) return; // déjà traité
        localStorage.setItem('monetbilPaymentInProgress', 'true');

        //setIsChecking(true);
        intervalRef.current = setInterval(async () => {
            //if (isChecking) return;
            if (hasNotified) return; // déjà traité
            try {
                const res = await fetch('/api/payment-status');
                const data = await res.json();

                if (data && data.status) {
                    //setIsChecking(false);
                    setPaymentStatus(data);
                    setNotif({
                        message: data.message || "Transaction traitée",
                        type: data.status === "success" ? "success" : "failed",
                        key: Date.now() // <- très important pour réafficher à chaque fois
                    });
                    hasNotified = true; // bloque les suivants

                    // Téléchargement automatique
                    // Utilisation de item_ref pour construire le lien du document
                    const itemRef = data.item_ref;
                    const link = document.createElement('a');
                    link.href = `/fichiers/${itemRef}.pdf`; // ton document sur le serveur
                    link.download = `${itemRef}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);


                    await fetch('/api/clear-payment-status', { method: 'POST' });

                    // 🧹 Arrêter la boucle quand on a une réponse
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    // ✅ Si la transaction est terminée, on arrête la boucle
                    // if (data.status === 'success' || data.status === 'failed' || data.status === 'cancelled') {
                    //     clearInterval(interval);
                    // }
                    localStorage.removeItem('monetbilPaymentInProgress');
                }
                else if (data == null) {
                    hasNotified = true; // bloque les suivants
                    //setIsChecking(false);
                    // setNotif({
                    //     message: "Erreur de transaction, veuillez réessayer.",
                    //     type: "failed",
                    //     key: Date.now() // <- très important pour réafficher à chaque fois
                    // });

                    await fetch('/api/clear-payment-status', { method: 'POST' });
                    // localStorage.removeItem('monetbilPaymentInProgress');
                    //console.log(" localstorage:", localStorage.getItem('monetbilPaymentInProgress'));
                    // console.error("Statut vide:", data);
                    localStorage.removeItem('monetbilPaymentInProgress');
                    // console.log("Nouveau localstorage:", localStorage.getItem('monetbilPaymentInProgress'));
                }
            } catch (err) {
                console.error('Erreur checkStatus:', err);
            }
        }, 3000);
    };


    // 🔹 Ancienne version avec useEffect (remplacée par startPaymentCheck)
    // useEffect(() => {
    //     let interval: ReturnType<typeof setInterval> | undefined; // on le déclare pour y avoir accès plus bas
    //     let hasNotified = false;
    //     const checkStatus = async () => {
    //         try {
    //             if (hasNotified) return; // déjà traité
    //             const res = await fetch('/api/payment-status');
    //             const data = await res.json();

    //             if (data && data.status) {
    //                 hasNotified = true; // bloque les suivants
    //                 setPaymentStatus(data);
    //                 setNotif({
    //                     message: data.message || "Transaction traitée",
    //                     type: data.status === "success" ? "success" : "failed",
    //                     key: Date.now() // <- très important pour réafficher à chaque fois
    //                 });

    //                 await fetch('/api/clear-payment-status', { method: 'POST' });


    //                 // ✅ Si la transaction est terminée, on arrête la boucle
    //                 // if (data.status === 'success' || data.status === 'failed' || data.status === 'cancelled') {
    //                 //     clearInterval(interval);
    //                 // }
    //             } else {
    //                 console.error("Statut vide:", data);
    //             }
    //         } catch (err) {
    //             console.error("Erreur lors de la vérification du statut :", err);
    //             clearInterval(interval); // on arrête aussi si erreur
    //         }
    //     };

    //     // Vérifie toutes les 3 secondes
    //     interval = setInterval(checkStatus, 3000);

    //     // Nettoyage automatique quand le composant est démonté
    //     return () => clearInterval(interval);
    // }, []);

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


    const setThemes = () => {

        if (theme === "dark") {
            setThemeAbout("corporate")
            setTheme("garden")
            setSepColor("bg-gradient-to-b  to-rgba(255,255,255,0.7)   from-[#0074D9]/30")
            setTextCol("text-black")
            setCardCol("#ffffff")
            setCardColor("bg-gray-600")
            setThemeRealisations("corporate")
        } else {
            setThemeAbout("sunset")
            setTheme("dark")
            setSepColor("bg-gradient-to-b  to-[#121c22]   from-[#0074D9]/30")
            setTextCol("text-white")
            setCardCol("#151419")
            setCardColor("bg-black/80")
            setThemeRealisations("night")
        }
    }

    const searchCache = new Map();

    function searchCourses(query: string, courses: typeof OnlineFormations) {
        const key = `${query}`;
        if (searchCache.has(key)) {
            return searchCache.get(key); // renvoie directement le résultat précédent
        }
        const q = normalizeText(query);
        const search = courses.filter(course =>
            normalizeText(course.location).includes(q)
        );
        searchCache.set(key, search); // on garde le résultat en mémoire
        return search;
    }

    const listRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const searchData = e.target.value;
        e.preventDefault();
        setSearchData(e.target.value);
        setOpenCollapse(1);
        // puis on scrolle
        if (!sideBar && listRef.current) {
            listRef.current?.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
                listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100); // petit délai pour laisser le DOM se mettre à jour
        }
        let newBoard = searchCourses(e.target.value, OnlineFormations);
        setSearchCoursesResult(newBoard);
        setDisplayedFormations(newBoard.slice(startIndex, startIndex + itemsPerPage));
        //setSearchDataValue(searchData)

        if (searchData == "") {
            setSearchCoursesResult(OnlineFormations)
        }
    };

    const handleSubmit = () => {
        setOpenCollapse(1)

        if (listRef.current) {
            listRef.current?.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
                listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100); // petit délai pour laisser le DOM se mettre à jour
        }
        setSearchCoursesResult(searchCourses(searchData, OnlineFormations));
        setSearchDataValue(searchData)

    };

    function normalizeText(text: string): string {
        if (!text) return "";

        return text
            // 1️⃣ Met tout en minuscule
            .toLowerCase()

            // 2️⃣ Supprime les accents (é → e, ç → c, etc.)
            .normalize("NFD") // décompose les lettres accentuées
            .replace(/[\u0300-\u036f]/g, "") // enlève les diacritiques

            // 3️⃣ Remplace les tirets, underscores et points par des espaces
            .replace(/[-_.]/g, " ")

            // 4️⃣ Supprime tout caractère non alphanumérique (sauf espaces)
            .replace(/[^\w\s]/g, "")

            // 5️⃣ Remplace les espaces multiples par un seul
            .replace(/\s+/g, " ")

            // 6️⃣ Supprime les espaces en début/fin
            .trim();
    }




    const clearSearch = () => {
        setSearchData("")
        setSearchCoursesResult(OnlineFormations)
        setCurrentPage(1);
        const newStartIndex = (1 - 1) * itemsPerPage;
        setDisplayedFormations(OnlineFormations.slice(newStartIndex, newStartIndex + itemsPerPage));
    };

    interface CategoryScore {
        category: string;
        score: number; // 1 point = 1 mot-clé trouvé
    }

    function categorize(title: string): CategoryScore[] {
        const t = normalizeText(title);

        // On définit un dictionnaire de catégories avec plusieurs mots-clés
        const categories: Record<string, string[]> = {
            "Programmation Python": ["python", "numpy", "pandas"],
            "Développement Web": ["html", "css", "javascript", "react", "nextjs", "vue", "node", "express", "bootstrap", "tailwind"],
            "Développement Mobile": ["android", "flutter", "kotlin", "swift", "react native", "app inventor"],
            "Intelligence Artificielle": [" ia ", "intelligence artificielle", "machine learning", "deep learning", "neural network", "tensorflow", "pytorch", "keras", "yolo", "vision", "facial", "reconnaissance"],
            "Data Science": ["data", "analyse", "statistique", " ml ", "classification", "régression", "big data", "spark", " r ", "excel", "sql", "hadoop"],
            "Cybersécurité": ["cybersecurite", "cyber", "hacking", "pentest", "securite", "cryptographie", "network security"],
            "Réseaux & Systèmes": ["reseaux", "network", "linux", "windows server", "administration", " tcp ", " ip ", "cloud", "docker", "kubernetes"],
            "Bases de Données": ["mysql", "sql", "postgresql", "mongodb", "firebase", "nosql", "base de donnees", "phpmyadmin"],
            "Bureautique": ["excel", "word", "powerpoint", "office", "bureautique"],
            "Mathématiques & Statistiques": ["mathematique", "statistique", "probabilite", "algèbre", "analyse"],
            "Design & Multimédia": ["design", "figma", "photoshop", "illustrator", " ui ", " ux ", "video", "montage", "graphisme"],
            "Entrepreneuriat & Business": ["entrepreneuriat", "startup", "marketing", "gestion", "finance", "business", "vente", "ecommerce"],
            "Formation Académique": ["cours", " td ", " tp ", "examen", "universite", "lycee"],
        };

        const results: CategoryScore[] = [];
        // Parcourt toutes les catégories et détecte les mots-clés correspondants
        for (const [category, keywords] of Object.entries(categories)) {
            let score = 0;
            for (const keyword of keywords) {
                if (t.includes(keyword)) { score += 1; }

            }
            if (score > 0) results.push({ category, score });
        }

        // On trie les catégories les plus pertinentes en premier
        return results.sort((a, b) => b.score - a.score);
    }

    const categorizedCourses = OnlineFormations.map(f => ({
        ...f,
        category: categorize(f.location),
    }));

    // const grouped = OnlineFormations.reduce((acc, f) => {
    //     const cat = categorize(f.location)[0]?.category || "Autres";
    //     acc[cat] = acc[cat] || [];
    //     acc[cat].push(f);
    //     return acc;
    // }, {} as Record<string, typeof OnlineFormations>);

    const [newCategorizedCourses, setNewCategorizedCourses] = useState<typeof categorizedCourses>([]);

    const [typeCategory, setTypeCategory] = useState("tout");
    const [category, setCategory] = useState("tout");
    const [classeCategory, setClasseCategory] = useState("tout");

    const handleSelect = (value: string, categoryType: string) => {
        // const cat = categorize(value)
        let c = category
        let t = typeCategory
        let cl = classeCategory
        switch (categoryType) {
            case "type":
                setTypeCategory(value);
                t = value
                break;
            case "category":
                setCategory(value);
                c = value
                break;
            case "classe":
                setClasseCategory(value);
                cl = value
                break;
        }
        console.log("Categorie:", c, "Type:", t);
        setNewCategorizedCourses(selectCategory(c, t, cl))
    }

    // --- Étape 1 : pré-normalisation (à faire une seule fois, ex: au chargement)
    const preNormalizedCourses = categorizedCourses.map(course => ({
        ...course,
        _normCategory: normalizeText(course.category.map(cat => cat.category).join(" ")),
        _normType: normalizeText(course.format),
        _normClasse: normalizeText(course.type)
    }));

    // --- Étape 2 : fonction avec mémoïsation simple
    const cache = new Map();

    const selectCategory = (category: string, type: string, classe: string) => {
        const key = `${category}|${type}|${classe}`;
        if (cache.has(key)) {
            return cache.get(key); // renvoie directement le résultat précédent
        }


        const normalizedC = normalizeText(category);
        const normalizedT = normalizeText(type);
        const normalizedCL = normalizeText(classe);

        const filtered = preNormalizedCourses.filter(course => {
            const matchCategory = normalizedC === "tout" || course._normCategory.includes(normalizedC);
            const matchType = normalizedT === "tout" || course._normType.includes(normalizedT);
            const matchClasse = normalizedCL === "tout" || course._normClasse.includes(normalizedCL);
            return matchCategory && matchType && matchClasse;
        });

        cache.set(key, filtered); // on garde le résultat en mémoire
        return filtered;
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };



    // Fonction pour générer la liste des pages à afficher
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            // Si peu de pages → tout afficher
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Si beaucoup de pages → ellipses intelligentes
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages
                );
            }
        }

        return pages;
    };

    return (
        <article className="relative flex flex-col h-screen" >
            {notif && (
                <PaymentNotification
                    key={notif.key}
                    message={notif.message}
                    type={notif.type}
                    onClose={() => setNotif(null)} // remet à null pour permettre la réapparition
                />
            )}
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
            <FormationNavBar />
            <div className="w-full 9/100 md:h-6/100 p-1 flex flex-col md:flex-row items-end  md:items-center md:justify-center gap-2" data-theme={`${theme}`}>
                <div className="w-full h-1/2 md:h-full bg-blue-500 gap-1 flex flex-row items-center justify-center p-1 rounded-xl">
                    <Search />
                    <Input onKeyDown={handleKeyDown} type="text" value={searchData} className="w-full h-full bg-white/30" onChange={handleChange} placeholder="Vous cherchez une formation ? ..." data-theme={`${theme}`} />
                    <button className="rounded-full p-1 bg-black/40 hover:bg-white/20" onClick={clearSearch} > <SearchX size={20} /></button>
                    <Button onClick={handleSubmit} type="submit" variant="ServicesSearch" className="h-full" >Rechercher</Button>

                </div>
                <div className="w-100 h-1/2 md:h-full rounded-xl flex flex-row items-center justify-end gap-2  px-2 bg-white/30 " data-theme={`${theme}`}>
                    <div className="flex flex-row items-center justify-center h-full p-1 font-medium gap-1">
                        {session ? (
                            <div className="flex flex-row items-center justify-center gap-1">

                                <div className=" text-black flex flex-col justify-center items-end bg-white/50 hover:bg-black/20 cursor-pointer px-2 rounded-xl" onClick={() => setSign(prev => (prev === -1 ? undefined : -1))}>
                                    <p className="font-bold text-xd">{session.user?.name}</p>
                                    <p className="text-sm">{session.user?.email}</p>
                                </div>

                            </div>
                        ) : (
                            <div>
                                <Button className={`text-bold cursor-pointer ${sign == 1 ? "bg-blue-700" : "bg-blue-500"}  hover:bg-blue-700`} onClick={() => { setSign(prev => (prev === 1 ? undefined : 1)) }}>Se connecter</Button>
                                <span> | </span>
                                <Button className={`text-bold cursor-pointer ${sign == 0 ? "bg-blue-700" : "bg-blue-500"}  hover:bg-blue-700`} onClick={() => { setSign(prev => (prev === 0 ? undefined : 0)) }}>S'inscrire</Button>
                            </div>
                        )}

                    </div>

                    <div className=" h-full w-10">
                        <Link href="#formations" className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold shadow-xl"><img src={!session?.user?.image ? UserProfile.src : session.user?.image} alt="" className="w-10 h-10 rounded-full " /></Link>
                    </div>
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
                        className="text-black w-100 h-50 rounded-xl bg-white/90 flex flex-col gap-5 items-center justify-center fixed right-6 md:top-33 top-50 z-50">
                        <Button disabled={signOutVal == 2} onClick={() => { setSignOutVal(2); signOut() }} className="cursor-pointer">{signOutVal === 2 ? 'Chargement, veuillez patienter...' : 'Se déconnecter'}</Button>
                    </motion.div >
                )}
            </AnimatePresence>
            <div className="flex flex-row justify-between h-82/100 md:h-85/100 w-full  gap-3   " data-theme={`${theme}`}>

                <div className={`flex flex-col w-full  ${sideBar ? "md:w-3/4" : "md:w-full"}  transition-all duration-300 h-full flex-wrap md:flex-nowrap  `}>

                    <div className="h-full w-full overflow-auto space-y-4  scroll-smooth">
                        <hr className="mb-4" />
                        <u><Title title="FORMATIONS" className="text-4xl pt-2" id="formations" /></u>
                        <div
                            className={` ${changeCourseHeight == 1 ? "min-h-155" : "h-fit"} transition-all duration-300 ease-in-out flex flex-row justify-center p-3 pt-6 rounded-3xl ml-2 shadow-[-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2)]`} data-theme={`${theme}`}>

                            <div className="flex flex-row w-full justify-between  items-start p-4 md:space-x-10 space-y-7 flex-wrap md:flex-nowrap " >
                                <div className="md:h-full flex flex-col items-start md:w-1/3 w-full ">
                                    <div className="flex flex-col md:block items-center w-full  relative h-fit rounded-xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                        <StripesBackground
                                            position="right"
                                            width="w-full"
                                            height="h-full"
                                            opacity="opacity-60"
                                            className='rounded-xl'
                                        />
                                        <motion.div className="w-auto h-full md:h-fit flex items-center justify-center rounded-xl"
                                            key={IdOpen}
                                            initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                            animate={{ opacity: "100%", x: "5%", y: "-5%", scale: 1 }}
                                            exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                            transition={{ duration: 0.5 }}
                                        >

                                            <img src={IdOpen == -1 ? "/assets/formation.webp" : searchCoursesResultCurrent[IdOpen].img} alt="Formations en ligne" className="transition-all md:transition-none  -translate-x-[5%] md:-translate-x-[0%] translate-y-[5%] md:-translate-y-[0%] object-cover md:w-full md:h-auto  w-auto h-80  rounded-xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></img>

                                        </motion.div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 h-auto md:w-2/3 w-full">
                                    <Card className="w-100% relative h-full rounded-4xl flex flex-col border-none  justify-between items-center bg-transparent">
                                        <motion.div
                                            key={IdOpen}
                                            initial={{ opacity: "0%", x: "-10%", y: 0 }}
                                            animate={{ opacity: "100%", x: "0%", y: "0%" }}
                                            exit={{ x: "10%", y: "0%", opacity: "0%", scale: 0.8 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className="h-fit w-full border-x rounded-4xl" >
                                            <CardHeader>
                                                <CardTitle className=" text-3xl uppercase whitespace-pre-wrap"> {IdOpen == -1 ? "FORMATIONS" : searchCoursesResultCurrent[IdOpen].location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</CardTitle>
                                                <hr />
                                                <CardDescription className="flex flex-row flex-wrap gap-2 items-center">
                                                    <span className={`${IdOpen == -1 ? "" : "badge badge-info badge-outline  badge-md  mt-2  rounded-full"}`}><i> {IdOpen == -1 ? "pdf / videos / images / presentations..." : searchCoursesResultCurrent[IdOpen].format}</i></span>
                                                    <span className={`${IdOpen == -1 ? "" : (`badge  badge-outline rounded-full badge-md mt-2   ${searchCoursesResultCurrent[IdOpen].type == "premium" ? " text-yellow-400  bg-gray-400 font-semibold" : searchCoursesResultCurrent[IdOpen].type == "sous licence" ? "badge-accent" : "badge-info"} `)}`}>{IdOpen == -1 ? "" : searchCoursesResultCurrent[IdOpen].type}  </span>
                                                    <span className="text-3xl  animate-zoom text-center ml-3 underline decoration-1  decoration-gray-100  ">{IdOpen == -1 ? "" : searchCoursesResultCurrent[IdOpen].type == "premium" ? `${PromPrice} FCFA` : ""}</span>
                                                    <span className="text-red-500 ml-3"> {IdOpen == -1 ? "" : searchCoursesResultCurrent[IdOpen].type == "premium" ? `Prix promotionnel` : ""}</span>
                                                </CardDescription>

                                            </CardHeader>
                                            <CardContent className="">

                                                <p>{IdOpen == -1 ? "Devenez le meilleur de vous avec les formations sur mesure et adaptés à la lecture et la compréhension facile." : searchCoursesResultCurrent[IdOpen].description} </p>
                                            </CardContent>
                                        </motion.div>
                                        <CardFooter className="flex md:flex-row flex-col space-y-8 md:space-y-0 items-align md:space-x-2 w-full mt-5">

                                            {IdOpen === -1 ? (
                                                <Button onClick={() => handleOpenCollapse()} className="h-12 rounded-xl w-auto md:w-2/3 bg-blue-500   transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0 ">
                                                    <a href={`${openCollapse == 1 ? "#formationslist" : "#formations"}`} className="w-full h-full p-2 flex items-center justify-center">{openCollapse == 0 ? "Afficher toutes les formations" : "Fermer les formations"}</a>
                                                </Button>
                                            ) : (searchCoursesResultCurrent[IdOpen].type != "premium" ? (

                                                <Button className="h-12 rounded-xl w-full md:w-2/3 bg-blue-500   transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0 ">
                                                        <a href={searchCoursesResultCurrent[IdOpen].location} download={searchCoursesResultCurrent[IdOpen].location.split("/").pop()} className="w-full h-full flex items-center justify-center hover:w-full  shadow-4xl transition-all duration-400 bg-gradient-to-tr from-white/40 via-cyan-400 to-blue-500 ">Telecharger</a>
                                                </Button>
                                            ) : (
                                                <div className="flex md:flex-row flex-wrap  space-y-2 md:space-y-0 md:space-x-2 w-full  items-center justify-center">
                                                            <Button className="h-12 w-auto md:w-2/3 hover:h-15  hover:w-full  shadow-4xl transition-all duration-400 bg-gradient-to-tr from-white/40 via-yellow-400 to-orange-500 ">
                                                        <Link href="https://layidgpo.mychariow.com" target="_blank" className="w-full h-full p-2 flex items-center justify-center">Acheter {"( via chariow )"}</Link>
                                                    </Button>
                                                    {/* <PayButton amount={PromPrice} item_ref={searchCoursesResultCurrent[IdOpen].location.split("DIVLAB_").pop()?.split(".")[0] ?? ""} startPaymentCheck={startPaymentCheck} /> */}
                                                </div>)
                                            )}




                                            {/* {paymentStatus && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className={`z-50 fixed bottom-3 right-5  p-4 rounded-xl h-20 w-fit text-white font-bold flex items-center justify-center  ${paymentStatus.status === 'success'
                                                            ? 'bg-green-600'
                                                            : 'bg-red-600'
                                                        }`}
                                                >

                                                    {paymentStatus.status === 'success'
                                                        ? '✅ Paiement réussi ! Téléchargement disponible.'
                                                        : `❌ Paiement échoué : ${paymentStatus.message || 'Veuillez réessayer.'}`}
                                                </motion.div>
                                            )} */}



                                            <Button className={`rounded-xl h-fit ${sideBar ? "hover:w-1/2" : "hover:w-1/3"}  w-12 hover:shadow-lg bg-gradient-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold `}>
                                                <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a>
                                            </Button>
                                            
                                        </CardFooter>
                                        {!sideBar && IdOpen != -1 && openCollapse == 0 && (<Button onClick={() => handleOpenCollapse()} className="h-10 rounded-xl w-auto md:w-2/3 bg-blue-500   transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0 ">
                                            <a href={`#formationslist`} className="w-full h-full p-2 flex items-center justify-center">Afficher toutes les formations</a>
                                        </Button>)}
                                    </Card>

                                </div>
                            </div>
                        </div>
                        <div id="category" className="h-90">

                            <div className="flex relative h-full   w-full  rounded-3xl p-2  shadow-[-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2)]" >

                                <Card className="w-full relative h-full rounded-4xl flex flex-col justify-start border-none ">
                                    <CardHeader className="py-2">
                                        <div className="  flex flex-col md:flex-row gap-5 items-center ">
                                            <span className="text-2xl font-bold">Categorisation</span>
                                            <div className="gap-2 flex flex-wrap md:flex-row">
                                                <span className="flex flex-row items-center gap-1">
                                                    <p className="text-md font-medium">Type : </p>
                                                    <Select onValueChange={(value) => {
                                                        handleSelect(value, "type");
                                                    }}>
                                                        <SelectTrigger className="w-[180px] md:w-[200px]">
                                                            <SelectValue placeholder="Choisir le Type..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-black/80">
                                                            <SelectItem value="tout">Tout...</SelectItem>
                                                            <SelectItem value="pdf">Pdf</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </span>
                                                <span className="flex flex-row items-center gap-1">
                                                    <p className="text-md font-medium">Categorie : </p>
                                                    {/* <select onChange={handleselect} >
                                                        <option value="Programmation Python">developpement pyhton</option>
                                                        <option value="Développement Web">dev web</option>
                                                        <option value="IA & Deep Learning">IA</option>
                                                    </select> */}

                                                    <Select onValueChange={(value) => {
                                                        handleSelect(value, "category");
                                                    }}>
                                                        <SelectTrigger className="w-[200px]">
                                                            <SelectValue placeholder="Choisir la categorie..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-black/80">
                                                            <SelectItem value="tout">Tout...</SelectItem>
                                                            <SelectItem value="Programmation Python">Programmation python</SelectItem>
                                                            <SelectItem value="Développement Web">Développement web</SelectItem>
                                                            <SelectItem value="Développement Mobile">Développement mobile</SelectItem>
                                                            <SelectItem value="Intelligence Artificielle">IA & Deep Learning</SelectItem>
                                                            <SelectItem value="Data Science">Data Science</SelectItem>
                                                            <SelectItem value="Cybersécurité">Cybersécurité</SelectItem>
                                                            <SelectItem value="Réseaux & Systèmes">Réseaux &amp; Systèmes</SelectItem>
                                                            <SelectItem value="Bases de Données">Bases de Données</SelectItem>
                                                            <SelectItem value="Bureautique">Bureautique</SelectItem>
                                                            <SelectItem value="Mathématiques & Statistiques">Mathématiques &amp; Statistiques</SelectItem>
                                                            <SelectItem value="Design & Multimédia">Design &amp; Multimédia</SelectItem>
                                                            <SelectItem value="Entrepreneuriat & Business">Entrepreneuriat &amp; Business</SelectItem>
                                                            <SelectItem value="Formation Académique">Formation Académique</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </span>
                                                <span className="flex flex-row items-center gap-1">
                                                    <p className="text-md font-medium">Classe : </p>
                                                    <Select onValueChange={(value) => {
                                                        handleSelect(value, "classe");
                                                    }}>
                                                        <SelectTrigger className="w-[180px] md:w-[200px]">
                                                            <SelectValue placeholder="Choisir la Classe..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-black/80">
                                                            <SelectItem value="tout">Tout...</SelectItem>
                                                            <SelectItem value="free">gratuit</SelectItem>
                                                            <SelectItem value="premium">premium</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </span>
                                            </div>

                                        </div>
                                        <hr />
                                        {newCategorizedCourses.length != 0 && (<CardDescription><i>Recherches en fonction de Categorie = "{category}" , Type = "{typeCategory}" , Classe = "{classeCategory}"</i></CardDescription>)}

                                    </CardHeader>
                                    <CardContent className="h-full w-full py-2 overflow-auto flex items-center justify-start px-2">
                                        <div className="w-fit h-full flex flex-row gap-2">
                                            {newCategorizedCourses.map((course, index) => (
                                                <button key={course.id} onClick={() => { setSearchCoursesResultCurrent(newCategorizedCourses), setIdOpen(index), setChangeCourseHeight(1) }} className="w-40 h-full p-1 rounded-xl shadow-[-8px_2px_15px_rgba(0,0,0,0.6)] hover:bg-black/20">
                                                    <Link href="#formations" className=" flex flex-col items-center h-full overflow-hidden ">
                                                        <Image height={500} width={500} src={course.img} alt="Formations en ligne" className="  w-full h-4/5  rounded-xl shadow-[-3px_1px_7px_rgba(0,200,255,0.6)] mr-1"></Image>

                                                        <div className="flex flex-col w-full items-start whitespace-nowrap p-1">
                                                            <p className="text-sm font-medium"><i>{course.location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</i></p>
                                                            <span className="text-sm flex flex-row gap-3"><i>{course.format}</i><i className={`${course.type == "premium" ? "text-yellow-500" : "text-info"}`} >{course.type}</i></span>
                                                            {/* <span className="text-sm flex flex-col gap-2"><i>{course.category.map((cat) => { return <span key={cat.category} className="text-xs">{cat.category}</span>; })}</i></span> */}
                                                        </div>
                                                    </Link>
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>

                        </div>
                        <div id="formationslist" ref={listRef} className={`${sideBar ? "md:hidden" : ""}  w-full h-auto  rounded-2xl shadow-[inset_7px_-7px_80px_rgba(0,0,0,0.8),-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2),inset_-7px_7px_20px_rgba(255,255,255,0.3)]`} data-theme={`${theme}`}>
                            <Collapsible open={openCollapse == 1} onOpenChange={() => setOpenCollapse(0)} className=" ">

                                <CollapsibleTrigger asChild className="">

                                </CollapsibleTrigger>
                                <CollapsibleContent className=" p-2">
                                    <div className="   flex flex-col w-full h-auto space-y-2">
                                        <Link href="#formations" onClick={() => { handleOpenCollapse(), handleCilck(-1), setChangeCourseHeight(0) }} className=" mb-2 rounded-full w-10 h-10 bg-black/20 hover:bg-blue-500 flex items-center justify-center cursor-pointer">{<X />}</Link>

                                        <motion.div
                                            initial={{ opacity: 0, y: 40 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 40 }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                            className="relative"
                                        >
                                            <div className="h-auto w-full relative flex flex-row space-y-8 p-2 rounded-xl flex-wrap  md:space-x-6 justify-center">
                                                <AnimatePresence mode="popLayout">
                                                    {displayedFormations.map((Formations, index) => (
                                                        // <button onClick={() => { setIdOpen(index) }} key={Formations.id} className="  w-1/2  p-2 rounded-md shadow-[-8px_3px_15px_rgba(0,0,0,0.6)] hover:bg-black/20">
                                                        //     <Link href="#formations" className=" flex flex-col items-center w-fit h-full ">
                                                        //         <Image height={80} width={50} src={Formations.img} alt="Formations en ligne" className="object-cover  w-10 h-13  rounded-sm shadow-[-3px_1px_7px_rgba(0,200,255,0.6)] mr-1"></Image>

                                                        //         <div className="flex flex-col justify-center w-full items-start ">
                                                        //             <p className="text-sm font-bold"><i>{Formations.location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</i></p>
                                                        //             <span className="text-sm flex flex-row gap-3"><i>{Formations.format}</i><i className={`${Formations.type == "premium" ? "text-accent" : "text-info"}`} >{Formations.type}</i></span>
                                                        //         </div>
                                                        //     </Link>


                                                        // </button>

                                                        <motion.button
                                                            layout
                                                            initial={{ opacity: 0, scale: 0.8, y: 40 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{
                                                                opacity: 0,
                                                                y: -50,
                                                                position: "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                z: -1,
                                                                scale: 0.7
                                                            }}
                                                            transition={{
                                                                duration: 0.4,
                                                                ease: "easeOut",
                                                                delay: index * 0.08,
                                                            }}
                                                            className="h-120 cursor-pointer " key={Formations.id} onClick={() => { setIdOpen(index), setChangeCourseHeight(1), setSearchCoursesResultCurrent(displayedFormations) }} >
                                                            <InteractiveGradient

                                                                color="#1890ff"
                                                                glowColor="#1076675d"
                                                                followMouse={true}
                                                                hoverOnly={false}
                                                                intensity={100}
                                                                backgroundColor={cardCol}
                                                                width="20rem"
                                                                height="full"
                                                                borderRadius="2.25rem"
                                                                className="flex items-start h-full transition  duration-400  ease-in-out hover:border-info hover:scale-102  hover:-translate-y-2 hover:shadow-[0_5px_20px_rgba(0,0,0,0.6)] justify-center h-100% mt-5  shadow-[0_5px_20px_rgba(0,0,0,0.5)] ">
                                                                <Link href="#formations" className=" w-full h-full">
                                                                    <Card className={` w-100% relative h-100% rounded-4xl border-none flex flex-col ${textCol}`}>
                                                                        <CardHeader>
                                                                            <div className="mb-5 w-full h-50 rounded-3xl bg-gray-500 transform duration-300 hover:scale-104">
                                                                                <Image
                                                                                    alt=""
                                                                                    width={320}
                                                                                    height={420}

                                                                                    className={" object-cover shadow-[0_5px_20px_rgba(0,200,255,0.6)] relative h-full w-full rounded-3xl "}
                                                                                    src={Formations.img} // https://picsum.photos/500/350?image=${(id + 5) * 11}
                                                                                />
                                                                            </div>
                                                                            <CardTitle className=""><p className="text-sm font-bold"><i>{Formations.location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</i></p></CardTitle>
                                                                            <CardDescription><span className="text-sm flex flex-row gap-3"><i>{Formations.format}</i><i className={`${Formations.type == "premium" ? "text-yellow-500" : "text-info"}`} >{Formations.type}</i></span></CardDescription>
                                                                            <hr />
                                                                        </CardHeader>
                                                                        <CardContent className=" ">
                                                                            <p className="line-clamp-3 leading-relaxed ">{Formations.description}</p>
                                                                        </CardContent>

                                                                    </Card>
                                                                </Link>
                                                            </InteractiveGradient>
                                                        </motion.button>
                                                    )

                                                    )}
                                                </AnimatePresence>
                                            </div>

                                        </motion.div>
                                        {/* Pagination */}
                                        <div className="flex justify-center mt-6 space-x-2 items-center">
                                            {/* Bouton précédent */}
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => {
                                                    const newPage: number = Math.max(currentPage - 1, 1);
                                                    setCurrentPage(newPage);
                                                    handlePageChange(newPage);
                                                }}
                                                className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 text-black"
                                            >
                                                <Link href="#formationslist" className="w-full h-full">
                                                    ←
                                                </Link>
                                            </button>

                                            {/* Pages dynamiques */}
                                            {getPageNumbers().map((page, index) =>
                                                page === "..." ? (
                                                    <span key={index} className="px-2 text-blue-500">
                                                        ...
                                                    </span>
                                                ) : (
                                                    <button
                                                        key={index}
                                                        onClick={() => handlePageChange(Number(page))}
                                                        className={`cursor-pointer transition-all duration-400 ease-in-out px-3 py-1 rounded-lg ${currentPage === page
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-gray-200 hover:bg-gray-300 text-black"
                                                            }`}
                                                    >
                                                        <Link href="#formationslist" className="w-full h-full">
                                                            {page}
                                                        </Link>

                                                    </button>
                                                )
                                            )}

                                            {/* Bouton suivant */}
                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => {
                                                    const newPage: number = Math.min(currentPage + 1, totalPages);
                                                    setCurrentPage(newPage);
                                                    handlePageChange(newPage);
                                                }}
                                                className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 text-black"
                                            >
                                                <Link href="#formationslist" className="w-full h-full">
                                                    →
                                                </Link>
                                            </button>
                                        </div>
                                    </div>

                                </CollapsibleContent>
                            </Collapsible>
                            {/* commentaire */}
                            <div className="  rounded-md shadow-[-8px_3px_15px_rgba(0,0,0,0.6)] h-fit ">

                            </div>
                        </div>
                        <div className="flex flex-row h-fit  md:p-4 space-y-4 ">
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
                                            opacity="opacity-50"
                                            className='rounded-3xl z-2'
                                        />
                                        <div className="w-full md:w-1/3 relative h-60 hidden md:flex items-center justify-center rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)] ">
                                            <Image height={40} width={50} src="/assets/indisponible.svg" alt="Formations Presentiel" className="  w-full h-full shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] rounded-3xl "></Image>

                                        </div>

                                        <div className="flex flex-col gap-3 h-fit md:w-2/3 w-full ">
                                            <Card className="w-100% relative h-full rounded-4xl border-none flex flex-col justify-center">
                                                <CardHeader>
                                                    <CardTitle className=" text-3xl uppercase"> Formation en Ligne</CardTitle>
                                                    <hr />
                                                    <CardDescription><i><b>indisponible pour le moment...</b></i></CardDescription>

                                                </CardHeader>
                                                <CardContent className="">

                                                    <p><i><b>indisponible pour le moment...</b></i></p>
                                                </CardContent>
                                                <CardFooter className="flex flex-row  space-x-2">

                                                    <Button className="-z-2 text-white rounded-xl w-auto md:w-2/3 bg-blue-500  shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1">
                                                        Veuillez patienter...</Button>
                                                    <Button className="rounded-xl h-fit hover:w-1/3 w-12 hover:shadow-lg bg-gradient-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold ">
                                                        <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a></Button>

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

                        <div className="flex flex-row h-fit  md:p-4 space-y-4 ">
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
                                            opacity="opacity-50"
                                            className='rounded-3xl z-2'
                                        />
                                        <div className="w-full md:w-1/3 relative h-60 hidden md:flex items-center justify-center rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)] ">
                                            <Image height={40} width={50} src="/assets/indisponible.svg" alt="Formations Presentiel" className="  w-full h-full shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] rounded-3xl "></Image>

                                        </div>

                                        <div className="flex flex-col gap-3 h-fit md:w-2/3 w-full ">
                                            <Card className="w-100% relative h-full rounded-4xl border-none flex flex-col justify-center">
                                                <CardHeader>
                                                    <CardTitle className=" text-3xl uppercase"> Formation en Presentiel</CardTitle>
                                                    <hr />
                                                    <CardDescription><i><b>indisponible pour le moment...</b></i></CardDescription>

                                                </CardHeader>
                                                <CardContent className="">

                                                    <p><i><b>indisponible pour le moment...</b></i></p>
                                                </CardContent>
                                                <CardFooter className="flex flex-row  space-x-2">

                                                    <Button className="-z-2 text-white rounded-xl w-auto md:w-2/3 bg-blue-500  shadow-4xl  transition-transform duration-400 hover:scale-99  hover:translate-y-1">
                                                        Veuillez patienter...</Button>
                                                    <Button className="rounded-xl h-fit hover:w-1/3 w-12 hover:shadow-lg bg-gradient-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold ">
                                                        <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a></Button>

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
                            <div className="flex flex-row  justify-center rounded-3xl relative p-2 pt-6 my-7 ml-2 shadow-[-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2)] " key={site.id} data-theme={`${theme}`}>
                                <Image height={30} width={30} src="/assets/promo.svg" alt="promo" className="absolute w-30 h-30 top-0 right-10 -rotate-10 animate-zoom z-5"></Image>

                                <div className="flex flex-row w-full justify-between flex-wrap md:flex-nowrap  items-center  p-4 md:space-x-10 space-y-7" >

                                    <div className="w-full md:w-1/3 relative h-100   rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                        <StripesBackground
                                            position="right"
                                            width="w-full"
                                            height="h-full"
                                            opacity="opacity-60"
                                            className='rounded-3xl'
                                        />
                                        <motion.div className="w-full h-full  rounded-3xl md:border border-info"
                                            key={site.id}
                                            initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                            animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                            exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                            transition={{ duration: 0.5 }}
                                        >

                                            <Image height={500} width={500} src={Websites[index].img} alt="Formations en ligne" className="transition-all md:transition-none  -translate-x-[6%] md:-translate-x-[0%] translate-y-[6%] md:-translate-y-[0%] object-cover w-full h-full rounded-2xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></Image>

                                        </motion.div>
                                    </div>

                                    <div className="flex flex-col md:gap-3 h-auto w-full md:w-2/3 ">
                                        <Card className="w-100% relative h-full rounded-4xl border-none space-y-5  flex flex-col justify-between">
                                            <div className="h-fit w-full border-x rounded-4xl" >
                                                <CardHeader>
                                                    <CardTitle className=" text-3xl uppercase"> {Websites[index].value}</CardTitle>
                                                    <hr />
                                                    <CardDescription className="flex flex-col gap-2">
                                                        <span className={`text-xl font-bold  `}> {Websites[index].content}</span>
                                                        <span className={`text-md `}><u className="font-bold">Delai:</u> {Websites[index].Delai}</span>
                                                    </CardDescription>

                                                </CardHeader>
                                                <CardContent className=" text-5xl md:ml-15 relative   font-bold space-y-3">

                                                    <p className="line-through decoration-2 text-color-red  text-red-500 -rotate-7">{Websites[index].prixAv} </p>
                                                    <span className="h-fit flex items-center w-full flex-row justify-center"><p className="text-center  w-fit animate-zoom">{Websites[index].prixAp} </p></span>
                                                </CardContent>
                                            </div>
                                            <CardFooter className="flex flex-row space-x-2 ">

                                                <Button className={`rounded-xl h-fit ${sideBar ? "hover:w-1/2" : "hover:w-1/3"}  w-12 hover:shadow-lg bg-gradient-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold `}>
                                                    <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a></Button>


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
                            <div className="flex flex-row justify-center rounded-3xl relative p-2 pt-6 ml-2 shadow-[-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2)]  " key={ia.id} data-theme={`${theme}`}>

                                <div className="flex flex-row w-full justify-between flex-wrap md:flex-nowrap  items-center  p-4 md:space-x-10 space-y-7">
                                    <div className="w-full md:w-1/3 relative  h-100 rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                        <StripesBackground
                                            position="right"
                                            width="w-full"
                                            height="h-full"
                                            opacity="opacity-60"
                                            className='rounded-3xl'
                                        />
                                        <motion.div className="w-full h-full  rounded-3xl md:border border-info"
                                            key={ia.id}
                                            initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                            animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                            exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                            transition={{ duration: 0.5 }}
                                        >

                                            <Image height={500} width={500} src={IA[index].img} alt="Formations en ligne" className="transition-all md:transition-none  -translate-x-[6%] md:-translate-x-[0%] translate-y-[6%] md:-translate-y-[0%] object-cover w-full h-full rounded-2xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></Image>

                                        </motion.div>
                                    </div>

                                    <div className="flex flex-col gap-3 h-auto w-full md:w-2/3 ">
                                        <Card className="w-100% relative h-full rounded-4xl border-none  flex flex-col space-y-5 justify-between">
                                            <div className="h-fit w-full border-x rounded-4xl" >
                                                <CardHeader>
                                                    <CardTitle className=" font-bold text-3xl uppercase"> {IA[index].value}</CardTitle>
                                                    <hr />
                                                    <CardDescription className="flex flex-col gap-2">
                                                        <span className={`text-xl font-medium  `}> {IA[index].content}</span>
                                                        <span className={`text-md   `}><u className="font-medium">Delai:</u> {IA[index].Delai}</span>
                                                    </CardDescription>

                                                </CardHeader>
                                                <CardContent className=" text-5xl md:ml-15 relative flex flex-col items-center md:block font-bold space-y-3 md:p-6 p-0 mb-5 md:mb-2">

                                                    <p className="   shadow-full underline decoration-1 decoration-double  decoration-gray-300 ">{IA[index].prixfcfa} </p>
                                                    {/* <p className="text-center md:ml-8  shadow-full underline decoration-1 decoration-double  decoration-gray-300 -rotate-3">{IA[index].prixeur} </p> */}
                                                </CardContent>
                                            </div>
                                            <CardFooter className="flex flex-row space-x-2 ">

                                                <Button className={`rounded-xl h-fit ${sideBar ? "hover:w-1/2" : "hover:w-1/3"}  w-12 hover:shadow-lg bg-gradient-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold `}>
                                                    <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a></Button>


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
                            <div className="flex flex-row justify-center rounded-3xl relative p-2 pt-6 md:ml-2 shadow-[-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2)]  " key={des.id} data-theme={`${theme}`}>

                                <div className="flex flex-row w-full justify-between items-center flex-wrap md:flex-nowrap p-4 md:space-x-10 space-y-5 md:space-y-0">

                                    {index == 0 ? (
                                        <div className="w-full md:w-1/3 relative h-fit  rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                            <StripesBackground
                                                position="right"
                                                width="w-full"
                                                height="h-full"
                                                opacity="opacity-60"
                                                className='rounded-3xl'
                                            />
                                            <motion.div className="w-auto h-auto  rounded-3xl md:border border-info"
                                                key={des.id}
                                                initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                                animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                                exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                                transition={{ duration: 0.5 }}
                                            >

                                                <video autoPlay loop muted playsInline className="transition-all md:transition-none  -translate-x-[6%] md:-translate-x-[0%] translate-y-[6%] md:-translate-y-[0%]  rounded-3xl "><source src={design[index].img} type="video/mp4" /></video>

                                            </motion.div>
                                        </div>
                                    ) :

                                        (
                                            <div className="w-full md:w-1/3 relative h-100 rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                                <StripesBackground
                                                    position="right"
                                                    width="w-full"
                                                    height="h-full"
                                                    opacity="opacity-60"
                                                    className='rounded-3xl'
                                                />
                                                <motion.div className="w-full h-full  rounded-3xl md:border border-info"
                                                    key={des.id}
                                                    initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                                    animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                                    exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <Image height={500} width={500} src={design[index].img} alt="Formations en ligne" className=" transition-all md:transition-none  -translate-x-[6%] md:-translate-x-[0%] translate-y-[6%] md:-translate-y-[0%] object-cover w-full h-full rounded-2xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></Image>
                                                </motion.div>
                                            </div>
                                        )

                                    }

                                    <div className="flex flex-col gap-4 h-auto w-full md:w-2/3 ">
                                        <Card className="w-100% relative h-full rounded-4xl border-none space-y-5  flex flex-col justify-between">
                                            <div className="h-fit w-full border-x rounded-4xl " >
                                                <CardHeader>
                                                    <CardTitle className=" text-3xl uppercase"> {design[index].value}</CardTitle>
                                                    <hr />
                                                    <CardDescription className="flex flex-col gap-2">
                                                        <span className={`text-xl font-bold `}> {design[index].content}</span>
                                                        <span className={`text-md  `}><u className="font-bold">Delai:</u> {design[index].Delai}</span>
                                                    </CardDescription>

                                                </CardHeader>
                                                <CardContent className=" text-5xl md:ml-15 relative flex flex-col items-center md:block  font-bold space-y-3 md:p-6 p-0 mb-5 md:mb-2">

                                                    {/* <p className="underline decoration-1 decoration-double  decoration-gray-300 -rotate-3 ">{design[index].prixeur} </p> */}
                                                    <p className="text-center md:ml-8 underline decoration-1 decoration-double  decoration-gray-300  ">{design[index].prixfcfa} </p>
                                                </CardContent>
                                            </div>
                                            <CardFooter className="flex flex-row space-x-2">

                                                <Button className={`rounded-xl h-fit ${sideBar ? "hover:w-1/2" : "hover:w-1/3"}  w-12 hover:shadow-lg bg-gradient-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold `}>
                                                    <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a></Button>


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
                <AnimatePresence>
                    {sideBar ? (
                        <motion.div className="md:flex hidden flex-row w-1/4   items-center justify-between space-x-3  pb-5 h-full rounded-sm shadow-[-8px_3px_15px_rgba(0,0,0,0.6),inset_8px_-3px_15px_rgba(0,0,0,0.3),inset_-8px_3px_30px_rgba(255,255,255,0.1)] bg-backdrop-blur  " data-theme={` ${theme}`}>

                            <div className="flex flex-col  space-y-1 w-full  pt-0 h-full px-2">

                                <div className="h-[12%] ">
                                    <div className="h-fit rounded-md w-full bg-black/15 p-1 text-sm">
                                        <a className="transparent w-full italic h-full text-blue-500 " href=" /fichiers/DIVLAB_MODALITES-GENERALES-POUR-LES-DIFFERENTES-OFFRES-DE-DIVLAB.pdf" download="Grille_des_prix_DIVLAB.pdf" >Telecharger la fiche des prix Divlab</a>
                                    </div>
                                    <div className="relative">
                                        <h1 className="text-xl font-bold p-2  italic ">Div<span className="text-blue-500">lab</span></h1>
                                        <button className="rounded-full absolute right-1 bottom-1 p-1  hover:bg-gray-600 bg-black/20  rounded-l-xl  transition-all duration-300 cursor-pointer" onClick={() => setSideBar(false)}><X size={20} /></button>
                                        <hr />
                                    </div>
                                </div>
                                <div className="h-[88%] w-full " data-theme={` ${theme}`}>

                                    <div className="h-full " >
                                        <Collapsible open={openCollapse == 1} onOpenChange={() => { setOpenCollapse(0), setChangeCourseHeight(0) }} className=" h-full ">

                                            <CollapsibleTrigger asChild >
                                                <button onClick={() => handleCilck(-1)} className="h-2/14  w-full flex flex-row p-2 border-y border-gray space-x-2 rounded-md items-center " data-theme="dark">
                                                    <Image height={80} width={50} src="/assets/ImgCarousel/1.jpg" alt="Formations en ligne" className="object-cover rounded-md w-10 h-12 border-info shadow-[-2px_3px_3px_rgba(0,200,255,0.6)] "></Image>
                                                    <div className="flex flex-col  justify-center items-start  ">
                                                        <span className="flex flex-row gap-2 items-center"><h1 className="text-xl font-bold">Formations </h1> {searchData != "" && (<span className="text-sm italic">/ recherches pour "{searchData}"</span>)}</span>
                                                        <span className="text-sm"><i>pdf / e-books / videos / presentations...</i></span>
                                                    </div>
                                                </button>

                                            </CollapsibleTrigger>
                                            <div className="h-12/14  overflow-auto w-full">
                                                <CollapsibleContent className=" w-fit ">
                                                    <div className="  flex flex-row justify-center w-full   ">
                                                        <div className="h-auto w-[2px] bg-white ">

                                                        </div>
                                                        {searchCoursesResult.length != 0 ?
                                                            (
                                                                <div className=" flex flex-col space-y-1  py-2 rounded-xl  h-full " >
                                                                    {searchCoursesResult.map((Formations, index) => (
                                                                        <button onClick={() => { setSearchCoursesResultCurrent(searchCoursesResult), setIdOpen(index), setChangeCourseHeight(1) }} key={Formations.id} className="flex flex-row  w-fit space-x-2 p-2 rounded-md shadow-[2px_3px_20px_rgba(0,0,0,0.5)] hover:bg-black/20">
                                                                            <Link href="#formations" className=" flex flex-row justify-center items-center ml-2 w-200 h-full ">
                                                                                <Image height={80} width={50} src={Formations.img} alt="Formations en ligne" className="object-cover  w-9 h-12  rounded-sm shadow-[-3px_1px_7px_rgba(0,200,255,0.6)] mr-1"></Image>

                                                                                <div className="flex flex-col justify-center w-full items-start ">
                                                                                    <p className="text-md font-bold"><i>{Formations.location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</i></p>
                                                                                    <span className="text-sm flex flex-row gap-3"><i>{Formations.format}</i><i className={`${Formations.type == "premium" ? "text-yellow-600" : Formations.type == "sous licence" ? "text-red-700" : "text-info"}`} >{Formations.type}</i></span>
                                                                                </div>
                                                                            </Link>


                                                                        </button>
                                                                    )

                                                                    )}
                                                                </div>
                                                            ) :
                                                            (
                                                                <div className=" flex  italic font-light text-gray-600  py-2 rounded-xl  h-full items-center justify-center">
                                                                    Aucune formation contenant "{searchData}"
                                                                </div>
                                                            )}

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



                        </motion.div>
                    ) : (<button onClick={() => setSideBar(true)} className="hidden md:flex fixed right-0 top-35 hover:bg-gray-600 bg-black/20  rounded-l-xl p-5 transition-all duration-300 cursor-pointer"><ChevronLeft className="text-white " /></button>)}
                </AnimatePresence>
            </div>
        </article >

    );
}

export default Formations;