"use client"

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import DivlabSpaceSignUp from "../Components/DivlabSpaceSignUp";
import DivlabSpaceLogin from "../Components/DivlabSpaceLogin";
import { TopLoader } from "../Components/lightswind/top-loader";
import AuroraShader from "../Components/lightswind/aurora-shader";
import TextType from "../Components/TextType";

interface Sign {
    setSign: React.Dispatch<React.SetStateAction<boolean>>;
    setSignValid: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}



const SignIn = () => {

    const [signValid, setSignValid] = useState<boolean>(false)
    const [state, setState] = useState("UnActive")
    const [sign, setSign] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // signIn peut retourner undefined
        const res = await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/DivlabSpace"
        });
    };

    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) { setState(`Active + ${session.user?.name} `); }
    }, [session, router]);



    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="flex flex-col  items-center justify-center min-h-screen bg-gray-100">
            <p className="text-md font-bold text-black">{state}</p>
            <div className="overflow-hidden w-9/11 relative h-full rounded-t-3xl  flex-col gap-2 flex items-center justify-center">

                <AnimatePresence  >

                    {sign ? (
                        <motion.div
                            initial={{ width: "0%", height: "0%", borderRadius: "100%", opacity: 0 }}
                            animate={{ width: "100%", height: "100%", borderRadius: "100%", opacity: 1 }}
                            exit={{ width: "0%", borderRadius: "100%", opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeIn" }}
                            className="w-9/11 relative h-full rounded-t-3xl flex flex-col gap-2">
                             
                            <DivlabSpaceSignUp setSign={setSign} setSignValid={setSignValid} />

                        </motion.div>
                    ) :
                        (
                            <motion.div
                                initial={{ width: "0%", height: "0%", borderRadius: "100%", opacity: 0 }}
                                animate={{ width: "100%", height: "100%", borderRadius: "100%", opacity: 1 }}
                                exit={{ width: "0%", borderRadius: "100%", opacity: 0 }}
                                transition={{ duration: 0.9, ease: "easeIn" }}
                                className="w-9/11 relative h-full rounded-full flex flex-col gap-2">

                                <DivlabSpaceLogin setSign={setSign} setSignValid={setSignValid} setIsLoading={setIsLoading} />
                            </motion.div>
                        )}

                </AnimatePresence  >

                
            </div>
            {signValid && (

                <motion.div
                    initial={{ y: "-100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className=" text-black h-full w-full absolute right-0 bottom-0 bg-gray-200 rounded-3xl flex items-center justify-center isolate">
                    <TopLoader isLoading={isLoading} color="#33C3F0" />
                    {/* <AnimatedBubbleParticles className="absolute w-full h-full"/> */}
                    {/* <AuroraBackground /> */}
                    <AuroraShader
                        colorStops={['#5227FF', '#7cff67', '#5227FF']}
                        amplitude={1.0}
                        blend={0.5}
                        speed={2.0}
                    />
                    <div className="flex flex-col items-center justify-between h-30 z-1">
                        <h1 className="text-7xl">Bienvenu chez Divlab !</h1>

                        <TextType
                            text={["Votre Divlab space a ete cree avec succes.", "Profitez de votre espace personnel."]}
                            typingSpeed={90}
                            pauseDuration={1500}
                            showCursor={true}
                            cursorCharacter="|"
                            // onSentenceComplete={(sentence = "Votre Divlab space a ete cree avec succes.", index = 0) => setSide("open")}
                            className="text-4xl font-medium "
                        />
                    </div>
                </motion.div>
            )}


        </div>
    );
};

export default SignIn;