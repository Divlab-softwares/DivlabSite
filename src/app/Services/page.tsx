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
import { OnlineFormations, Websites, IA, design, Papers } from '@/app/data_restructured.js'
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
import { ShineButton } from "../Components/lightswind/shine-button";
import TextType from "../Components/TextType";
import { BorderBeam } from "../Components/lightswind/border-beam";


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

    const [searchCoursesResult, setSearchCoursesResult] = useState<typeof OnlineFormations>(OnlineFormations.map(course => ({
        ...course,
        _normTitle: normalizeText(course.Title)
    })));

    const [searchPapersResult, setSearchPapersResult] = useState<typeof Papers>(Papers.map(paper => ({
        ...paper,
        _normTitle: normalizeText(paper.Title)
    })));
    const [searchCoursesResultCurrent, setSearchCoursesResultCurrent] = useState<typeof OnlineFormations>(OnlineFormations)
    const [searchPapersResultCurrent, setSearchPapersResultCurrent] = useState<typeof Papers>(Papers)
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

    const [currentPaperPage, setCurrentPaperPage] = useState(1);
    const itemsPerPaperPage = 5;
    const startPaperIndex = (currentPaperPage - 1) * itemsPerPaperPage;

    const [displayedFormations, setDisplayedFormations] = useState(searchCoursesResult.slice(startIndex, startIndex + itemsPerPage));
    const [displayedPapers, setDisplayedPapers] = useState(searchPapersResult.slice(startPaperIndex, startPaperIndex + itemsPerPaperPage));
    const totalPages = Math.ceil(searchCoursesResult.length / itemsPerPage);
    const totalPaperPages = Math.ceil(searchPapersResult.length / itemsPerPaperPage);
    const [signResult, setSignResult] = useState<SignResult | null>(null);

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
            normalizeText(course.Title).includes(q)
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
        category: categorize(f.Title),
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
   const [filiereCategoryPaper, setFiliereCategoryPaper]= useState("tout");
    const [levelCategoryPaper, setLevelCategoryPaper] = useState("tout"); 
    const [typeCategoryPaper, settypeCategoryPaper]= useState("tout");

    const handleSelect = (value: string, categoryType: string, group: string) => {
        // const cat = categorize(value)
        let c = category
        let f = formatCategory
        let cl = classeCategory
        let c_p = categoryPaper
        let f_p = formatCategoryPaper
        let cl_p = classeCategoryPaper
        let f_l=filiereCategoryPaper
        let l_p = levelCategoryPaper
        let t_p= typeCategoryPaper

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
                        console.log("test filiere" , f_l)

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
            setNewCategorizedPapers(selectCategory({category: c_p,format:  f_p,classe: cl_p,filiere: f_l,level: l_p, type: t_p, group: group}))
        } else if (group == "formation") {
            setNewCategorizedCourses(selectCategory({category: c,format: f, classe: cl,group: group}))
        }

    }


    // --- Étape 1 : pré-normalisation (à faire une seule fois, ex: au chargement)
    const preNormalizedCourses = categorizedCourses.map(course => ({
        ...course,
        _normCategory: normalizeText(course.category.map(cat => cat.category).join(" ")),
        _normFormat: normalizeText(course.Format),
        _normClasse: normalizeText(course.Class),
   
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

    const selectCategory = (options : GetDataOptions) => {
        const { category, format, classe, level, filiere, type, group } = options;
        const key = `${category}|${format}|${classe}|${group}|${level}|${filiere}|${type}`;
        const cacheToUse = group === "epreuve" ? cachePaper : cache;
        if (cacheToUse.has(key)) {
            return cacheToUse.get(key); // renvoie directement le résultat précédent
        }
        const PrenormalizedTable = group === "epreuve" ? preNormalizedPapers : preNormalizedCourses;

        const normalizedC = normalizeText(category|| "");
        const normalizedF = normalizeText(format|| "");
        const normalizedCL = normalizeText(classe|| "");
        const normalizedL = normalizeText(level || "");
        const normalizedFL = normalizeText(filiere || "");
        const normalizeT = normalizeText(type || "");
        console.log("Categorie:", category, "Type:", type, "Class:", classe, "Format:", format,"Level:", level,"Filiere:",filiere);

        const filtered = PrenormalizedTable.filter(course => {
           const matchCategory =  normalizedC === "tout" || course._normCategory.includes(normalizedC);
           const matchClasse = normalizedCL === "tout" || course._normClasse.includes(normalizedCL);
           const matchFormat = normalizedF === "tout" || course._normFormat.includes(normalizedF);
            const matchType = group ==="epreuve"
                ? (normalizeT==="tout" ||("_normType"in course && typeof (course as any)._normType==="string" && (course as any)._normType.includes(normalizeT)))
                : true;
            const matchFiliere =  group ==="epreuve"
                ? (normalizedFL==="tout" || ("_normFiliere" in course && typeof(course as any)._normFiliere==="string" && (course as any)._normFiliere.includes(normalizedFL)))
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
                <div className="relative w-full h-1/2 md:h-full bg-white/30  gap-1 flex flex-row items-center justify-center  rounded-2xl">

                    <Input onKeyDown={handleKeyDown} type="text" value={searchData} className="bg-blue-200 w-full h-full  hover:bg-blue-300 text-gray-800" onChange={handleChange} placeholder="Vous cherchez une formation ? ..." data-theme={`${theme}`} />
                    <div className="absolute flex flex-row gap-1 right-2 top-1/2 transform -translate-y-1/2">
                        <button className="transition-all duration-200 hover:bg-red-300 rounded-md p-1" onClick={clearSearch} > <X size={18} /></button>
                        <button onClick={handleSubmit} className="transition-all duration-200 hover:bg-blue-400 rounded-md p-1"><Search size={18} /></button>
                    </div>

                    {/* <Button onClick={handleSubmit} type="submit" variant="ServicesSearch" className="h-full" >Rechercher</Button> */}

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
                            <div className="h-full flex flex-row items-center justify-center gap-2">
                                <button className={`text-bold cursor-pointer ${sign == 1 ? "bg-blue-700 " : "hover:bg-blue-300"}    border font-bold rounded-xl h-full text-sm px-2`} onClick={() => { setSign(prev => (prev === 1 ? undefined : 1)) }} >Se connecter</button>
                                <span> | </span>
                                <button className={`text-bold cursor-pointer ${sign == 0 ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700"}   font-bold rounded-xl h-full text-sm px-2`} onClick={() => { setSign(prev => (prev === 0 ? undefined : 0)) }}>S'inscrire</button>
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
                        <Button disabled={signOutVal == 2} onClick={() => { setSignOutVal(2); signOut({ callbackUrl: '/Services' }) }} className="cursor-pointer bg-red-500 hover:bg-red-600">{signOutVal === 2 ? 'Chargement, veuillez patienter...' : 'Se déconnecter'}</Button>
                    </motion.div >
                )}
            </AnimatePresence>
            <div className="flex flex-row justify-between h-82/100 md:h-85/100 w-full  gap-3 " data-theme={`${theme}`}>
              
                    <div className={`flex flex-col   ${sideBar ? "md:w-3/4" : "md:w-full w-full"}  transition-all duration-300 h-full flex-wrap md:flex-nowrap  `}>

                        <div className="h-full w-full overflow-auto space-y-4  scroll-smooth">
                            <hr className="mb-4" />
                            <u><Title title="FORMATIONS" className="text-4xl pt-2" id="formations" /></u>

                            {/* Zone des formations en e-book*/}

                            <div className={` ${changeCourseHeight == 1 ? "min-h-155" : "h-fit"}  transition-all duration-300 ease-in-out flex flex-row justify-center p-3 pt-6 rounded-3xl ml-2 shadow-[0_5px_20px_rgba(0,200,255,0.6)] rounded-3xl`} data-theme={`${theme}`}>



                                <div className="flex flex-row relative w-full justify-between  items-start p-4 md:space-x-10 space-y-7 flex-wrap md:flex-nowrap  " >

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

                                                <img src={IdOpen == -1 ? "/assets/formation.webp" : searchCoursesResultCurrent[IdOpen].Img} alt="Formations en ligne" className="transition-all duration-400 md:transition-none  -translate-x-[5%] md:-translate-x-[0%] translate-y-[5%] md:-translate-y-[0%] object-cover md:w-full md:h-auto  w-auto h-80   rounded-xl hover:shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></img>

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
                                                    <CardTitle className=" text-3xl whitespace-pre-wrap"> {IdOpen == -1 ? (
                                                        <TextType
                                                            text={["Vos formations en ligne sur mesure.", "Devellopez vos competences grace a un seul click.", "Obtenez le meilleur service qui puisse etre offert."]}
                                                            typingSpeed={90}
                                                            pauseDuration={3000}
                                                            showCursor={true}
                                                            cursorCharacter="|"
                                                            // onSentenceComplete={(sentence = "Votre Divlab space a ete cree avec succes.", index = 0) => setSide("open")}
                                                            className="text-4xl font-bold"
                                                        />
                                                    ) : searchCoursesResultCurrent[IdOpen].Title}</CardTitle>
                                                    <hr />
                                                    <CardDescription className="flex flex-col flex-wrap gap-2 items-start" >
                                                        <span className="flex flex-row flex-wrap gap-2 items-center justify-center">
                                                            <span className={`${IdOpen == -1 ? "" : "badge badge-info badge-outline  badge-md  mt-2  rounded-full"}`}><i> {IdOpen == -1 ? "pdf / videos / images / presentations..." : searchCoursesResultCurrent[IdOpen].Format}</i></span>
                                                            <span className={`${IdOpen == -1 ? "" : "badge badge-soft badge-outline  badge-md  mt-2  rounded-full"}`}><i> {IdOpen == -1 ? "" : `${searchCoursesResultCurrent[IdOpen].Pages} Pages`} </i></span>
                                                            <span className={`${IdOpen == -1 ? "" : (`badge  badge-outline rounded-full badge-md mt-2   ${searchCoursesResultCurrent[IdOpen].Class == "premium" ? " text-yellow-400  bg-black font-semibold" : searchCoursesResultCurrent[IdOpen].Class == "sous licence" ? "badge-accent" : "badge-info"} `)}`}>{IdOpen == -1 ? "" : searchCoursesResultCurrent[IdOpen].Class}  </span>
                                                            <span className="text-3xl  animate-zoom text-center ml-3 underline decoration-1  decoration-gray-100  ">{IdOpen == -1 ? "" : searchCoursesResultCurrent[IdOpen].Class == "premium" ? `${PromPrice} FCFA` : ""}</span>
                                                            <span className="text-red-500 ml-3"> {IdOpen == -1 ? "" : searchCoursesResultCurrent[IdOpen].Class == "premium" ? `Prix promotionnel` : ""}</span>
                                                        </span>
                                                        <span className="">
                                                            {IdOpen == -1 ? "" : (searchCoursesResultCurrent[IdOpen].Author !== "Inconnu" && searchCoursesResultCurrent[IdOpen].Author !== "Author") ? (<span className="text-md font-bold">Auteur: {searchCoursesResultCurrent[IdOpen].Author}</span>) : ""}
                                                        </span>
                                                    </CardDescription>

                                                </CardHeader>
                                                <CardContent className="">

                                                    <p>{IdOpen == -1 ? "Devenez le meilleur de vous avec les formations sur mesure et adaptés à la lecture et la compréhension facile." : searchCoursesResultCurrent[IdOpen].Description} </p>
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
                                                ) : (searchCoursesResultCurrent[IdOpen].Class != "premium" ? (

                                                    <Link href={searchCoursesResultCurrent[IdOpen].Location} download={searchCoursesResultCurrent[IdOpen].Location.split("/").pop()} className="font-bold h-12 rounded-xl w-full   transition-transform duration-400 hover:scale-105  hover:-translate-y-1 p-0 shadow-4xl">
                                                        <ShineButton
                                                            className="w-full h-full rounded-xl flex items-center justify-center hover:w-full  shadow-4xl transition-all duration-400 bg-linear-to-tr from-white/40 via-cyan-400 to-blue-500 "
                                                            label="Télécharger"
                                                            size="lg"
                                                            bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)"
                                                        //onClick={() => alert('Thanks for your support!')}
                                                        />
                                                    </Link>
                                                ) : (
                                                    <div className="flex md:flex-row flex-wrap  space-y-2 md:space-y-0 md:space-x-2 w-full  items-center justify-center">
                                                        <Link href="https://layidgpo.mychariow.com" target="_blank" className="font-bold h-12 w-full hover:scale-105 hover:-translate-y-1 shadow-xl transition-all duration-400 bg-linear-to-tr rounded-xl">
                                                            <ShineButton
                                                                className="w-full h-full rounded-xl p-2 flex items-center justify-center"
                                                                label="Acheter (via chariow)"
                                                                size="lg"
                                                                bgColor="linear-gradient(325deg, hsl(24 100% 50%) 0%, hsl(34 100% 60%) 55%, hsl(24 100% 50%) 90%)"
                                                            />
                                                        </Link>
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
                                            {!sideBar && IdOpen != -1 && openCollapse == 0 && (<Button onClick={() => handleOpenCollapse("formation")} className="h-10 rounded-xl w-auto md:w-2/3 bg-blue-500   transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0 ">
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
                                        {newCategorizedCourses.length != 0 && (<CardDescription><i>Recherches en fonction de Categorie = "{category}" ,  Format ="{formatCategory}" , Classe = "{classeCategory}"</i></CardDescription>)}

                                        </CardHeader>
                                        <CardContent className="h-full w-full py-2 overflow-auto flex items-center justify-start px-2">
                                            <div className="w-fit h-full flex flex-row gap-2">
                                                {newCategorizedCourses.map((course, index) => (
                                                    <button key={course.Id} onClick={() => { setSearchCoursesResultCurrent(newCategorizedCourses), setIdOpen(index), setChangeCourseHeight(1) }} className="w-40 h-full p-1 rounded-xl shadow-[-8px_2px_15px_rgba(0,0,0,0.6)] hover:bg-black/20">
                                                        <Link href="#formations" className=" flex flex-col items-center h-full overflow-hidden ">
                                                            <Image height={500} width={500} src={course.Img} alt="Formations en ligne" className="  w-full h-4/5  rounded-xl shadow-[-3px_1px_7px_rgba(0,200,255,0.6)] mr-1"></Image>

                                                            <div className="flex flex-col w-full items-start whitespace-nowrap p-1">
                                                                <p className="text-sm font-medium"><i>{course.Location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</i></p>
                                                                <span className="text-sm flex flex-row gap-3"><i>{course.Format}</i><i className={`${course.Class == "premium" ? "text-yellow-500" : "text-info"}`} >{course.Class}</i></span>
                                                                <span className={`${IdOpen == -1 ? "" : "badge badge-info badge-outline  badge-md  mt-2  rounded-full"}`}><i> {IdOpen == -1 ? "" : searchCoursesResultCurrent[IdOpen].Pages} pages</i></span>
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
                                            <Link href="#formations" onClick={() => { handleOpenCollapse("formation"), handleCilck(-1), setChangeCourseHeight(0) }} className=" mb-2 rounded-full w-10 h-10 bg-black/20 hover:bg-blue-500 flex items-center justify-center cursor-pointer">{<X />}</Link>

                                            <motion.div
                                                initial={{ opacity: 0, y: 40 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 40 }}
                                                transition={{ duration: 0.6, ease: "easeOut" }}
                                                className="relative"
                                            >
                                                <div className="h-auto w-full relative flex flex-row space-y-8 p-2 rounded-xl flex-wrap space-x-4  md:space-x-6 justify-center">
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
                                                                className="h-120 cursor-pointer " key={Formations.Id} onClick={() => { setIdOpen(index), setChangeCourseHeight(1), setSearchCoursesResultCurrent(displayedFormations) }} >
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
                                                                                        src={Formations.Img} // https://picsum.photos/500/350?image=${(id + 5) * 11}
                                                                                    />
                                                                                </div>
                                                                                <CardTitle className=""><p className="text-sm font-bold"><i>{Formations.Title?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</i></p></CardTitle>
                                                                                <CardDescription><span className="text-sm flex flex-row gap-3"><i>{Formations.Format}</i><i className={`${Formations.Class == "premium" ? "text-yellow-500" : "text-info"}`} >{Formations.Class}</i><i className={`text-info`} >{Formations.Pages} pages</i></span></CardDescription>
                                                                                <hr />
                                                                            </CardHeader>
                                                                            <CardContent className=" ">
                                                                                <p className="line-clamp-3 leading-relaxed ">{Formations.Description}</p>
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

                            <u><Title title="EPREUVES" className="text-4xl pt-2" id="papers" /></u>

                            {/* Zone des Epreuves*/}

                            <div className={` ${changePaperHeight == 1 ? "min-h-155" : "h-fit"} transition-all duration-300 ease-in-out flex flex-row justify-center p-3 pt-6 rounded-3xl ml-2 shadow-[-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2)]`} data-theme={`${theme}`}>

                                <div className="relative flex flex-row w-full justify-between  items-start p-4 md:space-x-10 space-y-7 flex-wrap md:flex-nowrap " >
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
                                                key={IdPaperOpen}
                                                initial={{ opacity: "0%", x: 0, y: 0, scale: 0.8 }}
                                                animate={{ opacity: "100%", x: "5%", y: "-5%", scale: 1 }}
                                                exit={{ x: "20%", y: "-20%", opacity: "0%", scale: 0.8 }}
                                                transition={{ duration: 0.5 }}
                                            >

                                                <img src={IdPaperOpen == -1 ? "/assets/epreuve.jpeg" : searchPapersResultCurrent[IdPaperOpen].Img} alt="Formations en ligne" className="transition-all duration-400   -translate-x-[5%] md:-translate-x-[0%] translate-y-[5%] md:-translate-y-[0%] object-cover md:w-full md:h-auto  w-auto h-80   rounded-xl hover:shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></img>

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
                                                    <CardTitle className=" text-3xl uppercase whitespace-pre-wrap"> {IdPaperOpen == -1 ? "EPREUVES" : searchPapersResultCurrent[IdPaperOpen].Location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</CardTitle>
                                                    <hr />
                                                    <CardDescription className="flex flex-row flex-wrap gap-2 items-center">
                                                        <div className="flex flex-row flex-wrap gap-2 items-center justify-center">
                                                            <span className={`${IdPaperOpen == -1 ? "" : "badge badge-info badge-outline  badge-md  mt-2  rounded-full"}`}><i> {IdPaperOpen == -1 ? "pdf / videos / images / presentations..." : searchPapersResultCurrent[IdPaperOpen].Format}</i></span>
                                                            {/* <span className={`${IdPaperOpen == -1 ? "" : "badge badge-soft badge-outline  badge-md  mt-2  rounded-full"}`}><i> {IdPaperOpen == -1 ? "" : `${searchPapersResultCurrent[IdPaperOpen].Pages} Pages`} </i></span> */}
                                                            <span className={`${IdPaperOpen == -1 ? "" : (`badge  badge-outline rounded-full badge-md mt-2   ${searchPapersResultCurrent[IdPaperOpen].Class == "premium" ? " text-yellow-400  bg-black font-semibold" : searchPapersResultCurrent[IdPaperOpen].Class == "sous licence" ? "badge-accent" : "badge-info"} `)}`}>{IdPaperOpen == -1 ? "" : searchPapersResultCurrent[IdPaperOpen].Class}  </span>
                                                            <span className="text-3xl  animate-zoom text-center ml-3 underline decoration-1  decoration-gray-100  ">{IdPaperOpen == -1 ? "" : searchPapersResultCurrent[IdPaperOpen].Class == "premium" ? `${PromPrice} FCFA` : ""}</span>
                                                            <span className="text-red-500 ml-3"> {IdPaperOpen == -1 ? "" : searchPapersResultCurrent[IdPaperOpen].Class == "premium" ? `Prix promotionnel` : ""}</span>
                                                        </div>
                                                        {/* <div className="">
                                                        {IdPaperOpen == -1 ? "" : (searchPapersResultCurrent[IdPaperOpen].Author !== "Inconnu" && searchPapersResultCurrent[IdPaperOpen].Author !== "Author") ? (<span className="text-md font-bold">Auteur: {searchPapersResultCurrent[IdPaperOpen].Author}</span>) : ""}
                                                    </div> */}
                                                    </CardDescription>

                                                </CardHeader>
                                                {/* <CardContent className="">

                                                <p>{IdPaperOpen == -1 ? "Decouvrez les epreuves qui vous permettrons enfin de reviser facilement, de manière ludique et interactive." : searchPapersResultCurrent[IdPaperOpen].Description} </p>
                                            </CardContent> */}
                                            </motion.div>
                                            <CardFooter className="flex md:flex-row flex-col space-y-8 md:space-y-0 items-align md:space-x-2 w-full mt-5">

                                                {IdPaperOpen === -1 ? (
                                                    <Button onClick={() => handleOpenCollapse("epreuve")} className="h-12 rounded-xl w-auto md:w-2/3 bg-blue-500   transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0 ">
                                                        <a href={`${openPaperCollapse == 1 ? "#paperslist" : "#papers"}`} className="w-full h-full p-2 flex items-center justify-center">{openPaperCollapse == 0 ? "Afficher toutes les epreuves" : "Fermer les epreuves"}</a>
                                                    </Button>
                                                ) : (searchPapersResultCurrent[IdPaperOpen].Class != "premium" ? (

                                                    <Button className="h-12 rounded-xl w-full md:w-2/3 bg-blue-500   transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0 ">
                                                        <a href={searchPapersResultCurrent[IdPaperOpen].Location} download={searchPapersResultCurrent[IdPaperOpen].Location.split("/").pop()} className="w-full h-full flex items-center justify-center hover:w-full  shadow-4xl transition-all duration-400 bg-gradient-to-tr from-white/40 via-cyan-400 to-blue-500 ">Telecharger</a>
                                                    </Button>
                                                ) : (
                                                    <div className="flex md:flex-row flex-wrap  space-y-2 md:space-y-0 md:space-x-2 w-full  items-center justify-center">
                                                        <Button className="transition-all duration-300 h-12 w-auto md:w-2/3 hover:h-15  hover:w-full  shadow-4xl  bg-gradient-to-tr from-white/40 via-yellow-400 to-orange-500 ">
                                                            <Link href="https://layidgpo.mychariow.com" target="_blank" className="w-full h-full p-2 flex items-center justify-center">Acheter {"( via chariow )"}</Link>
                                                        </Button>
                                                        {/* <PayButton amount={PromPrice} item_ref={searchPapersResultCurrent[IdPaperOpen].location.split("DIVLAB_").pop()?.split(".")[0] ?? ""} startPaymentCheck={startPaymentCheck} /> */}
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
                                            {!sideBar && IdPaperOpen != -1 && openPaperCollapse == 0 && (<Button onClick={() => handleOpenCollapse("epreuve")} className="h-10 rounded-xl w-auto md:w-2/3 bg-blue-500   transition-transform duration-400 hover:scale-99  hover:translate-y-1 p-0 ">
                                                <a href={`#paperslist`} className="w-full h-full p-2 flex items-center justify-center">Afficher toutes les formations</a>
                                            </Button>)}
                                        </Card>

                                    </div>
                                </div>
                            </div>
                            <div id="paperscategory" className="h-90">

                                <div className="flex relative h-full   w-full  rounded-3xl p-2  shadow-[-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2)]" >

                                <Card className="w-full relative h-full rounded-4xl flex flex-col justify-start border-none ">
                                    <CardHeader className="py-2">
                                        <div className="  flex flex-col md:flex-row gap-5 items-start ">
                                            <span className="text-2xl font-bold">Categorisation</span>
                                            <div className="gap-2 flex flex-wrap md:flex-row">
                                                <span className="flex flex-row items-center gap-1">
                                                    <p className="text-md font-medium">Format : </p>
                                                    <Select onValueChange={(value) => {
                                                        handleSelect(value, "format", "epreuve");
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
                                                    <p className="text-md font-medium">categorie : </p>

                                                 <Select onValueChange={(value) => {
                                                        handleSelect(value, "category", "epreuve");
                                                    }}>
                                                        <SelectTrigger className="w-[200px]">
                                                            <SelectValue placeholder="Choisir la categorie..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-black/80">
                                                            <SelectItem value="informatique">informatique</SelectItem>
                                                            <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                                                            <SelectItem value="autre">autre</SelectItem>
                                                           
                                                        </SelectContent>
                                                    </Select>
                                                </span>


                                                <span className="flex flex-row items-center gap-1">
                                                    <p className="text-md font-medium">Niveau scolaire : </p>


                                                    <Select onValueChange={(value) => {
                                                        handleSelect(value, "level", "epreuve");
                                                    }}>
                                                        <SelectTrigger className="w-[200px]">
                                                            <SelectValue placeholder="Choisir le niveau scolaire..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-black/80">
                                                            <SelectItem value="niveau 1 universitaire">niveau 1 universitaire</SelectItem>
                                                            <SelectItem value="niveau 2 universitaire">niveau 2 universitaire</SelectItem>
                                                            <SelectItem value="niveau 3 universitaire">niveau 3 universitaire</SelectItem>
                                                        
                                                        </SelectContent>
                                                    </Select>
                                                </span>
                                                 <span className="flex flex-row items-center gap-1">
                                                    <p className="text-md font-medium">classe: </p>

                                                    <Select onValueChange={(value) => {
                                                        handleSelect(value, "classe", "epreuve");
                                                    }}>
                                                        <SelectTrigger className="w-[200px]">
                                                            <SelectValue placeholder="Choisir la categorie..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-black/80">
                                                        <SelectItem value="tout">Tout...</SelectItem>
                                                        <SelectItem value="premium">premium</SelectItem>
                                                        <SelectItem value="free">gratuit</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </span>
                                                <span className="flex flex-row items-center gap-1">
                                                    <p className="text-md font-medium">filiere : </p>

                                                 <Select onValueChange={(value) => {
                                                        handleSelect(value, "filiere", "epreuve");
                                                    }}>
                                                        <SelectTrigger className="w-[200px]">
                                                            <SelectValue placeholder="Choisir la categorie..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-black/80">
                                                            <SelectItem value="SDIA ( Science des donnees et Inteligence Artificielle)">SDIA ( Science des donnees et Inteligence Artificielle)</SelectItem>
                                                            <SelectItem value= "Toutes les specialites"> Toutes les specialites</SelectItem>
                                                            <SelectItem value= "GC (Geni civil), INFOTEL (Informatique et Telecommunication)">GC (Geni civil), INFOTEL (Informatique et Telecommunication)</SelectItem>
                                                               <SelectItem value= "none"> aucune</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </span>
                                                 <span className="flex flex-row items-center gap-1">
                                                    <p className="text-md font-medium">Type : </p>
                                                   

                                                    <Select onValueChange={(value) => {
                                                        handleSelect(value, "type", "epreuve");
                                                    }}>
                                                        <SelectTrigger className="w-[200px]">
                                                            <SelectValue placeholder="Choisir le type d'epreuve..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-black/80">
                                                            <SelectItem value="tout">Tout...</SelectItem>
                                                            <SelectItem value="Concours">Concours</SelectItem>
                                                            <SelectItem value="Examen">Examens</SelectItem>
                                                            <SelectItem value="Séquences">Séquences</SelectItem>
                                                            <SelectItem value="TD">TD</SelectItem>

                                                        </SelectContent>
                                                    </Select>
                                                </span>
                                            </div>

                                        </div>
                                        <hr />
                                        {newCategorizedPapers.length != 0 && (<CardDescription><i>Recherches en fonction de cotegorie = "{categoryPaper}" , Format = "{formatCategoryPaper}" , Niveau scolaire = "{levelCategoryPaper},    classe="{classeCategoryPaper}" ,  filiere="{filiereCategoryPaper}",   type="{typeCategoryPaper}"</i></CardDescription>)}

                                        </CardHeader>
                                        <CardContent className="h-full w-full py-2 overflow-auto flex items-center justify-start px-2">
                                            <div className="w-fit h-full flex flex-row gap-2">
                                                {newCategorizedPapers.map((course, index) => (
                                                    <button key={course.Id} onClick={() => { setSearchPapersResultCurrent(newCategorizedPapers), setIdPaperOpen(index), setChangePaperHeight(1) }} className="w-40 h-full p-1 rounded-xl shadow-[-8px_2px_15px_rgba(0,0,0,0.6)] hover:bg-black/20">
                                                        <Link href="#papers" className=" flex flex-col items-center h-full overflow-hidden ">
                                                            <Image height={500} width={500} src={course.Img} alt="Formations en ligne" className="  w-full h-4/5  rounded-xl shadow-[-3px_1px_7px_rgba(0,200,255,0.6)] mr-1"></Image>

                                                            <div className="flex flex-col w-full items-start whitespace-nowrap p-1">
                                                                <p className="text-sm font-medium"><i>{course.Location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</i></p>
                                                                <span className="text-sm flex flex-row gap-3"><i>{course.Format}</i><i className={`${course.Class == "premium" ? "text-yellow-500" : "text-info"}`} >{course.Class}</i></span>
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
                            <div id="paperslist" className={`${sideBar ? "md:hidden" : ""}  w-full h-auto  rounded-2xl shadow-[inset_7px_-7px_80px_rgba(0,0,0,0.8),-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2),inset_-7px_7px_20px_rgba(255,255,255,0.3)]`} data-theme={`${theme}`}>
                                <Collapsible open={openPaperCollapse == 1} onOpenChange={() => setOpenCollapse(0)} className=" ">

                                    <CollapsibleTrigger asChild className="">

                                    </CollapsibleTrigger>
                                    <CollapsibleContent className=" p-2">
                                        <div className="flex flex-col w-full h-auto space-y-2">
                                            <Link href="#papers" onClick={() => { handleOpenCollapse("epreuve"), setIdPaperOpen(-1), setChangePaperHeight(0) }} className=" mb-2 rounded-full w-10 h-10 bg-black/20 hover:bg-blue-500 flex items-center justify-center cursor-pointer">{<X />}</Link>

                                            <motion.div
                                                initial={{ opacity: 0, y: 40 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 40 }}
                                                transition={{ duration: 0.6, ease: "easeOut" }}
                                                className="relative"
                                            >
                                                <div className="h-auto w-full relative flex flex-row space-y-8 p-2 rounded-xl flex-wrap space-x-4 md:space-x-6 justify-center">
                                                    <AnimatePresence mode="popLayout">
                                                        {displayedPapers.map((Formations, index) => (
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
                                                                className="h-120 cursor-pointer " key={Formations.Id} onClick={() => { setIdPaperOpen(index), setChangePaperHeight(1), setSearchPapersResultCurrent(displayedPapers) }} >
                                                                <InteractiveGradient

                                                                    color="#1890ff"
                                                                    glowColor="#1076675d"
                                                                    followMouse={true}
                                                                    hoverOnly={false}
                                                                    intensity={100}
                                                                    backgroundColor={cardCol}
                                                                    width="20rem"
                                                                    height="full"
                                                                    borderRadius="1.5rem"
                                                                    className="flex items-start h-full transition  duration-400   ease-in-out hover:border-info hover:scale-102  hover:-translate-y-2 p-0 hover:shadow-[0_5px_20px_rgba(0,0,0,0.6)] justify-center h-100% mt-5  shadow-[0_5px_20px_rgba(0,0,0,0.5)] ">
                                                                    <Link href="#papers" className=" w-full h-full">
                                                                        <Card className={` w-100% relative h-100%  border-none flex flex-col p-0 ${textCol}`}>
                                                                            <CardHeader className=" h-120 p-2 flex flex-col items-center justify-end overflow-y-hidden">
                                                                                <div className="w-full h-8/10 rounded-3xl bg-gray-500 transform duration-300 hover:scale-104 mb-2 ">
                                                                                    <Image
                                                                                        alt=""
                                                                                        width={500}
                                                                                        height={500}

                                                                                        className={" shadow-[0_5px_20px_rgba(0,200,255,0.6)] relative h-full w-full rounded-3xl "}
                                                                                        src={Formations.Img} // https://picsum.photos/500/350?image=${(id + 5) * 11}
                                                                                    />
                                                                                </div>
                                                                                <div className="w-full h-2/10 px-1 flex flex-col items-start justify-between">
                                                                                    <hr />
                                                                                    <CardTitle className=""><p className="text-xl font-bold line-clamp-2 leading-relaxed "><i>{Formations.Location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</i></p></CardTitle>
                                                                                    <CardDescription><span className="ml-2 text-sm flex flex-row gap-3"><i>{Formations.Format}</i><i className={`${Formations.Class == "premium" ? "text-yellow-500" : "text-info"}`} >{Formations.Class}</i></span></CardDescription>

                                                                                </div>

                                                                            </CardHeader>
                                                                            {/* <CardContent className=" ">
                                                                            <p className="line-clamp-3 leading-relaxed ">{Formations.Description}</p>
                                                                        </CardContent> */}

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
                                                    disabled={currentPaperPage === 1}
                                                    onClick={() => {
                                                        const newPage: number = Math.max(currentPaperPage - 1, 1);
                                                        setCurrentPaperPage(newPage);
                                                        handlePaperPageChange(newPage);
                                                    }}
                                                    className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 text-black"
                                                >
                                                    <Link href="#paperslist" className="w-full h-full">
                                                        ←
                                                    </Link>
                                                </button>

                                                {/* Pages dynamiques */}
                                                {getPageNumbers("epreuve").map((page, index) =>
                                                    page === "..." ? (
                                                        <span key={index} className="px-2 text-blue-500">
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={index}
                                                            onClick={() => handlePaperPageChange(Number(page))}
                                                            className={`cursor-pointer transition-all duration-400 ease-in-out px-3 py-1 rounded-lg ${currentPaperPage === page
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-gray-200 hover:bg-gray-300 text-black"
                                                                }`}
                                                        >
                                                            <Link href="#paperslist" className="w-full h-full">
                                                                {page}
                                                            </Link>

                                                        </button>
                                                    )
                                                )}

                                                {/* Bouton suivant */}
                                                <button
                                                    disabled={currentPaperPage === totalPaperPages}
                                                    onClick={() => {
                                                        const newPage: number = Math.min(currentPaperPage + 1, totalPaperPages);
                                                        setCurrentPaperPage(newPage);
                                                        handlePaperPageChange(newPage);
                                                    }}
                                                    className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 text-black"
                                                >
                                                    <Link href="#paperslist" className="w-full h-full">
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

                            <div id="formationsOnline" className="flex flex-row h-fit  md:p-4 space-y-4 ">
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

                            {/* Zone des formations en presentiel*/}

                            <div id="formationPresentiel" className="flex flex-row h-fit  md:p-4 space-y-4 ">
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

                            {/* Zone des Solutions web */}
                            <u><Title title="SOLUTIONS WEB" className="text-4xl pt-2" id="solutions web" /></u>
                            {Websites.map((site, index) => (
                                <div className="flex flex-row  justify-center rounded-3xl relative p-2 pt-6 my-7 ml-2 shadow-[-8px_15px_20px_rgba(0,0,0,0.7),-3px_5px_20px_rgba(0,200,255,0.2)] " key={site.id} data-theme={`${theme}`}>
                                    <Image height={30} width={30} src="/assets/promo.svg" alt="promo" className="absolute w-30 h-30 top-0 right-10 -rotate-10 animate-zoom z-5"></Image>

                                    <div className="relative flex flex-row w-full justify-between flex-wrap md:flex-nowrap  items-center  p-4 md:space-x-10 space-y-7 shadow-[0_5px_10px_rgba(0,200,255,0.6)]" >

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

                                                <Image height={500} width={500} src={Websites[index].img} alt="Formations en ligne" className="transition-all md:transition-none  -translate-x-[6%] md:translate-x-[0%] translate-y-[6%] md:translate-y-[0%] object-cover w-full h-full rounded-2xl shadow-[0_0_3px_3px_rgba(0,200,255,0.6)]"></Image>

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

                                                    <Button className={`rounded-xl h-fit ${sideBar ? "hover:w-1/2" : "hover:w-1/3"}  w-12 hover:shadow-lg bg-linear-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold `}>
                                                        <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a></Button>


                                                    <HoverCard
                                                        openDelay={100}
                                                        closeDelay={0}
                                                        NewClassName="text-white rounded-xl w-full bg-blue-500  relative shadow-4xl  transition-transform duration-400 hover:scale-99  "
                                                    >
                                                        <HoverCardTrigger asChild>
                                                            <Button className="w-full md:2/3 h-full p-0 bg-gray-500">
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
                                                <CardFooter className="flex flex-row space-x-2 ">

                                                    <Button className={`rounded-xl h-fit ${sideBar ? "hover:w-1/2" : "hover:w-1/3"}  w-12 hover:shadow-lg bg-gradient-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold `}>
                                                        <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a></Button>


                                                    <HoverCard
                                                        openDelay={100}
                                                        closeDelay={0}
                                                        NewClassName="text-white rounded-xl w-full bg-blue-500  relative shadow-4xl  transition-transform duration-400 hover:scale-99  "
                                                    >
                                                        <HoverCardTrigger asChild>
                                                            <Button className="md:2/3 w-full h-full p-0">
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
                                                <CardFooter className="flex flex-row space-x-2">

                                                    <Button className={`rounded-xl h-fit ${sideBar ? "hover:w-1/2" : "hover:w-1/3"}  w-12 hover:shadow-lg bg-gradient-to-br from-green-500 via-white/80 to-green-500   shadow-4xl  transition-all duration-400 hover:scale-99   p-0 text-green-900 font-bold `}>
                                                        <a href="whatsapp://send?phone=237652509674 " className="w-full h-full flex items-center justify-start overflow-hidden text-md font-bold"><img src={Whatsapp.src} alt="" className="w-12 h-12 rounded-full " /> Discuter sur whatsapp</a></Button>


                                                    <HoverCard
                                                        openDelay={100}
                                                        closeDelay={0}
                                                        NewClassName="text-white rounded-xl w-full bg-blue-500  relative shadow-4xl  transition-transform duration-400 hover:scale-99  "
                                                    >
                                                        <HoverCardTrigger asChild>
                                                            <Button className="w-full md:2/3 h-full p-0">
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
                    {sideBar && (
                        <motion.div
                            initial={{  opacity: 0, width: "0%" }}
                            animate={{ opacity: 1, width: "25%" }}
                            exit={{  opacity: 0, width: "0%" }}
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
                                                        <div className="h-auto w-[2px] bg-white ">

                                                        </div>
                                                        {searchCoursesResult.length != 0 ?
                                                            (
                                                                <div className=" flex flex-col space-y-1  py-2 rounded-xl  h-full " >
                                                                    {searchCoursesResult.map((Formations, index) => (
                                                                        <button onClick={() => { setSearchCoursesResultCurrent(searchCoursesResult), setIdOpen(index), setChangeCourseHeight(1) }} key={Formations.Id} className="flex flex-row  w-fit space-x-2 p-2 rounded-md shadow-[2px_3px_20px_rgba(0,0,0,0.5)] hover:bg-black/20">
                                                                            <Link href="#formations" className=" flex flex-row justify-center items-center ml-2 w-200 h-full ">
                                                                                <Image height={80} width={50} src={Formations.Img} alt="Formations en ligne" className="object-cover  w-9 h-12  rounded-sm shadow-[-3px_1px_7px_rgba(0,200,255,0.6)] mr-1"></Image>

                                                                                <div className="flex flex-col justify-center w-full items-start ">
                                                                                    <p className="text-md font-bold"><i>{Formations.Location?.split("DIVLAB_").pop()?.split(".")[0] ?? ""}</i></p>
                                                                                    <span className="text-sm flex flex-row gap-3"><i>{Formations.Format}</i><i className={`${Formations.Class == "premium" ? "text-yellow-600" : Formations.Class == "sous licence" ? "text-red-700" : "text-info"}`} >{Formations.Class}</i></span>
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
            </div>
        </article >

    );
}

export default Formations;