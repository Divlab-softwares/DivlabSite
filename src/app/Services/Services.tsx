"use client";

import downloadAndDecompress from "@/app/helpers/downloadAndDecompress"
import { useSession, signOut } from "next-auth/react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/app/Components/lightswind/hover-card";

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { ArrowDown, BarChart3, BookOpen, ChevronLeft, ExternalLink, Home, Moon, Search, Share, Sun, Users, Video, X } from "lucide-react"
import Title from "@/app/Components/Title";
import StripesBackground from '@/app/Components/lightswind/StripesBackground';
import { Website, IA, design, Papers } from '@/app/data_restructured.js'
import PayButton from "../Components/PayButton";
import AnimatedNotification from "../Components/lightswind/animated-notification";
import PaymentNotification from "../Components/PaymentNotification";
import PaymentNotifications from "../Components/PaymentNotifications";
import Whatsapp from "../../../public/assets/Whatsapp.svg";
import UserProfile from "../../../public/assets/UserProfile.png";
import { Input } from "../Components/lightswind/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/Components/lightswind/select";
import InteractiveGradient from "@/app/Components/lightswind/interactive-gradient-card";
import DivlabSpaceSignUp from "../Components/DivlabSpaceSignUp";
import DivlabSpaceLogin from "../Components/DivlabSpaceLogin";
import { ShineButton } from "../Components/lightswind/shine-button";
import TextType from "../Components/TextType";
import { BorderBeam } from "../Components/lightswind/border-beam";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "../Components/AppSidebar"
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import UploaderFile from "../Components/UploaderFile";
import { Dropdown } from "../Components/Dropdown";


// 🔹 Fonction pour récupérer le lien public Supabase
function getSupabasePublicLink(path: string | null | undefined, bucket: string) {
    if (!path) return null;
    if (path.startsWith("https://") || path.startsWith("http://") || path.startsWith("/")) return path;
    const configuredUrl =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_BASIC_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!configuredUrl) return null;

    try {
        const apiOrigin = new URL(
            configuredUrl.replace(".storage.supabase.co", ".supabase.co"),
        ).origin;
        const encodedPath = path
            .split("/")
            .filter(Boolean)
            .map(encodeURIComponent)
            .join("/");
        return `${apiOrigin}/storage/v1/object/public/${bucket}/${encodedPath}`;
    } catch {
        return null;
    }
}

type Courses = {
    id: string;
    title: string;
    description: string;
    domain: string;
    state: string;
    roomCode: string;
    date_start: Date;
    date_end: Date;
    courseType: string;
    time: number;
    price: number;
    trainerId: string;
    trainer: {
        user: {
            id: string;
            name: string;
            email: string;
            image?: string | null;
        };
        valid: boolean;
        reject: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
    language: string;
    currency: string;
    frontCover: string;
    backCover: string;
};

type Props = {
    initialRankedCourses?: Courses[];
};

const Services = ({ initialRankedCourses }: Props) => {


    interface CategoryScore {
        category: string;
        score: number; // 1 point = 1 mot-clé trouvé
    }




    interface Formation {
        id: number;
        title: string;
        location: string;
        format: string;
        classe: string;
        description: string;
        img: string;
        group: string;
        category: string[] | CategoryScore[]; // accept either original string array or CategoryScore[] produced by categorize()
        author: string;
        pages: number;
        createdAt: Date;
        updatedAt: Date;
    }

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const startIndex = (currentPage - 1) * itemsPerPage;

    const [OnlineFormations, setOnlineFormations] = useState<Formation[]>([]);
    const [OnlineCourses, setOnlineCourses] = useState<Formation[]>([]);
    const [searchCoursesResult, setSearchCoursesResult] = useState<Formation[]>([]);
    const [searchCoursesResultCurrent, setSearchCoursesResultCurrent] = useState<Formation[]>([]);
    const [displayedFormations, setDisplayedFormations] = useState<Formation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const rankedCourses = initialRankedCourses || [];

    // Chargement des formations
    useEffect(() => {
        let isMounted = true; // sécurité anti memory leak

        async function getOnlineFormations() {
            try {
                setLoading(true);
                const res = await fetch("/api/formation");

                if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);

                const data = await res.json();

                if (data.success && data.data && isMounted) {

                    // Typage de la réponse API
                    interface ApiResponse<T> {
                        success: boolean;
                        data: T;
                    }

                    const apiResponse = data as ApiResponse<any[]>;

                    const withPublicImg: Formation[] = (apiResponse.data || []).map((course: any) => ({
                        ...(course as Formation),
                        img: (getSupabasePublicLink(course.img as string, "images") ?? (course.img as string)) as string,
                    }));

                    console.log("tableau entre", withPublicImg)

                    setOnlineFormations(withPublicImg);
                } else {
                    throw new Error("Données invalides");
                }
            } catch (err: any) {
                if (isMounted) setError(err.message || "Erreur inconnue");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        getOnlineFormations();

        return () => {
            isMounted = false; // annule les setState après un démontage
        };
    }, []);

    const featuredStats = useMemo(() => {

        return {
            totalCourses: rankedCourses.length,
            freeCourses: rankedCourses.filter((course) => course.price === 0).length,
            premiumCourses: rankedCourses.filter((course) => course.price > 0).length,
            videoCourses: rankedCourses.filter((course) => course.courseType === "video").length,
            rankedCourses: rankedCourses
        };
    }, [rankedCourses]);


    // 🔹 Synchroniser `searchCoursesResult` quand `onlineFormations` change
    useEffect(() => {
        if (OnlineFormations.length > 0) {
            const normalized = OnlineFormations.map(course => ({
                ...course,
                _normTitle: normalizeText(course.title)
            }));

            setSearchCoursesResult(normalized);
            setSearchCoursesResultCurrent(OnlineFormations)
            setDisplayedFormations(normalized.slice(startIndex, startIndex + itemsPerPage))

        }
    }, [OnlineFormations]);

    // ✅ Maintenant, ici on peux dépendre de onlineFormations en toute sécurité
    // if (loading) return <p>Chargement des formations...</p>;
    // if (error) return <p>Erreur : {error}</p>;
    // if (!onlineFormations.length) return <p>Aucune formation disponible.</p>;


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

    const [load, setLoad] = useState(false);
    const PromPrice = 2000
    const [IdOpen, setIdOpen] = useState<number>(-1)
    const [IdPaperOpen, setIdPaperOpen] = useState<number>(-1)
    const [changeCourseHeight, setChangeCourseHeight] = useState<number>(0)
    const [changePaperHeight, setChangePaperHeight] = useState<number>(0)
    const serviceKey = process.env.MONETBIL_SERVICE_KEY;
    const [openCollapse, setOpenCollapse] = useState<number>(0)
    const [openPaperCollapse, setOpenPaperCollapse] = useState<number>(0)
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


    const [searchPapersResult, setSearchPapersResult] = useState<typeof Papers>(Papers.map(paper => ({
        ...paper,
        _normTitle: normalizeText(paper.Title)
    })));

    const [searchPapersResultCurrent, setSearchPapersResultCurrent] = useState<typeof Papers>(Papers)
    type PaymentStatus = { status: 'success' | 'failed' | string; message?: string };
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
    interface NotifState {
        message: string;
        type: 'success' | 'failed' | 'cancelled';
        key: number;
    }
    const [notif, setNotif] = useState<NotifState | null>(null);

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

    /* multiple notifications */

    let interval: ReturnType<typeof setInterval> | undefined; // on le déclare pour y avoir accès plus bas
    let hasNotified = false;
    const [isChecking, setIsChecking] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    // const [currentPage, setCurrentPage] = useState(1);
    const [currentPaperPage, setCurrentPaperPage] = useState(1);
    const itemsPerPaperPage = 5;
    const startPaperIndex = (currentPaperPage - 1) * itemsPerPaperPage;


    const [displayedPapers, setDisplayedPapers] = useState(searchPapersResult.slice(startPaperIndex, startPaperIndex + itemsPerPaperPage));
    const totalPages = Math.ceil(searchCoursesResult.length / itemsPerPage);
    const totalPaperPages = Math.ceil(searchPapersResult.length / itemsPerPaperPage);
    const [signResult, setSignResult] = useState<SignResult | null>(null);
    const freeCoursesCount = OnlineFormations.filter((course) => course.classe?.toLowerCase().includes("free") || course.classe?.toLowerCase().includes("gratuit")).length;
    const premiumCoursesCount = OnlineFormations.filter((course) => course.classe?.toLowerCase().includes("premium")).length;
    const trainHighlights = [
        { label: "Cours synchronises", value: featuredStats.totalCourses || "API", icon: BookOpen },
        { label: "Formations gratuites", value: featuredStats.freeCourses || "-", icon: Users },
        { label: "Parcours premium", value: featuredStats.premiumCourses || "-", icon: BarChart3 },
        { label: "Videos & lecons", value: featuredStats.videoCourses || "YouTube", icon: Video },
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const newStartIndex = (page - 1) * itemsPerPage;
        setDisplayedFormations(searchCoursesResult.slice(newStartIndex, newStartIndex + itemsPerPage));
    };

    const handlePaperPageChange = (page: number) => {
        setCurrentPaperPage(page);
        const newStartIndex = (page - 1) * itemsPerPaperPage;
        setDisplayedPapers(searchPapersResult.slice(newStartIndex, newStartIndex + itemsPerPaperPage));
    };

    // Verification du statut de connexion
    useEffect(() => {

        // if (signResult?.status === "success") {
        //     setNotif({
        //         message: `${signResult.message}, bienvenu ${signResult.data[0]?.name}` || "Operation traitée avec succès",
        //         type: signResult.status,
        //         key: Date.now() // <- très important pour réafficher à chaque fois
        //     });
        // } else if (signResult?.status === "failed") {
        //     setNotif({
        //         message: signResult.message || "Operation echouee, veuillez réessayer.",
        //         type: signResult.status,
        //         key: Date.now() // <- très important pour réafficher à chaque fois
        //     });
        // }
        if (signResult?.status === "success" || signResult?.status === "failed" || signResult?.status === "cancelled") {
            addNotification(signResult?.message || "Operation traitée", signResult?.status || "success", Date.now())
        }

        console.log(signResult)
    }, [signResult]);



    const sp = useSearchParams();
    const ref = sp.get("trxref");
    //const [status, setStatus] = useState("checking");
    const [tries, setTries] = useState(0);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        async function check() {
            const query = ref ? `?reference=${encodeURIComponent(ref)}` : '';
            // if (query != '') {
            //     fetch(`/api/payment-status${query}`)
            //         .then(res => res.json())
            //         .then(data => {
            //             setNotif({
            //                 message: data.message || "Transaction traitée",
            //                 type: data.status === "success" || data.status === "complete" ? "success" : "failed",
            //                 key: Date.now() // <- très important pour réafficher à chaque fois
            //             });
            //             if (data.status == "complete") {
            //                 // Téléchargement automatique
            //                 const itemRef = data.item_ref;
            //                 const link = document.createElement('a');
            //                 link.href = `/fichiers/${itemRef}.pdf`; // ton document sur le serveur
            //                 link.download = `${itemRef}.pdf`;
            //                 document.body.appendChild(link);
            //                 link.click();
            //                 document.body.removeChild(link);
            //             }
            //         })
            //         .catch(err => console.error(err));

            //     router.replace(window.location.pathname);
            // }
            const res = await fetch(`/api/payment-status${query}`);
            const d = await res.json();
            // if (!mounted) return;
            // setStatus(d.status || "unknown");
            if (d.status == "complete" || d.status == "failed") {
                const payStatus = d.status
                // setNotif({
                //     message: payStatus === "complete" ? "Transaction effectuee avec success" : "Transaction echouee",
                //     type: payStatus === "complete" ? "success" : "failed",
                //     key: Date.now() // <- très important pour réafficher à chaque fois
                // });
                addNotification(payStatus === "complete" ? "Transaction effectuee avec success" : "Transaction echouee, essayez de discuter sur whatsapp avec le service client", payStatus === "complete" ? "success" : "failed", Date.now())

                if (payStatus == "complete" && d.downloadUrl) {
                    // Téléchargement automatique
                    const itemLoc = d.downloadUrl;
                    const itemTitle = d.fileName;
                    downloadAndDecompress(itemLoc, itemTitle)
                    addNotification("Telechargement effectué", "success", Date.now())
                }
                router.replace(window.location.pathname);

            }
        }



        // polling initial: tenta 6 fois toutes les 2s (12s total)
        // const interval = setInterval(async () => {
        //     setTries(t => t + 1);
        //     await check();
        //     console.log(tries)
        //     if (tries >= 5) { clearInterval(interval); };

        // }, 2000);

        // première vérification immédiate
        check();

        // return () => { mounted = false; clearInterval(interval); };
    }, [ref]);

    // 🔹 Vérifie si un paiement est en cours au chargement
    // useEffect(() => {
    //     if (!localStorage.getItem('monetbilPaymentInProgress')) {
    //         localStorage.setItem('monetbilPaymentInProgress', 'false');
    //     }
    //     const inProgress = localStorage.getItem('monetbilPaymentInProgress');
    //     if (inProgress === 'true') startPaymentCheck();
    //     console.log("test du local", localStorage.getItem('monetbilPaymentInProgress'))
    //     return () => {
    //         if (intervalRef.current) clearInterval(intervalRef.current);
    //     };
    // }, []);

    // // 🔹 Fonction appelée quand on lance une transaction
    // const startPaymentCheck = () => {
    //     //if (isChecking) return;// déjà en cours
    //     if (hasNotified) return; // déjà traité
    //     localStorage.setItem('monetbilPaymentInProgress', 'true');

    //     //setIsChecking(true);
    //     // intervalRef.current = setInterval(async () => {
    //     //     //if (isChecking) return;
    //     //     if (hasNotified) return; // déjà traité
    //     //     try {
    //     //         const res = await fetch('/api/payment-status');
    //     //         const data = await res.json();

    //     //         if (data && data.status) {
    //     //             //setIsChecking(false);
    //     //             setPaymentStatus(data);
    //     //             setNotif({
    //     //                 message: data.message || "Transaction traitée",
    //     //                 type: data.status === "success" ? "success" : "failed",
    //     //                 key: Date.now() // <- très important pour réafficher à chaque fois
    //     //             });
    //     //             hasNotified = true; // bloque les suivants

    //     //             // Téléchargement automatique
    //     //             // Utilisation de item_ref pour construire le lien du document
    //     //             const itemRef = data.item_ref;
    //     //             const link = document.createElement('a');
    //     //             link.href = `/fichiers/${itemRef}.pdf`; // ton document sur le serveur
    //     //             link.download = `${itemRef}.pdf`;
    //     //             document.body.appendChild(link);
    //     //             link.click();
    //     //             document.body.removeChild(link);


    //     //             await fetch('/api/clear-payment-status', { method: 'POST' });

    //     //             // 🧹 Arrêter la boucle quand on a une réponse
    //     //             if (intervalRef.current) {
    //     //                 clearInterval(intervalRef.current);
    //     //                 intervalRef.current = null;
    //     //             }
    //     //             // ✅ Si la transaction est terminée, on arrête la boucle
    //     //             // if (data.status === 'success' || data.status === 'failed' || data.status === 'cancelled') {
    //     //             //     clearInterval(interval);
    //     //             // }
    //     //             localStorage.removeItem('monetbilPaymentInProgress');
    //     //         }
    //     //         else if (data == null) {
    //     //             hasNotified = true; // bloque les suivants
    //     //             //setIsChecking(false);
    //     //             // setNotif({
    //     //             //     message: "Erreur de transaction, veuillez réessayer.",
    //     //             //     type: "failed",
    //     //             //     key: Date.now() // <- très important pour réafficher à chaque fois
    //     //             // });

    //     //             await fetch('/api/clear-payment-status', { method: 'POST' });
    //     //             // localStorage.removeItem('monetbilPaymentInProgress');
    //     //             //console.log(" localstorage:", localStorage.getItem('monetbilPaymentInProgress'));
    //     //             // console.error("Statut vide:", data);
    //     //             localStorage.removeItem('monetbilPaymentInProgress');
    //     //             // console.log("Nouveau localstorage:", localStorage.getItem('monetbilPaymentInProgress'));
    //     //         }
    //     //     } catch (err) {
    //     //         console.error('Erreur checkStatus:', err);
    //     //     }
    //     // }, 3000);
    // };



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

    const handleOpenCollapse = (value: string) => {
        if (value == "formation") {
            if (openCollapse == 0) {
                setOpenCollapse(1)
            } else {
                setOpenCollapse(0)
            }
        } else if (value == "epreuve") {
            if (openPaperCollapse == 0) {
                setOpenPaperCollapse(1)
            } else {
                setOpenPaperCollapse(0)
            }
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
            normalizeText(course.title).includes(q)
        );
        searchCache.set(key, search); // on garde le résultat en mémoire
        return search;
    }

    const listRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const searchData = e.target.value;
        setLoad(false)
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
        setCurrentPage(1);
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
    }

    // CategoryScore type moved to the top of the file (to be used by OnlineFormations).

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
        category: categorize(f.title),
    }));

    const categorizedPapers = Papers.map(f => ({
        ...f,
        category: categorize(f.Title),
    }));

    // const grouped = OnlineFormations.reduce((acc, f) => {
    //     const cat = categorize(f.location)[0]?.category || "Autres";
    //     acc[cat] = acc[cat] || [];
    //     acc[cat].push(f);
    //     return acc;
    // }, {} as Record<string, typeof OnlineFormations>);

    const [newCategorizedCourses, setNewCategorizedCourses] = useState<typeof categorizedCourses>([]);
    const [newCategorizedPapers, setNewCategorizedPapers] = useState<typeof categorizedPapers>([]);

    const [formatCategory, setFormatCategory] = useState("tout");
    const [category, setCategory] = useState("tout");
    const [classeCategory, setClasseCategory] = useState("tout");

    const [formatCategoryPaper, setFormatCategoryPaper] = useState("tout");
    const [categoryPaper, setCategoryPaper] = useState("tout");
    const [classeCategoryPaper, setClasseCategoryPaper] = useState("tout");
    const [filiereCategoryPaper, setFiliereCategoryPaper] = useState("tout");
    const [levelCategoryPaper, setLevelCategoryPaper] = useState("tout");
    const [typeCategoryPaper, settypeCategoryPaper] = useState("tout");

    const handleSelect = (value: string, categoryType: string, group: string) => {
        // const cat = categorize(value)
        let c = category
        let f = formatCategory
        let cl = classeCategory
        let c_p = categoryPaper
        let f_p = formatCategoryPaper
        let cl_p = classeCategoryPaper
        let f_l = filiereCategoryPaper
        let l_p = levelCategoryPaper
        let t_p = typeCategoryPaper

        switch (categoryType) {
            case "format":
                switch (group) {
                    case "epreuve":
                        setFormatCategoryPaper(value);
                        f_p = value
                    case "formation":
                        setFormatCategory(value);
                        f = value
                }
                break;
            case "category":
                switch (group) {
                    case "epreuve":
                        setCategoryPaper(value);
                        c_p = value
                    case "formation":
                        setCategory(value);
                        c = value
                }
                break;
            case "classe":
                switch (group) {
                    case "epreuve":
                        setClasseCategoryPaper(value);
                        cl_p = value
                    case "formation":
                        setClasseCategory(value);
                        cl = value
                }
                break;

            // uniquement pour epreuve
            case "filiere":
                switch (group) {
                    case "epreuve":
                        setFiliereCategoryPaper(value);
                        f_l = value
                        console.log("test filiere", f_l)

                }
                break;
            case "level":
                switch (group) {
                    case "epreuve":
                        setLevelCategoryPaper(value);
                        l_p = value

                }
                break;
            case "type":
                switch (group) {
                    case "epreuve":
                        settypeCategoryPaper(value);
                        t_p = value

                }
                break;


        }


        console.log("Categorie:", c, "Type:", f, "class", cl, "classPaper", cl_p);
        if (group == "epreuve") {
            setNewCategorizedPapers(selectCategory({ category: c_p, format: f_p, classe: cl_p, filiere: f_l, level: l_p, type: t_p, group: group }))
        } else if (group == "formation") {
            setNewCategorizedCourses(selectCategory({ category: c, format: f, classe: cl, group: group }))
        }

    }


    // --- Étape 1 : pré-normalisation (à faire une seule fois, ex: au chargement)
    const preNormalizedCourses = categorizedCourses.map(course => ({
        ...course,
        _normCategory: normalizeText(course.category.map(cat => cat.category).join(" ")),
        _normFormat: normalizeText(course.format),
        _normClasse: normalizeText(course.classe),

    }));

    const preNormalizedPapers = categorizedPapers.map(paper => ({
        ...paper,
        _normCategory: normalizeText(paper.category.map(cat => cat.category).join(" ")),
        _normFormat: normalizeText(paper.Format),
        _normClasse: normalizeText(paper.Class),
        _normSchool: normalizeText(paper.School),
        _normLevel: normalizeText(paper.Level),
        _normFiliere: normalizeText(paper.Filiere),
        _normType: normalizeText(paper.Type)
    }));

    // --- Étape 2 : fonction avec mémoïsation simple
    const cache = new Map();
    const cachePaper = new Map();

    interface GetDataOptions {
        category?: string;
        format?: string;
        classe?: string;
        level?: string;
        filiere?: string;
        type?: string;
        group?: string;
    }

    const selectCategory = (options: GetDataOptions) => {
        const { category, format, classe, level, filiere, type, group } = options;
        const key = `${category}|${format}|${classe}|${group}|${level}|${filiere}|${type}`;
        const cacheToUse = group === "epreuve" ? cachePaper : cache;
        if (cacheToUse.has(key)) {
            return cacheToUse.get(key); // renvoie directement le résultat précédent
        }
        const PrenormalizedTable = group === "epreuve" ? preNormalizedPapers : preNormalizedCourses;

        const normalizedC = normalizeText(category || "");
        const normalizedF = normalizeText(format || "");
        const normalizedCL = normalizeText(classe || "");
        const normalizedL = normalizeText(level || "");
        const normalizedFL = normalizeText(filiere || "");
        const normalizeT = normalizeText(type || "");
        console.log("Categorie:", category, "Type:", type, "Class:", classe, "Format:", format, "Level:", level, "Filiere:", filiere);

        const filtered = PrenormalizedTable.filter(course => {
            const matchCategory = normalizedC === "tout" || course._normCategory.includes(normalizedC);
            const matchClasse = normalizedCL === "tout" || course._normClasse.includes(normalizedCL);
            const matchFormat = normalizedF === "tout" || course._normFormat.includes(normalizedF);
            const matchType = group === "epreuve"
                ? (normalizeT === "tout" || ("_normType" in course && typeof (course as any)._normType === "string" && (course as any)._normType.includes(normalizeT)))
                : true;
            const matchFiliere = group === "epreuve"
                ? (normalizedFL === "tout" || ("_normFiliere" in course && typeof (course as any)._normFiliere === "string" && (course as any)._normFiliere.includes(normalizedFL)))
                : true;
            const matchLevel = group === "epreuve"
                ? (normalizedL === "tout" || ("_normLevel" in course && typeof (course as any)._normLevel === "string" && (course as any)._normLevel.includes(normalizedL)))
                : true;

            return matchCategory && matchFormat && matchClasse && matchLevel && matchType && matchFiliere;
        });

        cacheToUse.set(key, filtered); // on garde le résultat en mémoire
        return filtered;
    };




    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setLoad(false)
            handleSubmit();
        }
    };



    // Fonction pour générer la liste des pages à afficher
    const getPageNumbers = (group: string) => {
        const pages: (number | string)[] = [];
        const total = group === "epreuve" ? totalPaperPages : totalPages;
        const current = group == "epreuve" ? currentPaperPage : currentPage;

        if (total <= 7) {
            // Si peu de pages → tout afficher
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            // Si beaucoup de pages → ellipses intelligentes
            if (current <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", total);
            } else if (current >= total - 3) {
                pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
            } else {
                pages.push(
                    1,
                    "...",
                    current - 1,
                    current,
                    current + 1,
                    "...",
                    total
                );
            }
        }

        return pages;
    };

    const [downloading, setDownloading] = useState<boolean>(false)

    const handleDownload = async (fileUrl: string, fileName: string) => {
        try {
            setDownloading(true)

            const res = await downloadAndDecompress(fileUrl, fileName);

            if (res.ok) {
                addNotification("Votre telechargement est en cours", "success", Date.now())
            } else {
                addNotification("Erreur lors du telechargement, veuillez reesayer plus tard", "failed", Date.now())
            }
            setDownloading(false)
        } catch (error) {
            console.error("Download and decompress failed:", error);
        }
    }

    const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [isOutOpen, setIsSignOutOpen] = useState(false);
    // const router = useRouter();

    function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLDivElement, MouseEvent>, state: string) {


        e.stopPropagation();

        switch (state) {
            case "signIn":
                setIsSignInOpen((prev) => !prev);
                setIsSignUpOpen(false);
                break;
            case "signUp":
                setIsSignUpOpen((prev) => !prev);
                setIsSignInOpen(false);
                break;
            case "signOut":
                setIsSignOutOpen((prev) => !prev);
                break;

            default:
                break;
        }
    }

    function closeDropdown(state: string) {
        switch (state) {
            case "signIn":
                setIsSignInOpen(false);
                break;
            case "signUp":
                setIsSignUpOpen(false);
                break;
            case "signOut":
                setIsSignOutOpen(false);
                break;

            default:
                break;
        }
    }

    return (
        <article className={`services-page relative flex h-screen flex-col overflow-hidden ${theme === "garden" ? "divlab-light" : "divlab-dark"} divlab-section-shell`} >
            {/* {notif && (
                <PaymentNotification
                    key={notif.key}
                    message={notif.message}
                    type={notif.type}
                    onClose={() => setNotif(null)} // remet à null pour permettre la réapparition
                />


            )} */}

            <PaymentNotifications
                notifications={notifications}
                removeNotification={removeNotification}
            />
            <button
                onClick={() => setThemes()}
                aria-label={theme === "garden" ? "Activer le theme sombre" : "Activer le theme clair"}
                className="divlab-theme-toggle fixed bottom-4 right-4 z-50 flex h-12 w-24 items-center rounded-full p-1 transition-all duration-500 hover:scale-105"
            >

                {theme === "garden" ? (
                    <motion.div
                        key={theme}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeIn" }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-500 shadow-lg"><Sun size={18} /></motion.div>)
                    : (
                        <motion.div
                            key={theme}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeIn" }}
                            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#071421] text-cyan-300 shadow-lg"><Moon size={18} /></motion.div>)}

            </button>

            <FormationNavBar />
            <div className="services-commandbar divlab-glass mx-2 mt-2 flex w-[calc(100%-1rem)] flex-col items-end gap-2 rounded-2xl p-2 md:h-[7%] md:flex-row md:items-center md:justify-center" data-theme={`${theme}`}>
                <div className="services-search relative flex h-12 w-full flex-row items-center justify-center gap-1 rounded-xl">

                    <Input onKeyDown={handleKeyDown} type="text" value={searchData} className="h-full w-full rounded-xl border-none bg-transparent px-4 pr-20 outline-none" onChange={handleChange} placeholder="Rechercher une formation, un service ou une solution..." data-theme={`${theme}`} />
                    <div className="absolute flex flex-row gap-1 right-2 top-1/2 transform -translate-y-1/2">
                        <button aria-label="Effacer la recherche" className="services-icon-button rounded-lg p-2 transition-all duration-200" onClick={clearSearch} > <X size={18} /></button>
                        <button aria-label="Lancer la recherche" onClick={handleSubmit} className="services-icon-button services-icon-button-primary rounded-lg p-2 transition-all duration-200"><Search size={18} /></button>
                    </div>

                    {/* <Button onClick={handleSubmit} type="submit" variant="ServicesSearch" className="h-full" >Rechercher</Button> */}

                </div>
                <div className="flex h-12 w-full flex-row items-center justify-end gap-2 rounded-2xl bg-white/30 px-2 md:w-[28rem]" data-theme={`${theme}`}>
                    <div className="flex flex-row items-center justify-center h-full  font-medium">
                        {session ? (
                            <div className="flex flex-row items-center justify-center gap-1">
                                {/* <motion.button
                                    initial={{ scale: 1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}

                                    onClick={() => setLoad(l => !l)} className="border-r text-black flex flex-col justify-center items-center hover:bg-black/20 cursor-pointer p-2 rounded-l-xl">
                                    {load ? (<Home size={18} />) : (<Share size={18} />)}
                                </motion.button>
                                 */}
                                <div className=" text-black flex flex-col justify-center items-end bg-white/50 hover:bg-black/20 cursor-pointer px-2 rounded-xl" onClick={(e) => { toggleDropdown(e, "signOut"); setSign(prev => (prev === -1 ? undefined : -1)) }}>
                                    <p className="font-bold text-xd">{session.user?.name}</p>
                                    <p className="text-sm">{session.user?.email}</p>
                                </div>

                            </div>
                        ) : (
                            <motion.div initial={{ scale: 1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-row items-center justify-center gap-2">

                                <button className={`text-bold cursor-pointer dropdown-toggle ${sign == 1 ? "bg-blue-700 " : "hover:bg-blue-300"}    border font-bold rounded-xl h-full text-sm px-2`} onClick={(e) => { toggleDropdown(e, "signIn"); setSign(prev => (prev === 1 ? undefined : 1)) }} >Se connecter</button>
                                <span> | </span>
                                <button className={`text-bold cursor-pointer dropdown-toggle ${sign == 0 ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700"}   font-bold rounded-xl h-full text-sm px-2`} onClick={(e) => { toggleDropdown(e, "signUp"); setSign(prev => (prev === 0 ? undefined : 0)) }}>S'inscrire</button>
                            </motion.div>
                        )}

                    </div>

                    <div className=" h-full w-10">
                        <Link href="#formations" className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold shadow-xl"><img src={getSupabasePublicLink(session?.user?.image, "images") || UserProfile.src} alt={session?.user?.name ? `Photo de ${session.user.name}` : "Profil utilisateur"} className="w-10 h-10 rounded-full object-cover" /></Link>
                    </div>
                </div>

            </div>

            <AnimatePresence>
                <Dropdown
                    isOpen={isSignInOpen}
                    onClose={() => closeDropdown("signIn")}
                    className="">
                    <DivlabSpaceLogin setSign={setSign} setSignResult={setSignResult} setIsSignInOpen={setIsSignInOpen} />
                </Dropdown >
            </AnimatePresence>
            <AnimatePresence>
                <Dropdown
                    isOpen={isSignUpOpen}
                    onClose={() => closeDropdown("signUp")}
                    className="">
                    <DivlabSpaceSignUp setSignResult={setSignResult} setSign={setSign} setIsSignUpOpen={setIsSignUpOpen} />

                </Dropdown>
            </AnimatePresence>
            <AnimatePresence>
                {sign == -1 && (
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="text-black w-100 h-50 rounded-xl bg-white/90 flex flex-col gap-5 items-center justify-center fixed right-6 md:top-33 top-50 z-50">
                        <Button disabled={signOutVal == 2} onClick={() => { setSignOutVal(2); signOut({ redirect: false }); setSign(-2); setSignOutVal(0) }} className="services-secondary-button cursor-pointer">{signOutVal === 2 ? 'Chargement, veuillez patienter...' : 'Se déconnecter'}</Button>
                    </motion.div >
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!load && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-row justify-between h-81/100 md:h-84/100 w-full  gap-3 " data-theme={`${theme}`}>
                        {/* <SidebarProvider> */}
                        {/* <AppSidebar /> */}
                        <div className={`flex flex-col   ${sideBar ? "md:w-3/4" : "md:w-full w-full"}  transition-all duration-300 h-full flex-wrap md:flex-nowrap  `}>
                            {/* <SidebarTrigger size="sm" className="font-bold w-fit" /> */}
                            <div className="h-full w-full overflow-auto space-y-4 scroll-smooth px-2 pb-8">
                                {/* <section className="relative mx-auto mb-6 mt-4 max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/18 via-white/8 to-amber-300/12 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-8">
                                    <div className="divlab-grid-mask absolute inset-0 opacity-25" />
                                    <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
                                        <div>
                                            <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold uppercase text-cyan-200">
                                                Catalogue DIVLAB
                                            </span>
                                            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                                                Services, formations et produits numeriques dans un meme espace.
                                            </h1>
                                            <p className="mt-4 max-w-3xl text-[var(--divlab-muted)]">
                                                Recherchez une ressource, commandez un site, explorez les offres IA ou accedez a DIVLAB TRAIN selon votre besoin.
                                            </p>
                                            <div className="mt-6 flex flex-wrap gap-3">
                                                <Link href="#formations" className="rounded-full bg-white px-5 py-3 font-bold text-[#071421] transition hover:-translate-y-1">Voir les formations</Link>
                                                <Link href="#solutions web" className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white transition hover:-translate-y-1">Commander un service</Link>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {trainHighlights.map((item) => (
                                                <div key={item.label} className="divlab-glass rounded-2xl p-4">
                                                    <item.icon className="mb-4 text-cyan-300" size={22} />
                                                    <p className="text-2xl font-black">{item.value}</p>
                                                    <p className="text-xs uppercase text-[var(--divlab-muted)]">{item.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section> */}
                                <u><Title title="FORMATIONS" className="text-4xl pt-2" id="formations" /></u>

                                {/* Zone des formations en e-book*/}

                                <div className={`services-simple-card ${changeCourseHeight == 1 ? "min-h-155" : "h-fit"} transition-all duration-300 ease-in-out flex flex-row justify-center p-3 pt-6 rounded-3xl ml-2`} data-theme={`${theme}`}>



                                    <div className="flex flex-row relative w-full justify-between  items-start p-4 md:space-x-10 space-y-7 flex-wrap md:flex-nowrap  rounded-3xl" >

                                        <BorderBeam
                                            size={50}
                                            duration={5.5}
                                            delay={0}
                                            colorFrom="#0785ce"
                                            colorTo="#0785ce"
                                            reverse={false}
                                            initialOffset={0}
                                            borderThickness={5}
                                            opacity={1}
                                            glowIntensity={8}
                                            beamBorderRadius={45}
                                            pauseOnHover={false}
                                            speedMultiplier={1.1}
                                        />

                                        <div className="md:h-full flex flex-col items-start md:w-1/3 w-full ">
                                            <div className="flex flex-col md:block items-center w-full  relative h-fit rounded-xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                                <StripesBackground
                                                    position="right"
                                                    width="w-full"
                                                    height="h-full"
                                                    opacity="opacity-60"
                                                    className='rounded-xl'
                                                />
                                                <motion.div className="w-auto h-full md:h-fit flex items-center justify-center rounded-xl hover:translate-x-[0%] md:hover:translate-x-[2%] hover:translate-y-[0%] md:hover:-translate-y-[1%] hover:scale-104 md:hover:scale-100 transition-all duration-400"
                                                    key={IdOpen}
                                                    initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                                    animate={{ opacity: "100%", x: "5%", y: "-5%", scale: 1 }}
                                                    exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                                    transition={{ duration: 0.5 }}
                                                >

                                                    <img src={IdOpen == -1 ? "/assets/Formations.webp" : searchCoursesResultCurrent[IdOpen].img} alt="Formations en ligne" className="transition-all duration-400 md:transition-none  -translate-x-[5%] md:translate-x-[0%] translate-y-[5%] md:translate-y-[0%] object-cover md:w-full md:h-auto  w-auto h-80   rounded-xl hover:shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></img>

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
                                                    className="h-fit w-full rounded-4xl" >
                                                    <CardHeader>
                                                        <CardTitle className=" text-3xl whitespace-pre-wrap "> {IdOpen == -1 ? (
                                                            <div>
                                                                <TextType
                                                                    text={["Vos formations en ligne sur mesure.", "Devellopez vos competences grace à un seul click.", "Obtenez le meilleur service qui puisse etre offert."]}
                                                                    typingSpeed={90}
                                                                    pauseDuration={3000}
                                                                    showCursor={true}
                                                                    cursorCharacter="|"
                                                                    // onSentenceComplete={(sentence = "Votre Divlab space a ete cree avec succes.", index = 0) => setSide("open")}
                                                                    className="text-4xl font-bold hidden md:inline-block"
                                                                />

                                                                <p className="md:hidden flex text-4xl font-bold">Vos formations en ligne sur mesure.</p>
                                                            </div>

                                                        ) : searchCoursesResultCurrent[IdOpen].title}</CardTitle>
                                                        <hr />
                                                        <CardDescription className="flex flex-col flex-wrap gap-2 items-start" >
                                                            <span className="flex flex-row flex-wrap gap-2 items-center justify-center">
                                                                <span className={`${IdOpen == -1 ? "" : "badge badge-info badge-outline  badge-md  mt-2  rounded-full"}`}><i> {IdOpen == -1 ? "pdf / videos / images / presentations..." : searchCoursesResultCurrent[IdOpen].format}</i></span>
                                                                <span className={`${IdOpen == -1 ? "" : "badge badge-soft badge-outline  badge-md  mt-2  rounded-full"}`}><i> {IdOpen == -1 ? "" : `${searchCoursesResultCurrent[IdOpen].pages} Pages`} </i></span>
                                                                <span className={`${IdOpen == -1 ? "" : (`badge  badge-outline rounded-full badge-md mt-2   ${searchCoursesResultCurrent[IdOpen].classe == "premium" ? " text-yellow-400  bg-black font-semibold" : searchCoursesResultCurrent[IdOpen].classe == "licensed" ? "badge-accent" : "badge-info"} `)}`}>{IdOpen == -1 ? "" : searchCoursesResultCurrent[IdOpen].classe} </span>
                                                                {IdOpen != -1 && (searchCoursesResultCurrent[IdOpen].classe != "licensed" && (
                                                                    <div>
                                                                        <span className="text-3xl  animate-zoom text-center ml-3 underline decoration-1  decoration-gray-100  ">{IdOpen == -1 ? "" : searchCoursesResultCurrent[IdOpen].classe == "premium" ? `${PromPrice} FCFA` : ""}</span>
                                                                        <span className="text-red-500 ml-3"> {IdOpen == -1 ? "" : searchCoursesResultCurrent[IdOpen].classe == "premium" ? `Prix promotionnel` : ""}</span>
                                                                    </div>
                                                                ))}
                                                            </span>
                                                            <span className="">
                                                                {IdOpen == -1 ? "" : (searchCoursesResultCurrent[IdOpen].author !== "Inconnu" && searchCoursesResultCurrent[IdOpen].author !== "Author") ? (<span className="text-md font-bold">Auteur: {searchCoursesResultCurrent[IdOpen].author}</span>) : ""}
                                                            </span>
                                                        </CardDescription>

                                                    </CardHeader>
                                                    <CardContent className="">
                                                        <p>{IdOpen == -1 ? "Devenez le meilleur de vous avec les formations sur mesure et adaptés à la lecture et la compréhension facile." : searchCoursesResultCurrent[IdOpen].description} </p>
                                                    </CardContent>
                                                </motion.div>
                                                <CardFooter className="flex md:flex-row flex-col space-y-8 md:space-y-0 md:space-x-8 w-full mt-5">

                                                    {IdOpen === -1 ? (
                                                        <Link href={`${openCollapse == 0 ? "#formationslist" : "#formations"}`} className="h-12 rounded-xl w-full  transition-transform duration-400 hover:scale-105  hover:-translate-y-1  font-bold">
                                                            <ShineButton className="w-full h-full p-2 flex items-center justify-center"
                                                                label={`${openCollapse == 0 ? "Afficher toutes les formations" : "Fermer les formations"}`}
                                                                size="lg"
                                                                bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)"
                                                                onClick={() => handleOpenCollapse("formation")}
                                                            />
                                                        </Link>
                                                    ) : (searchCoursesResultCurrent[IdOpen].classe != "premium" ? (searchCoursesResultCurrent[IdOpen].classe != "licensed" ? (

                                                        <div className="font-bold h-12 rounded-xl w-full   transition-transform duration-400 hover:scale-105  hover:-translate-y-1 p-0 shadow-4xl">
                                                            <ShineButton
                                                                className="w-full h-full rounded-xl flex items-center justify-center hover:w-full  shadow-4xl transition-all duration-400 bg-linear-to-tr from-white/40 via-cyan-400 to-blue-500 "
                                                                disabled={downloading}
                                                                label={`${!downloading ? `Télécharger` : `Veuillez patienter...`}`}
                                                                size="lg"
                                                                bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)"
                                                                onClick={() => handleDownload(searchCoursesResultCurrent[IdOpen].location, searchCoursesResultCurrent[IdOpen].title)}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="font-bold h-12 rounded-xl w-full   transition-transform duration-400 p-0 shadow-4xl opacity-60 cursor-not-allowed">
                                                            <ShineButton
                                                                className="w-full h-full rounded-xl flex items-center justify-center shadow-4xl transition-all duration-400"
                                                                label={`Document sous license...`}
                                                                size="lg"
                                                                disabled={true}
                                                                bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)"
                                                            // onClick={() => handleDownload(searchCoursesResultCurrent[IdOpen].location, searchCoursesResultCurrent[IdOpen].title)}
                                                            />
                                                        </div>
                                                    )
                                                    ) : (
                                                        <div className="flex md:flex-row flex-wrap md:flex-nowrap space-y-5 md:space-y-0 md:space-x-2 w-full  items-start justify-center">
                                                            <Link href="https://layidgpo.mychariow.com" target="_blank" className="font-bold h-12 w-full hover:scale-105 hover:-translate-y-1 shadow-xl transition-all duration-400 bg-linear-to-tr rounded-xl">
                                                                <ShineButton
                                                                    className="w-full h-full rounded-xl p-2 flex items-center justify-center"
                                                                    label="Acheter (via chariow)"
                                                                    size="lg"
                                                                    bgColor="linear-gradient(325deg, hsl(24 100% 50%) 0%, hsl(34 100% 60%) 55%, hsl(24 100% 50%) 90%)"
                                                                />
                                                            </Link>
                                                            <PayButton amount={PromPrice} filePath={searchCoursesResultCurrent[IdOpen].location} fileName={searchCoursesResultCurrent[IdOpen].title} currency="XAF" userId={session ? session.user.id : ""} theme={theme} />
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



                                                    <Button className={`rounded-xl h-fit ${sideBar ? "hover:w-1/2" : "hover:w-1/3"}  w-12 hover:shadow-lg bg-linear-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold `}>
                                                        <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a>
                                                    </Button>

                                                </CardFooter>
                                                {/* {!sideBar && IdOpen != -1 && openCollapse == 0 && (<Button onClick={() => handleOpenCollapse("formation")} className="h-10 rounded-xl w-auto md:w-2/3 bg-blue-500   transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0 ">
                                                    <a href={`#formationslist`} className="w-full h-full p-2 flex items-center justify-center">Afficher toutes les formations</a>
                                                </Button>)} */}
                                            </Card>

                                        </div>
                                        {IdOpen != -1 && (
                                            <div className="absolute md:bottom-50 bottom-20 right-0">
                                                <div className={`flex flex-row rounded-l-xl h-fit  w-12   transition-all  duration-400 bg-linear-to-bl from-blue-500 via-white/80 to-blue-500   p-2 font-bold `}>
                                                    <Link href="#formationslist" onClick={() => setOpenCollapse(1)} className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"> <span className="w-12 h-12 flex items-center justify-center text-black"><ArrowDown /></span> Voir les formations</Link>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>

                                <div id="category" className="h-90">

                                    <div className="services-simple-card flex relative h-full w-full rounded-3xl p-2" >

                                        <Card className="w-full relative h-full rounded-4xl flex flex-col justify-start border-none ">
                                            <CardHeader className="py-2">
                                                <div className="  flex flex-col md:flex-row gap-5 items-center ">
                                                    <span className="text-2xl font-bold">Categorisation</span>
                                                    <div className="gap-2 flex flex-wrap md:flex-row">
                                                        <span className="flex flex-row items-center gap-1">
                                                            <p className="text-md font-medium">Format : </p>
                                                            <Select onValueChange={(value) => {
                                                                handleSelect(value, "format", "formation");
                                                            }}>
                                                                <SelectTrigger className="w-[180px] md:w-[200px]">
                                                                    <SelectValue placeholder="Choisir le Format..." />
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
                                                                handleSelect(value, "category", "formation");
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
                                                                handleSelect(value, "classe", "formation");
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


                                            </CardHeader>
                                            <CardContent className="h-full w-full py-2 overflow-auto flex items-center justify-start px-2">
                                                <div className="w-fit h-full flex flex-row gap-2">
                                                    {newCategorizedCourses.map((course, index) => (
                                                        <button key={course.id} onClick={() => { setSearchCoursesResultCurrent(newCategorizedCourses), setIdOpen(index), setChangeCourseHeight(1) }} className="w-40 h-full p-1 rounded-xl shadow-[-8px_2px_15px_rgba(0,0,0,0.6)] hover:bg-black/20">
                                                            <Link href="#formations" className=" flex flex-col items-center h-full overflow-hidden ">
                                                                <img src={course.img} alt="Formations en ligne" className="  w-full h-4/5  rounded-xl shadow-[-3px_1px_7px_rgba(0,200,255,0.6)] mr-1" />

                                                                <div className="flex flex-col w-full items-start whitespace-nowrap p-1">
                                                                    <p className="text-sm font-medium"><i>{course.title}</i></p>
                                                                    <span className="text-sm flex flex-row gap-3"><i>{course.format}</i><i className={`${course.classe == "premium" ? "text-yellow-500" : "text-info"}`} >{course.classe}</i></span>
                                                                    <span className={`${IdOpen == -1 ? "" : "badge badge-info badge-outline  badge-md  mt-2  rounded-full"}`}><i> {IdOpen == -1 ? "" : searchCoursesResultCurrent[IdOpen].pages} pages</i></span>
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
                                <div id="formationslist" ref={listRef} className={`services-simple-card ${sideBar ? "md:hidden" : ""} w-full h-auto rounded-2xl`} data-theme={`${theme}`}>
                                    <Collapsible open={openCollapse == 1} onOpenChange={() => setOpenCollapse(0)} className=" ">

                                        <CollapsibleTrigger asChild className="">

                                        </CollapsibleTrigger>
                                        <CollapsibleContent className=" p-2">
                                            <div className="   flex flex-col w-full h-auto space-y-2">
                                                <Link href="#formations" onClick={() => { handleOpenCollapse("formation"), handleCilck(-1), setChangeCourseHeight(0) }} className=" mb-2 rounded-full w-10 h-10 bg-black/20 hover:bg-blue-500 flex items-center justify-center cursor-pointer">{<X />}</Link>

                                                <motion.div
                                                    initial={{ opacity: 0, y: 40 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 40 }}
                                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                                    className="relative"
                                                >
                                                    <div className="h-auto w-full relative flex flex-row space-y-8 p-2 rounded-xl flex-wrap space-x-4  md:space-x-6 justify-center">
                                                        {loading ? (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                {/* <LoadingSpinner size={50} color="#1890ff" /> */}
                                                                <p>Chargement des formations ...</p>
                                                            </div>
                                                        ) : displayedFormations.length == 0 && (<p>Aucune formation disponible pour le moment, essayez de rafraichir la page.</p>)}


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
                                                                                        <img
                                                                                            alt=""
                                                                                            className={" object-cover shadow-[0_5px_20px_rgba(0,200,255,0.6)] relative h-full w-full rounded-3xl "}
                                                                                            src={Formations.img} // https://picsum.photos/500/350?image=${(id + 5) * 11}
                                                                                        />
                                                                                    </div>
                                                                                    <CardTitle className=""><p className="text-sm font-ultrabold"><i>{Formations.title?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</i></p></CardTitle>
                                                                                    <CardDescription><span className="text-sm flex flex-row gap-3"><i>{Formations.format}</i><i className={`${Formations.classe == "premium" ? "text-yellow-500" : "text-info"}`} >{Formations.classe}</i><i className={`text-info`} >{Formations.pages} pages</i></span></CardDescription>
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
                                                    {getPageNumbers("formation").map((page, index) =>
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


                                {/* Zone des formations en ligne */}

                                <div id="formationsOnline" className="rounded-xl flex h-fit flex-row space-y-4 md:p-4 shadow-[-8px_15px_20px_rgba(0,0,0,0.4),-3px_5px_20px_rgba(0,200,255,0.2)]" data-theme={`${theme}`}>
                                    <div className="divlab-glass relative flex h-fit w-full flex-wrap justify-center overflow-hidden rounded-[2rem] p-4 md:ml-2 md:flex-nowrap md:space-x-8" >
                                        <div className="divlab-grid-mask absolute inset-0 opacity-25" />
                                        <div className="relative hidden h-80 w-full overflow-hidden rounded-[1.6rem] shadow-[0_20px_70px_rgba(0,116,217,0.28)] md:flex md:w-1/3">
                                            <Image height={640} width={520} src="/assets/projects/divlabTrain.png" alt="DIVLAB TRAIN" className="h-full w-full object-cover"></Image>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/10 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <p className="text-sm uppercase text-cyan-200">Plateforme de formation en ligne</p>
                                                <h3 className="text-3xl font-black">DIVLAB TRAIN</h3>
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex h-fit w-full flex-col gap-3 md:w-2/3">
                                            <Card className="w-100% relative flex h-full flex-col justify-center rounded-[1.6rem] border-none bg-transparent">
                                                <CardHeader>
                                                    <CardTitle className="text-3xl uppercase md:text-5xl"> Formation en Ligne | DIVLAB TRAIN</CardTitle>
                                                    <hr />
                                                    <CardDescription className="text-base leading-7">
                                                        DIVLAB TRAIN pensee pour aider les formateurs a gerer leurs cours, suivre les apprenants et ameliorer la qualite des parcours avec des tableaux de bord.
                                                    </CardDescription>

                                                </CardHeader>
                                                <CardContent className="space-y-5">
                                                    <div className="grid gap-3 md:grid-cols-4">
                                                        {trainHighlights.map((item) => (
                                                            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 p-3">
                                                                <item.icon className="mb-3 text-cyan-300" size={20} />
                                                                <p className="text-xl font-black">{item.value}</p>
                                                                <p className="text-xs text-[var(--divlab-muted)]">{item.label}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="grid gap-2 md:grid-cols-3">
                                                        {(featuredStats.rankedCourses.length > 0 ? featuredStats.rankedCourses.slice(0, 3) : featuredStats.rankedCourses.slice(0, 3)).map((course) => (
                                                            <div key={course.id} className="flex items-center gap-3 rounded-2xl bg-black/10 p-2">
                                                                <img src={course.frontCover} alt={course.title} className="h-14 w-11 rounded-lg object-cover" />
                                                                <div className="min-w-0">
                                                                    <p className="truncate text-sm font-bold">{course.title}</p>
                                                                    <p className="text-xs text-cyan-300">Formation {course.courseType}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="text-sm leading-6 text-[var(--divlab-muted)]">
                                                        Les formations sont directement accesible sur DIVLAB TRAIN, vous pouvez y participer et/ou devemir formateur.
                                                    </p>
                                                </CardContent>
                                                <CardFooter className="flex flex-col gap-3 md:flex-row">


                                                    <Link href="https://train.divlabs-tech.com" target="_blank" className="font-bold h-12 rounded-xl w-full transition-transform duration-400 hover:scale-105  hover:-translate-y-1 p-0 shadow-4xl">
                                                        <ShineButton
                                                            className="w-full h-full rounded-xl flex items-center justify-center hover:w-full  shadow-4xl transition-all duration-400 bg-linear-to-tr from-white/40 via-cyan-400 to-blue-500 "
                                                            // disable= {downloading}
                                                            label={`Acceder a DIVLAB TRAIN `}
                                                            size="lg"
                                                            bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)"
                                                        // onClick={() => handleDownload(searchCoursesResultCurrent[IdOpen].location, searchCoursesResultCurrent[IdOpen].title)}
                                                        />
                                                        {/* <ExternalLink className="ml-2 h-4 w-4" /> */}
                                                    </Link>
                                                    <Button className={`rounded-xl h-fit ${sideBar ? "hover:w-1/2" : "hover:w-1/3"}  w-12 hover:shadow-lg bg-linear-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold `}>
                                                        <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a>
                                                    </Button>

                                                </CardFooter>
                                            </Card>

                                        </div>
                                    </div>
                                </div>

                                {/* Zone des formations en presentiel*/}

                                {/* <div id="formationPresentiel" className="flex flex-row h-fit  md:p-4 space-y-4 ">
                                    <HoverCard
                                        openDelay={100}
                                        closeDelay={0}
                                        NewClassName="w-full h-fit "
                                    >
                                        <HoverCardTrigger asChild >
                                            <div
                                                className="services-simple-card flex flex-row relative h-fit flex-wrap md:flex-nowrap justify-center w-full rounded-3xl p-4 md:space-x-20 md:ml-2"
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
                                                            <Button className="rounded-xl h-fit hover:w-1/3 w-12 hover:shadow-lg bg-linear-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold ">
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

                                </div> */}

                                {/* Zone des Solutions web */}
                                <u><Title title="SOLUTIONS WEB" className="text-4xl pt-2" id="solutions web" /></u>
                                {Website.map((site, index) => (
                                    <div className="services-simple-card flex flex-row justify-center rounded-3xl relative p-2 pt-6 my-7 ml-2" key={site.id} data-theme={`${theme}`}>
                                        <Image height={30} width={30} src="/assets/promo.svg" alt="promo" className="absolute w-30 h-30 top-0 right-10 -rotate-10 animate-zoom z-5"></Image>

                                        <div className="relative flex flex-row w-full rounded-3xl justify-between flex-wrap md:flex-nowrap  items-center  p-4 md:space-x-10 space-y-7 shadow-[0_5px_10px_rgba(0,200,255,0.6)]" >

                                            <BorderBeam
                                                size={50}
                                                duration={5.5}
                                                delay={0}
                                                colorFrom="#0785ce"
                                                colorTo="#0785ce"
                                                reverse={false}
                                                initialOffset={0}
                                                borderThickness={5}
                                                opacity={1}
                                                glowIntensity={8}
                                                beamBorderRadius={45}
                                                pauseOnHover={false}
                                                speedMultiplier={1.1}
                                            />

                                            <div className="w-full md:w-1/3 relative h-100   rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                                <StripesBackground
                                                    position="right"
                                                    width="w-full"
                                                    height="h-full"
                                                    opacity="opacity-60"
                                                    className='rounded-3xl'
                                                />
                                                <motion.div className="w-full h-full  rounded-3xl md:border border-info hover:translate-x-[0%] md:hover:translate-x-[2%] hover:translate-y-[0%] md:hover:-translate-y-[1%] hover:scale-104 md:hover:scale-100 transition-all duration-400"
                                                    key={site.id}
                                                    initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                                    animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                                    exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                                    transition={{ duration: 0.5 }}
                                                >

                                                    <Image height={500} width={500} src={Website[index].img} alt="Formations en ligne" className="transition-all md:transition-none  -translate-x-[6%] md:translate-x-[0%] translate-y-[6%] md:translate-y-[0%] object-cover w-full h-full rounded-2xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></Image>

                                                </motion.div>
                                            </div>

                                            <div className="flex flex-col md:gap-3 h-auto w-full md:w-2/3 ">
                                                <Card className="w-100% relative h-full rounded-4xl border-none space-y-5  flex flex-col justify-between">
                                                    <div className="h-fit w-full border-x rounded-4xl" >
                                                        <CardHeader>
                                                            <CardTitle className=" text-3xl uppercase"> {Website[index].value}</CardTitle>
                                                            <hr />
                                                            <CardDescription className="flex flex-col gap-2">
                                                                <span className={`text-xl font-bold  `}> {Website[index].content}</span>
                                                                <span className={`text-md `}><u className="font-bold">Delai:</u> {Website[index].Delai}</span>
                                                            </CardDescription>

                                                        </CardHeader>
                                                        <CardContent className=" text-5xl md:ml-15 relative   font-bold space-y-3">

                                                            <p className="line-through decoration-2 text-color-red  text-red-500 -rotate-7">{Website[index].prixAv} </p>
                                                            <span className="h-fit flex items-center w-full flex-row justify-center"><p className="text-center  w-fit animate-zoom">{Website[index].prixAp} </p></span>
                                                        </CardContent>
                                                    </div>
                                                    <CardFooter className="flex md:flex-row flex-col space-y-2 md:space-x-8 items-start">

                                                        <Button className={`rounded-xl h-fit ${sideBar ? "hover:w-1/2" : "hover:w-1/3"}  w-12 hover:shadow-lg bg-linear-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold `}>
                                                            <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a></Button>


                                                        <Link href={{
                                                            pathname: "/Commande",
                                                            query: {
                                                                commandId: Website[index].id.toString(),
                                                                commandType: "Website",
                                                                sessionName: session?.user?.name,
                                                                sessionEmail: session?.user?.email
                                                            },
                                                        }} target="_blank" className="font-bold h-12 rounded-xl w-full transition-transform duration-400 hover:scale-105  hover:-translate-y-1 p-0 shadow-4xl">
                                                            <ShineButton
                                                                className="w-full h-full rounded-xl flex items-center justify-center hover:w-full  shadow-4xl transition-all duration-400 bg-linear-to-tr from-white/40 via-cyan-400 to-blue-500 "
                                                                // disable= {downloading}
                                                                label={`Initier la commande`}
                                                                size="lg"
                                                                bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)"
                                                            // onClick={() => handleDownload(searchCoursesResultCurrent[IdOpen].location, searchCoursesResultCurrent[IdOpen].title)}
                                                            />
                                                        </Link>


                                                    </CardFooter>
                                                </Card>

                                            </div>
                                        </div>

                                    </div>
                                ))}

                                {/* Zone des Solutions IA */}

                                <u><Title title="INTELLIGENCE ARTIFFICIELLE" className="text-4xl pt-2" id="ia" /></u>
                                {IA.map((ia, index) => (
                                    <div className="services-simple-card flex flex-row justify-center rounded-3xl relative p-2 pt-6 ml-2" key={ia.id} data-theme={`${theme}`}>

                                        <div className="relative flex flex-row w-full justify-between flex-wrap md:flex-nowrap  items-center  p-4 md:space-x-10 space-y-7   rounded-3xl shadow-[0_5px_10px_rgba(0,200,255,0.6)]">

                                            <BorderBeam
                                                size={50}
                                                duration={5.5}
                                                delay={0}
                                                colorFrom="#0785ce"
                                                colorTo="#0785ce"
                                                reverse={false}
                                                initialOffset={0}
                                                borderThickness={5}
                                                opacity={1}
                                                glowIntensity={8}
                                                beamBorderRadius={45}
                                                pauseOnHover={false}
                                                speedMultiplier={1.1}
                                            />
                                            <div className="w-full md:w-1/3 relative  h-100 rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                                <StripesBackground
                                                    position="right"
                                                    width="w-full"
                                                    height="h-full"
                                                    opacity="opacity-60"
                                                    className='rounded-3xl'
                                                />
                                                <motion.div className="w-full h-full  rounded-3xl md:border border-info hover:translate-x-[0%] md:hover:translate-x-[2%] hover:translate-y-[0%] md:hover:-translate-y-[1%] hover:scale-104 md:hover:scale-100 transition-all duration-400"
                                                    key={ia.id}
                                                    initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                                    animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                                    exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                                    transition={{ duration: 0.5 }}
                                                >

                                                    <Image height={500} width={500} src={IA[index].img} alt="Formations en ligne" className="transition-all md:transition-none  -translate-x-[6%] md:translate-x-[0%] translate-y-[6%] md:translate-y-[0%] object-cover w-full h-full rounded-2xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></Image>

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
                                                    <CardFooter className="flex md:flex-row flex-col space-y-2 md:space-x-8 items-start ">

                                                        <Button className={`rounded-xl h-fit ${sideBar ? "hover:w-1/2" : "hover:w-1/3"}  w-12 hover:shadow-lg bg-linear-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold `}>
                                                            <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a></Button>


                                                        <Link href={{
                                                            pathname: "/Commande",
                                                            query: {
                                                                commandId: IA[index].id,
                                                                commandType: "IA",
                                                                sessionName: session?.user?.name,
                                                                sessionEmail: session?.user?.email
                                                            },
                                                        }} target="_blank" className="font-bold h-12 rounded-xl w-full transition-transform duration-400 hover:scale-105  hover:-translate-y-1 p-0 shadow-4xl">
                                                            <ShineButton
                                                                className="w-full h-full rounded-xl flex items-center justify-center hover:w-full  shadow-4xl transition-all duration-400  "
                                                                // disable= {downloading}
                                                                label={`Initier la commande`}
                                                                size="lg"
                                                                bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)"
                                                            // onClick={() => handleDownload(searchCoursesResultCurrent[IdOpen].location, searchCoursesResultCurrent[IdOpen].title)}
                                                            />
                                                        </Link>


                                                    </CardFooter>
                                                </Card>

                                            </div>
                                        </div>



                                    </div>
                                ))}

                                {/* Zone des Solutions Design et creativite */}
                                <u><Title title="DESIGN ET CREATIVITE" className="text-4xl pt-2" id="design" /></u>
                                {design.map((des, index) => (
                                    <div className="services-simple-card flex flex-row justify-center rounded-3xl relative p-2 pt-6 md:ml-2" key={des.id} data-theme={`${theme}`}>

                                        <div className="relative flex flex-row w-full justify-between items-center flex-wrap md:flex-nowrap p-4 md:space-x-10 space-y-5 md:space-y-0   rounded-3xl shadow-[0_5px_10px_rgba(0,200,255,0.6)]">

                                            <BorderBeam
                                                size={50}
                                                duration={5.5}
                                                delay={0}
                                                colorFrom="#0785ce"
                                                colorTo="#0785ce"
                                                reverse={false}
                                                initialOffset={0}
                                                borderThickness={5}
                                                opacity={1}
                                                glowIntensity={8}
                                                beamBorderRadius={45}
                                                pauseOnHover={false}
                                                speedMultiplier={1.1}
                                            />

                                            {index == 0 ? (
                                                <div className="w-full md:w-1/3 relative h-fit  rounded-3xl shadow-[0_5px_20px_rgba(0,200,255,0.6)]">
                                                    <StripesBackground
                                                        position="right"
                                                        width="w-full"
                                                        height="h-full"
                                                        opacity="opacity-60"
                                                        className='rounded-3xl'
                                                    />
                                                    <motion.div className="w-auto h-auto  rounded-3xl md:border border-info hover:translate-x-[0%] md:hover:translate-x-[2%] hover:translate-y-[0%] md:hover:-translate-y-[1%] hover:scale-104 md:hover:scale-100 transition-all duration-400"
                                                        key={des.id}
                                                        initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                                        animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                                        exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                                        transition={{ duration: 0.5 }}
                                                    >

                                                        <video autoPlay loop muted playsInline className="transition-all md:transition-none  -translate-x-[6%] md:translate-x-[0%] translate-y-[6%] md:translate-y-[0%]  rounded-3xl "><source src={design[index].img} type="video/mp4" /></video>

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
                                                        <motion.div className="w-full h-full  rounded-3xl md:border border-info hover:translate-x-[0%] md:hover:translate-x-[2%] hover:translate-y-[0%] md:hover:-translate-y-[1%] hover:scale-104 md:hover:scale-100 transition-all duration-400"
                                                            key={des.id}
                                                            initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                                            animate={{ opacity: "100%", x: "6%", y: "-6%", scale: 1 }}
                                                            exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            <Image height={500} width={500} src={design[index].img} alt="Formations en ligne" className=" transition-all md:transition-none  -translate-x-[6%] md:translate-x-[0%] translate-y-[6%] md:translate-y-[0%] object-cover w-full h-full rounded-2xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></Image>
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
                                                    <CardFooter className="flex md:flex-row flex-col space-y-2 md:space-x-8 items-start">

                                                        <Button className={`rounded-xl h-fit ${sideBar ? "hover:w-1/2" : "hover:w-1/3"}  w-12 hover:shadow-lg bg-linear-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold `}>
                                                            <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a></Button>


                                                        <Link href={{
                                                            pathname: "/Commande",
                                                            query: {
                                                                commandId: design[index].id,
                                                                commandType: "Design",
                                                                sessionName: session?.user?.name,
                                                                sessionEmail: session?.user?.email
                                                            },
                                                        }} target="_blank" className="font-bold h-12 rounded-xl w-full transition-transform duration-400 hover:scale-105  hover:-translate-y-1 p-0 shadow-4xl">
                                                            <ShineButton
                                                                className="w-full h-full rounded-xl flex items-center justify-center hover:w-full  shadow-4xl transition-all duration-400 bg-linear-to-tr from-white/40 via-cyan-400 to-blue-500 "
                                                                // disable= {downloading}
                                                                label={`Initier la commande`}
                                                                size="lg"
                                                                bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)"
                                                            // onClick={() => handleDownload(searchCoursesResultCurrent[IdOpen].location, searchCoursesResultCurrent[IdOpen].title)}
                                                            />
                                                        </Link>


                                                    </CardFooter>
                                                </Card>

                                            </div>
                                        </div>



                                    </div>
                                ))}

                                <Footer />
                            </div>

                        </div>
                        {/* </SidebarProvider> */}
                        <AnimatePresence>
                            {sideBar && (
                                <motion.div
                                    initial={{ opacity: 0, width: "0%" }}
                                    animate={{ opacity: 1, width: "25%" }}
                                    exit={{ opacity: 0, width: "0%" }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="md:flex hidden flex-row w-1/4   items-center justify-between space-x-3  pb-5 h-full rounded-sm shadow-[-8px_3px_15px_rgba(0,0,0,0.6),inset_8px_-3px_15px_rgba(0,0,0,0.3),inset_-8px_3px_30px_rgba(255,255,255,0.1)] bg-backdrop-blur  " data-theme={` ${theme}`}>

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
                                                                <div className="h-auto w-0.5 bg-white ">

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
                                                                                            <span className="text-sm flex flex-row gap-3"><i>{Formations.format}</i><i className={`${Formations.classe == "premium" ? "text-yellow-600" : Formations.classe == "sous licence" ? "text-red-700" : "text-info"}`} >{Formations.classe}</i></span>
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
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {!sideBar && (<motion.button
                                initial={{ x: "100%", opacity: 1 }}
                                animate={{ x: "0%", opacity: 1 }}
                                exit={{ x: "100%", opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                onClick={() => setSideBar(true)} className="hidden md:flex fixed right-0 top-35 hover:bg-gray-600 bg-black/20  rounded-l-xl p-5 transition-all duration-300 cursor-pointer"><ChevronLeft className="text-white " /></motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {load && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: 0.3, ease: "easeInOut" }}
                        className="flex flex-row justify-center items-center h-82/100 md:h-85/100 w-full " >
                        <UploaderFile />
                    </motion.div>
                )}
            </AnimatePresence>
        </article >

    );
}

export default Services;
